const PARAMETER = /^:([A-Za-z_][A-Za-z0-9_]*)$/;

export function splitRoutePath(path: string): readonly string[] {
  return path.split('/').filter(Boolean);
}

export function joinRoutePath(parent: string, child: string): string {
  const joined = [...splitRoutePath(parent), ...splitRoutePath(child)].join('/');
  return joined ? `/${joined}` : '/';
}

export function extractRouteParamNames(path: string): readonly string[] {
  const names: string[] = [];
  for (const segment of splitRoutePath(path)) {
    if (!segment.startsWith(':')) continue;
    const match = PARAMETER.exec(segment);
    if (!match) throw new Error(`Invalid route parameter segment "${segment}" in path "${path}".`);
    names.push(match[1]);
  }
  return names;
}

export function normalizeRoutePattern(path: string): string {
  return splitRoutePath(path).map(segment => segment.startsWith(':') ? ':' : segment).join('/');
}

export function deriveStaticPrefix(path: string): string {
  const staticSegments: string[] = [];
  for (const segment of splitRoutePath(path)) {
    if (segment.startsWith(':')) break;
    staticSegments.push(segment);
  }
  return staticSegments.length ? `/${staticSegments.join('/')}` : '/';
}