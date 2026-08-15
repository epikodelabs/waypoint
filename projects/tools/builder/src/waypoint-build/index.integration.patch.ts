/*
Builder derives runtime and debug destinations separately.

Runtime:
  protectedRoot
  serverRoot/index.json
  serverRoot/shards/

Optional build/debug:
  metadataRoot/build-manifest.json

The server output belongs to the deployable server application.
`.waypoint/build-manifest.json` is optional tooling state and should never be
served as part of protected module delivery.
*/
