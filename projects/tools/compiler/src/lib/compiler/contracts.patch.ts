/*
Final application/compiler contract cleanup.

Remove:
  hostModules
  entriesOutput
  routesExport
  manifestOutput

Keep:
  entry
  artifactTsConfig?      // low-level override only, if still needed
  serverOutput
  artifactsOutput
  buildManifestOutput?
  cwd?
  dryRun?
  inspect?
  profile?

Generated route entries live only inside PreparedArtifactSources.
Navigation exports are collected from the navigation module export graph.
*/
