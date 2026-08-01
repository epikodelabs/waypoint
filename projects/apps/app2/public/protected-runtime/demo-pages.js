function component(name) {
  return Object.freeze({
    kind: 'component',
    name,
  });
}

export const IntroPage = component('IntroPage');
export const DemoShellComponent = component('DemoShellComponent');
export const WorkspacePage = component('WorkspacePage');
export const WorkspaceSidebarComponent = component('WorkspaceSidebarComponent');
export const SettingsPage = component('SettingsPage');
export const SettingsSidebarComponent = component('SettingsSidebarComponent');
export const EditorPage = component('EditorPage');
export const EditorSidebarComponent = component('EditorSidebarComponent');
export const AdminPage = component('AdminPage');
export const AdminSidebarComponent = component('AdminSidebarComponent');
export const ReportsSidebarComponent = component('ReportsSidebarComponent');
