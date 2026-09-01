export function createHostRoutesSource(): string {
  return [
    `// Waypoint generated public route host.`,
    `import { routeSlot } from '@epikodelabs/waypoint';`,
    ``,
    `export const routes = [`,
    `  routeSlot('public'),`,
    `  routeSlot('application'),`,
    `];`,
    ``,
  ].join('\n');
}
