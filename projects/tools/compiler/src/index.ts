export { bundleArtifacts } from './bundle-artifacts.js';
export { compileRoutes } from './compile.js';
export { normalizeCompilerOptions } from './config.js';
export { emitBrowserEntries } from './emit-browser-entries.js';
export { emitServerArtifacts } from './emit-server.js';
export { buildRouteGraph } from './graph-builder.js';
export { parseRoutes } from './parse-routes.js';
export { createRouteProgram } from './program.js';
export { analyzeRouteGraph } from './route-analyzer.js';
export { evaluateStaticRouteData } from './static-evaluator.js';
export type {
  CompiledRouteBranch,
  PlannedCompilerOutputs,
  ParsedRouteGraph,
  RouteCompilerDiagnostic,
  RouteCompilerOptions,
  RouteCompilerOutputs,
  RouteCompilerResult,
  SourceReference,
} from './types.js';
