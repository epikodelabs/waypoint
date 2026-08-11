import { createServerNavigationResolver } from '@epikodelabs/waypoint';

/** Server-authorized route delivery for the client playground. */
export const loadProtectedRouteBranch = createServerNavigationResolver();
