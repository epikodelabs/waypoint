This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app1/
  public/
    favicon.ico
  src/
    app/
      app.config.ts
      app.css
      app.html
      app.routes.ts
      app.ts
      demo-pages.ts
      demo-session.service.ts
      reports.page.ts
    routes/
      admin.route.ts
      app-home.route.ts
      app-shell.route.ts
      editor.route.ts
      index.ts
      intro.route.ts
      legacy.route.ts
      reports.route.ts
      routes.authored.ts
      settings.route.ts
      workspace.route.ts
    index.html
    main.ts
    styles.css
  tsconfig.app.json
  tsconfig.app.tsbuildinfo
  tsconfig.spec.json
app2/
  public/
    protected-routes/
      route-branch-admin.js
      route-branch-app-home.js
      route-branch-editor.js
      route-branch-intro.js
      route-branch-legacy.js
      route-branch-reports.js
      route-branch-settings.js
      route-branch-workspace.js
    protected-runtime/
      demo-pages.js
      lazy-pages.js
      route-builders.js
      route-hooks.js
      schema.js
    favicon.ico
  src/
    app/
      app.config.server.ts
      app.config.ts
      app.css
      app.html
      app.routes.server.ts
      app.routes.ts
      app.ts
      protected-route-loader.ts
      protected-route-runtime.ts
    authorized-route-modules.ts
    index.html
    main.server.ts
    main.ts
    route-auth.ts
    route-authorization.ts
    server.ts
    styles.css
  tsconfig.app.json
  tsconfig.spec.json
```

# Files

## File: app1/src/app/app.config.ts
```typescript
import {
  ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@epikodelabs/waypoint';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideRouter(routes, {
      viewTransitions: true,
    }),
  ],
};
```

## File: app1/src/app/app.css
```css
:host {
  display: block;
  min-height: 100vh;
}

.app-frame {
  min-height: 100vh;
  padding: 1.5rem;
}

.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 88rem;
  margin: 0 auto 1.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.9), rgb(245 249 255 / 0.72)),
    var(--panel-color);
  box-shadow: 0 16px 40px rgb(32 53 78 / 0.08);
  backdrop-filter: blur(16px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  color: var(--ink-strong);
  text-decoration: none;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 1rem;
}

.brand small {
  color: var(--ink-soft);
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-deep));
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.top-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.top-nav a {
  padding: 0.7rem 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  color: var(--ink-soft);
  text-decoration: none;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    background-color 150ms ease;
}

.top-nav a:hover {
  transform: translateY(-1px);
  border-color: rgb(43 92 230 / 0.16);
  background: rgb(255 255 255 / 0.82);
  color: var(--ink-strong);
}

@media (max-width: 760px) {
  .app-frame {
    padding: 1rem;
  }

  .masthead {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

## File: app1/src/app/app.html
```html
<div class="app-frame">
  <header class="masthead">
    <a class="brand" [routerLink]="'/'">
      <span class="brand-mark">W</span>
      <span>
        <strong>Waypoint</strong>
        <small>Route Playground</small>
      </span>
    </a>

    <nav class="top-nav" aria-label="Primary navigation">
      <a [routerLink]="'/'">Overview</a>
      <a
        [routerLink]="{
          name: 'workspace',
          params: { projectId: session.currentUser().homeProjectId },
          query: {
            view: session.currentUser().preferredView,
            page: 1,
            filters: session.currentUser().focusFilters
          }
        }"
      >
        Workspace
      </a>
      <a [routerLink]="{ name: 'reports' }">Lazy Reports</a>
      <a [routerLink]="'/legacy'">Redirect</a>
    </nav>
  </header>

  <router-outlet />
</div>
```

## File: app1/src/app/app.routes.ts
```typescript
export { routes } from '../routes';
```

## File: app1/src/app/app.ts
```typescript
import {
  Component,
  inject,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
} from '@epikodelabs/waypoint';
import { DemoSessionService, DemoUser } from './demo-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly session = inject(DemoSessionService);

  get currentUser(): DemoUser {
    return this.session.currentUser();
  }
}
```

## File: app1/src/app/demo-pages.ts
```typescript
import {
  Component,
  inject,
  input,
} from '@angular/core';
import {
  RouterOutlet,
  Router,
  RouterLink,
} from '@epikodelabs/waypoint';

import {
  type DemoUser,
  type AdminAudit,
  type WorkspaceSnapshot,
  DemoSessionService,
} from './demo-session.service';

type ParamsInput = Record<string, unknown>;
type QueryInput = Record<string, unknown>;
type DataInput = Record<string, unknown>;

const pageStyles = `
  .page {
    display: grid;
    gap: 1rem;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .page-header h1 {
    margin: 0.25rem 0 0;
    font-size: clamp(1.9rem, 3vw, 2.7rem);
  }

  .status-pill {
    padding: 0.55rem 0.8rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent-deep);
    font-weight: 700;
  }

  .page-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1rem;
  }

  .panel {
    padding: 1.1rem;
    border: 1px solid var(--border-color);
    border-radius: 1.1rem;
    background: var(--panel-strong);
  }

  .panel h3 {
    margin-top: 0;
  }

  .panel p {
    line-height: 1.6;
  }

  .data-list {
    display: grid;
    gap: 0.7rem;
    margin: 0;
  }

  .data-list div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .data-list dt {
    color: var(--ink-soft);
  }

  .data-list dd {
    margin: 0;
    font-weight: 700;
    color: var(--ink-strong);
  }

  .action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .action-link,
  .action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.9rem;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    border: 1px solid rgb(43 92 230 / 0.18);
    background: rgb(255 255 255 / 0.8);
    color: var(--ink-strong);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
  }

  .inline-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.85rem;
    font-weight: 600;
  }
`;

const sidebarStyles = `
  .sidebar-card {
    display: grid;
    gap: 0.75rem;
  }

  .sidebar-card h3 {
    margin: 0;
  }

  .sidebar-card p,
  .sidebar-card li {
    line-height: 1.55;
  }

  .sidebar-card ul {
    margin: 0;
    padding-left: 1.15rem;
  }

  .sidebar-links {
    display: grid;
    gap: 0.55rem;
  }

  .sidebar-links a {
    padding: 0.8rem 0.9rem;
    border-radius: 0.9rem;
    background: rgb(43 92 230 / 0.07);
    color: var(--ink-strong);
    text-decoration: none;
  }
