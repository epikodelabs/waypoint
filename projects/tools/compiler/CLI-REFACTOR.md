# Required CLI extraction

In the existing `route-compiler.ts`, extract the current argument parsing/dispatch body into:

```ts
export async function runRouteCompiler(args: readonly string[]): Promise<void> {
  // existing parse + compile dispatch, using args instead of process.argv.slice(2)
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runRouteCompiler(process.argv.slice(2));
}
```

No compiler semantics should move into the builder. `compileWaypoint()` is the stable programmatic boundary; the CLI becomes only another adapter over the same implementation.
