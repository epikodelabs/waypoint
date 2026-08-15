# Page module boundaries

Keep Angular declarations aligned with authorization ownership.

Preferred:

```text
pages/
  intro.page.ts
  demo-shell.component.ts
  workspace.page.ts
  workspace-sidebar.component.ts
  settings.page.ts
  settings-sidebar.component.ts
  editor.page.ts
  editor-sidebar.component.ts
```

Avoid large declaration barrels such as:

```text
demo-pages.ts
```

when different declarations are consumed by different `routesFor()`
authorization domains.

Waypoint now reports `WPT3220` when an AOT module containing Angular
declarations would otherwise be duplicated across incompatible authorization
domains.