`;

@Component({
  standalone: true,
  selector: 'app-intro-page',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <p class="eyebrow">Sample application</p>
      <h1>Manual route scenario harness</h1>
      <p class="lede">
        This app is meant for real browser checks, not framework smoke tests.
        Use it to validate how Waypoint handles redirects, typed params,
        query defaults, lazy routes, frame hooks, and grouped named outlets.
      </p>

      <section class="hero-session">
        <p class="session-heading">Signed-in demo user</p>
        <div class="session-user">
          <div>
            <strong>{{ currentUser().name }}</strong>
            <span>{{ currentUser().role }} В· {{ currentUser().email }}</span>
          </div>
          <p>
            Home workspace {{ currentUser().homeProjectId }} В·
            admin {{ currentUser().canAccessAdmin ? 'enabled' : 'disabled' }}
          </p>
        </div>
        <div class="user-toggle-row">
          @for (user of users; track user.id) {
            <button
              type="button"
              class="user-toggle"
              [class.user-toggle--active]="user.id === currentUser().id"
              (click)="activateUser(user.id)"
            >
              {{ user.name }}
            </button>
          }
        </div>
      </section>

      <div class="hero-actions">
        <a class="action-link action-link--solid" [routerLink]="'/legacy'">
          Follow redirect scenario
        </a>
        <a
          class="action-link"
          [routerLink]="{
            name: 'settings',
            query: { section: 'profile' }
          }"
        >
          Open settings by route name
        </a>
        <button type="button" class="action-button" (click)="openWorkspace()">
          Open current workspace
        </button>
      </div>

      <div class="scenario-grid">
        <article class="scenario-card">
          <strong>Redirects</strong>
          <p>
            Visit <code>/legacy</code> or <code>/app</code> and confirm the
            router rewrites to the expected workspace URLs.
          </p>
        </article>
        <article class="scenario-card">
          <strong>Typed parsing</strong>
          <p>
            Workspace pages parse <code>projectId</code> as a number and apply
            defaults for <code>view</code>, <code>page</code>, and
            <code>filters</code>.
          </p>
        </article>
        <article class="scenario-card">
          <strong>Named outlets</strong>
          <p>
            Every <code>/app/*</code> route updates a primary view and the
            sidebar outlet as one grouped navigation commit.
          </p>
        </article>
        <article class="scenario-card">
          <strong>Frames and lazy routes</strong>
          <p>
            The admin and editor pages use frame lifecycle hooks, and the
            reports page is loaded lazily.
          </p>
        </article>
      </div>
    </section>
  `,
  styles: `
    .hero {
      max-width: 88rem;
      margin: 0 auto;
      padding: clamp(1.25rem, 2vw, 2rem);
      border: 1px solid var(--border-color);
      border-radius: 2rem;
      background:
        linear-gradient(140deg, rgb(255 255 255 / 0.92), rgb(239 245 255 / 0.78)),
        var(--panel-color);
      box-shadow: 0 24px 64px rgb(18 31 56 / 0.08);
    }

    .eyebrow {
      margin: 0 0 0.8rem;
      color: var(--accent-deep);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.2rem, 4vw, 4rem);
      line-height: 0.95;
    }

    .lede {
      max-width: 46rem;
      margin: 1rem 0 0;
      font-size: 1.05rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      margin: 1.75rem 0 0;
    }

    .hero-session {
      display: grid;
      gap: 0.85rem;
      margin-top: 1.5rem;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 1.2rem;
      background: rgb(255 255 255 / 0.62);
    }

    .session-heading {
      margin: 0;
      color: var(--ink-soft);
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .session-user {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.9rem;
    }

    .session-user strong,
    .session-user span {
      display: block;
    }

    .session-user span,
    .session-user p {
      color: var(--ink-soft);
    }

    .session-user p {
      margin: 0;
    }

    .user-toggle-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .user-toggle {
      min-height: 2.7rem;
      padding: 0.65rem 0.95rem;
      border: 1px solid rgb(43 92 230 / 0.18);
      border-radius: 999px;
      background: rgb(255 255 255 / 0.85);
      color: var(--ink-strong);
      font-weight: 600;
      cursor: pointer;
    }

    .user-toggle--active {
      border-color: transparent;
      background: linear-gradient(135deg, var(--accent-color), var(--accent-deep));
      color: #fff;
    }

    .action-link,
    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 3rem;
      padding: 0.75rem 1.1rem;
      border-radius: 999px;
      border: 1px solid rgb(43 92 230 / 0.18);
      background: rgb(255 255 255 / 0.8);
      color: var(--ink-strong);
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition:
        transform 150ms ease,
        box-shadow 150ms ease,
        background-color 150ms ease;
    }

    .action-link--solid {
      background: linear-gradient(135deg, var(--accent-color), var(--accent-deep));
      color: #fff;
      border-color: transparent;
    }

    .action-link:hover,
    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgb(18 54 184 / 0.12);
    }

    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .scenario-card {
      padding: 1.1rem;
      border: 1px solid var(--border-color);
      border-radius: 1.2rem;
      background: rgb(255 255 255 / 0.68);
    }

    .scenario-card strong {
      display: block;
      margin-bottom: 0.55rem;
    }

    .scenario-card p {
      margin: 0;
      line-height: 1.6;
    }
  `,
})
export class IntroPage {
  private readonly session = inject(DemoSessionService);
  private readonly router = inject(Router);
  protected readonly users = this.session.users;

  protected currentUser(): DemoUser {
    return this.session.currentUser();
  }

  protected async activateUser(userId: string): Promise<void> {
    this.session.loginAs(userId);

    await this.router.navigate({
      name: 'admin',
    });
  }

  protected openWorkspace(
    projectId = this.currentUser().homeProjectId,
  ): void {
    const activeUser = this.currentUser();

    void this.router.navigate(
      {
        name: 'workspace',
        params: { projectId },
        query: {
          view: activeUser.preferredView,
          page: 1,
          filters: [...activeUser.focusFilters],
          draft: activeUser.prefersDraftGuard,
        },
      },
      {
        state: {
          source: 'intro-page',
          projectId,
          userId: activeUser.id,
        },
      },
    );
  }
}

