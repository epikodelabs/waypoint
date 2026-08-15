import type {
  NavigationTree,
} from '@epikodelabs/waypoint';

export function mergeRootNavigationTrees(
  trees: readonly NavigationTree[],
): NavigationTree {
  if (trees.length === 0) {
    return Object.freeze([]) as NavigationTree;
  }

  return Object.freeze(
    trees.flatMap(tree => [...tree]),
  ) as NavigationTree;
}
