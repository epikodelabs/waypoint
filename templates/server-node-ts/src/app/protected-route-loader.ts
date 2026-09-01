import { createServerNavigationResolver } from '@epikodelabs/waypoint';

/**
 * Resolves authorized route branches and their browser artifacts from the
 * server delivery endpoints without bundling protected implementations.
 * Host runtime identities are registered automatically by the generated
 * Waypoint bootstrap included by the builder.
 */
export const loadProtectedRouteBranch = createServerNavigationResolver();
