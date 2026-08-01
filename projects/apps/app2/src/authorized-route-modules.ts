import type {
  AuthorizationRoute,
  RouteModuleArtifact,
} from './route-authorization.js';

const publicPolicy = Object.freeze({
  allowAnonymous: true,
  roles: Object.freeze([]),
  permissions: Object.freeze([]),
});

const authenticatedPolicy =
  Object.freeze({
    allowAnonymous: false,
    roles: Object.freeze([]),
    permissions: Object.freeze([]),
  });

export const authorizationRoutes = [
  {
    kind: 'route',
    path: '/',
    name: 'intro',
    pageType: 'IntroPage',
    loadMode: 'eager',
    policies: [publicPolicy],
  },
  {
    kind: 'redirect',
    path: '/legacy',
    name: 'legacy',
    redirectTo:
      '/app/workspace/101?view=activity&page=2&filters=legacy',
    policies: [publicPolicy],
  },
  {
    kind: 'layout',
    path: '/app',
    pageType: 'DemoShellComponent',
    loadMode: 'eager',
    policies: [authenticatedPolicy],
    entries: [
      {
        kind: 'redirect',
        path: '/app',
        name: 'appHome',
        redirectTo:
          '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
        policies: [],
      },
      {
        kind: 'route',
        path: '/app/workspace/:projectId',
        name: 'workspace',
        pageType: 'WorkspacePage',
        loadMode: 'eager',
        policies: [
          {
            roles: ['user', 'admin'],
            permissions: ['project:read'],
          },
        ],
      },
      {
        kind: 'route',
        path: '/app/settings',
        name: 'settings',
        pageType: 'SettingsPage',
        loadMode: 'eager',
        policies: [
          {
            roles: ['admin'],
            permissions: ['settings:write'],
          },
        ],
      },
      {
        kind: 'route',
        path: '/app/editor/:draftId',
        name: 'editor',
        pageType: 'EditorPage',
        loadMode: 'eager',
        policies: [
          {
            roles: ['user', 'admin'],
            permissions: ['draft:write'],
          },
        ],
      },
      {
        kind: 'route',
        path: '/app/reports',
        name: 'reports',
        pageType: 'ReportsPage',
        loadMode: 'lazy',
        policies: [
          {
            roles: ['user', 'admin'],
            permissions: ['reports:read'],
          },
        ],
      },
      {
        kind: 'route',
        path: '/app/admin',
        name: 'admin',
        pageType: 'AdminPage',
        loadMode: 'eager',
        policies: [
          {
            roles: ['admin'],
            permissions: ['admin:read'],
          },
        ],
      },
    ],
  },
] as const satisfies readonly AuthorizationRoute[];

export const routeModuleArtifactsByName: Readonly<
  Record<string, RouteModuleArtifact>
> = Object.freeze({
    intro: {
      routeName: 'intro',
      modulePath:
        'protected-routes/route-branch-intro.js',
    },
    legacy: {
      routeName: 'legacy',
      modulePath:
        'protected-routes/route-branch-legacy.js',
    },
    appHome: {
      routeName: 'appHome',
      modulePath:
        'protected-routes/route-branch-app-home.js',
    },
    workspace: {
      routeName: 'workspace',
      modulePath:
        'protected-routes/route-branch-workspace.js',
    },
    settings: {
      routeName: 'settings',
      modulePath:
        'protected-routes/route-branch-settings.js',
    },
    editor: {
      routeName: 'editor',
      modulePath:
        'protected-routes/route-branch-editor.js',
    },
    reports: {
      routeName: 'reports',
      modulePath:
        'protected-routes/route-branch-reports.js',
    },
    admin: {
      routeName: 'admin',
      modulePath:
        'protected-routes/route-branch-admin.js',
    },
  });
