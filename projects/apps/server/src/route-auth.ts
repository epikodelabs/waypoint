import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ServerPrincipal } from '@epikodelabs/waypoint';

declare global {
  namespace Express {
    interface Request {
      principal?: ServerPrincipal;
    }
  }
}

const demoPrincipals: Readonly<Record<string, ServerPrincipal>> = {
  nora: {
    subject: 'nora',
    roles: new Set(['user']),
    permissions: new Set([
      'project:read',
      'draft:write',
      'reports:read',
    ]),
  },
  lev: {
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
};

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
    ? demoPrincipals[decodeURIComponent(token)]
    : undefined;
  next();
};
