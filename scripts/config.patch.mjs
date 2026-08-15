/*
Remove:
  compilerProject
  compilerModule
  compilerCliCandidates
  routeEntry pointing at app.compiler.routes.ts
  compilerOutputs/entriesOutput-specific configuration

Builder owns:
  app.routes.ts analysis
  host generation
  protected AOT
  bundling
  publication
*/
