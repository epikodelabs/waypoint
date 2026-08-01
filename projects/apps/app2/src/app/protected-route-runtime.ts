import { inject } from '@angular/core';
import {
  s,
  type NavigationContext,
} from '@epikodelabs/waypoint';
import {
  AdminPage,
  AdminSidebarComponent,
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
  IntroPage,
  SettingsPage,
  SettingsSidebarComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
  ReportsSidebarComponent,
} from '../../../app1/src/app/demo-pages';
import { ReportsPage } from '../../../app1/src/app/reports.page';
import { DemoSessionService } from '../../../app1/src/app/demo-session.service';

export interface ProtectedRouteRuntime {
  readonly components: {
    readonly IntroPage: typeof IntroPage;
    readonly DemoShellComponent: typeof DemoShellComponent;
    readonly WorkspacePage: typeof WorkspacePage;
    readonly WorkspaceSidebarComponent: typeof WorkspaceSidebarComponent;
    readonly SettingsPage: typeof SettingsPage;
    readonly SettingsSidebarComponent: typeof SettingsSidebarComponent;
    readonly EditorPage: typeof EditorPage;
    readonly EditorSidebarComponent: typeof EditorSidebarComponent;
    readonly AdminPage: typeof AdminPage;
    readonly AdminSidebarComponent: typeof AdminSidebarComponent;
    readonly ReportsSidebarComponent: typeof ReportsSidebarComponent;
    readonly ReportsPage: typeof ReportsPage;
  };
  readonly hooks: {
    readonly prepareWorkspace: (
      context: NavigationContext,
    ) => {
      readonly snapshot: ReturnType<DemoSessionService['buildWorkspaceSnapshot']>;
    };
    readonly confirmDraftDiscard: () => boolean;
    readonly requireAdminAccess: () => true | { readonly redirectTo: string; readonly replace: true };
    readonly prepareAdminAudit: () => { readonly audit: ReturnType<DemoSessionService['createAdminAudit']> };
  };
  readonly s: typeof s;
}

declare global {
  var __app2ProtectedRouteRuntime:
    ProtectedRouteRuntime |
    undefined;
}

const runtime: ProtectedRouteRuntime = Object.freeze({
  components: Object.freeze({
    IntroPage,
    DemoShellComponent,
    WorkspacePage,
    WorkspaceSidebarComponent,
    SettingsPage,
    SettingsSidebarComponent,
    EditorPage,
    EditorSidebarComponent,
    AdminPage,
    AdminSidebarComponent,
    ReportsSidebarComponent,
    ReportsPage,
  }),
  hooks: Object.freeze({
    prepareWorkspace: (context: NavigationContext) => {
      const projectId =
        Number(
          context.params['projectId'] ?? 0,
        );

      return {
        snapshot:
          inject(DemoSessionService)
            .buildWorkspaceSnapshot(projectId),
      };
    },
    confirmDraftDiscard: () => {
      const session =
        inject(DemoSessionService);

      return !session.draftDirty()
        || window.confirm(
          'Leave the draft and discard unsaved changes?',
        );
    },
    requireAdminAccess: () => {
      const session =
        inject(DemoSessionService);

      return session.adminAccess()
        ? true
        : {
            redirectTo: '/app/settings?section=access',
            replace: true as const,
          };
    },
    prepareAdminAudit: () => ({
      audit:
        inject(DemoSessionService)
          .createAdminAudit(),
    }),
  }),
  s,
});

export function registerProtectedRouteRuntime(): void {
  globalThis.__app2ProtectedRouteRuntime =
    runtime;
}
