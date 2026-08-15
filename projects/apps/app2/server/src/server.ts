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
  createExpressServerRouterHandlers,
  createServerRouter,
} from '@epikodelabs/waypoint/server';

import {
  compilerOutputSource,
  resolveOutputPath,
  type ArtifactDescriptor,
  type Branch,
} from './compiler-output.js';
import { demoPrincipalProfile, readPrincipal } from './route-auth.js';

const browserDistFolder = path.join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

const serverRouter = createServerRouter<ArtifactDescriptor, Branch>({
  loadSnapshot: compilerOutputSource.loadSnapshot,
  moduleUrlFor: artifact =>
    `/api/navigation/modules/${encodeURIComponent(artifact.artifactKey)}`
    + `/${encodeURIComponent(artifact.hash ?? '')}`,
});

const navigation = createExpressServerRouterHandlers<
  ArtifactDescriptor,
  Request
>({
  router: serverRouter,
  principalFrom: request => request.principal,
  artifactPathFor: artifact => {
    if (!artifact.file) {
      throw new Error(`Artifact "${artifact.artifactKey}" has no published file.`);
    }
    return resolveOutputPath(artifact.file);
  },
});

app.use(express.json({ limit: '16kb' }));
app.use(readPrincipal);

app.post('/api/session/logout', (_request, response) => {
  response
    .status(200)
    .set({
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization, Cookie',
      'Clear-Site-Data': '"cache"',
    })
    .clearCookie('identity', {
      path: '/',
      sameSite: 'lax',
    })
    .json({
      location: '/?account=choose',
    });
});

app.post('/api/session/principal', async (request, response, next) => {
  try {
    const profile = demoPrincipalProfile(request.body?.identity);
    if (!profile) {
      response.status(400).set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      }).json({ error: 'Unknown demo principal.' });
      return;
    }

    const location = await serverRouter.resolveLanding(
      profile.landingTargets,
      profile.principal,
    );
    if (!location) {
      response.status(403).set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      }).json({ error: 'No authorized landing route.' });
      return;
    }

    response
      .status(200)
      .set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      })
      .cookie('identity', profile.id, {
        path: '/',
        sameSite: 'lax',
      })
      .json({ location });
  } catch (error) {
    next(error);
  }
});

app.get('/api/ping', (_request, response) => {
  response.json({
    ok: true,
    runtime: 'express',
    renderedAt: new Date().toISOString(),
  });
});

app.get('/api/navigation/resolve', navigation.resolve);
app.get('/api/navigation/modules/:artifactKey/:hash', navigation.module);

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