@Component({
  standalone: true,
  selector: 'app-demo-shell',
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  template: `
    <section class="playground-shell">
      <aside class="control-panel">
        <p class="eyebrow">Scenario menu</p>
        <h2><code>/app</code> layout shell</h2>

        <div class="control-card">
          <p class="outlet-label">Session user</p>
          <strong>{{ currentUser().name }}</strong>
          <p>{{ currentUser().role }} В· {{ currentUser().email }}</p>
          <div class="session-actions">
            @for (user of users; track user.id) {
              <button
                type="button"
                class="session-button"
                [class.session-button--active]="user.id === currentUser().id"
                (click)="activateUser(user.id)"
              >
                {{ user.name }}
              </button>
            }
          </div>
        </div>

        <nav class="scenario-nav" aria-label="Scenario navigation">
          @for (item of navItems(); track item.label) {
            <a class="nav-card" [routerLink]="item.target">
              <strong>{{ item.label }}</strong>
              <span>{{ item.description }}</span>
            </a>
          }
        </nav>

        <div class="control-card">
          <label class="toggle">
            <input
              type="checkbox"
              [checked]="session.adminAccess()"
              (change)="setAdminAccess($event)"
            />
            Allow <code>/app/admin</code>
          </label>
          <p>
            @if (session.adminAccess()) {
              The <code>beforeEnter</code> frame hook will allow the admin route.
            } @else {
              The <code>beforeEnter</code> frame hook redirects to access settings.
            }
          </p>
        </div>

        <div class="control-card">
          <label class="toggle">
            <input
              type="checkbox"
              [checked]="session.draftDirty()"
              (change)="setDraftDirty($event)"
            />
            Leave guard armed
          </label>
          <p>
            When enabled, leaving the editor route triggers a native
            confirmation dialog through the <code>beforeLeave</code> frame hook.
          </p>
        </div>

        <section class="outlet-card">
          <p class="outlet-label">Named outlet</p>
          <router-outlet name="sidebar" />
        </section>
      </aside>

      <main class="canvas">
        <router-outlet />
      </main>
    </section>
  `,
  styles: `
    .playground-shell {
      display: grid;
      grid-template-columns: minmax(18rem, 24rem) minmax(0, 1fr);
      gap: 1rem;
      max-width: 88rem;
      margin: 0 auto;
    }

    .control-panel,
    .canvas {
      border: 1px solid var(--border-color);
      border-radius: 1.75rem;
      background: var(--panel-color);
      box-shadow: 0 20px 48px rgb(25 40 71 / 0.07);
      backdrop-filter: blur(16px);
    }

    .control-panel {
      padding: 1.2rem;
    }

    .canvas {
      min-width: 0;
      padding: 1.2rem;
    }

    .eyebrow,
    .outlet-label {
      margin: 0 0 0.7rem;
      color: var(--ink-soft);
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h2 {
      margin: 0 0 1rem;
      font-size: 1.45rem;
    }

    .scenario-nav {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .nav-card {
      display: block;
      padding: 0.95rem;
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      background: rgb(255 255 255 / 0.74);
      text-decoration: none;
    }

    .nav-card strong,
    .nav-card span {
      display: block;
    }

    .nav-card span {
      margin-top: 0.35rem;
      color: var(--ink-soft);
      line-height: 1.5;
    }

    .control-card,
    .outlet-card {
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 1rem;
      background: rgb(255 255 255 / 0.68);
    }

    .control-card + .control-card,
    .control-card + .outlet-card {
      margin-top: 0.85rem;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-weight: 600;
      color: var(--ink-strong);
    }

    .control-card p {
      margin: 0.8rem 0 0;
      line-height: 1.55;
    }

    .session-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 0.9rem;
    }

    .session-button {
      min-height: 2.5rem;
      padding: 0.6rem 0.85rem;
      border: 1px solid rgb(43 92 230 / 0.18);
      border-radius: 999px;
      background: rgb(255 255 255 / 0.84);
      color: var(--ink-strong);
      font-weight: 600;
      cursor: pointer;
    }

    .session-button--active {
      border-color: transparent;
      background: linear-gradient(135deg, var(--accent-color), var(--accent-deep));
      color: #fff;
    }

    @media (max-width: 960px) {
      .playground-shell {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class DemoShellComponent {
  protected readonly session = inject(DemoSessionService);
  private readonly router = inject(Router);
  protected readonly users = this.session.users;

  protected currentUser(): DemoUser {
    return this.session.currentUser();
  }

  protected navItems() {
    const activeUser = this.currentUser();

    return [
      {
        label: 'Workspace',
        description: 'Typed params, query defaults, grouped sidebar outlet',
        target: {
          name: 'workspace',
          params: { projectId: activeUser.homeProjectId },
          query: {
            view: activeUser.preferredView,
            page: 1,
            filters: [...activeUser.focusFilters],
          },
        },
      },
      {
        label: 'Settings',
        description: 'Query-only route that also receives guard redirects',
        target: {
          name: 'settings',
          query: { section: 'profile' },
        },
      },
      {
        label: 'Editor',
        description: 'beforeLeave frame hook with a dirty-state toggle',
        target: {
          name: 'editor',
          params: { draftId: activeUser.favoriteDraftId },
          query: { mode: 'review' },
        },
      },
      {
        label: 'Lazy reports',
        description: 'Lazy component route paired with an eager sidebar outlet',
        target: {
          name: 'reports',
        },
      },
      {
        label: 'Admin',
        description: 'Guarded route that redirects until access is enabled',
        target: {
          name: 'admin',
        },
      },
    ] as const;
  }

  protected async activateUser(userId: string): Promise<void> {
    this.session.loginAs(userId);

    await this.router.navigate({
      name: 'admin',
    });
  }

  protected setAdminAccess(event: Event): void {
    this.session.setAdminAccess(this.readChecked(event));
  }

  protected setDraftDirty(event: Event): void {
    this.session.setDraftDirty(this.readChecked(event));
  }

  private readChecked(event: Event): boolean {
    return (event.target as HTMLInputElement | null)?.checked ?? false;
  }
}

@Component({
  standalone: true,
  selector: 'app-workspace-page',
  imports: [RouterLink],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Typed params + query schema</p>
          <h1>Workspace {{ projectId() }}</h1>
        </div>
        <span class="status-pill">
          Prepare load #{{ snapshot()?.loadOrder ?? 0 }}
        </span>
      </header>

      <div class="page-grid">
        <article class="panel">
          <h3>Parsed route values</h3>
          <dl class="data-list">
            <div>
              <dt>projectId</dt>
              <dd>{{ projectId() }}</dd>
            </div>
            <div>
              <dt>user</dt>
              <dd>{{ snapshot()?.activeUserName ?? 'unknown' }}</dd>
            </div>
            <div>
              <dt>role</dt>
              <dd>{{ snapshot()?.activeUserRole ?? 'unknown' }}</dd>
            </div>
            <div>
              <dt>view</dt>
              <dd>{{ queryValue('view', 'overview') }}</dd>
            </div>
            <div>
              <dt>page</dt>
              <dd>{{ queryValue('page', 1) }}</dd>
            </div>
            <div>
              <dt>filters</dt>
              <dd>{{ filtersText() }}</dd>
            </div>
            <div>
              <dt>draft</dt>
              <dd>{{ queryValue('draft', 'not set') }}</dd>
            </div>
          </dl>
        </article>

        <article class="panel">
          <h3>Prepared payload</h3>
          <p>
            Suggested filters:
            <strong>{{ snapshot()?.suggestedFilters?.join(', ') || 'none' }}</strong>
          </p>
          <p>
            Admin route available:
            <strong>{{ snapshot()?.canOpenAdmin ? 'yes' : 'no' }}</strong>
          </p>
          <p>
            Recommended draft:
            <strong>#{{ snapshot()?.recommendedDraftId ?? 0 }}</strong>
          </p>
          <p>
            Switching the signed-in demo user attempts the admin route.
            Nora is redirected to access settings, while Lev enters admin.
          </p>
        </article>
      </div>

      <div class="action-row">
        <a
          class="action-link"
          [routerLink]="{
            name: 'workspace',
            params: { projectId: projectId() + 1 },
            query: {
              view: 'activity',
              page: 1,
              filters: ['assigned']
            }
          }"
        >
          Next project
        </a>
        <button type="button" class="action-button" (click)="openEditor()">
          Open editor scenario
        </button>
        <button type="button" class="action-button" (click)="updateHistory()">
          Update history.state
        </button>
      </div>
    </section>
  `,
  styles: [pageStyles],
})
export class WorkspacePage {
  private readonly session = inject(DemoSessionService);
  private readonly router = inject(Router);

  protected readonly params = input<ParamsInput>({});
  protected readonly query = input<QueryInput>({});
  protected readonly data = input<DataInput>({});

  protected projectId(): number {
    return Number(this.params()['projectId'] ?? 0);
  }

  protected queryValue(key: string, fallback: unknown): unknown {
    return this.query()[key] ?? fallback;
  }

  protected filtersText(): string {
    const filters = this.query()['filters'];
    return Array.isArray(filters) && filters.length > 0
      ? filters.join(', ')
      : 'none';
  }

  protected snapshot(): WorkspaceSnapshot | null {
    return (this.data()['snapshot'] as WorkspaceSnapshot | undefined) ?? null;
  }

  protected openEditor(): void {
    const activeUser = this.session.currentUser();

    void this.router.navigate({
      name: 'editor',
      params: { draftId: activeUser.favoriteDraftId },
      query: { mode: 'review' },
    });
  }

  protected updateHistory(): void {
    this.router.updateHistoryState({
      updatedFrom: 'workspace',
      projectId: this.projectId(),
    });
  }
}

@Component({
  standalone: true,
  selector: 'app-workspace-sidebar',
  imports: [RouterLink],
  template: `
    <section class="sidebar-card">
      <h3>Workspace sidebar</h3>
      <p>
        This outlet is committed together with the primary workspace route for
        <code>/app/workspace/:projectId</code>.
      </p>

      <div class="sidebar-links">
        <a
          [routerLink]="{
            name: 'workspace',
            params: { projectId: projectId() },
            query: { view: 'overview', page: 1, filters: ['open'] }
          }"
        >
          Overview tab
        </a>
        <a
          [routerLink]="{
            name: 'workspace',
            params: { projectId: projectId() },
            query: { view: 'activity', page: 2, filters: ['recent'] }
          }"
        >
          Activity tab
        </a>
        <a
          [routerLink]="{
            name: 'workspace',
            params: { projectId: projectId() },
            query: { view: 'files', page: 1, filters: ['approved'] }
          }"
        >
          Files tab
        </a>
      </div>
    </section>
  `,
  styles: [sidebarStyles],
})
export class WorkspaceSidebarComponent {
  protected readonly params = input<ParamsInput>({});

  protected projectId(): number {
    return Number(this.params()['projectId'] ?? 0);
  }
}

