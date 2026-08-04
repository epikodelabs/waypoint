export { compileRoutes } from './compiler/compile.js';
export { normalizeCompilerOptions } from './compiler/config.js';
export { diagnostic, hasErrors, toSourceSpan } from './compiler/diagnostics.js';

export { createRouteProgram } from './discovery/program.js';
export { discoverRouteSources } from './discovery/discover-route-sources.js';
export { resolveRouteDiscovery } from './resolution/resolve-route-discovery.js';
export { parseRoutes } from './resolution/parse-routes.js';
export { evaluateStaticRouteData } from './resolution/evaluate-static-route-data.js';

export { buildRouteGraph, expandNavigation } from './ir/expand-navigation.js';
export * from './ir/route-path.js';
export { validateRouteGraph, validateNavigation } from './validation/validate-navigation.js';
export { planRouteArtifacts } from './planning/plan-artifacts.js';
export { emitBrowserEntries } from './emitters/emit-browser-entries.js';
export { emitServerArtifacts } from './emitters/emit-server-artifacts.js';
export { bundleArtifacts } from './emitters/bundle-artifacts.js';

export type * from './compiler/contracts.js';
export type * from './ir/model.js';
