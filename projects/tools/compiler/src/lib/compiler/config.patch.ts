/*
Rename:
  manifestOutput
to:
  buildManifestOutput

Make it optional.

Normal custom-builder applications should not need to configure it. If enabled,
derive a default such as:

  <angular output>/.waypoint/build-manifest.json

CLI/compiler inspection workflows may still request it explicitly.
*/
