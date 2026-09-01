import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ServerPrincipal } from '../../../../../templates/server-node-ts/src/waypoint-server/public-api.js';

declare global {
  namespace Express {
    interface Request {
      principal?: ServerPrincipal;
    }
  }
}

export interface DemoPrincipalProfile {
  readonly id: string;
  readonly principal: ServerPrincipal;
  readonly landingTargets: readonly string[];
}

const demoProfiles: Readonly<Record<string, DemoPrincipalProfile>> = {
  nora: {
    id: 'nora',
    principal: {
      subject: 'nora',
      roles: new Set(['user']),
      permissions: new Set([
        'project:read',
        'draft:write',
        'reports:read',
      ]),
    },
    landingTargets: [
      '/app/settings?section=access',
      '/',
    ],
  },
  lev: {
    id: 'lev',
    principal: {
      subject: 'lev',
      roles: new Set(['admin']),
      permissions: new Set([
        'project:read',
        'settings:write',
        'draft:write',
        'reports:read',
        'admin:read',
      ]),
    },
    landingTargets: [
      '/app/admin',
      '/app/settings?section=access',
      '/',
    ],
  },
};

export function demoPrincipalProfile(
  identity: unknown,
): DemoPrincipalProfile | undefined {
  if (typeof identity !== 'string') return undefined;
  return demoProfiles[identity.trim()];
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return '';
  }
}

export const readPrincipal: RequestHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const token = request.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?? request.header('cookie')
      ?.split(';')
      .map(value => value.trim())
      .find(value => value.startsWith('identity='))
      ?.slice('identity='.length);

  request.principal = token
    ? demoPrincipalProfile(safeDecodeURIComponent(token))?.principal
    : undefined;
  next();
};
