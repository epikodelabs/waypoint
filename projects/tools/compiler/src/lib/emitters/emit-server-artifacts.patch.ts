/*
Split emitServerArtifacts() so it no longer writes the browser/build manifest.

It should publish only:
  - planned.serverOutput (runtime server index)
  - plan.serverShards[*]

Remove:
  planned.manifestOutput
  delivery.manifest
  manifest snapshot/staging resource

The server runtime does not need the compiler inspection manifest.
*/
