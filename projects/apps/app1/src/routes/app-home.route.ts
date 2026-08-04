import { redirectRoute } from '@epikodelabs/waypoint';

export const appHomeRoute = redirectRoute(
  '',
  '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
  {
    name: 'appHome',
  },
);

export const appHomeBranchRoutes = [appHomeRoute] as const;