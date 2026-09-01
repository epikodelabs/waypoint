export function createHostResolverSource(
  specifiers: readonly string[],
): string {
  const modules = [
    ...new Set([
      '@epikodelabs/waypoint',
      ...specifiers,
    ]),
  ].sort();

  const imports = modules.map(
    (specifier, index) =>
      `import * as module${index} from ${JSON.stringify(specifier)};`,
  );

  const waypointIndex =
    modules.indexOf('@epikodelabs/waypoint');

  const entries = modules.map(
    (specifier, index) =>
      `    ${JSON.stringify(specifier)}: module${index},`,
  );

  return [
    `// Waypoint generated server-navigation resolver.`,
    ...imports,
    ``,
    `export const resolveRoutes =`,
    `  module${waypointIndex}.createServerNavigationResolver({`,
    `    hostModules: {`,
    ...entries,
    `    },`,
    `  });`,
    ``,
  ].join('\n');
}