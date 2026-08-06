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
  loadServerIndex,
  loadShard,
  resolveOutputPath,
  type ArtifactDescriptor,
  type Branch,
} from './compiler-output.js';
import { isAllowed, readPrincipal } from './route-auth.js';

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
    isAllowed(policy, request.principal),
  );
}

async function descriptorFor(
  artifactKey: string,
): Promise<
  (ArtifactDescriptor & {
    readonly moduleUrl: string;
  }) | null
> {
  const index =
    await loadServerIndex();

  const artifact =
    index.artifacts.find(
      item =>
        item.artifactKey === artifactKey,
    );

  if (!artifact?.file || !artifact.hash) {
    return null;
  }

  return {
    ...artifact,
    moduleUrl:
      '/api/navigation/modules/'
      + encodeURIComponent(
        path.basename(artifact.file),
      ),
  };
}

async function canAccessArtifact(
  artifactKey: string,
  request: Request,
): Promise<boolean> {
  const index = await loadServerIndex();

  for (const descriptor of index.shards) {
    const shard = await loadShard(descriptor.file);

    if (
      shard.branches.some(
        branch =>
          branch.routeSetId === artifactKey
          && allowed(branch, request),
      )
    ) {
      return true;
    }
  }

  return false;
}

function publicDescriptor(
  descriptor: ArtifactDescriptor & { readonly moduleUrl: string },
) {
  return {
    artifactKey: descriptor.artifactKey,
    dependencies: descriptor.dependencies,
    moduleUrl: descriptor.moduleUrl,
    hash: descriptor.hash!,
  };
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

    if (!branch?.routeSetId) {
      response.status(404).json({ error: 'Route not found.' });
      return;
    }

    if (!allowed(branch, request)) {
      response
        .status(request.principal ? 403 : 401)
        .json({ error: 'Route not authorized.' });
      return;
    }

    const descriptor = await descriptorFor(branch.routeSetId);

    if (!descriptor) {
      response.status(503).json({ error: 'Artifact unavailable.' });
      return;
    }

    response
      .set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      })
      .json(publicDescriptor(descriptor));
  } catch (error) {
    next(error);
  }
});

app.get(
  '/api/navigation/artifacts/:artifactKey',
  async (request, response, next) => {
    try {
      const artifactKey = request.params['artifactKey'];

      if (!await canAccessArtifact(artifactKey, request)) {
        response
          .status(request.principal ? 403 : 401)
          .json({ error: 'Artifact not authorized.' });
        return;
      }

      const descriptor = await descriptorFor(artifactKey);

      if (!descriptor) {
        response.status(404).json({ error: 'Artifact not found.' });
        return;
      }

      response
        .set({
          'Cache-Control': 'private, no-store',
          Vary: 'Authorization, Cookie',
        })
        .json(publicDescriptor(descriptor));
    } catch (error) {
      next(error);
    }
  },
);

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

      if (!descriptor?.file) {
        response.status(404).end();
        return;
      }

      if (
        !await canAccessArtifact(
          descriptor.artifactKey,
          request,
        )
      ) {
        response
          .status(
            request.principal
              ? 403
              : 401,
          )
          .end();

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
