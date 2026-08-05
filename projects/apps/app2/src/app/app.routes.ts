import type { NavigationTree } from '@epikodelabs/waypoint';

// Runtime routes arrive only through authorized compiler artifacts.
export const routes = [] as const satisfies NavigationTree;
