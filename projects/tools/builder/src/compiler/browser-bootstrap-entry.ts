import path from 'node:path';

/**
 * Generates the Angular browser entry used by Waypoint builds.
 *
 * Host-runtime registration must happen before the application entry executes,
 * because independently delivered route artifacts import the host application's
 * exact Angular/Waypoint module identities from that runtime.
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
    `import ${JSON.stringify(
      relativeImport(bootstrapEntry, browserEntry),
    )};`,
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

  if (!relative.startsWith('.')) {
    relative = `./${relative}`;
  }

  return relative;
}
