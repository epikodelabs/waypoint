import path from 'node:path';

export interface WaypointOptions {
  readonly entry?: string;
  readonly routesExport?: string;
  readonly profile?: boolean;
  readonly buildManifest?: boolean;
}

export interface ResolvedWaypointOptions {
  readonly entry: string;
  readonly routesExport: string;
  readonly profile: boolean;
  readonly buildManifest: boolean;
}

export function resolveWaypointOptions(
  projectRoot: string,
  options: WaypointOptions | undefined,
): ResolvedWaypointOptions {
  return Object.freeze({
    entry: path.join(
      projectRoot,
      options?.entry ?? 'src/app/app.routes.ts',
    ),
    routesExport: options?.routesExport ?? 'routes',
    profile: options?.profile ?? false,
    buildManifest: options?.buildManifest ?? true,
  });
}