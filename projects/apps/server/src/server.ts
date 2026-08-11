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
  createServerRouter,
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

const serverRouter = createServerRouter<ArtifactDescriptor, Branch>({
  loadIndex: loadServerIndex,
  loadShard,
  moduleUrlFor: artifact =>
    `/api/navigation/modules/${encodeURIComponent(artifact.artifactKey)}`
    + `/${encodeURIComponent(artifact.hash ?? '')}`,
});

app.use(readPrincipal);

function hideRoute(response: Response): void {
  response
    .status(404)
    .set({
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization, Cookie',
    })
    .json({ error: 'Route not found.' });
}

function unavailable(response: Response): void {
  response
    .status(503)
    .set({
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization, Cookie',
    })
    .json({ error: 'Navigation artifact unavailable.' });
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
    const target = request.query['path'];

    if (typeof target !== 'string' || !target.trim()) {
      response.status(400).json({ error: 'Invalid path.' });
      return;
    }

    const resolution = await serverRouter.resolve(target, request.principal);

    // Unknown and unauthorized destinations intentionally have the same public
    // response. Authorization must not become a route-discovery oracle.
    if (!resolution) {
      hideRoute(response);
      return;
    }

    response
      .set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      })
      .json(resolution);
  } catch (error) {
    if (error instanceof ServerArtifactResolutionError) {
      unavailable(response);
      return;
    }

    next(error);
  }
});

app.get(
  '/api/navigation/modules/:artifactKey/:hash',
  async (request, response, next) => {
    try {
      const artifactKey = request.params['artifactKey'] ?? '';
      const hash = request.params['hash'] ?? '';
      const descriptor = await serverRouter.resolveModule(
        artifactKey,
        hash,
        request.principal,
      );

      // Do not reveal whether a guessed, stale, or unauthorized artifact exists.
      if (!descriptor?.file) {
        response.status(404).end();
        return;
      }

      response.set({
        'Cache-Control': 'private, no-store',
        'Content-Type': 'text/javascript; charset=utf-8',
        Vary: 'Authorization, Cookie',
        'X-Content-Type-Options': 'nosniff',
      });

      response.sendFile(
        resolveOutputPath(descriptor.file),
        error => {
          if (error && !response.headersSent) next(error);
        },
      );
    } catch (error) {
      if (error instanceof ServerArtifactResolutionError) {
        response.status(404).end();
        return;
      }

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

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, error => {
    if (error) throw error;

    console.log(
      `Node Express server listening on http://localhost:${port}`,
    );
  });
}

export const reqHandler = createNodeRequestHandler(app);
