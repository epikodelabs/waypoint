import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import type {
  Principal,
  RoutePolicy,
} from './route-authorization.js';

declare global {
  namespace Express {
    interface Request {
      principal?: Principal;
    }
  }
}

const demoPrincipals: Readonly<Record<string, Principal>> = {
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
  const token =
    request
      .header('authorization')
      ?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?? readIdentityCookie(
      request.header('cookie'),
    );

  request.principal =
    token
      ? demoPrincipals[token]
      : undefined;

  next();
};

function readIdentityCookie(
  header?: string,
): string | undefined {
  if (!header) {
    return undefined;
  }

  for (const part of header.split(';')) {
    const [rawName, ...rawValue] =
      part.trim().split('=');

    if (rawName !== 'identity') {
      continue;
    }

    const value =
      rawValue.join('=');

    return value
      ? decodeURIComponent(value)
      : undefined;
  }

  return undefined;
}

export function isAllowed(
  policy: RoutePolicy,
  principal?: Principal,
): boolean {
  if (policy.allowAnonymous) {
    return true;
  }

  if (!principal) {
    return false;
  }

  const roles =
    policy.roles ?? [];
  const permissions =
    policy.permissions ?? [];
  const roleAllowed =
    roles.length === 0
    || roles.some(role =>
      principal.roles.has(role),
    );
  const permissionsAllowed =
    permissions.every(permission =>
      principal.permissions.has(
        permission,
      ),
    );

  return (
    roleAllowed
    && permissionsAllowed
  );
}