@Component({
  standalone: true,
  selector: 'app-settings-page',
  imports: [RouterLink],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Query-only route</p>
          <h1>Settings</h1>
        </div>
        <span class="status-pill">section={{ section() }}</span>
      </header>

      <div class="page-grid">
        <article class="panel">
          <h3>Why this page exists</h3>
          <p>
            The admin guard redirects here with
            <code>?section=access</code> when access is disabled.
          </p>
        </article>
        <article class="panel">
          <h3>Quick checks</h3>
          <p>
            Change sections with named navigation and verify the same layout
            shell remains mounted.
          </p>
        </article>
      </div>

      <div class="action-row">
        <a
          class="action-link"
          [routerLink]="{ name: 'settings', query: { section: 'billing' } }"
        >
          Billing section
        </a>
        <a
          class="action-link"
          [routerLink]="{ name: 'settings', query: { section: 'access' } }"
        >
          Access section
        </a>
        <a
          class="action-link"
          [routerLink]="{
            name: 'workspace',
            params: { projectId: 101 },
            query: { view: 'overview', page: 1, filters: ['open'] }
          }"
        >
          Back to workspace
        </a>
      </div>
    </section>
  `,
  styles: [pageStyles],
})
export class SettingsPage {
  protected readonly query = input<QueryInput>({});

  protected section(): string {
    return String(this.query()['section'] ?? 'general');
  }
}

@Component({
  standalone: true,
  selector: 'app-settings-sidebar',
  template: `
    <section class="sidebar-card">
      <h3>Settings sidebar</h3>
      <p>
        Use this route to confirm grouped outlet swaps outside the workspace
        flow.
      </p>
      <ul>
        <li>Query parsing: <code>section</code></li>
        <li>Guard redirect target: <code>/app/settings?section=access</code></li>
      </ul>
    </section>
  `,
  styles: [sidebarStyles],
})
export class SettingsSidebarComponent {}

@Component({
  standalone: true,
  selector: 'app-editor-page',
  imports: [RouterLink],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">beforeLeave frame hook</p>
          <h1>Draft {{ draftId() }}</h1>
        </div>
        <span class="status-pill">{{ mode() }} mode</span>
      </header>

      <div class="page-grid">
        <article class="panel">
          <h3>Leave guard</h3>
          <p>
            The shell toggle controls whether leaving this page should prompt.
          </p>
          <label class="inline-toggle">
            <input
              type="checkbox"
              [checked]="session.draftDirty()"
              (change)="setDraftDirty($event)"
            />
            Unsaved changes present
          </label>
        </article>
        <article class="panel">
          <h3>Manual checks</h3>
          <p>Try navigating to reports or workspace with the guard armed.</p>
        </article>
      </div>

      <div class="action-row">
        <button type="button" class="action-button" (click)="goReports()">
          Leave for lazy reports
        </button>
        <a
          class="action-link"
          [routerLink]="{
            name: 'workspace',
            params: { projectId: 103 },
            query: { view: 'activity', page: 1, filters: ['recent'] }
          }"
        >
          Return to workspace
        </a>
      </div>
    </section>
  `,
  styles: [pageStyles],
})
export class EditorPage {
  protected readonly session = inject(DemoSessionService);
  private readonly router = inject(Router);

  protected readonly params = input<ParamsInput>({});
  protected readonly query = input<QueryInput>({});

  protected draftId(): number {
    return Number(this.params()['draftId'] ?? 0);
  }

  protected mode(): string {
    return String(this.query()['mode'] ?? 'write');
  }

  protected setDraftDirty(event: Event): void {
    this.session.setDraftDirty(
      (event.target as HTMLInputElement | null)?.checked ?? false,
    );
  }

  protected goReports(): void {
    void this.router.navigate({ name: 'reports' });
  }
}

@Component({
  standalone: true,
  selector: 'app-editor-sidebar',
  template: `
    <section class="sidebar-card">
      <h3>Editor sidebar</h3>
      <p>
        Confirm this outlet changes with the primary editor page and that the
        leave guard only applies when you navigate away.
      </p>
    </section>
  `,
  styles: [sidebarStyles],
})
export class EditorSidebarComponent {}

@Component({
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">beforeEnter + prepare frame hooks</p>
          <h1>Admin console</h1>
        </div>
        <span class="status-pill">guard passed</span>
      </header>

      <div class="page-grid">
        <article class="panel">
          <h3>Guard result</h3>
          <p>
            Access is controlled by the shell checkbox. Disable it and try the
            route again to confirm the redirect.
          </p>
        </article>
        <article class="panel">
          <h3>Prepared audit</h3>
          <p>reviewedBy: <strong>{{ audit()?.reviewedBy }}</strong></p>
          <p>reviewerRole: <strong>{{ audit()?.reviewerRole }}</strong></p>
          <p>workspaceLoads: <strong>{{ audit()?.workspaceLoads ?? 0 }}</strong></p>
        </article>
      </div>
    </section>
  `,
  styles: [pageStyles],
})
export class AdminPage {
  protected readonly data = input<DataInput>({});

  protected audit(): AdminAudit | null {
    return (this.data()['audit'] as AdminAudit | undefined) ?? null;
  }
}

@Component({
  standalone: true,
  template: `
    <section class="sidebar-card">
      <h3>Admin sidebar</h3>
      <p>
        This route is useful for checking that a successful guard still commits
        both outlets together.
      </p>
    </section>
  `,
  styles: [sidebarStyles],
})
export class AdminSidebarComponent {}

@Component({
  standalone: true,
  template: `
    <section class="sidebar-card">
      <h3>Reports sidebar</h3>
      <p>
        The sidebar is eager even though the primary reports page is lazy.
      </p>
      <ul>
        <li>Check the first load after a hard refresh.</li>
        <li>Navigate away and back to confirm reuse behavior.</li>
      </ul>
    </section>
  `,
  styles: [sidebarStyles],
})
export class ReportsSidebarComponent {}
```

## File: app1/src/app/demo-session.service.ts
```typescript
import {
  Injectable,
  signal,
} from '@angular/core';

export interface DemoUser {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly email: string;
  readonly homeProjectId: number;
  readonly favoriteDraftId: number;
  readonly preferredView: string;
  readonly focusFilters: readonly string[];
  readonly canAccessAdmin: boolean;
  readonly prefersDraftGuard: boolean;
}

export interface WorkspaceSnapshot {
  readonly projectId: number;
  readonly loadOrder: number;
  readonly canOpenAdmin: boolean;
  readonly activeUserName: string;
  readonly activeUserRole: string;
  readonly recommendedDraftId: number;
  readonly suggestedFilters: readonly string[];
}

export interface AdminAudit {
  readonly accessGranted: boolean;
  readonly reviewedBy: string;
  readonly reviewerRole: string;
  readonly workspaceLoads: number;
}

const demoUsers = Object.freeze([
  {
    id: 'nora',
    name: 'Nora Hale',
    role: 'Operations Lead',
    email: 'nora@waypoint.test',
    homeProjectId: 101,
    favoriteDraftId: 7,
    preferredView: 'overview',
    focusFilters: Object.freeze(['open', 'recent']),
    canAccessAdmin: false,
    prefersDraftGuard: true,
  },
  {
    id: 'lev',
    name: 'Lev Moroz',
    role: 'Admin Reviewer',
    email: 'lev@waypoint.test',
    homeProjectId: 204,
    favoriteDraftId: 21,
    preferredView: 'activity',
    focusFilters: Object.freeze(['assigned', 'flagged']),
    canAccessAdmin: true,
    prefersDraftGuard: false,
  },
] satisfies readonly DemoUser[]);

@Injectable({
  providedIn: 'root',
})
export class DemoSessionService {
  readonly users = demoUsers;
  readonly currentUserId = signal(demoUsers[0].id);
  readonly adminAccess = signal(
    demoUsers[0].canAccessAdmin,
  );
  readonly draftDirty = signal(
    demoUsers[0].prefersDraftGuard,
  );
  readonly workspaceLoads = signal(0);

  currentUser(): DemoUser {
    return this.users.find(
      user => user.id === this.currentUserId(),
    ) ?? this.users[0];
  }

  loginAs(userId: string): void {
    const nextUser = this.users.find(
      user => user.id === userId,
    );

    if (!nextUser) {
      return;
    }

    this.currentUserId.set(nextUser.id);
    this.adminAccess.set(nextUser.canAccessAdmin);
    this.draftDirty.set(nextUser.prefersDraftGuard);
  }

  setAdminAccess(value: boolean): void {
    this.adminAccess.set(value);
  }

  setDraftDirty(value: boolean): void {
    this.draftDirty.set(value);
  }

  buildWorkspaceSnapshot(projectId: number): WorkspaceSnapshot {
    const activeUser = this.currentUser();
    const loadOrder = this.workspaceLoads() + 1;
    this.workspaceLoads.set(loadOrder);

    return {
      projectId,
      loadOrder,
      canOpenAdmin: this.adminAccess(),
      activeUserName: activeUser.name,
      activeUserRole: activeUser.role,
      recommendedDraftId: activeUser.favoriteDraftId,
      suggestedFilters: Object.freeze(
        projectId % 2 === 0
          ? [...activeUser.focusFilters, 'assigned']
          : [...activeUser.focusFilters, 'watching'],
      ),
    };
  }

  createAdminAudit(): AdminAudit {
    const activeUser = this.currentUser();

    return {
      accessGranted: this.adminAccess(),
      reviewedBy: activeUser.email,
      reviewerRole: activeUser.role,
      workspaceLoads: this.workspaceLoads(),
    };
  }
}
```

## File: app1/src/app/reports.page.ts
```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@epikodelabs/waypoint';

@Component({
  standalone: true,
  selector: 'app-reports-page',
  imports: [RouterLink],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Lazy route</p>
          <h1>Reports</h1>
        </div>
        <span class="status-pill">lazy component</span>
      </header>

      <div class="panel-grid">
        <article class="panel">
          <h3>What to verify</h3>
          <p>
            This page is loaded through <code>lazyRoute()</code> while the
            paired sidebar route remains eager.
          </p>
        </article>
        <article class="panel">
          <h3>Suggested checks</h3>
          <ul>
            <li>Hard refresh on <code>/app/reports</code>.</li>
            <li>Navigate here from workspace and back.</li>
            <li>Confirm the sidebar swaps in the same commit.</li>
          </ul>
        </article>
      </div>

      <div class="actions">
        <a
          [routerLink]="{
            name: 'workspace',
            params: { projectId: 120 },
            query: { view: 'activity', page: 3, filters: ['recent'] }
          }"
        >
          Back to workspace
        </a>
        <a [routerLink]="{ name: 'admin' }">Try guarded admin route</a>
      </div>
    </section>
  `,
  styles: `
    .page {
      display: grid;
      gap: 1rem;
    }

    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .page-header h1 {
      margin: 0.25rem 0 0;
      font-size: clamp(1.9rem, 3vw, 2.7rem);
    }

    .eyebrow {
      margin: 0;
      color: var(--ink-soft);
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .status-pill {
      padding: 0.55rem 0.8rem;
      border-radius: 999px;
      background: var(--warning-soft);
      color: #9a5600;
      font-weight: 700;
    }

    .panel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1rem;
    }

    .panel {
      padding: 1.1rem;
      border: 1px solid var(--border-color);
      border-radius: 1.1rem;
      background: var(--panel-strong);
    }

    .panel h3 {
      margin-top: 0;
    }

    .panel ul {
      margin: 0;
      padding-left: 1.1rem;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .actions a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.9rem;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      border: 1px solid rgb(43 92 230 / 0.18);
      background: rgb(255 255 255 / 0.8);
      color: var(--ink-strong);
      font-weight: 600;
      text-decoration: none;
    }
  `,
})
export class ReportsPage {}
```

## File: app1/src/routes/admin.route.ts
```typescript
import { inject } from '@angular/core';
import {
  frame,
  route,
} from '@epikodelabs/waypoint';

