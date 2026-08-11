import {
  layout,
  route,
  s,
  type NavigationTree,
  type Router,
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
    settingsRoute,
    dashboardRoute,
  ]),
] as const satisfies NavigationTree;

function expectType<T>(_value: T): void {}

function assertNamedNavigation(router: Router<typeof routes>): void {
  expectType<Promise<boolean>>(router.navigateTo.dashboard({
    params: { projectId: 123 },
  }));

  expectType<Promise<boolean>>(router.navigateTo.dashboard({
    params: { projectId: 123 },
    query: {
      tab: 'settings',
      page: 2,
      filters: ['a', 'b'],
      draft: true,
    },
  }));

  expectType<Promise<boolean>>(router.navigateTo.settings({
    query: { section: 'billing' },
  }));

  const href = router.hrefTo.dashboard({
    params: { projectId: 123 },
    query: { tab: 'overview' },
  });

  expectType<string | null>(href);

  // @ts-expect-error route name must exist in the configured layout tree
  expectType<Promise<boolean>>(router.navigateTo.missing());
}

describe('typed routes typings', () => {
  it('discovers named leaf routes nested inside layouts', () => {
    expect(typeof assertNamedNavigation).toBe('function');
  });
});
