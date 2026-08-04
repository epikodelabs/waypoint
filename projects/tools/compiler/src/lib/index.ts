export { compileRoutes } from './compiler/compile.js';
export { normalizeCompilerOptions } from './compiler/config.js';
export { diagnostic, hasErrors, toSourceSpan } from './compiler/diagnostics.js';

export { createRouteProgram } from './discovery/program.js';
export { discoverRouteSources } from './discovery/discover-route-sources.js';
export { buildSemanticProgram } from './resolution/build-semantic-program.js';
export { resolveNavigationProgram } from './resolution/resolve-navigation-program.js';
export { evaluateStaticRouteData } from './resolution/evaluate-static-route-data.js';

export { buildNavigationIr } from './ir/build-navigation-ir.js';
export { expandNavigation } from './ir/expand-navigation.js';
export {
  NAVIGATION_IR_VERSION,
  NO_IR_REF,
  NavigationIrEntryKind,
  NavigationIrLoadMode,
  iterateIrEntryRefs,
  readIrSource,
  readIrString,
} from './ir/navigation-ir.js';
export * from './ir/route-path.js';
export { validateNavigation } from './validation/validate-navigation.js';
export { planRouteArtifacts } from './planning/plan-artifacts.js';
export { emitBrowserEntries } from './emitters/emit-browser-entries.js';
export { emitServerArtifacts } from './emitters/emit-server-artifacts.js';
export { bundleArtifacts } from './emitters/bundle-artifacts.js';

export type * from './compiler/contracts.js';
export type * from './ir/model.js';
export type * from './ir/navigation-ir.js';
