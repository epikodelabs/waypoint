function readRuntime() {
  const runtime =
    globalThis.__app2ProtectedRouteRuntime;

  if (!runtime) {
    throw new Error(
      'Protected route runtime is not registered.',
    );
  }

  return runtime;
}

export const IntroPage =
  readRuntime().components.IntroPage;
export const DemoShellComponent =
  readRuntime().components.DemoShellComponent;
export const WorkspacePage =
  readRuntime().components.WorkspacePage;
export const WorkspaceSidebarComponent =
  readRuntime().components.WorkspaceSidebarComponent;
export const SettingsPage =
  readRuntime().components.SettingsPage;
export const SettingsSidebarComponent =
  readRuntime().components.SettingsSidebarComponent;
export const EditorPage =
  readRuntime().components.EditorPage;
export const EditorSidebarComponent =
  readRuntime().components.EditorSidebarComponent;
export const AdminPage =
  readRuntime().components.AdminPage;
export const AdminSidebarComponent =
  readRuntime().components.AdminSidebarComponent;
export const ReportsSidebarComponent =
  readRuntime().components.ReportsSidebarComponent;
