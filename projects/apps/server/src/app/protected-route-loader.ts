import { createServerNavigationResolver } from '@epikodelabs/waypoint';

/** Server-authorized route delivery for the SSR-capable playground. */
export const loadProtectedRouteBranch = createServerNavigationResolver();
