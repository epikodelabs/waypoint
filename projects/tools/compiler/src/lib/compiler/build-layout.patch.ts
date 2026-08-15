/*
Extend WaypointBuildLayout with:

readonly buildManifest: string;

Example:

return Object.freeze({
  root,
  publicRoot: path.join(root, 'browser'),
  protectedRoot: path.join(root, 'protected'),
  metadataRoot,
  buildManifest: path.join(
    metadataRoot,
    'build-manifest.json',
  ),
  serverRoot: path.join(
    metadataRoot,
    'server',
  ),
});
*/
