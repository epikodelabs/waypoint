import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { Principal, RoutePolicy } from './navigation-delivery.js';

declare global { namespace Express { interface Request { principal?: Principal; } } }

const demoPrincipals: Readonly<Record<string, Principal>> = {
  nora: { subject: 'nora', roles: new Set(['user']), permissions: new Set(['project:read','draft:write','reports:read']) },
  lev: { subject: 'lev', roles: new Set(['admin']), permissions: new Set(['project:read','settings:write','draft:write','reports:read','admin:read']) },
};

export const readPrincipal: RequestHandler = (request: Request, _response: Response, next: NextFunction) => {
  const token = request.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?? request.header('cookie')?.split(';').map(v => v.trim()).find(v => v.startsWith('identity='))?.slice('identity='.length);
  request.principal = token ? demoPrincipals[decodeURIComponent(token)] : undefined;
  next();
};

export function isAllowed(policy: RoutePolicy, principal?: Principal): boolean {
  if (policy.allowAnonymous) return true;
  if (!principal) return false;
  const roles = policy.roles ?? [];
  return (roles.length === 0 || roles.some(role => principal.roles.has(role)))
    && (policy.permissions ?? []).every(permission => principal.permissions.has(permission));
}
