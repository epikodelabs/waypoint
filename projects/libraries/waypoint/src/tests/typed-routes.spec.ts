import {
  defineTransitions,
  layout,
  route,
  s,
  transition,
  type StreamixRoutes,
  type StreamixRouter,
} from '@epikodelabs/waypoint';

class DashboardLayout {}
class DashboardPage {}
class SettingsPage {}

const dashboardRoute = route('/dashboard/:projectId', DashboardPage, {
  name: 'dashboard',
  paramsSchema: {
    projectId: s.number({ min: 1 }),
  },
  querySchema: {
    tab: s.string('overview'),
    page: s.number({ default: 1, min: 1 }),
    filters: s.array(),
    draft: s.optional(s.boolean()),
  },
});

const settingsRoute = route('/settings', SettingsPage, {
  name: 'settings',
  querySchema: {
    section: s.string('general'),
  },
});

const routes = [
  layout('/app', DashboardLayout, [
    dashboardRoute,
    settingsRoute,
  ]),
] as const satisfies StreamixRoutes;

const transitions = defineTransitions([
  transition({
    to: dashboardRoute,
    prepare: [
      ({ to }) => {
        const projectId: number = to.params.projectId;
        const tab: string = to.query.tab;
        void projectId;
        void tab;
      },
    ],
  }),
  transition({
    from: dashboardRoute,
    to: settingsRoute,
    beforeLeave: [
      ({ from, to }) => {
        const projectId: number = from.params.projectId;
        const section: string = to.query.section;
        void projectId;
        void section;
      },
    ],
  }),
]);

void transitions;

function assertNamedNavigation(router: StreamixRouter<typeof routes>): void {
  void router.navigateTo.dashboard({
    params: { projectId: 123 },
  });

  void router.navigateTo.dashboard({
    params: { projectId: 123 },
    query: {
      tab: 'settings',
      page: 2,
      filters: ['a', 'b'],
      draft: true,
    },
  });

  void router.navigateTo.settings({
    query: { section: 'billing' },
  });

  const href = router.hrefTo.dashboard({
    params: { projectId: 123 },
    query: { tab: 'overview' },
  });

  const typedHref: string | null = href;
  void typedHref;

  // @ts-expect-error route name must exist in the configured layout tree
  void router.navigateTo.missing();
}

describe('typed routes typings', () => {
  it('discovers named leaf routes nested inside layouts', () => {
    expect(typeof assertNamedNavigation).toBe('function');
  });

  it('infers transition route snapshots from route values', () => {
    expect(transitions.length).toBe(2);
  });
});
