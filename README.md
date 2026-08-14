# Waypoint tool layout

The Angular builder now lives beside the existing compiler:

```text
projects/tools/
  builder/
  compiler/
```

`builder` is intentionally thin. It owns Angular Architect/workspace orchestration; `compiler` remains responsible for navigation semantics and artifact planning.

The next change should expose the compiler pipeline as a programmatic API and replace the builder's CLI subprocess with a direct call.
