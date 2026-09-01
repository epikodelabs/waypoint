# Host isolation build test

This is an output-level test, not a source-graph unit test.

The administration implementation contains a unique string sentinel. After a complete Waypoint build the assertion scans:

```text
dist/.../browser/
dist/.../protected/
```

The build fails unless:

```text
browser/**     sentinel count = 0
protected/**   sentinel count >= 1
```

This catches the failure mode that matters: Angular/esbuild can transform names and modules heavily, but a unique string literal gives us a stable proof that the protected implementation did or did not cross the public build boundary.

The helper intentionally does not infer security from filenames, chunk names, route names, or source maps.