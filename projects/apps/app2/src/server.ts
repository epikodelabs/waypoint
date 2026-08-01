import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import {
  authorizationRoutes,
  routeModuleArtifactsByName,
} from './authorized-route-modules.js';
import {
  isAllowed,
  readPrincipal,
} from './route-auth.js';
import type {
  AuthorizationRoute,
  Principal,
  RoutePolicy,
} from './route-authorization.js';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

app.use(readPrincipal);

interface RequestLike {
  readonly query: Record<string, unknown>;
  readonly principal?: Principal;
}

interface ResponseLike {
  readonly headersSent?: boolean;
  json(body: unknown): void;
  status(code: number): ResponseLike;
  set(headers: Record<string, string>): ResponseLike;
  sendFile(
    path: string,
    callback?: (error?: unknown) => void,
  ): void;
  end(): void;
}

interface NextFunction {
  (): void;
}

interface MatchedPageRoute {
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly name: string;
  readonly pageType?: string;
  readonly redirectTo?: string;
  readonly policies: readonly RoutePolicy[];
}

function isAllowedByPolicies(
  policies: readonly RoutePolicy[],
  principal?: Principal,
): boolean {
  return policies.every(policy =>
    isAllowed(
      policy,
      principal,
    ),
  );
}

function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
}

function matchesRoutePath(
  pattern: string,
  pathname: string,
): boolean {
  const regex = new RegExp(
    `^${pattern
      .split('/')
      .map(segment => {
        if (!segment) {
          return '';
        }

        return segment.startsWith(':')
          ? '[^/]+'
          : escapeRegExp(segment);
      })
      .join('/')}$`,
  );

  return regex.test(pathname);
}

function findMatchedPageRoute(
  pathname: string,
  routes: readonly AuthorizationRoute[],
  inheritedPolicies: readonly RoutePolicy[] = [],
): MatchedPageRoute | undefined {
  for (const route of routes) {
    const policies = [
      ...inheritedPolicies,
      ...route.policies,
    ];

    if (route.kind === 'layout') {
      const matched =
        findMatchedPageRoute(
          pathname,
          route.entries,
          policies,
        );

      if (matched) {
        return matched;
      }

      continue;
    }

    if (
      !matchesRoutePath(
        route.path,
        pathname,
      )
    ) {
      continue;
    }

    if (route.kind === 'redirect') {
      return {
        kind: 'redirect',
        path: route.path,
        name: route.name,
        redirectTo: route.redirectTo,
        policies,
      };
    }

    return {
      kind: 'route',
      path: route.path,
      name: route.name,
      pageType: route.pageType,
      policies,
    };
  }

  return undefined;
}

function readRequestedPath(
  value: unknown,
): URL | null {
  if (
    typeof value !== 'string'
    || value.trim() === ''
  ) {
    return null;
  }

  try {
    const requested = new URL(
      value,
      'http://waypoint.local',
    );

    if (
      requested.origin
      !== 'http://waypoint.local'
    ) {
      return null;
    }

    return requested;
  } catch {
    return null;
  }
}

/**
 * Example API endpoint for server-side requests during development.
 */
app.get('/api/ping', (_req: RequestLike, res: ResponseLike) => {
  res.json({
    ok: true,
    runtime: 'express',
    renderedAt: new Date().toISOString(),
  });
});

app.get(
  '/api/routes/module',
  (request: RequestLike, response: ResponseLike) => {
    const requested =
      readRequestedPath(
        request.query['path'],
      );

    if (!requested) {
      response.status(400).json({
        error:
          'Provide a relative route path in the "path" query parameter.',
      });
      return;
    }

    const matched =
      findMatchedPageRoute(
        requested.pathname,
        authorizationRoutes,
      );

    if (!matched) {
      response.status(404).json({
        error:
          'Route module not found.',
        path: requested.pathname,
      });
      return;
    }

    if (
      !isAllowedByPolicies(
        matched.policies,
        request.principal,
      )
    ) {
      if (!request.principal) {
        response.status(401).json({
          error:
            'Authentication required.',
          path: requested.pathname,
        });
        return;
      }

      response.status(403).json({
        error:
          'Route not authorized.',
        path: requested.pathname,
        name: matched.name,
      });
      return;
    }

    const artifact =
      routeModuleArtifactsByName[
        matched.name
      ];

    if (!artifact) {
      response.status(409).json({
        error:
          'Route module artifact is not configured.',
        path: requested.pathname,
        name: matched.name,
      });
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
      'X-Waypoint-Route-Name':
        matched.name,
    });

    response.sendFile(
      join(
        browserDistFolder,
        artifact.modulePath,
      ),
      error => {
        if (
          !error
          || response.headersSent
        ) {
          return;
        }

        response.status(503).json({
          error:
            'Route module artifact is unavailable. Build app2 before requesting route modules.',
          name: matched.name,
        });
      },
    );
  },
);

app.use(
  '/protected-routes',
  (_request: RequestLike, response: ResponseLike) => {
    response.status(404).end();
  },
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/api', (_request: RequestLike, response: ResponseLike) => {
  response.status(404).json({
    error: 'API route not found.',
  });
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req: RequestLike, res: ResponseLike, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response: Response | null) => (
      response
        ? writeResponseToNodeResponse(response, res)
        : next()
    ))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error?: unknown) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
