/*
Expose the bundle result to the builder validation phase before publication.

Preferred shape:

const prepared = await build.prepareArtifacts();

prepared.bundle

await validateBuilderSpecificIsolation(
  prepared.bundle,
);

await prepared.publish();

Do not hide the physical module/input graph inside publish(), because Angular
declaration isolation is a builder concern layered on top of compiler planning.
*/
