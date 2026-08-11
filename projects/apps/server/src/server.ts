import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import path from 'node:path';
import {
  createServerNavigationResolution,
  isServerArtifactAuthorized,
  isServerArtifactChainAuthorized,
  isServerPolicyAllowed,
  requiredServerBranchIds,
  resolveServerArtifactChain,
  ServerArtifactResolutionError,
} from '@epikodelabs/waypoint';

import {
  loadServerIndex,
  loadShard,
  resolveOutputPath,
  type ArtifactDescriptor,
  type Branch,
} from './compiler-output.js';
import { readPrincipal } from './route-auth.js';

const browserDistFolder = path.join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

app.use(readPrincipal);

function requestedUrl(value: unknown): URL | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    const url = new URL(value, 'http://waypoint.local');
    return url.origin === 'http://waypoint.local' ? url : null;
  } catch {
    return null;
  }
}

function matches(pattern: string, pathname: string): boolean {
  const expected = pattern.split('/').filter(Boolean);
  const actual = pathname.split('/').filter(Boolean);

  return expected.length === actual.length
    && expected.every(
      (part, index) => part.startsWith(':') || part === actual[index],
    );
}

async function findBranch(pathname: string): Promise<Branch | undefined> {
  const index = await loadServerIndex();

  const candidates = [...index.shards]
    .sort((left, right) => right.prefix.length - left.prefix.length)
    .filter(shard => pathname.startsWith(shard.prefix));

  for (const descriptor of candidates) {
    const shard = await loadShard(descriptor.file);
    const found = shard.branches.find(branch =>
      matches(branch.path, pathname),
    );

    if (found) return found;
  }

  return undefined;
}

function allowed(branch: Branch, request: Request): boolean {
  return branch.policies.every(policy =>
    isServerPolicyAllowed(policy, request.principal),
  );
}

async function loadBranches(
  branchIds: ReadonlySet<string>,
): Promise<ReadonlyMap<string, Branch>> {
  const remaining = new Set(branchIds);
  const result = new Map<string, Branch>();
  if (remaining.size === 0) return result;

  const index = await loadServerIndex();

  for (const descriptor of index.shards) {
    const shard = await loadShard(descriptor.file);

    for (const branch of shard.branches) {
      if (!remaining.has(branch.id)) continue;
      result.set(branch.id, branch);
      remaining.delete(branch.id);
    }

    if (remaining.size === 0) break;
  }

  return result;
}

function artifactForRouteSet(
  artifacts: readonly ArtifactDescriptor[],
  routeSetId: string,
): ArtifactDescriptor | undefined {
  return artifacts.find(artifact => artifact.routeSetId === routeSetId);
}

function moduleUrlFor(artifact: ArtifactDescriptor): string {
  if (!artifact.file) return '';

  return '/api/navigation/modules/'
    + encodeURIComponent(path.basename(artifact.file));
}

async function authorizedArtifactChain(
  artifactKey: string,
  request: Request,
): Promise<readonly ArtifactDescriptor[] | null> {
  const index = await loadServerIndex();
  const chain = resolveServerArtifactChain(index, artifactKey);
  const branches = await loadBranches(requiredServerBranchIds(chain));

  return isServerArtifactChainAuthorized(
    chain,
    branches,
    request.principal,
  )
    ? chain
    : null;
}

async function authorizedArtifact(
  artifact: ArtifactDescriptor,
  request: Request,
): Promise<boolean> {
  const branches = await loadBranches(new Set(artifact.branchIds));
  return isServerArtifactAuthorized(
    artifact,
    branches,
    request.principal,
  );
}

function hideRoute(response: Response): void {
  response
    .status(404)
    .set({
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization, Cookie',
    })
    .json({ error: 'Route not found.' });
}

app.get('/api/ping', (_request, response) => {
  response.json({
    ok: true,
    runtime: 'express',
    renderedAt: new Date().toISOString(),
  });
});

app.get('/api/navigation/resolve', async (request, response, next) => {
  try {
    const url = requestedUrl(request.query['path']);

    if (!url) {
      response.status(400).json({ error: 'Invalid path.' });
      return;
    }

    const branch = await findBranch(url.pathname);

    // Unknown and unauthorized destinations intentionally have the same public
    // response. Authorization must not become a route-discovery oracle.
    if (!branch?.routeSetId || !allowed(branch, request)) {
      hideRoute(response);
      return;
    }

    const index = await loadServerIndex();
    const targetArtifact = artifactForRouteSet(index.artifacts, branch.routeSetId);

    if (!targetArtifact) {
      response.status(503).json({ error: 'Navigation artifact unavailable.' });
      return;
    }

    const chain = await authorizedArtifactChain(
      targetArtifact.artifactKey,
      request,
    );

    if (!chain) {
      hideRoute(response);
      return;
    }

    response
      .set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      })
      .json(createServerNavigationResolution(
        targetArtifact.artifactKey,
        chain,
        artifact => moduleUrlFor(artifact),
      ));
  } catch (error) {
    if (error instanceof ServerArtifactResolutionError) {
      response.status(503).json({ error: 'Navigation artifact unavailable.' });
      return;
    }

    next(error);
  }
});

app.get(
  '/api/navigation/modules/:module',
  async (
    request,
    response,
    next,
  ) => {
    try {
      const requestedFile =
        decodeURIComponent(
          request.params['module'],
        );

      const index =
        await loadServerIndex();

      const descriptor =
        index.artifacts.find(
          artifact =>
            artifact.file
            && path.basename(
              artifact.file,
            ) === requestedFile,
        );

      // Do not reveal whether a guessed or stale protected artifact exists.
      if (
        !descriptor?.file
        || !await authorizedArtifact(descriptor, request)
      ) {
        response.status(404).end();
        return;
      }

      response.set({
        'Cache-Control':
          'private, no-store',
        'Content-Type':
          'text/javascript; charset=utf-8',
        Vary:
          'Authorization, Cookie',
        'X-Content-Type-Options':
          'nosniff',
      });

      response.sendFile(
        resolveOutputPath(
          descriptor.file,
        ),
        error => {
          if (
            error
            && !response.headersSent
          ) {
            next(error);
          }
        },
      );
    } catch (error) {
      next(error);
    }
  },
);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use(
  (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    angularApp
      .handle(request)
      .then(result =>
        result
          ? writeResponseToNodeResponse(result, response)
          : next(),
      )
      .catch(next);
  },
);

if (
  isMainModule(import.meta.url)
  || process.env['pm_id']
) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, error => {
    if (error) throw error;

    console.log(
      `Node Express server listening on http://localhost:${port}`,
    );
  });
}

export const reqHandler = createNodeRequestHandler(app);