import { AdminPage, AdminSidebarComponent } from '../app/demo-pages';
import { DemoSessionService } from '../app/demo-session.service';

export const adminRoute = route(
  '/admin',
  frame(AdminPage, {
    beforeEnter: [
      () => {
        const session = inject(DemoSessionService);

        return session.adminAccess()
          || {
            redirectTo: '/app/settings?section=access',
            replace: true,
          };
      },
    ],
    prepare: [
      () => ({
        audit:
          inject(DemoSessionService)
            .createAdminAudit(),
      }),
    ],
  }),
  {
    name: 'admin',
  },
);

export const adminSidebarRoute = route(
  '/admin',
  AdminSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const adminBranchRoutes = [
  adminRoute,
  adminSidebarRoute,
] as const;
```

## File: app1/src/routes/app-home.route.ts
```typescript
import { redirectRoute } from '@epikodelabs/waypoint';

export const appHomeRoute = redirectRoute(
  '',
  '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
  {
    name: 'appHome',
  },
);

export const appHomeBranchRoutes = [appHomeRoute] as const;
```

## File: app1/src/routes/app-shell.route.ts
```typescript
import {
  layout,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoShellComponent } from '../app/demo-pages';
import { adminBranchRoutes } from './admin.route';
import { appHomeBranchRoutes } from './app-home.route';
import { editorBranchRoutes } from './editor.route';
import { reportsBranchRoutes } from './reports.route';
import { settingsBranchRoutes } from './settings.route';
import { workspaceBranchRoutes } from './workspace.route';

export const appShellEntries = [
  ...appHomeBranchRoutes,
  ...workspaceBranchRoutes,
  ...settingsBranchRoutes,
  ...editorBranchRoutes,
  ...reportsBranchRoutes,
  ...adminBranchRoutes,
] as const satisfies NavigationTree;

export const appShellRoute = layout(
  '/app',
  DemoShellComponent,
  appShellEntries,
);
```

## File: app1/src/routes/editor.route.ts
```typescript
import { inject } from '@angular/core';
import {
  frame,
  route,
  s,
} from '@epikodelabs/waypoint';

import { EditorPage, EditorSidebarComponent } from '../app/demo-pages';
import { DemoSessionService } from '../app/demo-session.service';

export const editorRoute = route(
  '/editor/:draftId',
  frame(EditorPage, {
    beforeLeave: [
      () => {
        const session = inject(DemoSessionService);

        return !session.draftDirty()
          || window.confirm(
            'Leave the draft and discard unsaved changes?',
          );
      },
    ],
  }),
  {
    name: 'editor',
    paramsSchema: {
      draftId: s.number({ min: 1 }),
    },
    querySchema: {
      mode: s.string('write'),
    },
  },
);

export const editorSidebarRoute = route(
  '/editor/:draftId',
  EditorSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const editorBranchRoutes = [
  editorRoute,
  editorSidebarRoute,
] as const;
```

## File: app1/src/routes/index.ts
```typescript
export { routes } from './routes.authored';
```

## File: app1/src/routes/intro.route.ts
```typescript
import { route } from '@epikodelabs/waypoint';

import { IntroPage } from '../app/demo-pages';

export const introRoute = route('/', IntroPage, {
  name: 'intro',
});

export const introBranchRoutes = [introRoute] as const;
```

## File: app1/src/routes/legacy.route.ts
```typescript
import { redirectRoute } from '@epikodelabs/waypoint';

export const legacyRoute = redirectRoute(
  '/legacy',
  '/app/workspace/101?view=activity&page=2&filters=legacy',
  {
    name: 'legacy',
  },
);

export const legacyBranchRoutes = [legacyRoute] as const;
```

## File: app1/src/routes/reports.route.ts
```typescript
import {
  lazyRoute,
  route,
} from '@epikodelabs/waypoint';

import { ReportsSidebarComponent } from '../app/demo-pages';

export const reportsRoute = lazyRoute(
  '/reports',
  () =>
    import('../app/reports.page')
      .then(module => module.ReportsPage),
  {
    name: 'reports',
  },
);

export const reportsSidebarRoute = route(
  '/reports',
  ReportsSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const reportsBranchRoutes = [
  reportsRoute,
  reportsSidebarRoute,
] as const;
```

## File: app1/src/routes/routes.authored.ts
```typescript
import { type NavigationTree } from '@epikodelabs/waypoint';

import { appShellRoute } from './app-shell.route';
import { introBranchRoutes } from './intro.route';
import { legacyBranchRoutes } from './legacy.route';

export const routes = [
  ...introBranchRoutes,
  ...legacyBranchRoutes,
  appShellRoute,
] as const satisfies NavigationTree;
```

## File: app1/src/routes/settings.route.ts
```typescript
import {
  route,
  s,
} from '@epikodelabs/waypoint';

import { SettingsPage, SettingsSidebarComponent } from '../app/demo-pages';

export const settingsRoute = route('/settings', SettingsPage, {
  name: 'settings',
  querySchema: {
    section: s.string('general'),
  },
});

export const settingsSidebarRoute = route(
  '/settings',
  SettingsSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const settingsBranchRoutes = [
  settingsRoute,
  settingsSidebarRoute,
] as const;
```

## File: app1/src/routes/workspace.route.ts
```typescript
import { inject } from '@angular/core';
import {
  frame,
  route,
  s,
} from '@epikodelabs/waypoint';

import { WorkspacePage, WorkspaceSidebarComponent } from '../app/demo-pages';
import { DemoSessionService } from '../app/demo-session.service';

export const workspaceRoute = route(
  '/workspace/:projectId',
  frame(WorkspacePage, {
    prepare: [
      context => {
        const projectId = Number(
          context.params['projectId'] ?? 0,
        );

        return {
          snapshot:
            inject(DemoSessionService)
              .buildWorkspaceSnapshot(projectId),
        };
      },
    ],
  }),
  {
    name: 'workspace',
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
);

export const workspaceSidebarRoute = route(
  '/workspace/:projectId',
  WorkspaceSidebarComponent,
  {
    outlet: 'sidebar',
  },
);

export const workspaceBranchRoutes = [
  workspaceRoute,
  workspaceSidebarRoute,
] as const;
```

## File: app1/src/index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>RoutePlayground</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

## File: app1/src/main.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

## File: app1/src/styles.css
```css
:root {
  color-scheme: light;
  --app-bg:
    radial-gradient(circle at top left, rgb(222 234 255 / 0.95), transparent 32%),
    radial-gradient(circle at top right, rgb(254 232 201 / 0.9), transparent 28%),
    linear-gradient(180deg, #f5f7fb 0%, #edf2f9 100%);
  --panel-color: rgb(255 255 255 / 0.76);
  --panel-strong: rgb(255 255 255 / 0.92);
  --border-color: rgb(54 86 131 / 0.12);
  --accent-color: #2b5ce6;
  --accent-deep: #1236b8;
  --accent-soft: rgb(43 92 230 / 0.1);
  --warning-soft: rgb(220 124 0 / 0.12);
  --ink-strong: #162033;
  --ink-body: #31405d;
  --ink-soft: #61708c;
}

* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
}

body {
  margin: 0;
  background: var(--app-bg);
  color: var(--ink-body);
  font-family:
    'Segoe UI Variable Text',
    'Bahnschrift',
    'Trebuchet MS',
    sans-serif;
}

h1,
h2,
h3,
h4,
strong {
  color: var(--ink-strong);
  font-family:
    'Aptos Display',
    'Franklin Gothic Medium',
    'Segoe UI Variable Display',
    sans-serif;
}

button,
input,
textarea,
select {
  font: inherit;
}

a {
  color: inherit;
}
```

## File: app1/tsconfig.app.json
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "types": []
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

## File: app1/tsconfig.app.tsbuildinfo
```
{"root":["./src/main.ts","./src/app/app.config.ts","./src/app/app.routes.ts","./src/app/app.ts","./src/app/demo-pages.ts","./src/app/demo-session.service.ts","./src/app/reports.page.ts"],"version":"6.0.3"}
```

## File: app1/tsconfig.spec.json
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../out-tsc/app1-spec",
    "types": [
      "jasmine"
    ]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
```

## File: app2/public/protected-routes/route-branch-admin.js
```javascript
import {
  frame,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  AdminPage,
  AdminSidebarComponent,
  DemoShellComponent,
} from '/protected-runtime/demo-pages.js';
import {
  prepareAdminAudit,
  requireAdminAccess,
} from '/protected-runtime/route-hooks.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route(
      '/admin',
      frame(AdminPage, {
        beforeEnter: [requireAdminAccess],
        prepare: [prepareAdminAudit],
      }),
      {
        name: 'admin',
      },
    ),
    route('/admin', AdminSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-app-home.js
```javascript
import {
  layout,
  redirectRoute,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
} from '/protected-runtime/demo-pages.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    redirectRoute(
      '',
      '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
      {
        name: 'appHome',
      },
    ),
  ]),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-editor.js
```javascript
import {
  frame,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
} from '/protected-runtime/demo-pages.js';
import {
  confirmDraftDiscard,
} from '/protected-runtime/route-hooks.js';
import {
  s,
} from '/protected-runtime/schema.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route(
      '/editor/:draftId',
      frame(EditorPage, {
        beforeLeave: [confirmDraftDiscard],
      }),
      {
        name: 'editor',
        paramsSchema: {
          draftId: s.number({
            min: 1,
          }),
        },
        querySchema: {
          mode: s.string('write'),
        },
      },
    ),
    route('/editor/:draftId', EditorSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-intro.js
```javascript
import {
  route,
} from '/protected-runtime/route-builders.js';
import {
  IntroPage,
} from '/protected-runtime/demo-pages.js';

const branch = Object.freeze([
  route('/', IntroPage, {
    name: 'intro',
  }),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-legacy.js
```javascript
import {
  redirectRoute,
} from '/protected-runtime/route-builders.js';

const branch = Object.freeze([
  redirectRoute(
    '/legacy',
    '/app/workspace/101?view=activity&page=2&filters=legacy',
    {
      name: 'legacy',
    },
  ),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-reports.js
```javascript
import {
  lazyRoute,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  ReportsSidebarComponent,
} from '/protected-runtime/demo-pages.js';

const loadReportsPage = () =>
  import('/protected-runtime/lazy-pages.js')
    .then(module => module.ReportsPage);

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    lazyRoute('/reports', loadReportsPage, {
      name: 'reports',
    }),
    route('/reports', ReportsSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-settings.js
```javascript
import {
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  SettingsPage,
  SettingsSidebarComponent,
} from '/protected-runtime/demo-pages.js';
import {
  s,
} from '/protected-runtime/schema.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route('/settings', SettingsPage, {
      name: 'settings',
      querySchema: {
        section: s.string('general'),
      },
    }),
    route('/settings', SettingsSidebarComponent, {
      outlet: 'sidebar',
    }),
  ]),
]);

export default branch;
```

## File: app2/public/protected-routes/route-branch-workspace.js
```javascript
import {
  frame,
  layout,
  route,
} from '/protected-runtime/route-builders.js';
import {
  DemoShellComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
} from '/protected-runtime/demo-pages.js';
import {
  prepareWorkspace,
} from '/protected-runtime/route-hooks.js';
import {
  s,
} from '/protected-runtime/schema.js';

const branch = Object.freeze([
  layout('/app', DemoShellComponent, [
    route(
      '/workspace/:projectId',
      frame(WorkspacePage, {
        prepare: [prepareWorkspace],
      }),
      {
        name: 'workspace',
        paramsSchema: {
          projectId: s.number({
            min: 1,
          }),
        },
        querySchema: {
          view: s.string('overview'),
          page: s.number({
            default: 1,
            min: 1,
          }),
          filters: s.array(),
          draft: s.optional(
            s.boolean(),
          ),
        },
      },
    ),
    route(
      '/workspace/:projectId',
      WorkspaceSidebarComponent,
      {
        outlet: 'sidebar',
      },
    ),
  ]),
]);

export default branch;
```

## File: app2/public/protected-runtime/demo-pages.js
```javascript
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
```

## File: app2/public/protected-runtime/lazy-pages.js
```javascript
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

export const ReportsPage =
  readRuntime().components.ReportsPage;
```

## File: app2/public/protected-runtime/route-builders.js
```javascript
function freezeArray(entries) {
  return Object.freeze([...entries]);
}

function normalizeView(view) {
  if (
    view
    && typeof view === 'object'
    && view.kind === 'frame'
  ) {
    if ('component' in view) {
      return {
        component: view.component,
        frame: view,
      };
    }

    return {
      loadComponent: view.loadComponent,
      frame: view,
    };
  }

  return {
    component: view,
    frame: undefined,
  };
}

function normalizeLazyView(view) {
  if (
    view
    && typeof view === 'object'
    && view.kind === 'frame'
  ) {
    if ('component' in view) {
      return {
        component: view.component,
        frame: view,
      };
    }

    return {
      loadComponent: view.loadComponent,
      frame: view,
    };
  }

  return {
    loadComponent: view,
    frame: undefined,
  };
}

export function frame(component, hooks = {}) {
  return Object.freeze({
    kind: 'frame',
    component,
    ...hooks,
  });
}

export function lazyFrame(loadComponent, hooks = {}) {
  return Object.freeze({
    kind: 'frame',
    loadComponent,
    ...hooks,
  });
}

export function route(path, view, options = {}) {
  return Object.freeze({
    kind: 'route',
    path,
    ...normalizeView(view),
    ...options,
  });
}

export function lazyRoute(path, loadComponent, options = {}) {
  return Object.freeze({
    kind: 'route',
    path,
    ...normalizeLazyView(loadComponent),
    ...options,
  });
}

export function redirectRoute(path, redirectTo, options = {}) {
  return Object.freeze({
    kind: 'route',
    path,
    redirectTo,
    ...options,
  });
}

export function layout(path, view, entries, options = {}) {
  return Object.freeze({
    kind: 'layout',
    path,
    ...normalizeView(view),
    entries: freezeArray(entries),
    ...options,
  });
}

export function lazyLayout(path, loadComponent, entries, options = {}) {
  return Object.freeze({
    kind: 'layout',
    path,
    ...normalizeLazyView(loadComponent),
    entries: freezeArray(entries),
    ...options,
  });
}
```

## File: app2/public/protected-runtime/route-hooks.js
```javascript
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

export const prepareWorkspace =
  readRuntime().hooks.prepareWorkspace;
export const confirmDraftDiscard =
  readRuntime().hooks.confirmDraftDiscard;
export const requireAdminAccess =
  readRuntime().hooks.requireAdminAccess;
export const prepareAdminAudit =
  readRuntime().hooks.prepareAdminAudit;
```

## File: app2/public/protected-runtime/schema.js
```javascript
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

export const s =
  readRuntime().s;
```

## File: app2/src/app/app.config.server.ts
```typescript
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
```

## File: app2/src/app/app.config.ts
```typescript
import {
  ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
} from '@angular/core';
import {
  BrowserModule,
} from '@angular/platform-browser';
import {
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
} from '@epikodelabs/waypoint';
import {
  loadProtectedRouteBranch,
} from './protected-route-loader';
import {
  namedRoutes,
  routes,
} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ApplicationModule,
      BrowserModule,
    ),
    provideBrowserGlobalErrorListeners(),
    ...provideRouter(routes, {
      viewTransitions: true,
      namedRoutes,
      resolveRoutes: loadProtectedRouteBranch,
    }),
  ],
};
```

## File: app2/src/app/app.css
```css
:host {
  display: block;
  min-height: 100vh;
}

.app-frame {
  min-height: 100vh;
  padding: 1.5rem;
}

.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 88rem;
  margin: 0 auto 1.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  background:
    linear-gradient(135deg, rgb(255 255 255 / 0.9), rgb(245 249 255 / 0.72)),
    var(--panel-color);
  box-shadow: 0 16px 40px rgb(32 53 78 / 0.08);
  backdrop-filter: blur(16px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  color: var(--ink-strong);
  text-decoration: none;
}

.brand strong,
.brand small {
  display: block;
}

.brand strong {
  font-size: 1rem;
}

.brand small {
  color: var(--ink-soft);
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, var(--accent-color), var(--accent-deep));
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.top-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.top-nav a {
  padding: 0.7rem 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  color: var(--ink-soft);
  text-decoration: none;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    color 150ms ease,
    background-color 150ms ease;
}

.top-nav a:hover {
  transform: translateY(-1px);
  border-color: rgb(43 92 230 / 0.16);
  background: rgb(255 255 255 / 0.82);
  color: var(--ink-strong);
}

@media (max-width: 760px) {
  .app-frame {
    padding: 1rem;
  }

  .masthead {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

## File: app2/src/app/app.html
```html
<div class="app-frame">
  <header class="masthead">
    <a class="brand" [routerLink]="'/'">
      <span class="brand-mark">W</span>
      <span>
        <strong>Waypoint</strong>
        <small>Route Playground</small>
      </span>
    </a>

    <nav class="top-nav" aria-label="Primary navigation">
      <a [routerLink]="'/'">Overview</a>
      <a
        [routerLink]="{
          name: 'workspace',
          params: { projectId: session.currentUser().homeProjectId },
          query: {
            view: session.currentUser().preferredView,
            page: 1,
            filters: session.currentUser().focusFilters
          }
        }"
      >
        Workspace
      </a>
      <a [routerLink]="{ name: 'reports' }">Lazy Reports</a>
      <a [routerLink]="'/legacy'">Redirect</a>
    </nav>
  </header>

  <router-outlet />
</div>
```

## File: app2/src/app/app.routes.server.ts
```typescript
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
```

## File: app2/src/app/app.routes.ts
```typescript
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
```

## File: app2/src/app/app.ts
```typescript
import {
  Component,
  effect,
  inject,
} from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
} from '@epikodelabs/waypoint';
import { DemoSessionService } from '../../../app1/src/app/demo-session.service';
import { registerProtectedRouteRuntime } from './protected-route-runtime';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly session = inject(DemoSessionService);

  constructor() {
    registerProtectedRouteRuntime();

    if (typeof document === 'undefined') {
      return;
    }

    effect(() => {
      const identity =
        this.session.currentUserId();

      document.cookie =
        `identity=${encodeURIComponent(identity)}; Path=/; SameSite=Lax`;
    });
  }
}
```

## File: app2/src/app/protected-route-loader.ts
```typescript
import type {
  NavigationTree,
} from '@epikodelabs/waypoint';

interface RouteModule {
  readonly default?: unknown;
}

const importRouteModule =
  new Function(
    'url',
    'return import(url);',
  ) as (
    url: string,
  ) => Promise<RouteModule>;

function isRouteArray(
  value: unknown,
): value is NavigationTree {
  return Array.isArray(value);
}

export async function loadProtectedRouteBranch(
  url: URL,
): Promise<NavigationTree | null> {
  const requestPath =
    `${url.pathname}${url.search}${url.hash}`;
  const response =
    await fetch(
      `/api/routes/module?path=${encodeURIComponent(requestPath)}`,
      {
        credentials: 'same-origin',
        headers: {
          Accept: 'text/javascript',
        },
      },
    );

  if (
    response.status === 401 ||
    response.status === 403 ||
    response.status === 404
  ) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to resolve route branch for ${requestPath}: ${response.status}`,
    );
  }

  const moduleSource =
    await response.text();
  const blobUrl =
    URL.createObjectURL(
      new Blob(
        [moduleSource],
        {
          type: 'text/javascript',
        },
      ),
    );

  try {
    const loaded =
      await importRouteModule(
        blobUrl,
      );
    const branch =
      loaded.default;

    if (!isRouteArray(branch)) {
      throw new Error(
        `Route module for ${requestPath} did not export a route array.`,
      );
    }

    return Object.freeze(
      [...branch],
    ) as NavigationTree;
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}
```

## File: app2/src/app/protected-route-runtime.ts
```typescript
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
```

## File: app2/src/authorized-route-modules.ts
```typescript
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
```

## File: app2/src/index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>App2</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
```

## File: app2/src/main.server.ts
```typescript
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
```

## File: app2/src/main.ts
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

## File: app2/src/route-auth.ts
```typescript
import type {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import type {
  Principal,
  RoutePolicy,
} from './route-authorization.js';

declare global {
  namespace Express {
    interface Request {
      principal?: Principal;
    }
  }
}

const demoPrincipals: Readonly<Record<string, Principal>> = {
  nora: {
    subject: 'nora',
    roles: new Set(['user']),
    permissions: new Set([
      'project:read',
      'draft:write',
      'reports:read',
    ]),
  },
  lev: {
    subject: 'lev',
    roles: new Set(['admin']),
    permissions: new Set([
      'project:read',
      'settings:write',
      'draft:write',
      'reports:read',
      'admin:read',
    ]),
  },
};

export const readPrincipal: RequestHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const token =
    request
      .header('authorization')
      ?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?? readIdentityCookie(
      request.header('cookie'),
    );

  request.principal =
    token
      ? demoPrincipals[token]
      : undefined;

  next();
};

function readIdentityCookie(
  header?: string,
): string | undefined {
  if (!header) {
    return undefined;
  }

  for (const part of header.split(';')) {
    const [rawName, ...rawValue] =
      part.trim().split('=');

    if (rawName !== 'identity') {
      continue;
    }

    const value =
      rawValue.join('=');

    return value
      ? decodeURIComponent(value)
      : undefined;
  }

  return undefined;
}

export function isAllowed(
  policy: RoutePolicy,
  principal?: Principal,
): boolean {
  if (policy.allowAnonymous) {
    return true;
  }

  if (!principal) {
    return false;
  }

  const roles =
    policy.roles ?? [];
  const permissions =
    policy.permissions ?? [];
  const roleAllowed =
    roles.length === 0
    || roles.some(role =>
      principal.roles.has(role),
    );
  const permissionsAllowed =
    permissions.every(permission =>
      principal.permissions.has(
        permission,
      ),
    );

  return (
    roleAllowed
    && permissionsAllowed
  );
}
```

## File: app2/src/route-authorization.ts
```typescript
export interface RoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

interface AuthorizationRouteBase {
  readonly path: string;
  readonly outlet?: string;
  readonly policies: readonly RoutePolicy[];
}

export interface AuthorizationLayoutRoute
  extends AuthorizationRouteBase {
  readonly kind: 'layout';
  readonly pageType: string;
  readonly loadMode: 'eager' | 'lazy';
  readonly entries: readonly AuthorizationRoute[];
}

export interface AuthorizationPageRoute
  extends AuthorizationRouteBase {
  readonly kind: 'route';
  readonly name: string;
  readonly pageType: string;
  readonly loadMode: 'eager' | 'lazy';
}

export interface AuthorizationRedirectRoute
  extends AuthorizationRouteBase {
  readonly kind: 'redirect';
  readonly name: string;
  readonly redirectTo: string;
}

export type AuthorizationRoute =
  | AuthorizationLayoutRoute
  | AuthorizationPageRoute
  | AuthorizationRedirectRoute;

export interface Principal {
  readonly subject: string;
  readonly roles: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;
}

export interface RouteModuleArtifact {
  readonly routeName: string;
  readonly modulePath: string;
}
```

## File: app2/src/server.ts
```typescript
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, {
  type NextFunction,
  type Request as ExpressRequest,
  type Response as ExpressResponse,
} from 'express';
import { join } from 'node:path';
import {
  authorizationRoutes,
  routeModuleArtifactsByName,
} from './authorized-route-modules.js';
import {
  isAllowed,
  readPrincipal,
} from './route-auth.js';
import type {
  AuthorizationRoute,
  Principal,
  RoutePolicy,
} from './route-authorization.js';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

app.use(readPrincipal);

interface MatchedPageRoute {
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly name: string;
  readonly pageType?: string;
  readonly redirectTo?: string;
  readonly policies: readonly RoutePolicy[];
}

function isAllowedByPolicies(
  policies: readonly RoutePolicy[],
  principal?: Principal,
): boolean {
  return policies.every(policy =>
    isAllowed(
      policy,
      principal,
    ),
  );
}

function escapeRegExp(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  );
}

function matchesRoutePath(
  pattern: string,
  pathname: string,
): boolean {
  const regex = new RegExp(
    `^${pattern
      .split('/')
      .map(segment => {
        if (!segment) {
          return '';
        }

        return segment.startsWith(':')
          ? '[^/]+'
          : escapeRegExp(segment);
      })
      .join('/')}$`,
  );

  return regex.test(pathname);
}

function findMatchedPageRoute(
  pathname: string,
  routes: readonly AuthorizationRoute[],
  inheritedPolicies: readonly RoutePolicy[] = [],
): MatchedPageRoute | undefined {
  for (const route of routes) {
    const policies = [
      ...inheritedPolicies,
      ...route.policies,
    ];

    if (route.kind === 'layout') {
      const matched =
        findMatchedPageRoute(
          pathname,
          route.entries,
          policies,
        );

      if (matched) {
        return matched;
      }

      continue;
    }

    if (
      !matchesRoutePath(
        route.path,
        pathname,
      )
    ) {
      continue;
    }

    if (route.kind === 'redirect') {
      return {
        kind: 'redirect',
        path: route.path,
        name: route.name,
        redirectTo: route.redirectTo,
        policies,
      };
    }

    return {
      kind: 'route',
      path: route.path,
      name: route.name,
      pageType: route.pageType,
      policies,
    };
  }

  return undefined;
}

function readRequestedPath(
  value: unknown,
): URL | null {
  if (
    typeof value !== 'string'
    || value.trim() === ''
  ) {
    return null;
  }

  try {
    const requested = new URL(
      value,
      'http://waypoint.local',
    );

    if (
      requested.origin
      !== 'http://waypoint.local'
    ) {
      return null;
    }

    return requested;
  } catch {
    return null;
  }
}

/**
 * Example API endpoint for server-side requests during development.
 */
app.get('/api/ping', (_req: ExpressRequest, res: ExpressResponse) => {
  res.json({
    ok: true,
    runtime: 'express',
    renderedAt: new Date().toISOString(),
  });
});

app.get(
  '/api/routes/module',
  (request: ExpressRequest, response: ExpressResponse) => {
    const requested =
      readRequestedPath(
        request.query['path'],
      );

    if (!requested) {
      response.status(400).json({
        error:
          'Provide a relative route path in the "path" query parameter.',
      });
      return;
    }

    const matched =
      findMatchedPageRoute(
        requested.pathname,
        authorizationRoutes,
      );

    if (!matched) {
      response.status(404).json({
        error:
          'Route module not found.',
        path: requested.pathname,
      });
      return;
    }

    if (
      !isAllowedByPolicies(
        matched.policies,
        request.principal,
      )
    ) {
      if (!request.principal) {
        response.status(401).json({
          error:
            'Authentication required.',
          path: requested.pathname,
        });
        return;
      }

      response.status(403).json({
        error:
          'Route not authorized.',
        path: requested.pathname,
        name: matched.name,
      });
      return;
    }

    const artifact =
      routeModuleArtifactsByName[
        matched.name
      ];

    if (!artifact) {
      response.status(409).json({
        error:
          'Route module artifact is not configured.',
        path: requested.pathname,
        name: matched.name,
      });
      return;
    }

    response.set({
      'Cache-Control':
        'private, no-store',
      'Content-Type':
        'text/javascript; charset=utf-8',
      Vary:
        'Authorization, Cookie',
      'X-Content-Type-Options':
        'nosniff',
      'X-Waypoint-Route-Name':
        matched.name,
    });

    response.sendFile(
      join(
        browserDistFolder,
        artifact.modulePath,
      ),
      error => {
        if (
          !error
          || response.headersSent
        ) {
          return;
        }

        response.status(503).json({
          error:
            'Route module artifact is unavailable. Build app2 before requesting route modules.',
          name: matched.name,
        });
      },
    );
  },
);

app.use(
  '/protected-routes',
  (_request: ExpressRequest, response: ExpressResponse) => {
    response.status(404).end();
  },
);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/api', (_request: ExpressRequest, response: ExpressResponse) => {
  response.status(404).json({
    error: 'API route not found.',
  });
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response: globalThis.Response | null) => (
      response
        ? writeResponseToNodeResponse(response, res)
        : next()
    ))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error?: unknown) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
```

## File: app2/src/styles.css
```css
@import '../../app1/src/styles.css';
```

## File: app2/tsconfig.app.json
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "types": ["jasmine"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

## File: app2/tsconfig.spec.json
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
```
