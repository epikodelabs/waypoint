/*
Inside WaypointBuildTransaction.publish():

1. Bundle protected artifacts.
2. Finalize runtime server index:
     const serverIndex = finalizeRuntimeServerIndex(...)
3. Validate runtime delivery.
4. Publish server index + shards transactionally.
5. Commit runtime publication.
6. Only after runtime publication succeeds, optionally emit the build manifest:
     if (planned.buildManifestOutput) {
       const manifest = finalizeBuildManifest(...)
       await emitBuildManifest(...)
     }

IMPORTANT:
A failure to write an optional build/debug manifest should be reported as a build
diagnostic, but should not roll back already-valid runtime deployment state
unless the caller explicitly requests strict build-artifact publication.

This makes the lifetimes honest:
- runtime metadata belongs to deployment publication;
- build manifest belongs to inspection/tooling output.
*/
