import {
  s,
  type NamedRouteDefinition,
  type NavigationTree,
} from '@epikodelabs/waypoint';

export const routes = [] as const satisfies NavigationTree;

export const namedRoutes = [
  {
    name: 'workspace',
    path: '/app/workspace/:projectId',
    paramsSchema: {
      projectId: s.number({ min: 1 }),
    },
    querySchema: {
      view: s.string('overview'),
      page: s.number({ default: 1, min: 1 }),
      filters: s.array(),
      draft: s.optional(s.boolean()),
    },
  },
  {
    name: 'settings',
    path: '/app/settings',
    querySchema: {
      section: s.string('general'),
    },
  },
  {
    name: 'editor',
    path: '/app/editor/:draftId',
    paramsSchema: {
      draftId: s.number({ min: 1 }),
    },
    querySchema: {
      mode: s.string('write'),
    },
  },
  {
    name: 'reports',
    path: '/app/reports',
  },
  {
    name: 'admin',
    path: '/app/admin',
  },
] as const satisfies readonly NamedRouteDefinition[];

