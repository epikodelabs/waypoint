import path from 'node:path';

/**
 * Generates the Angular browser entry used by Waypoint builds.
 *
 * Host-runtime registration must complete before the application module graph
 * can even begin evaluating. The real browser entry is therefore loaded with a
 * dynamic import after the runtime side effect has executed.
 */
export function createBrowserBootstrapSource(
  browserEntry: string,
  runtimeEntry: string,
  bootstrapEntry: string,
): string {
  return [
    `import ${JSON.stringify(
      relativeImport(bootstrapEntry, runtimeEntry),
    )};`,
    `await import(${JSON.stringify(
      relativeImport(bootstrapEntry, browserEntry),
    )});`,
    ``,
  ].join('\n');
}

function relativeImport(
  fromFile: string,
  toFile: string,
): string {
  let relative = path
    .relative(
      path.dirname(fromFile),
      toFile,
    )
    .replace(/\\/g, '/');

  if (relative.endsWith('.ts')) {
    relative = relative.slice(0, -'.ts'.length);
  }

  if (!relative.startsWith('.')) {
    relative = `./${relative}`;
  }

  return relative;
}
