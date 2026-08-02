import { redirectRoute } from '@epikodelabs/waypoint';

export const legacyRoute = redirectRoute(
  '/legacy',
  '/app/workspace/101?view=activity&page=2&filters=legacy',
  {
    name: 'legacy',
  },
);

export const legacyBranchRoutes = [legacyRoute] as const;
