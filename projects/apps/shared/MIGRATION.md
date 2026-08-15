# Remove the old shared demo project

The original `projects/apps/shared` project no longer fits the current build
model.

Do not keep route/page/component ownership in a separate shared project.

Move only genuinely shared *runtime-neutral* utilities to an appropriate library.
For app2 demo state such as `DemoSessionService`, prefer the owning application:

```text
projects/apps/app2/client/src/app/demo/
```

Protected routes/pages/components should live in the client application source
tree so the Waypoint compiler/builder partitions that one ordinary application.

After imports are updated, remove:

```text
projects/apps/shared/
```

and delete the tsconfig path alias:

```text
@waypoint-demo/runtime
```

The final architecture should not need an application-specific host runtime
package.
