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
````
builders/
  src/
    run-script/
      index.cjs
      schema.json
    with-prerequisites/
      index.cjs
      schema.json
  builders.json
  package.json
docs/
  authorization-tree.md
  build-model.md
  choosing-a-navigation-library.md
  server-delivery-contract.md
projects/
  apps/
    app1/
      src/
        app/
          core/
            demo-session.service.ts
          pages/
            demo-pages.ts
            reports.page.ts
          routes/
            application.routes.ts
            public.routes.ts
          app.config.ts
          app.css
          app.html
          app.routes.ts
          app.ts
        index.html
        main.ts
        styles.css
      tsconfig.app.json
      tsconfig.spec.json
    app2/
      client/
        src/
          app/
            core/
              demo-session.service.ts
            pages/
              admin-pages.ts
              demo-pages.ts
              README.md
              reports.page.ts
            routes/
              administration.routes.ts
              application.routes.ts
              public.routes.ts
            app.config.ts
            app.css
            app.html
            app.routes.ts
            app.ts
          index.html
          main.ts
          styles.css
        proxy.conf.json
        tsconfig.app.json
        tsconfig.artifacts.json
        tsconfig.spec.json
      server/
        src/
          app/
            app.config.server.ts
            app.config.ts
            app.config.ts.patch
            app.css
            app.html
            app.routes.server.ts
            app.routes.ts
            app.ts
          compiler-output.ts
          index.html
          main.server.ts
          main.ts
          route-auth.ts
          server.ts
          styles.css
        tsconfig.app.json
        tsconfig.spec.json
  libraries/
    waypoint/
      client/
        ng-package.json
        public-api.ts
      server/
        browser-delivery-shared.spec.ts
        browser-delivery.patch.ts
        browser-delivery.ts
        ng-package.json
        public-api.ts
        server-artifact-authorization.ts
        server-artifact.ts
        server-delivery.ts
        server-express.ts
        server-host-runtime.ts
        server-http.ts
        server-router.patch.ts
        server-router.ts
        server-routing.patch.ts
        server-routing.ts
        server-shared-artifacts.spec.ts
        server-source.ts
      src/
        lib/
          adapter-utils.ts
          browser-delivery.ts
          history.ts
          index.ts
          navigation-commit.ts
          navigation-definitions.ts
          navigation-executor.ts
          navigation-targets.ts
          query-schema.ts
          route-adapter.ts
          route-builders.ts
          route-catalog.ts
          route-compiler.ts
          route-path.ts
          route-renderer.ts
          route-runtime.ts
          route-slots.ts
          router-contract.ts
          router-events.ts
          router-link.ts
          router-outlet.ts
          router-url.ts
          router.ts
          server-delivery.ts
          server-express.ts
          server-host-runtime.ts
          server-http.ts
          server-router.ts
          server-routing.ts
          server-source.ts
          typed-navigation.ts
          vanilla-router.ts
        tests/
          adapters.spec.ts
          angular-testbed.init.ts
          browser-delivery.spec.ts
          env.spec.ts
          history-manager-deep.spec.ts
          outlet-isolation.spec.ts
          query-schema-strict.spec.ts
          query-schema.spec.ts
          route-catalog.spec.ts
          route-compiler.spec.ts
          route-path.spec.ts
          route-runtime.spec.ts
          route-slots.spec.ts
          router-configuration.spec.ts
          router-events.spec.ts
          router-facade.spec.ts
          router-history-regression.spec.ts
          router-link.spec.ts
          router-mutation.spec.ts
          router-platform.spec.ts
          router-races.spec.ts
          router-redirect-chain.spec.ts
          router-test-utils.spec.ts
          router-test-utils.ts
          router.spec.ts
          server-delivery.spec.ts
          server-express.spec.ts
          server-http.spec.ts
          server-router.spec.ts
          server-routing.spec.ts
          server-source.spec.ts
          typed-navigation.spec.ts
          typed-prepare.spec.ts
        public-api.ts
      ng-package.json
      package.json
      README.md
      tsconfig.lib.json
      tsconfig.lib.prod.json
      tsconfig.spec.json
  tools/
    builder/
      scripts/
        generate-waypoint-schema.mjs
        generate-waypoint-schema.mjs.patch
      src/
        analysis/
          angular-declaration-module.ts
          collect-module-authorization-usages.ts
          validate-angular-declaration-isolation.ts
        compiler/
          analyze.ts
          build-layout.ts
          index.patch.ts
          index.ts
          navigation-snapshot.ts
          prepare-build.ts
          server-output.ts
          server-plan.ts
        testing/
          assert-host-isolation.ts
          host-isolation.spec.ts
          README.md
        tests/
          angular-declaration-isolation.spec.ts
          generated-schema.spec.mjs
          server-plan.spec.ts
          watch-cache.spec.ts
          watch-dependency-reuse.spec.ts
          watch-failure-preserves-publication.spec.ts
          watch-generation-lifecycle.spec.ts
          watch-publication-state.spec.ts
          waypoint-options.spec.ts
        watch/
          build-result-stream.ts
          dependency-fingerprint.ts
          watch-cache.ts
          watch-dependencies.ts
          watch-publication-state.ts
          watch-session-v2.ts
          watch-session.ts
        waypoint-build/
          index.cjs
          index.integration.patch.ts
          index.patch.ts
          index.ts
          options.patch.ts
          options.ts
          schema-source.json
          schema.json
          schema.patch.ts
          watch.patch.ts
          watch.ts
      builders.json
      package.json
templates/
  server-node-ts/
    src/
      app/
        app.config.server.ts
        app.config.ts
        app.css
        app.html
        app.routes.server.ts
        app.routes.ts
        app.ts
      compiler-output.ts
      index.html
      main.server.ts
      main.ts
      route-auth.ts
      server.ts
      styles.css
    README.md
    tsconfig.app.json
    tsconfig.spec.json
.editorconfig
.gitignore
.prettierrc
angular.json
package.json
README.md
testify.json
tsconfig.json
````

# Files

## File: testify.json
````json
{
  "srcDirs": [
    "projects/libraries/waypoint/src/lib"
  ],
  "testDirs": [
    "projects/libraries/waypoint/src/tests"
  ],
  "exclude": [
    "**/node_modules/**"
  ],
  "preserveOutputs": false,
  "outDir": "dist/.vite-jasmine-build",
  "browser": "chrome",
  "headless": false,
  "coverage": false,
  "port": 8888,
  "viteBuildOptions": {
    "target": "es2022",
    "sourcemap": true,
    "minify": false,
    "preserveModules": false,
    "preserveModulesRoot": "."
  },
  "jasmineConfig": {
    "env": {
      "stopSpecOnExpectationFailure": false,
      "random": true,
      "seed": 0,
      "timeout": 120000
    }
  },
  "htmlOptions": {
    "title": "Jasmine Test Runner",
    "preludeModules": [
      "@angular/compiler"
    ]
  },
  "suppressConsoleLogs": false
}
````

## File: builders/src/run-script/index.cjs
````javascript
const { spawn } = require('node:child_process');
const path = require('node:path');

const { createBuilder } = require('@angular-devkit/architect');

module.exports = createBuilder(async (options, context) => {
  const scriptPath = path.resolve(
    context.workspaceRoot,
    options.script,
  );
  const cwd = options.workingDirectory
    ? path.resolve(
        context.workspaceRoot,
        options.workingDirectory,
      )
    : context.workspaceRoot;

  context.reportStatus(
    `Running ${path.relative(context.workspaceRoot, scriptPath)}.`,
  );

  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [scriptPath, ...(options.args ?? [])],
      {
        cwd,
        env: process.env,
        shell: false,
        stdio: 'inherit',
      },
    );

    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });

  if (exitCode !== 0) {
    context.logger.error(
      `Script "${options.script}" failed with exit code ${exitCode}.`,
    );
  }

  return { success: exitCode === 0 };
});
````

## File: builders/src/run-script/schema.json
````json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Run Script Builder",
  "type": "object",
  "properties": {
    "script": {
      "type": "string",
      "description": "Workspace-relative path to the Node.js script."
    },
    "args": {
      "type": "array",
      "description": "Arguments to pass to the script.",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "workingDirectory": {
      "type": "string",
      "description": "Working directory relative to the workspace root."
    }
  },
  "required": [
    "script"
  ],
  "additionalProperties": false
}
````

## File: builders/src/with-prerequisites/index.cjs
````javascript
const {
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString,
  targetStringFromTarget,
} = require('@angular-devkit/architect');
const { from } = require('rxjs');
const { concatMap } = require('rxjs/operators');

const CUSTOM_OPTION_KEYS = new Set([
  'delegateTarget',
  'prerequisiteTargets',
  'targetConfiguration',
]);

module.exports = createBuilder((options, context) => {
  const delegateTarget = resolveTarget(
    options.delegateTarget,
    options.targetConfiguration,
    context,
  );
  const prerequisiteTargets = (
    options.prerequisiteTargets ?? []
  ).map(specifier =>
    resolveTarget(
      specifier,
      options.targetConfiguration,
      context,
    ),
  );
  const delegateOverrides = collectDelegateOverrides(
    options,
  );

  return from(
    runPrerequisites(prerequisiteTargets, context),
  ).pipe(
    concatMap(() =>
      scheduleTargetAndForget(
        context,
        delegateTarget,
        delegateOverrides,
      ),
    ),
  );
});

async function runPrerequisites(targets, context) {
  for (const target of targets) {
    context.reportStatus(
      `Running ${targetStringFromTarget(target)}.`,
    );

    const run = await context.scheduleTarget(target);

    try {
      const result = await run.result;
      if (!result.success) {
        throw new Error(
          `Target ${targetStringFromTarget(target)} failed.`,
        );
      }
    } finally {
      await run.stop();
    }
  }
}

function resolveTarget(
  specifier,
  targetConfiguration,
  context,
) {
  const target = targetFromTargetString(
    specifier,
    context.target?.project,
  );

  if (!target.configuration && targetConfiguration) {
    target.configuration = targetConfiguration;
  } else if (
    !target.configuration
    && context.target?.configuration
  ) {
    target.configuration =
      context.target.configuration;
  }

  return target;
}

function collectDelegateOverrides(options) {
  const overrides = {};

  for (const [key, value] of Object.entries(options)) {
    if (!CUSTOM_OPTION_KEYS.has(key)) {
      overrides[key] = value;
    }
  }

  return overrides;
}
````

## File: builders/src/with-prerequisites/schema.json
````json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "With Prerequisites Builder",
  "type": "object",
  "properties": {
    "delegateTarget": {
      "type": "string",
      "description": "Target to run after prerequisites complete."
    },
    "prerequisiteTargets": {
      "type": "array",
      "description": "Targets to run before the delegate target.",
      "items": {
        "type": "string"
      },
      "default": []
    },
    "targetConfiguration": {
      "type": "string",
      "description": "Configuration name to apply when delegated targets omit one."
    }
  },
  "required": [
    "delegateTarget"
  ],
  "additionalProperties": true
}
````

## File: builders/builders.json
````json
{
  "$schema": "../node_modules/@angular-devkit/architect/src/builders-schema.json",
  "builders": {
    "run-script": {
      "implementation": "./src/run-script/index.cjs",
      "schema": "./src/run-script/schema.json",
      "description": "Runs a local Node.js script."
    },
    "with-prerequisites": {
      "implementation": "./src/with-prerequisites/index.cjs",
      "schema": "./src/with-prerequisites/schema.json",
      "description": "Runs prerequisite targets before delegating to another target."
    }
  }
}
````

## File: builders/package.json
````json
{
  "name": "builders",
  "private": true,
  "type": "commonjs",
  "builders": "builders.json"
}
````

## File: docs/authorization-tree.md
````markdown
# Authorization tree

Nested `routesFor()` ownership is monotonic.

A nested route set inherits the complete context of the slot it targets,
including inherited policy context.

Waypoint therefore enforces:

```text
parent audience
    ⊇
child audience
```

or, phrased in requirements:

```text
child requirements
    >=
parent requirements
```

A child may preserve or strengthen authorization:

```text
application
  roles: user
      ↓
administration
  roles: user + admin
      ↓
security
  roles: user + admin
  permissions: security:manage
```

Valid.

A child may not weaken authorization:

```text
administration
  roles: user + admin
      ↓
application
  roles: user
```

Invalid: WPT3211.

The rule does not assign ranks to role names.

These domains are incomparable:

```text
roles: admin
roles: finance
```

so neither may be nested beneath the other unless their inherited policy chain
makes the resulting child domain a true subset of the parent audience.

This invariant aligns three structures:

```text
routesFor ownership tree
        =
artifact dependency tree
        =
authorization monotonicity tree
```

That gives the compiler a simple security guarantee:

> walking deeper into protected route ownership can never reveal code to a
> broader audience.
````

## File: docs/build-model.md
````markdown
# Waypoint build model

A normal Angular application keeps an explicit route-module convention:

```text
src/app/app.routes.ts
```

The file itself may be only an aggregation module:

```ts
export { publicRoutes } from './routes/public.routes';
export { applicationRoutes } from './routes/application.routes';
export { administrationRoutes } from './routes/administration.routes';
```

`app.config.ts` remains ordinary application code:

```ts
...provideRouter(routes, {
  resolveRoutes: createServerNavigationResolver(),
})
```

Waypoint-specific build behavior begins at the builder boundary.

The builder:

1. analyzes `app.routes.ts`;
2. prepares protected AOT sources;
3. generates host-only navigation/runtime inputs;
4. delegates the host build to Angular;
5. bundles protected code by authorization domain;
6. validates physical isolation;
7. publishes server delivery metadata atomically.

There is deliberately no automatic search for a route filename. Convention is
more predictable than filesystem heuristics, and `waypoint.entry` remains the
escape hatch for non-standard layouts.
````

## File: projects/apps/app1/src/app/core/demo-session.service.ts
````typescript
import {
  inject,
  Injectable,
  InjectionToken,
  signal,
  type Provider,
} from '@angular/core';
import { Router } from '@epikodelabs/waypoint';

export interface DemoUser {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly email: string;
  readonly homeProjectId: number;
  readonly favoriteDraftId: number;
  readonly preferredView: string;
  readonly focusFilters: readonly string[];
  readonly prefersDraftGuard: boolean;
}

export interface WorkspaceSnapshot {
  readonly projectId: number;
  readonly loadOrder: number;
  readonly activeUserName: string;
  readonly activeUserRole: string;
  readonly recommendedDraftId: number;
  readonly suggestedFilters: readonly string[];
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
    prefersDraftGuard: false,
  },
] satisfies readonly DemoUser[]);

function readIdentityCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const identity = document.cookie
    .split(';')
    .map(value => value.trim())
    .find(value => value.startsWith('identity='))
    ?.slice('identity='.length);

  if (!identity) return null;

  try {
    return decodeURIComponent(identity);
  } catch {
    return null;
  }
}

function initialDemoUser(): DemoUser {
  const identity = readIdentityCookie();
  return demoUsers.find(user => user.id === identity) ?? demoUsers[0];
}

export type DemoPrincipalSwitcher = (
  session: DemoSessionService,
  userId: string,
) => Promise<void>;

export const DEMO_PRINCIPAL_SWITCHER = new InjectionToken<DemoPrincipalSwitcher>(
  'DEMO_PRINCIPAL_SWITCHER',
);

@Injectable({
  providedIn: 'root',
})
export class DemoSessionService {
  readonly users = demoUsers;
  private readonly initialUser = initialDemoUser();
  private readonly principalSwitcher = inject(
    DEMO_PRINCIPAL_SWITCHER,
    { optional: true },
  );
  readonly currentUserId = signal(this.initialUser.id);
  readonly draftDirty = signal(
    this.initialUser.prefersDraftGuard,
  );
  readonly workspaceLoads = signal(0);
  private readonly realmIdentity = readIdentityCookie();

  constructor() {
    if (typeof window === 'undefined') return;

    window.addEventListener('pageshow', () => {
      if (readIdentityCookie() !== this.realmIdentity) {
        window.location.reload();
      }
    });
  }

  currentUser(): DemoUser {
    return this.users.find(
      user => user.id === this.currentUserId(),
    ) ?? this.users[0];
  }

  activateLocalUser(userId: string): DemoUser {
    const user = this.users.find(candidate => candidate.id === userId);
    if (!user) {
      throw new Error(`Unknown demo principal "${userId}".`);
    }

    this.currentUserId.set(user.id);
    this.draftDirty.set(user.prefersDraftGuard);
    this.workspaceLoads.set(0);

    return user;
  }

  async switchPrincipal(userId: string): Promise<void> {
    if (this.principalSwitcher) {
      await this.principalSwitcher(this, userId);
      return;
    }

    const response = await fetch('/api/session/principal', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identity: userId }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to switch principal "${userId}": ${response.status}.`,
      );
    }

    const payload: unknown = await response.json();
    if (
      !payload
      || typeof payload !== 'object'
      || typeof (payload as { location?: unknown }).location !== 'string'
      || !(payload as { location: string }).location.startsWith('/')
      || (payload as { location: string }).location.startsWith('//')
    ) {
      throw new Error('Server returned an invalid principal landing response.');
    }

    window.location.replace((payload as { location: string }).location);
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

}

export function provideLocalDemoPrincipalSwitching(): Provider {
  return {
    provide: DEMO_PRINCIPAL_SWITCHER,
    useFactory: () => {
      const router = inject(Router);

      return async (session: DemoSessionService, userId: string) => {
        const user = session.activateLocalUser(userId);
        const filters = user.focusFilters
          .map(filter => `filters=${encodeURIComponent(filter)}`)
          .join('&');
        const target =
          `/app/workspace/${user.homeProjectId}`
          + `?view=${encodeURIComponent(user.preferredView)}`
          + `&page=1`
          + (filters ? `&${filters}` : '');

        await router.navigate(target);
      };
    },
  };
}
````

## File: projects/apps/app1/src/app/pages/demo-pages.ts
````typescript
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
  type WorkspaceSnapshot,
  DemoSessionService,
} from '../core/demo-session.service';

type ParamsInput = Record<string, unknown>;
type QueryInput = Record<string, unknown>;
type DataInput = Record<string, unknown>;

function handleNavigation(navigation: Promise<boolean>): void {
  navigation.catch(error => {
    console.error(error);
  });
}

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
            Home workspace {{ currentUser().homeProjectId }}
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
    await this.session.switchPrincipal(userId);
  }

  protected openWorkspace(
    projectId = this.currentUser().homeProjectId,
  ): void {
    const activeUser = this.currentUser();

    handleNavigation(this.router.navigate(
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
    ));
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
    ] as const;
  }

  protected async activateUser(userId: string): Promise<void> {
    await this.session.switchPrincipal(userId);
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
            Recommended draft:
            <strong>#{{ snapshot()?.recommendedDraftId ?? 0 }}</strong>
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

    handleNavigation(this.router.navigate({
      name: 'editor',
      params: { draftId: activeUser.favoriteDraftId },
      query: { mode: 'review' },
    }));
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
    handleNavigation(this.router.navigate({ name: 'reports' }));
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
````

## File: projects/apps/app1/src/app/pages/reports.page.ts
````typescript
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
````

## File: projects/apps/app1/src/app/routes/public.routes.ts
````typescript
import { redirectRoute, route, routesFor, type NavigationTree } from '@epikodelabs/waypoint';

import { IntroPage } from '../pages/demo-pages';

export const introRoute = route('/', IntroPage, {
  name: 'intro',
});

export const legacyRoute = redirectRoute(
  '/legacy',
  '/app/workspace/101?view=activity&page=2&filters=legacy',
  {
    name: 'legacy',
  },
);

const entries = [introRoute, legacyRoute] as const satisfies NavigationTree;

export const publicRoutes = routesFor('public', 'public-core', entries);
````

## File: projects/apps/app2/client/src/app/pages/admin-pages.ts
````typescript
import { Component, input } from '@angular/core';

type DataInput = Record<string, unknown>;
interface AdminAudit {
  readonly reviewedBy: string;
  readonly reviewerRole: string;
  readonly workspaceLoads: number;
}

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
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <p class="eyebrow">server authorization + prepare</p>
          <h1>Admin console</h1>
        </div>
        <span class="status-pill">server authorized</span>
      </header>

      <div class="page-grid">
        <article class="panel">
          <h3>Delivery boundary</h3>
          <p>
            This page is compiled into a separate administration artifact and
            is delivered only after server authorization succeeds.
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
````

## File: projects/apps/app2/client/src/app/pages/demo-pages.ts
````typescript
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
  type WorkspaceSnapshot,
  DemoSessionService,
} from '../core/demo-session.service';

type ParamsInput = Record<string, unknown>;
type QueryInput = Record<string, unknown>;
type DataInput = Record<string, unknown>;

function handleNavigation(navigation: Promise<boolean>): void {
  navigation.catch(error => {
    console.error(error);
  });
}

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
            Home workspace {{ currentUser().homeProjectId }}
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
    await this.session.switchPrincipal(userId);
  }

  protected openWorkspace(
    projectId = this.currentUser().homeProjectId,
  ): void {
    const activeUser = this.currentUser();

    handleNavigation(this.router.navigate(
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
    ));
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
    ] as const;
  }

  protected async activateUser(userId: string): Promise<void> {
    await this.session.switchPrincipal(userId);
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
            Recommended draft:
            <strong>#{{ snapshot()?.recommendedDraftId ?? 0 }}</strong>
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

    handleNavigation(this.router.navigate({
      name: 'editor',
      params: { draftId: activeUser.favoriteDraftId },
      query: { mode: 'review' },
    }));
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
    handleNavigation(this.router.navigate({ name: 'reports' }));
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
````

## File: projects/apps/app2/client/src/app/pages/README.md
````markdown
# Page module boundaries

Keep Angular declarations aligned with authorization ownership.

Preferred:

```text
pages/
  intro.page.ts
  demo-shell.component.ts
  workspace.page.ts
  workspace-sidebar.component.ts
  settings.page.ts
  settings-sidebar.component.ts
  editor.page.ts
  editor-sidebar.component.ts
```

Avoid large declaration barrels such as:

```text
demo-pages.ts
```

when different declarations are consumed by different `routesFor()`
authorization domains.

Waypoint now reports `WPT3220` when an AOT module containing Angular
declarations would otherwise be duplicated across incompatible authorization
domains.
````

## File: projects/apps/app2/client/src/app/pages/reports.page.ts
````typescript
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
````

## File: projects/apps/app2/client/src/app/routes/administration.routes.ts
````typescript
import { inject } from '@angular/core';
import {
  frame,
  route,
  routesFor,
} from '@epikodelabs/waypoint';

import { AdminPage, AdminSidebarComponent } from '../pages/admin-pages';
import { DemoSessionService } from '../core/demo-session.service';

export const adminRoute = route(
  '/admin',
  frame(AdminPage, {
    prepare: [
      () => {
        const session = inject(DemoSessionService);
        const user = session.currentUser();

        return {
          audit: {
            reviewedBy: user.email,
            reviewerRole: user.role,
            workspaceLoads: session.workspaceLoads(),
          },
        };
      },
    ],
  }),
  {
    name: 'admin',
    policy: {
      roles: ['admin'],
      permissions: ['admin:read'],
    },
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
export const administrationRoutes = routesFor(
  'administration',
  'administration-core',
  adminBranchRoutes,
);
````

## File: projects/apps/app2/client/src/app/routes/public.routes.ts
````typescript
import { redirectRoute, route, routesFor, type NavigationTree } from '@epikodelabs/waypoint';

import { IntroPage } from '../pages/demo-pages';

export const introRoute = route('/', IntroPage, {
  name: 'intro',
});

export const legacyRoute = redirectRoute(
  '/legacy',
  '/app/workspace/101?view=activity&page=2&filters=legacy',
  {
    name: 'legacy',
  },
);

const entries = [introRoute, legacyRoute] as const satisfies NavigationTree;

export const publicRoutes = routesFor('public', 'public-core', entries);
````

## File: projects/apps/app2/client/src/app/app.css
````css
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
````

## File: projects/apps/app2/client/src/app/app.html
````html
<div class="app-frame">
  <header class="masthead">
    <a class="brand" [routerLink]="'/'">
      <span class="brand-mark">WP</span>
      <span>
        <strong>Waypoint</strong>
        <small>App 2 · Server Route Playground</small>
      </span>
    </a>

    <nav class="top-nav" aria-label="Primary navigation">
      <a [routerLink]="'/'">Overview</a>
      <a
        [routerLink]="'/app/workspace/101?view=overview&page=1&filters=open'"
      >
        Workspace
      </a>
      <a [routerLink]="'/app/reports'">Lazy Reports</a>
      <a [routerLink]="'/legacy'">Redirect</a>
    </nav>
  </header>

  <router-outlet />
</div>
````

## File: projects/apps/app2/client/src/app/app.ts
````typescript
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@epikodelabs/waypoint';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
````

## File: projects/apps/app2/client/src/index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Waypoint Route Playground</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
````

## File: projects/apps/app2/client/src/main.ts
````typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch(error => console.error(error));
````

## File: projects/apps/app2/client/src/styles.css
````css
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
````

## File: projects/apps/app2/client/proxy.conf.json
````json
{
  "/api": {
    "target": "http://localhost:4300",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
````

## File: projects/apps/app2/client/tsconfig.spec.json
````json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../../out-tsc/client-spec",
    "types": [
      "jasmine"
    ]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
````

## File: projects/apps/app2/server/src/app/app.config.server.ts
````typescript
import {
  type ApplicationConfig,
  mergeApplicationConfig,
} from '@angular/core';
import {
  provideServerRendering,
  withRoutes,
} from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};

export const config =
  mergeApplicationConfig(appConfig, serverConfig);
````

## File: projects/apps/app2/server/src/app/app.config.ts.patch
````diff
/*
Apply the same simplification to the server-hosted browser app configuration:

import {
  createServerNavigationResolver,
} from '@epikodelabs/waypoint/server';

...provideRouter(routes, {
  viewTransitions: true,
  resolveRoutes:
    createServerNavigationResolver(),
}),

Delete the local protected-route-loader import.
*/
````

## File: projects/apps/app2/server/src/app/app.css
````css
:host { display: block; min-height: 100vh; }
.app-frame { min-height: 100vh; padding: 1.5rem; }
.masthead {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 88rem;
  margin: 0 auto 1.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  background: var(--panel-color);
}
.brand, nav a { color: var(--ink-strong); text-decoration: none; }
nav { display: flex; flex-wrap: wrap; gap: .6rem; }
nav a { padding: .7rem 1rem; border-radius: 999px; }
````

## File: projects/apps/app2/server/src/app/app.html
````html
<div class="app-frame">
  <header class="masthead">
    <a class="brand" [routerLink]="'/'">Waypoint</a>
    <nav>
      <a [routerLink]="'/'">Overview</a>
      <a [routerLink]="'/app/workspace/101?view=overview&page=1&filters=open'">Workspace</a>
      <a [routerLink]="'/app/reports'">Reports</a>
      <a [routerLink]="'/legacy'">Redirect</a>
    </nav>
  </header>
  <router-outlet />
</div>
````

## File: projects/apps/app2/server/src/app/app.routes.server.ts
````typescript
import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
````

## File: projects/apps/app2/server/src/app/app.routes.ts
````typescript
import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';

/**
 * App 2's server-hosted browser app ships the same minimal navigation
 * skeleton as its standalone client. Protected route implementations and
 * metadata are not bundled here; compiler artifacts attach to these ownership
 * slots at runtime.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
````

## File: projects/apps/app2/server/src/app/app.ts
````typescript
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@epikodelabs/waypoint';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
````

## File: projects/apps/app2/server/src/index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Waypoint Runtime</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body><app-root></app-root></body>
</html>
````

## File: projects/apps/app2/server/src/main.server.ts
````typescript
import {
  type BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';

import { config } from './app/app.config.server';
import { App } from './app/app';

export default (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);
````

## File: projects/apps/app2/server/src/main.ts
````typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch(error => console.error(error));
````

## File: projects/apps/app2/server/src/route-auth.ts
````typescript
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ServerPrincipal } from '@epikodelabs/waypoint/server';

declare global {
  namespace Express {
    interface Request {
      principal?: ServerPrincipal;
    }
  }
}

export interface DemoPrincipalProfile {
  readonly id: string;
  readonly principal: ServerPrincipal;
  readonly landingTargets: readonly string[];
}

const demoProfiles: Readonly<Record<string, DemoPrincipalProfile>> = {
  nora: {
    id: 'nora',
    principal: {
      subject: 'nora',
      roles: new Set(['user']),
      permissions: new Set([
        'project:read',
        'draft:write',
        'reports:read',
      ]),
    },
    landingTargets: [
      '/app/settings?section=access',
      '/',
    ],
  },
  lev: {
    id: 'lev',
    principal: {
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
    landingTargets: [
      '/app/admin',
      '/app/settings?section=access',
      '/',
    ],
  },
};

export function demoPrincipalProfile(
  identity: unknown,
): DemoPrincipalProfile | undefined {
  if (typeof identity !== 'string') return undefined;
  return demoProfiles[identity.trim()];
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return '';
  }
}

export const readPrincipal: RequestHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const token = request.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?? request.header('cookie')
      ?.split(';')
      .map(value => value.trim())
      .find(value => value.startsWith('identity='))
      ?.slice('identity='.length);

  request.principal = token
    ? demoPrincipalProfile(safeDecodeURIComponent(token))?.principal
    : undefined;
  next();
};
````

## File: projects/apps/app2/server/src/styles.css
````css
:root {
  --app-bg: linear-gradient(180deg, #f5f7fb, #edf2f9);
  --panel-color: rgb(255 255 255 / .8);
  --border-color: rgb(54 86 131 / .12);
  --ink-strong: #162033;
  --ink-body: #31405d;
}
* { box-sizing: border-box; }
html, body { min-height: 100%; }
body {
  margin: 0;
  background: var(--app-bg);
  color: var(--ink-body);
  font-family: "Segoe UI Variable Text", sans-serif;
}
````

## File: projects/apps/app2/server/tsconfig.app.json
````json
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": { "types": [] },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
````

## File: projects/apps/app2/server/tsconfig.spec.json
````json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../../out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
````

## File: projects/libraries/waypoint/client/ng-package.json
````json
{
  "$schema": "../../../node_modules/ng-packagr/ng-entrypoint.schema.json",
  "lib": {
    "entryFile": "public-api.ts"
  }
}
````

## File: projects/libraries/waypoint/server/browser-delivery-shared.spec.ts
````typescript
import {
  createServerNavigationResolver,
} from './browser-delivery';

describe('browser shared artifact delivery', () => {
  it('loads shared modules but returns only route contributions', async () => {
    const imported: string[] = [];
    const routeContribution = { kind: 'routes-for', id: 'admin' } as any;

    const resolver = createServerNavigationResolver({
      fetch: async () => ({
        ok: true,
        status: 200,
        async json() {
          return {
            version: 2,
            artifactKey: 'admin',
            artifacts: [
              {
                kind: 'shared',
                artifactKey: 'shared:admin',
                moduleUrl: '/modules/shared/ABC',
                hash: 'ABC',
              },
              {
                kind: 'route',
                artifactKey: 'admin',
                moduleUrl: '/modules/admin/DEF',
                hash: 'DEF',
              },
            ],
          };
        },
      }),
      importModule: async url => {
        imported.push(url);
        return url.includes('/admin/')
          ? { default: routeContribution }
          : { helper: true };
      },
    });

    const result = await resolver(new URL('https://example.test/app/admin'));

    expect(imported).toEqual([
      '/modules/shared/ABC',
      '/modules/admin/DEF',
    ]);
    expect(result?.contributions).toEqual([routeContribution]);
  });

  it('does not require shared modules to export route contributions', async () => {
    const resolver = createServerNavigationResolver({
      fetch: async () => ({
        ok: true,
        status: 200,
        async json() {
          return {
            version: 2,
            artifactKey: 'route',
            artifacts: [
              {
                kind: 'shared',
                artifactKey: 'shared:x',
                moduleUrl: '/shared.js',
                hash: 'A',
              },
              {
                kind: 'route',
                artifactKey: 'route',
                moduleUrl: '/route.js',
                hash: 'B',
              },
            ],
          };
        },
      }),
      importModule: async url =>
        url === '/shared.js'
          ? {}
          : { default: { kind: 'routes-for', id: 'route' } },
    });

    await expectAsync(
      resolver(new URL('https://example.test/route')),
    ).toBeResolved();
  });
});
````

## File: projects/libraries/waypoint/server/ng-package.json
````json
{
  "$schema": "../../../node_modules/ng-packagr/ng-entrypoint.schema.json",
  "lib": {
    "entryFile": "public-api.ts"
  }
}
````

## File: projects/libraries/waypoint/server/server-artifact-authorization.ts
````typescript
import type {
  ServerArtifactAuthorization,
  ServerArtifactRecord,
  ServerRouteArtifactRecord,
} from './server-artifact';
import type {
  ServerPrincipal,
  ServerRouteBranch,
  ServerRoutePolicy,
} from './server-routing';

export function isServerAuthorizationAllowed(
  authorization: ServerArtifactAuthorization,
  principal?: ServerPrincipal,
): boolean {
  return isServerPolicyAllowed({
    allowAnonymous: authorization.allowAnonymous,
    roles: authorization.roles,
    permissions: authorization.permissions,
  }, principal);
}

export function isServerDeliveryArtifactAuthorized(
  artifact: ServerArtifactRecord,
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  if (!isServerAuthorizationAllowed(artifact.authorization, principal)) {
    return false;
  }

  if (artifact.kind === 'shared') {
    return true;
  }

  return isRouteArtifactBranchesAuthorized(artifact, branches, principal);
}

function isRouteArtifactBranchesAuthorized(
  artifact: ServerRouteArtifactRecord,
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  return artifact.branchIds.length > 0
    && artifact.branchIds.every(branchId => {
      const branch = branches.get(branchId);
      return !!branch
        && branch.routeSetId === artifact.routeSetId
        && branch.policies.every(policy =>
          isServerPolicyAllowed(policy, principal));
    });
}

function isServerPolicyAllowed(
  policy: ServerRoutePolicy,
  principal?: ServerPrincipal,
): boolean {
  if (policy.allowAnonymous) return true;
  if (!principal) return false;

  const roles = policy.roles ?? [];
  return (roles.length === 0 || roles.some(role => principal.roles.has(role)))
    && (policy.permissions ?? [])
      .every(permission => principal.permissions.has(permission));
}
````

## File: projects/libraries/waypoint/server/server-artifact.ts
````typescript
export interface ServerArtifactAuthorization {
  readonly allowAnonymous: boolean;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
}

export interface ServerRouteArtifactRecord {
  readonly kind: 'route';
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: readonly string[];
  readonly sharedDependencies?: readonly string[];
  readonly branchIds: readonly string[];
  readonly authorization: ServerArtifactAuthorization;
  readonly file?: string;
  readonly hash?: string;
}

export interface ServerSharedArtifactRecord {
  readonly kind: 'shared';
  readonly artifactKey: string;
  readonly dependencies: readonly string[];
  readonly consumers: readonly string[];
  readonly authorization: ServerArtifactAuthorization;
  readonly file?: string;
  readonly hash?: string;
}

export type ServerArtifactRecord =
  | ServerRouteArtifactRecord
  | ServerSharedArtifactRecord;

export function serverArtifactDependencies(
  artifact: ServerArtifactRecord,
): readonly string[] {
  return artifact.kind === 'route'
    ? Object.freeze([
        ...artifact.dependencies,
        ...(artifact.sharedDependencies ?? []),
      ])
    : artifact.dependencies;
}
````

## File: projects/libraries/waypoint/server/server-host-runtime.ts
````typescript
export const WAYPOINT_SERVER_HOST_RUNTIME_SYMBOL_KEY =
  '@epikodelabs/waypoint/server-navigation-host-runtime/v1' as const;

export type ServerNavigationHostModule = Readonly<Record<string, unknown>>;
export type ServerNavigationHostModules = Readonly<
  Record<string, ServerNavigationHostModule>
>;

interface ServerNavigationHostRuntimeState {
  readonly version: 1;
  readonly modules: Map<string, ServerNavigationHostModule>;
}

type RuntimeGlobal = typeof globalThis & {
  [key: symbol]: ServerNavigationHostRuntimeState | undefined;
};

/**
 * Registers package module namespaces that independently delivered artifacts
 * must share with the already-running application.
 *
 * Angular packages and Waypoint itself are identity-sensitive: bundling a
 * second copy into an artifact can create different DI tokens, directives, or
 * framework runtime state. Re-registering the same module namespace is safe;
 * registering a different namespace for the same specifier is rejected.
 */
export function registerServerNavigationHostModules(
  modules: ServerNavigationHostModules,
): void {
  const global = globalThis as RuntimeGlobal;
  const key = Symbol.for(WAYPOINT_SERVER_HOST_RUNTIME_SYMBOL_KEY);
  let state = global[key];

  if (!state) {
    state = Object.freeze({
      version: 1 as const,
      modules: new Map<string, ServerNavigationHostModule>(),
    });
    global[key] = state;
  }

  for (const [specifier, module] of Object.entries(modules)) {
    const normalized = specifier.trim();
    if (!normalized) {
      throw new Error('Server navigation host module specifier must not be empty.');
    }
    if (!module || typeof module !== 'object') {
      throw new Error(`Server navigation host module ${JSON.stringify(normalized)} must be an object namespace.`);
    }

    const existing = state.modules.get(normalized);
    if (existing && existing !== module) {
      throw new Error(
        `Server navigation host module ${JSON.stringify(normalized)} was registered with a different module identity.`,
      );
    }
    state.modules.set(normalized, module);
  }
}
````

## File: projects/libraries/waypoint/server/server-router.patch.ts
````typescript
/*
Apply to server-router.ts.

In resolveNavigationChain(), route lookup currently does:

  const artifacts = snapshot.index.artifacts.filter(
    candidate => candidate.routeSetId === branch.routeSetId,
  );

Change it to:

  const artifacts = snapshot.index.artifacts.filter(
    candidate =>
      candidate.kind === 'route'
      && candidate.routeSetId === branch.routeSetId,
  );

Everything after that can remain unchanged.

authorizedChain() already:
  - resolves the complete dependency chain,
  - loads branch provenance for that chain,
  - authorizes every artifact.

Because shared artifacts contribute no branch IDs and authorize from their own
authorization domain, the existing flow becomes valid for both artifact kinds.

resolveModule() also remains unchanged: direct shared-chunk requests still call
resolveArtifact(), so a principal cannot bypass authorization by guessing a
shared artifact key/hash.
*/
````

## File: projects/libraries/waypoint/server/server-router.ts
````typescript
import {
  createServerNavigationResolution,
  ServerArtifactResolutionError,
  isServerArtifactChainAuthorized,
  isServerPolicyAllowed,
  requiredServerBranchIds,
  resolveServerArtifactChain,
  type ServerArtifactRecord,
  type ServerPrincipal,
  type ServerRouteBranch,
} from './server-routing';
import type { ServerNavigationResolution } from './server-delivery';

export interface ServerRoutableBranch extends ServerRouteBranch {
  readonly path: string;
  readonly kind?: 'route' | 'redirect';
  readonly redirectTo?: string;
}

export interface ServerRouteShardDescriptor {
  readonly prefix: string;
  readonly file: string;
}

export interface ServerRouterIndex<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> {
  readonly shards: readonly ServerRouteShardDescriptor[];
  readonly artifacts: readonly TArtifact[];
}

export interface ServerRouterShard<
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  readonly branches: readonly TBranch[];
}

export interface ServerRouterSnapshot<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  readonly index: ServerRouterIndex<TArtifact>;
  loadShard(file: string): Promise<ServerRouterShard<TBranch>>;
}

export interface ServerRouterSource<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  /** Loads one immutable compiler-output generation for the complete operation. */
  loadSnapshot(): Promise<ServerRouterSnapshot<TArtifact, TBranch>>;
}

export interface ServerRouterOptions<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> extends ServerRouterSource<TArtifact, TBranch> {
  moduleUrlFor(artifact: TArtifact): string;
  /** Maximum number of internal server-resolved redirect hops. Defaults to 16. */
  readonly maxRedirects?: number;
}

export interface ServerRouter<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  match(target: string | URL): Promise<TBranch | undefined>;
  resolve(
    target: string | URL,
    principal?: ServerPrincipal,
  ): Promise<ServerNavigationResolution | null>;
  resolveLanding(
    targets: readonly (string | URL)[],
    principal?: ServerPrincipal,
  ): Promise<string | null>;
  resolveArtifact(
    artifactKey: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null>;
  resolveModule(
    artifactKey: string,
    hash: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null>;
}

/**
 * Creates the framework-neutral server half of Waypoint routing.
 *
 * The router owns URL matching, shard selection, route-set lookup, dependency
 * resolution, authorization, and construction of the public delivery plan.
 * HTTP frameworks are adapters around this API rather than participants in the
 * routing model.
 */
export function createServerRouter<
  TArtifact extends ServerArtifactRecord,
  TBranch extends ServerRoutableBranch,
>(
  options: ServerRouterOptions<TArtifact, TBranch>,
): ServerRouter<TArtifact, TBranch> {
  async function match(target: string | URL): Promise<TBranch | undefined> {
    const pathname = pathnameOf(target);
    if (pathname === null) return undefined;

    const snapshot = await options.loadSnapshot();
    return (await findBranchMatch(snapshot, pathname))?.branch;
  }

  async function resolve(
    target: string | URL,
    principal?: ServerPrincipal,
  ): Promise<ServerNavigationResolution | null> {
    const pathname = pathnameOf(target);
    if (pathname === null) return null;

    const snapshot = await options.loadSnapshot();
    const resolution = await resolveNavigationChain(
      snapshot,
      target,
      principal,
      options.maxRedirects ?? 16,
    );
    if (!resolution) return null;

    return createServerNavigationResolution(
      resolution.artifactKey,
      resolution.artifacts,
      candidate => options.moduleUrlFor(candidate),
    );
  }

  async function resolveNavigationChain(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    target: string | URL,
    principal: ServerPrincipal | undefined,
    maxRedirects: number,
  ): Promise<{ readonly artifactKey: string; readonly artifacts: readonly TArtifact[] } | null> {
    const ordered: TArtifact[] = [];
    const seenArtifacts = new Set<string>();
    const visitedTargets = new Set<string>();
    let current = relativeTargetOf(target);
    let requestedArtifactKey: string | undefined;

    for (let redirectCount = 0; ; redirectCount++) {
      const pathname = pathnameOf(current);
      if (pathname === null || visitedTargets.has(current)) return null;
      visitedTargets.add(current);

      const matched = await findBranchMatch(snapshot, pathname);
      if (!matched) return null;
      const { branch, params } = matched;

      if (
        !branch.routeSetId
        || !branch.policies.every(policy => isServerPolicyAllowed(policy, principal))
      ) {
        return null;
      }

      const artifacts = snapshot.index.artifacts.filter(
        candidate => candidate.routeSetId === branch.routeSetId,
      );
      if (artifacts.length === 0) return null;
      if (artifacts.length > 1) {
        throw new ServerArtifactResolutionError(
          'invalid',
          `Route set "${branch.routeSetId}" maps to multiple server artifacts.`,
        );
      }

      const artifact = artifacts[0]!;
      requestedArtifactKey ??= artifact.artifactKey;
      const chain = await authorizedChain(snapshot, artifact.artifactKey, principal);
      if (!chain) return null;
      for (const item of chain) {
        if (seenArtifacts.has(item.artifactKey)) continue;
        seenArtifacts.add(item.artifactKey);
        ordered.push(item);
      }

      if (branch.kind !== 'redirect' || !branch.redirectTo) {
        return {
          artifactKey: requestedArtifactKey!,
          artifacts: Object.freeze([...ordered]),
        };
      }

      if (redirectCount >= maxRedirects) {
        throw new ServerArtifactResolutionError(
          'invalid',
          `Maximum server redirect count of ${maxRedirects} exceeded.`,
        );
      }

      const redirected = interpolateServerRedirect(branch.redirectTo, params);
      if (isExternalTarget(redirected)) {
        return {
          artifactKey: requestedArtifactKey!,
          artifacts: Object.freeze([...ordered]),
        };
      }
      current = redirected;
    }
  }

  async function resolveLanding(
    targets: readonly (string | URL)[],
    principal?: ServerPrincipal,
  ): Promise<string | null> {
    for (const target of targets) {
      const resolution = await resolve(target, principal);
      if (!resolution) continue;

      const pathname = pathnameOf(target);
      if (pathname === null) continue;
      return typeof target === 'string'
        ? relativeTargetOf(target)
        : `${target.pathname}${target.search}${target.hash}`;
    }

    return null;
  }

  async function resolveArtifact(
    artifactKey: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null> {
    const snapshot = await options.loadSnapshot();
    const chain = await authorizedChain(snapshot, artifactKey, principal);
    return chain?.at(-1) ?? null;
  }

  async function resolveModule(
    artifactKey: string,
    hash: string,
    principal?: ServerPrincipal,
  ): Promise<TArtifact | null> {
    if (!artifactKey.trim() || !hash.trim()) return null;

    const artifact = await resolveArtifact(artifactKey, principal);
    return artifact?.hash === hash ? artifact : null;
  }

  async function authorizedChain(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    artifactKey: string,
    principal?: ServerPrincipal,
  ): Promise<readonly TArtifact[] | null> {
    const chain = resolveServerArtifactChain(snapshot.index, artifactKey);
    const branches = await loadBranches(
      snapshot,
      requiredServerBranchIds(chain),
    );

    return isServerArtifactChainAuthorized(chain, branches, principal)
      ? chain
      : null;
  }

  async function loadBranches(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    branchIds: ReadonlySet<string>,
  ): Promise<ReadonlyMap<string, TBranch>> {
    const remaining = new Set(branchIds);
    const result = new Map<string, TBranch>();
    if (remaining.size === 0) return result;

    for (const descriptor of snapshot.index.shards) {
      const shard = await snapshot.loadShard(descriptor.file);

      for (const branch of shard.branches) {
        if (!remaining.has(branch.id)) continue;
        result.set(branch.id, branch);
        remaining.delete(branch.id);
      }

      if (remaining.size === 0) break;
    }

    return result;
  }

  async function findBranchMatch(
    snapshot: ServerRouterSnapshot<TArtifact, TBranch>,
    pathname: string,
  ): Promise<{ readonly branch: TBranch; readonly params: Readonly<Record<string, string>> } | undefined> {
    const candidates = [...snapshot.index.shards]
      .filter(shard => isPathPrefix(shard.prefix, pathname))
      .sort((left, right) => right.prefix.length - left.prefix.length);

    for (const descriptor of candidates) {
      const shard = await snapshot.loadShard(descriptor.file);
      for (const branch of shard.branches) {
        const params = matchRoutePattern(branch.path, pathname);
        if (params) return { branch, params };
      }
    }

    return undefined;
  }

  return Object.freeze({
    match,
    resolve,
    resolveLanding,
    resolveArtifact,
    resolveModule,
  });
}

export function matchesRoutePattern(pattern: string, pathname: string): boolean {
  return matchRoutePattern(pattern, pathname) !== null;
}

export function matchRoutePattern(
  pattern: string,
  pathname: string,
): Readonly<Record<string, string>> | null {
  const expected = routeSegments(pattern);
  const actual = routeSegments(pathname);
  if (expected.length !== actual.length) return null;

  const params: Record<string, string> = {};
  for (let index = 0; index < expected.length; index++) {
    const part = expected[index]!;
    const value = actual[index]!;
    if (part.startsWith(':')) {
      params[part.slice(1)] = value;
      continue;
    }
    if (part !== value) return null;
  }
  return Object.freeze(params);
}

export function isPathPrefix(prefix: string, pathname: string): boolean {
  const normalizedPrefix = normalizePath(prefix);
  const normalizedPathname = normalizePath(pathname);

  return normalizedPrefix === '/'
    || normalizedPathname === normalizedPrefix
    || normalizedPathname.startsWith(`${normalizedPrefix}/`);
}


function relativeTargetOf(target: string | URL): string {
  const url = target instanceof URL ? target : new URL(target, 'http://waypoint.local');
  return `${url.pathname}${url.search}${url.hash}`;
}

function interpolateServerRedirect(
  redirectTo: string,
  params: Readonly<Record<string, string>>,
): string {
  return redirectTo.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_match, key: string) => {
    const value = params[key];
    if (value === undefined) {
      throw new ServerArtifactResolutionError(
        'invalid',
        `Missing route parameter "${key}" for redirect "${redirectTo}".`,
      );
    }
    return value;
  });
}

function isExternalTarget(target: string): boolean {
  return /^[A-Za-z][A-Za-z\d+.-]*:/.test(target) || target.startsWith('//');
}

function pathnameOf(target: string | URL): string | null {
  if (target instanceof URL) return normalizePath(target.pathname);
  if (typeof target !== 'string' || !target.trim()) return null;

  try {
    const url = new URL(target, 'http://waypoint.local');
    if (url.origin !== 'http://waypoint.local') return null;
    return normalizePath(url.pathname);
  } catch {
    return null;
  }
}

function routeSegments(value: string): readonly string[] {
  return normalizePath(value).split('/').filter(Boolean);
}

function normalizePath(value: string): string {
  const path = value.split(/[?#]/, 1)[0]?.trim() || '/';
  const normalized = `/${path.split('/').filter(Boolean).join('/')}`;
  return normalized || '/';
}
````

## File: projects/libraries/waypoint/server/server-shared-artifacts.spec.ts
````typescript
import {
  resolveServerArtifactChain,
  requiredServerBranchIds,
  isServerArtifactChainAuthorized,
} from './server-routing';
import type { ServerArtifactRecord } from './server-artifact';

describe('shared protected server artifacts', () => {
  const user = {
    subject: 'user',
    roles: new Set(['user']),
    permissions: new Set<string>(),
  };
  const admin = {
    subject: 'admin',
    roles: new Set(['admin']),
    permissions: new Set<string>(),
  };

  const artifacts: readonly ServerArtifactRecord[] = [
    {
      kind: 'shared',
      artifactKey: 'shared:admin',
      dependencies: [],
      consumers: ['admin'],
      authorization: {
        allowAnonymous: false,
        roles: ['admin'],
        permissions: [],
      },
      file: 'protected/shared/admin.js',
      hash: 'SHARED',
    },
    {
      kind: 'route',
      artifactKey: 'admin',
      routeSetId: 'administration',
      dependencies: [],
      sharedDependencies: ['shared:admin'],
      branchIds: ['admin-home'],
      authorization: {
        allowAnonymous: false,
        roles: ['admin'],
        permissions: [],
      },
      file: 'protected/routes/admin.js',
      hash: 'ADMIN',
    },
  ];

  const branches = new Map([
    ['admin-home', {
      id: 'admin-home',
      routeSetId: 'administration',
      policies: [{ roles: ['admin'] }],
    }],
  ]);

  it('delivers shared chunks before their route consumer', () => {
    expect(resolveServerArtifactChain({ artifacts }, 'admin')
      .map(item => item.artifactKey))
      .toEqual(['shared:admin', 'admin']);
  });

  it('does not request branch shards for shared artifacts', () => {
    expect([...requiredServerBranchIds(
      resolveServerArtifactChain({ artifacts }, 'admin'),
    )]).toEqual(['admin-home']);
  });

  it('authorizes every shared delivery unit', () => {
    const chain = resolveServerArtifactChain({ artifacts }, 'admin');

    expect(isServerArtifactChainAuthorized(chain, branches, admin)).toBeTrue();
    expect(isServerArtifactChainAuthorized(chain, branches, user)).toBeFalse();
  });
});
````

## File: projects/libraries/waypoint/server/server-source.ts
````typescript
import type {
  ServerRoutableBranch,
  ServerRouterIndex,
  ServerRouterShard,
  ServerRouterSnapshot,
} from './server-router';
import type { ServerArtifactRecord } from './server-routing';

export interface ServerRouterSnapshotSource<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  loadSnapshot(): Promise<ServerRouterSnapshot<TArtifact, TBranch>>;
  refresh(): Promise<ServerRouterSnapshot<TArtifact, TBranch>>;
  invalidate(): void;
}

export interface ServerRouterSnapshotSourceOptions<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TBranch extends ServerRoutableBranch = ServerRoutableBranch,
> {
  loadIndex(): Promise<ServerRouterIndex<TArtifact>>;
  loadShard(file: string): Promise<ServerRouterShard<TBranch>>;
  /** Cheap publication identity (for example index mtime + size). */
  revision?(): Promise<string | number>;
}

/**
 * Creates an immutable, atomically refreshed view of compiler routing output.
 *
 * A snapshot eagerly loads every shard referenced by its index before becoming
 * visible. A failed refresh therefore leaves the previous successful snapshot
 * active instead of exposing a mixed index/shard generation. Concurrent first
 * loads and refreshes share one publication attempt.
 */
export function createServerRouterSnapshotSource<
  TArtifact extends ServerArtifactRecord,
  TBranch extends ServerRoutableBranch,
>(
  options: ServerRouterSnapshotSourceOptions<TArtifact, TBranch>,
): ServerRouterSnapshotSource<TArtifact, TBranch> {
  let current: ServerRouterSnapshot<TArtifact, TBranch> | undefined;
  let currentRevision: string | number | undefined;
  let epoch = 0;
  let pending: Promise<ServerRouterSnapshot<TArtifact, TBranch>> | undefined;

  async function build(): Promise<{
    readonly snapshot: ServerRouterSnapshot<TArtifact, TBranch>;
    readonly revision?: string | number;
  }> {
    for (let attempt = 0; attempt < 3; attempt++) {
      const before = options.revision
        ? await options.revision()
        : undefined;
      const index = await options.loadIndex();
      const descriptors = uniqueShardFiles(index);
      const loaded = await Promise.all(
        descriptors.map(async file => [file, await options.loadShard(file)] as const),
      );
      const after = options.revision
        ? await options.revision()
        : undefined;

      if (before !== undefined && after !== before) continue;

      const shards = new Map(loaded);
      return {
        revision: after ?? before,
        snapshot: Object.freeze({
          index,
          async loadShard(file: string) {
            const shard = shards.get(file);
            if (!shard) {
              throw new Error(`Server routing snapshot does not contain shard "${file}".`);
            }
            return shard;
          },
        }),
      };
    }

    throw new Error('Server routing output changed repeatedly while creating a snapshot.');
  }

  function publish(): Promise<ServerRouterSnapshot<TArtifact, TBranch>> {
    if (pending) return pending;

    const publicationEpoch = epoch;
    const attempt = build().then(result => {
      if (epoch === publicationEpoch) {
        current = result.snapshot;
        currentRevision = result.revision;
      }
      return result.snapshot;
    });
    pending = attempt;

    const clearPending = () => {
      if (pending === attempt) pending = undefined;
    };

    attempt.then(clearPending, clearPending);

    return attempt;
  }

  return Object.freeze({
    async loadSnapshot() {
      if (!current) return publish();
      if (!options.revision) return current;

      const revision = await options.revision();
      return revision === currentRevision ? current : publish();
    },
    refresh() {
      return publish();
    },
    invalidate() {
      epoch++;
      current = undefined;
      currentRevision = undefined;
      // A build that started before invalidation may still finish for its original
      // caller, but subsequent callers must not join that stale publication.
      pending = undefined;
    },
  });
}

function uniqueShardFiles<TArtifact extends ServerArtifactRecord>(
  index: ServerRouterIndex<TArtifact>,
): readonly string[] {
  return [...new Set(index.shards.map(descriptor => descriptor.file))];
}
````

## File: projects/libraries/waypoint/ng-package.json
````json
{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../../dist/waypoint",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
````

## File: projects/libraries/waypoint/tsconfig.lib.json
````json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "../../../out-tsc/lib",
    "declaration": true,
    "declarationMap": true,
    "types": []
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "**/*.spec.ts"
  ]
}
````

## File: projects/libraries/waypoint/tsconfig.lib.prod.json
````json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "declarationMap": false
  },
  "angularCompilerOptions": {
    "compilationMode": "partial"
  }
}
````

## File: projects/libraries/waypoint/tsconfig.spec.json
````json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "../../../out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.spec.ts"
  ]
}
````

## File: projects/tools/builder/scripts/generate-waypoint-schema.mjs
````javascript
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const angularPackage = require.resolve('@angular/build/package.json');
const angularRoot = path.dirname(angularPackage);
const angularSchemaPath = path.join(
  angularRoot,
  'src',
  'builders',
  'application',
  'schema.json',
);

const outputPath = path.resolve(
  import.meta.dirname,
  '../src/waypoint-build/schema.json',
);

const angularSchema = JSON.parse(
  await fs.readFile(angularSchemaPath, 'utf8'),
);

const waypointProperty = {
  type: 'object',
  description: 'Waypoint privilege-aware build options.',
  additionalProperties: false,
  default: {},
  properties: {
    entry: {
      type: 'string',
      default: 'src/app/app.routes.ts',
      description:
        'Waypoint navigation entry relative to the Angular project root.',
    },
    routesExport: {
      type: 'string',
      default: 'routes',
      description:
        'Named export containing the authored root navigation tree.',
    },
    profile: {
      type: 'boolean',
      default: false,
      description:
        'Record Waypoint compiler stage timings.',
    },
    buildManifest: {
      type: 'boolean',
      default: true,
      description:
        'Emit the optional Waypoint build/inspection manifest.',
    },
  },
};

const schema = {
  ...angularSchema,
  title: 'Waypoint Angular application build',
  description:
    'Angular application builder options extended with Waypoint privilege-aware partitioning.',
  properties: {
    ...(angularSchema.properties ?? {}),
    waypoint: waypointProperty,
  },
};

await fs.mkdir(path.dirname(outputPath), {
  recursive: true,
});

await fs.writeFile(
  outputPath,
  `${JSON.stringify(schema, null, 2)}\n`,
  'utf8',
);

console.log(
  `Generated ${path.relative(process.cwd(), outputPath)} from ${path.relative(process.cwd(), angularSchemaPath)}`,
);
````

## File: projects/tools/builder/src/analysis/angular-declaration-module.ts
````typescript
import fs from 'node:fs/promises';

export interface AngularDeclarationScan {
  readonly moduleId: string;
  readonly declarations: readonly string[];
}

/**
 * Lightweight post-AOT scan.
 *
 * Angular compiled declarations are recognizable through static fields such as:
 *   ɵcmp
 *   ɵdir
 *   ɵpipe
 *   ɵmod
 *
 * We only need to know whether a module contains identity-sensitive Angular
 * declarations, not to reconstruct Angular metadata.
 */
export async function scanAngularDeclarationModule(
  moduleId: string,
): Promise<AngularDeclarationScan> {
  const source = await fs.readFile(moduleId, 'utf8');

  const declarations = new Set<string>();

  for (const match of source.matchAll(
    /(?:class|const|let|var)\s+([A-Za-z_$][\w$]*)[\s\S]{0,400}?\.(?:ɵcmp|ɵdir|ɵpipe|ɵmod)\s*=/g,
  )) {
    declarations.add(match[1]!);
  }

  if (declarations.size === 0) {
    for (const match of source.matchAll(
      /([A-Za-z_$][\w$]*)\.(?:ɵcmp|ɵdir|ɵpipe|ɵmod)\s*=/g,
    )) {
      declarations.add(match[1]!);
    }
  }

  return Object.freeze({
    moduleId,
    declarations: Object.freeze([...declarations].sort()),
  });
}
````

## File: projects/tools/builder/src/analysis/collect-module-authorization-usages.ts
````typescript
import path from 'node:path';

import type {
  ArtifactBundleResult,
  RouteArtifactPlan,
} from '../../../compiler/src/lib/compiler/contracts.js';
import type {
  AngularDeclarationModuleUsage,
  ModuleAuthorizationConsumer,
} from './validate-angular-declaration-isolation.js';
import {
  scanAngularDeclarationModule,
} from './angular-declaration-module.js';

/**
 * Collect from the bundler's module/input graph, not from authored imports.
 *
 * That matters because AOT may rewrite or fan out source modules.
 */
export async function collectAngularDeclarationModuleUsages(
  plan: RouteArtifactPlan,
  bundle: ArtifactBundleResult,
): Promise<readonly AngularDeclarationModuleUsage[]> {
  const artifactByKey = new Map(
    plan.artifacts.map(
      artifact => [artifact.artifactKey, artifact] as const,
    ),
  );

  const consumersByModule = new Map<
    string,
    Map<string, ModuleAuthorizationConsumer>
  >();

  for (const artifact of bundle.artifacts) {
    const planned = artifactByKey.get(
      artifact.artifactKey,
    );

    if (!planned) continue;

    for (const input of artifact.inputs ?? []) {
      const moduleId = path.resolve(input);

      let consumers = consumersByModule.get(moduleId);
      if (!consumers) {
        consumers = new Map();
        consumersByModule.set(
          moduleId,
          consumers,
        );
      }

      consumers.set(
        artifact.artifactKey,
        Object.freeze({
          artifactKey: artifact.artifactKey,
          authorization: planned.authorization,
        }),
      );
    }
  }

  const usages: AngularDeclarationModuleUsage[] = [];

  for (const [moduleId, consumerMap] of consumersByModule) {
    if (consumerMap.size <= 1) continue;

    const scan =
      await scanAngularDeclarationModule(
        moduleId,
      );

    if (scan.declarations.length === 0) {
      continue;
    }

    usages.push(Object.freeze({
      moduleId,
      declarations: scan.declarations,
      consumers: Object.freeze(
        [...consumerMap.values()],
      ),
    }));
  }

  return Object.freeze(usages);
}
````

## File: projects/tools/builder/src/analysis/validate-angular-declaration-isolation.ts
````typescript
import type {
  AuthorizationDomain,
} from '../../../compiler/src/lib/planning/authorization-domain.js';
import {
  canContainAuthorizationDomain,
} from '../../../compiler/src/lib/planning/authorization-domain.js';

export interface ModuleAuthorizationConsumer {
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
}

export interface AngularDeclarationModuleUsage {
  readonly moduleId: string;
  readonly declarations: readonly string[];
  readonly consumers: readonly ModuleAuthorizationConsumer[];
}

export interface AngularDeclarationIsolationDiagnostic {
  readonly code: 'WPT3220';
  readonly level: 'error';
  readonly message: string;
  readonly moduleId: string;
  readonly artifactKeys: readonly string[];
  readonly declarations: readonly string[];
}

/**
 * Angular declaration modules may not be duplicated across incomparable
 * authorization domains.
 *
 * If all consumers form one audience-containment chain, a stricter consumer can
 * safely depend on code owned by a weaker/shared domain. If no such single owner
 * exists without broadening exposure, the source module must be split.
 */
export function validateAngularDeclarationIsolation(
  usages: readonly AngularDeclarationModuleUsage[],
): readonly AngularDeclarationIsolationDiagnostic[] {
  const diagnostics: AngularDeclarationIsolationDiagnostic[] = [];

  for (const usage of usages) {
    if (
      usage.declarations.length === 0
      || usage.consumers.length <= 1
    ) {
      continue;
    }

    if (hasSafeSingleOwner(usage.consumers)) {
      continue;
    }

    diagnostics.push(Object.freeze({
      code: 'WPT3220',
      level: 'error',
      moduleId: usage.moduleId,
      artifactKeys: Object.freeze(
        usage.consumers
          .map(consumer => consumer.artifactKey)
          .sort(),
      ),
      declarations: usage.declarations,
      message:
        `Angular declaration module "${usage.moduleId}" crosses incompatible ` +
        `authorization boundaries. It contains ` +
        `${usage.declarations.join(', ')} and is consumed by ` +
        `${usage.consumers.map(consumer => consumer.artifactKey).join(', ')}. ` +
        `Split Angular declarations into modules owned by a single authorization domain.`,
    }));
  }

  return Object.freeze(diagnostics);
}

function hasSafeSingleOwner(
  consumers: readonly ModuleAuthorizationConsumer[],
): boolean {
  return consumers.some(candidate =>
    consumers.every(other =>
      candidate === other
      || canContainAuthorizationDomain(
        other.authorization,
        candidate.authorization,
      ),
    ),
  );
}
````

## File: projects/tools/builder/src/compiler/build-layout.ts
````typescript
import path from 'node:path';

export interface WaypointBuildLayout {
  readonly root: string;
  readonly publicRoot: string;
  readonly protectedRoot: string;
  readonly metadataRoot: string;
  readonly manifest: string;
  readonly serverRoot: string;
}

export function createBuildLayout(
  outputPath: string,
): WaypointBuildLayout {
  const root = path.resolve(outputPath);
  const metadataRoot = path.join(
    root,
    '.waypoint',
  );

  return Object.freeze({
    root,
    publicRoot: path.join(
      root,
      'browser',
    ),
    protectedRoot: path.join(
      root,
      'protected',
    ),
    metadataRoot,
    manifest: path.join(
      metadataRoot,
      'manifest.json',
    ),
    serverRoot: path.join(
      metadataRoot,
      'server',
    ),
  });
}
````

## File: projects/tools/builder/src/compiler/index.patch.ts
````typescript
/*
Create/retain one INTERNAL aggregation barrel.

Export only what waypoint-build needs:

export { analyze } from './compiler/analyze.js';
export { createBuildLayout } from './compiler/build-layout.js';
export { prepareBuild } from './compiler/prepare-build.js';

Do not recreate the old public compiler API wholesale.
Do not export CLI functions.
*/
````

## File: projects/tools/builder/src/compiler/navigation-snapshot.ts
````typescript
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { build } from 'esbuild';
import ts from 'typescript';

export interface LoadedContribution {
  readonly definition: any;
  readonly sourceFile: string;
  readonly exportName: string;
}

export interface NavigationSnapshot {
  readonly rootRoutes: readonly any[];
  readonly contributions: readonly LoadedContribution[];
}

export async function loadNavigationSnapshot(
  projectRoot: string,
  entry: string,
  metadataRoot: string,
): Promise<NavigationSnapshot> {
  const routeFiles = await discoverRouteModules(
    path.join(projectRoot, 'src'),
    entry,
  );

  const generatedRoot = path.join(
    metadataRoot,
    'analysis',
  );
  const generatedSourceRoot = path.join(
    generatedRoot,
    'sources',
  );

  await fs.mkdir(
    generatedSourceRoot,
    { recursive: true },
  );

  const waypointStubFile = path.join(
    generatedSourceRoot,
    'waypoint-stub.ts',
  );

  await fs.writeFile(
    waypointStubFile,
    waypointStubSource(),
    'utf8',
  );

  const transformedModules = await Promise.all(
    [entry, ...routeFiles].map(
      (file, index) =>
        writeTransformedRouteModule(
          file,
          path.join(
            generatedSourceRoot,
            `module-${index}.ts`,
          ),
          waypointStubFile,
        ),
    ),
  );

  const [transformedEntry, ...transformedRoutes] =
    transformedModules;

  const sourceFile = path.join(
    generatedRoot,
    'navigation-snapshot.entry.ts',
  );

  const bundleFile = path.join(
    generatedRoot,
    'navigation-snapshot.mjs',
  );

  const imports = transformedRoutes.map(
    (file, index) =>
      `import * as routeModule${index} from ${JSON.stringify(asImportPath(file))};`,
  );

  const moduleDescriptors = routeFiles.map(
    (file, index) =>
      `{ sourceFile: ${JSON.stringify(file)}, exports: routeModule${index} }`,
  );

  await fs.writeFile(
    sourceFile,
    [
      `import { routes as rootRoutes } from ${JSON.stringify(asImportPath(transformedEntry!))};`,
      ...imports,
      '',
      `export default {`,
      `  rootRoutes,`,
      `  modules: [${moduleDescriptors.join(',')}],`,
      `};`,
      '',
    ].join('\n'),
    'utf8',
  );

  await build({
    entryPoints: [sourceFile],
    outfile: bundleFile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    sourcemap: false,
    logLevel: 'silent',
  });

  const loaded = await import(
    `${pathToFileURL(bundleFile).href}?t=${Date.now()}`,
  );

  const payload = loaded.default as {
    readonly rootRoutes?: unknown;
    readonly modules?: readonly {
      readonly sourceFile?: unknown;
      readonly exports?: unknown;
    }[];
  };

  if (!Array.isArray(payload.rootRoutes)) {
    throw new Error(
      `Waypoint entry "${entry}" did not export a NavigationTree named "routes".`,
    );
  }

  const contributions: LoadedContribution[] = [];

  for (const module of payload.modules ?? []) {
    if (
      typeof module.sourceFile !== 'string'
      || !module.exports
      || typeof module.exports !== 'object'
    ) {
      continue;
    }

    for (const [exportName, value] of Object.entries(
      module.exports as Record<string, unknown>,
    )) {
      if (!isContribution(value)) continue;

      contributions.push(Object.freeze({
        definition: value,
        sourceFile: module.sourceFile,
        exportName,
      }));
    }
  }

  return Object.freeze({
    rootRoutes: Object.freeze([...payload.rootRoutes]),
    contributions: Object.freeze(contributions),
  });
}

async function discoverRouteModules(
  sourceRoot: string,
  entry: string,
): Promise<readonly string[]> {
  const files: string[] = [];

  async function visit(directory: string): Promise<void> {
    let entries: import('node:fs').Dirent[];

    try {
      entries = await fs.readdir(
        directory,
        { withFileTypes: true },
      );
    } catch {
      return;
    }

    for (const item of entries) {
      const absolute = path.join(
        directory,
        item.name,
      );

      if (item.isDirectory()) {
        await visit(absolute);
        continue;
      }

      if (
        !item.isFile()
        || !item.name.endsWith('.routes.ts')
        || path.resolve(absolute) === path.resolve(entry)
        || item.name.endsWith('.spec.ts')
      ) {
        continue;
      }

      files.push(path.resolve(absolute));
    }
  }

  await visit(sourceRoot);

  return Object.freeze(
    files.sort(),
  );
}

async function writeTransformedRouteModule(
  sourcePath: string,
  outputPath: string,
  waypointStubFile: string,
): Promise<string> {
  const sourceText = await fs.readFile(
    sourcePath,
    'utf8',
  );

  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  let cursor = 0;
  let transformed = '';

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    transformed += sourceText.slice(
      cursor,
      statement.getFullStart(),
    );
    transformed += transformImportDeclaration(
      statement,
      outputPath,
      waypointStubFile,
    );
    cursor = statement.getEnd();
  }

  transformed += sourceText.slice(cursor);
  transformed = transformed.replace(
    /\bimport\s*\(/g,
    '__waypointDynamicImport(',
  );

  const prelude = [
    `const __waypointStubValue = new Proxy(function () {}, {`,
    `  get() { return __waypointStubValue; },`,
    `  apply() { return undefined; },`,
    `  construct() { return {}; },`,
    `});`,
    `const __waypointDynamicImport = async () => ({});`,
    '',
  ].join('\n');

  await fs.writeFile(
    outputPath,
    `${prelude}${transformed}`,
    'utf8',
  );

  return outputPath;
}

function transformImportDeclaration(
  statement: ts.ImportDeclaration,
  outputPath: string,
  waypointStubFile: string,
): string {
  const specifier = (
    statement.moduleSpecifier as ts.StringLiteral
  ).text;
  const clause = statement.importClause;

  if (!clause || clause.isTypeOnly) {
    return '';
  }

  if (specifier === '@epikodelabs/waypoint') {
    const relative = toRelativeImport(
      outputPath,
      waypointStubFile,
    );

    return rewriteImportSpecifier(
      clause,
      relative,
    );
  }

  return stubImportBindings(clause);
}

function rewriteImportSpecifier(
  clause: ts.ImportClause,
  specifier: string,
): string {
  const parts: string[] = [];

  if (clause.name) {
    parts.push(clause.name.text);
  }

  if (
    clause.namedBindings
    && ts.isNamespaceImport(
      clause.namedBindings
    )
  ) {
    parts.push(
      `* as ${clause.namedBindings.name.text}`,
    );
  } else if (
    clause.namedBindings
    && ts.isNamedImports(
      clause.namedBindings
    )
  ) {
    parts.push(
      `{ ${clause.namedBindings.elements
        .map(element =>
          element.propertyName
            ? `${element.propertyName.text} as ${element.name.text}`
            : element.name.text,
        )
        .join(', ')} }`,
    );
  }

  if (parts.length === 0) {
    return '';
  }

  return `import ${parts.join(', ')} from ${JSON.stringify(asImportPath(specifier))};`;
}

function stubImportBindings(
  clause: ts.ImportClause,
): string {
  const statements: string[] = [];

  if (clause.name) {
    statements.push(
      `const ${clause.name.text} = __waypointStubValue;`,
    );
  }

  if (
    clause.namedBindings
    && ts.isNamespaceImport(
      clause.namedBindings
    )
  ) {
    statements.push(
      `const ${clause.namedBindings.name.text} = __waypointStubValue;`,
    );
  } else if (
    clause.namedBindings
    && ts.isNamedImports(
      clause.namedBindings
    )
  ) {
    for (const element of clause.namedBindings.elements) {
      statements.push(
        `const ${element.name.text} = __waypointStubValue;`,
      );
    }
  }

  return statements.join('\n');
}

function toRelativeImport(
  fromFile: string,
  toFile: string,
): string {
  const relative = path.relative(
    path.dirname(fromFile),
    toFile,
  );

  return relative.startsWith('.')
    ? relative
    : `./${relative}`;
}

function waypointStubSource(): string {
  return [
    `export function routeSlot(id) {`,
    `  return { kind: 'route-slot', id };`,
    `}`,
    ``,
    `export function routesFor(slotId, id, entries) {`,
    `  return { kind: 'route-contribution', slotId, id, entries };`,
    `}`,
    ``,
    `export function route(path, view, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function redirectRoute(path, redirectTo, options = {}) {`,
    `  return { kind: 'redirect', path, redirectTo, ...options };`,
    `}`,
    ``,
    `export function layout(path, view, entries, options = {}) {`,
    `  return { kind: 'layout', path, entries, ...options };`,
    `}`,
    ``,
    `export function lazyRoute(path, loader, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function frame(component, options = {}) {`,
    `  return { component, ...options };`,
    `}`,
    ``,
    `export const s = Object.freeze({`,
    `  number(options = {}) { return { kind: 'number', ...options }; },`,
    `  string(value) { return { kind: 'string', value }; },`,
    `  array() { return { kind: 'array' }; },`,
    `  optional(value) { return { kind: 'optional', value }; },`,
    `  boolean() { return { kind: 'boolean' }; },`,
    `});`,
    '',
  ].join('\n');
}

function isContribution(
  value: unknown,
): value is {
  readonly kind: 'route-contribution';
  readonly slotId: string;
  readonly id: string;
  readonly entries: readonly unknown[];
} {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as any;

  return candidate.kind === 'route-contribution'
    && typeof candidate.slotId === 'string'
    && candidate.slotId.trim().length > 0
    && typeof candidate.id === 'string'
    && candidate.id.trim().length > 0
    && Array.isArray(candidate.entries);
}

function asImportPath(
  file: string,
): string {
  return file.split(path.sep).join('/');
}
````

## File: projects/tools/builder/src/compiler/server-output.ts
````typescript
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  commonStaticPrefix,
  type ServerRoutePlan,
} from './server-plan.js';

export interface PublishedServerOutput {
  readonly indexPath: string;
}

export async function publishServerRouteOutput(
  plan: ServerRoutePlan,
  serverRoot: string,
): Promise<PublishedServerOutput> {
  const absoluteRoot =
    path.resolve(serverRoot);

  const temporaryRoot =
    `${absoluteRoot}.tmp-${process.pid}-${Date.now()}`;

  await fs.rm(
    temporaryRoot,
    {
      recursive: true,
      force: true,
    },
  );

  await fs.mkdir(
    path.join(
      temporaryRoot,
      'shards',
    ),
    {
      recursive: true,
    },
  );

  const shardDescriptors: Array<{
    prefix: string;
    file: string;
  }> = [];

  for (const artifact of plan.artifacts) {
    const branches =
      plan.branches.filter(
        branch =>
          branch.routeSetId
            === artifact.routeSetId,
      );

    const shardFile =
      `shards/${safeFileName(artifact.routeSetId)}.json`;

    await fs.writeFile(
      path.join(
        temporaryRoot,
        shardFile,
      ),
      JSON.stringify(
        {
          version: 1,
          branches,
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );

    shardDescriptors.push({
      prefix:
        commonStaticPrefix(branches),
      file:
        shardFile,
    });
  }

  const artifacts =
    plan.artifacts.map(
      artifact => ({
        kind: artifact.kind,
        artifactKey:
          artifact.artifactKey,
        routeSetId:
          artifact.routeSetId,
        dependencies:
          artifact.dependencies,
        branchIds:
          artifact.branchIds,

        /*
         * Browser artifact publication is a later builder phase. Keep file/hash
         * absent until that phase supplies a real physical artifact. The server
         * can still match and authorize routes from this metadata, and it will
         * refuse module delivery until a physical artifact is published.
         */
      }),
    );

  const index = {
    version: 1,
    generatedAt:
      new Date().toISOString(),
    shards:
      shardDescriptors.sort(
        (left, right) =>
          right.prefix.length
          - left.prefix.length,
      ),
    artifacts,
    generationHash:
      crypto
        .createHash('sha256')
        .update(
          JSON.stringify({
            shards:
              shardDescriptors,
            artifacts,
          }),
        )
        .digest('hex')
        .slice(0, 16),
  };

  await fs.writeFile(
    path.join(
      temporaryRoot,
      'server-index.json',
    ),
    JSON.stringify(
      index,
      null,
      2,
    ) + '\n',
    'utf8',
  );

  await fs.rm(
    absoluteRoot,
    {
      recursive: true,
      force: true,
    },
  );

  await fs.rename(
    temporaryRoot,
    absoluteRoot,
  );

  return Object.freeze({
    indexPath:
      path.join(
        absoluteRoot,
        'server-index.json',
      ),
  });
}

function safeFileName(
  value: string,
): string {
  const normalized =
    value.replace(
      /[^A-Za-z0-9._-]+/g,
      '-',
    );

  return normalized || 'routes';
}
````

## File: projects/tools/builder/src/compiler/server-plan.ts
````typescript
import path from 'node:path';

import type {
  LoadedContribution,
  NavigationSnapshot,
} from './navigation-snapshot.js';

export interface ServerRoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface PlannedServerBranch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly redirectTo?: string;
  readonly policies: readonly ServerRoutePolicy[];
  readonly routeSetId: string;
}

export interface PlannedArtifact {
  readonly kind: 'route';
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: readonly string[];
  readonly branchIds: readonly string[];
  readonly sourceFile: string;
  readonly exportName: string;
}

export interface ServerRoutePlan {
  readonly branches: readonly PlannedServerBranch[];
  readonly artifacts: readonly PlannedArtifact[];
}

interface CompileContext {
  readonly contributionsBySlot: ReadonlyMap<
    string,
    readonly LoadedContribution[]
  >;
  readonly contributionSources: ReadonlyMap<
    string,
    LoadedContribution
  >;
  readonly artifacts: Map<string, MutableArtifact>;
  readonly branches: PlannedServerBranch[];
  readonly active: Set<string>;
  nextBranchId: number;
}

interface MutableArtifact {
  readonly kind: 'route';
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: Set<string>;
  readonly branchIds: string[];
  readonly sourceFile: string;
  readonly exportName: string;
}

interface Provenance {
  readonly contributionId: string;
}

export function createServerRoutePlan(
  snapshot: NavigationSnapshot,
): ServerRoutePlan {
  const contributionsBySlot =
    indexContributions(
      snapshot.contributions,
    );

  const contributionSources =
    new Map(
      snapshot.contributions.map(
        contribution => [
          contribution.definition.id,
          contribution,
        ] as const,
      ),
    );

  const context: CompileContext = {
    contributionsBySlot,
    contributionSources,
    artifacts: new Map(),
    branches: [],
    active: new Set(),
    nextBranchId: 1,
  };

  compileEntries(
    snapshot.rootRoutes,
    '/',
    [],
    context,
  );

  // Every discovered contribution must have been reachable from a root slot.
  for (const contribution of snapshot.contributions) {
    if (!context.artifacts.has(
      contribution.definition.id,
    )) {
      throw new Error(
        `Route contribution "${contribution.definition.id}" targets ` +
        `unreachable slot "${contribution.definition.slotId}".`,
      );
    }
  }

  return Object.freeze({
    branches: Object.freeze(
      [...context.branches],
    ),
    artifacts: Object.freeze(
      [...context.artifacts.values()].map(
        artifact => Object.freeze({
          kind: artifact.kind,
          artifactKey:
            artifact.artifactKey,
          routeSetId:
            artifact.routeSetId,
          dependencies:
            Object.freeze(
              [...artifact.dependencies],
            ),
          branchIds:
            Object.freeze(
              [...artifact.branchIds],
            ),
          sourceFile:
            artifact.sourceFile,
          exportName:
            artifact.exportName,
        }),
      ),
    ),
  });
}

function compileEntries(
  entries: readonly any[],
  parentPath: string,
  inheritedPolicies: readonly ServerRoutePolicy[],
  context: CompileContext,
  provenance?: Provenance,
): void {
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    if (entry.kind === 'layout') {
      compileEntries(
        entry.entries ?? [],
        joinRoutePath(
          parentPath,
          String(entry.path ?? ''),
        ),
        appendPolicy(
          inheritedPolicies,
          entry.policy,
        ),
        context,
        provenance,
      );
      continue;
    }

    if (entry.kind === 'route-slot') {
      const slotId =
        String(entry.id ?? '').trim();

      for (
        const contribution
        of context.contributionsBySlot.get(
          slotId,
        ) ?? []
      ) {
        compileContribution(
          contribution,
          parentPath,
          inheritedPolicies,
          context,
          provenance,
        );
      }

      continue;
    }

    if (
      entry.kind !== 'route'
      && entry.kind !== 'redirect'
    ) {
      continue;
    }

    // Named-outlet routes are browser rendering details, not separate server
    // destinations. Emitting them would duplicate the same URL and can weaken
    // policy matching if their options differ.
    if (
      entry.kind === 'route'
      && typeof entry.outlet === 'string'
      && entry.outlet.length > 0
    ) {
      continue;
    }

    if (!provenance) {
      // Root-host entries are intentionally not deliverable protected artifacts.
      continue;
    }

    const pathValue = joinRoutePath(
      parentPath,
      String(entry.path ?? ''),
    );

    const id =
      `${provenance.contributionId}:${context.nextBranchId++}`;

    const branch: PlannedServerBranch =
      Object.freeze({
        id,
        kind: entry.kind,
        path: pathValue,
        staticPrefix:
          staticPrefix(pathValue),
        name:
          typeof entry.name === 'string'
            ? entry.name
            : undefined,
        redirectTo:
          entry.kind === 'redirect'
            ? compileRedirect(
                parentPath,
                String(entry.redirectTo ?? ''),
              )
            : undefined,
        policies: Object.freeze(
          appendPolicy(
            inheritedPolicies,
            entry.policy,
          ),
        ),
        routeSetId:
          provenance.contributionId,
      });

    context.branches.push(
      branch,
    );

    const artifact =
      context.artifacts.get(
        provenance.contributionId,
      );

    artifact?.branchIds.push(id);
  }
}

function compileContribution(
  contribution: LoadedContribution,
  parentPath: string,
  inheritedPolicies: readonly ServerRoutePolicy[],
  context: CompileContext,
  parentProvenance?: Provenance,
): void {
  const id =
    String(
      contribution.definition.id,
    ).trim();

  if (context.active.has(id)) {
    throw new Error(
      `Recursive route contribution "${id}" was detected.`,
    );
  }

  let artifact =
    context.artifacts.get(id);

  if (!artifact) {
    artifact = {
      kind: 'route',
      artifactKey: id,
      routeSetId: id,
      dependencies: new Set<string>(),
      branchIds: [],
      sourceFile:
        contribution.sourceFile,
      exportName:
        contribution.exportName,
    };

    context.artifacts.set(
      id,
      artifact,
    );
  }

  if (
    parentProvenance
    && parentProvenance.contributionId
      !== id
  ) {
    artifact.dependencies.add(
      parentProvenance.contributionId,
    );
  }

  context.active.add(id);

  try {
    compileEntries(
      contribution.definition.entries,
      parentPath,
      inheritedPolicies,
      context,
      {
        contributionId: id,
      },
    );
  } finally {
    context.active.delete(id);
  }
}

function indexContributions(
  contributions: readonly LoadedContribution[],
): ReadonlyMap<
  string,
  readonly LoadedContribution[]
> {
  const output =
    new Map<
      string,
      LoadedContribution[]
    >();

  const ids = new Set<string>();

  for (const contribution of contributions) {
    const id =
      String(
        contribution.definition.id,
      ).trim();

    const slotId =
      String(
        contribution.definition.slotId,
      ).trim();

    if (ids.has(id)) {
      throw new Error(
        `Duplicate route contribution id "${id}".`,
      );
    }

    ids.add(id);

    const current =
      output.get(slotId) ?? [];

    current.push(contribution);
    output.set(slotId, current);
  }

  return output;
}

function appendPolicy(
  policies: readonly ServerRoutePolicy[],
  value: unknown,
): readonly ServerRoutePolicy[] {
  if (!isPolicy(value)) {
    return policies;
  }

  return Object.freeze([
    ...policies,
    Object.freeze({
      allowAnonymous:
        value.allowAnonymous,
      roles:
        value.roles
          ? Object.freeze(
              [...value.roles],
            )
          : undefined,
      permissions:
        value.permissions
          ? Object.freeze(
              [...value.permissions],
            )
          : undefined,
    }),
  ]);
}

function isPolicy(
  value: unknown,
): value is {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as any;

  return (
    candidate.allowAnonymous === undefined
    || typeof candidate.allowAnonymous === 'boolean'
  ) && (
    candidate.roles === undefined
    || (
      Array.isArray(candidate.roles)
      && candidate.roles.every(
        (item: unknown) =>
          typeof item === 'string',
      )
    )
  ) && (
    candidate.permissions === undefined
    || (
      Array.isArray(
        candidate.permissions,
      )
      && candidate.permissions.every(
        (item: unknown) =>
          typeof item === 'string',
      )
    )
  );
}

function joinRoutePath(
  parent: string,
  child: string,
): string {
  const left =
    normalizePath(parent);

  if (!child.trim()) {
    return left;
  }

  const right =
    child.trim().replace(
      /^\/+|\/+$/g,
      '',
    );

  if (!right) return left;

  return normalizePath(
    left === '/'
      ? `/${right}`
      : `${left}/${right}`,
  );
}

function normalizePath(
  value: string,
): string {
  const normalized =
    `/${value}`
      .replace(/\/+/g, '/')
      .replace(/\/+$/g, '');

  return normalized || '/';
}

function compileRedirect(
  parentPath: string,
  target: string,
): string {
  if (
    /^[A-Za-z][A-Za-z\d+.-]*:/.test(
      target,
    )
    || target.startsWith('//')
    || target.startsWith('/')
  ) {
    return target;
  }

  return joinRoutePath(
    parentPath,
    target,
  );
}

function staticPrefix(
  routePath: string,
): string {
  const segments =
    normalizePath(routePath)
      .split('/')
      .filter(Boolean);

  const staticSegments: string[] = [];

  for (const segment of segments) {
    if (segment.startsWith(':')) {
      break;
    }

    staticSegments.push(segment);
  }

  return staticSegments.length > 0
    ? `/${staticSegments.join('/')}`
    : '/';
}

export function commonStaticPrefix(
  branches: readonly PlannedServerBranch[],
): string {
  if (branches.length === 0) {
    return '/';
  }

  const split = branches.map(
    branch =>
      branch.staticPrefix
        .split('/')
        .filter(Boolean),
  );

  const first = split[0]!;
  const common: string[] = [];

  for (
    let index = 0;
    index < first.length;
    index++
  ) {
    const value = first[index];

    if (
      split.every(
        segments =>
          segments[index] === value,
      )
    ) {
      common.push(value!);
      continue;
    }

    break;
  }

  return common.length > 0
    ? `/${common.join('/')}`
    : '/';
}
````

## File: projects/tools/builder/src/testing/assert-host-isolation.ts
````typescript
import fs from 'node:fs/promises';
import path from 'node:path';

export interface HostIsolationProbe {
  readonly name: string;
  readonly marker: string;
}

export interface HostIsolationResult {
  readonly publicFiles: readonly string[];
  readonly protectedFiles: readonly string[];
}

/**
 * Build-level security assertion.
 *
 * A marker belonging to a protected implementation must:
 *  1. not occur anywhere in the public Angular browser output;
 *  2. occur in at least one protected Waypoint artifact.
 *
 * Markers are deliberately test-only sentinels, not production security metadata.
 */
export async function assertHostIsolation(
  publicRoot: string,
  protectedRoot: string,
  probes: readonly HostIsolationProbe[],
): Promise<HostIsolationResult> {
  const publicFiles = await readableFiles(publicRoot);
  const protectedFiles = await readableFiles(protectedRoot);

  const publicContents = await readAll(publicFiles);
  const protectedContents = await readAll(protectedFiles);

  for (const probe of probes) {
    const leaked = publicContents.find(file => file.contents.includes(probe.marker));
    if (leaked) {
      throw new Error(
        `Protected implementation "${probe.name}" leaked into public host output: ${leaked.file}.`,
      );
    }

    const emitted = protectedContents.some(file => file.contents.includes(probe.marker));
    if (!emitted) {
      throw new Error(
        `Protected implementation "${probe.name}" was not found in protected artifacts.`,
      );
    }
  }

  return Object.freeze({
    publicFiles: Object.freeze(publicFiles),
    protectedFiles: Object.freeze(protectedFiles),
  });
}

async function readableFiles(root: string): Promise<string[]> {
  const files: string[] = [];
  async function visit(directory: string): Promise<void> {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (/\.(?:m?js|cjs|css|html|json|map)$/i.test(entry.name)) files.push(file);
    }
  }
  await visit(root);
  return files.sort();
}

async function readAll(files: readonly string[]) {
  return Promise.all(
    files.map(async file => ({
      file,
      contents: await fs.readFile(file, 'utf8'),
    })),
  );
}
````

## File: projects/tools/builder/src/testing/host-isolation.spec.ts
````typescript
import path from 'node:path';

import { assertHostIsolation } from './assert-host-isolation';

describe('Waypoint host isolation', () => {
  it('keeps administration implementation out of public Angular output', async () => {
    const outputRoot = path.resolve('dist/projects/apps/app2/client');

    await assertHostIsolation(
      path.join(outputRoot, 'browser'),
      path.join(outputRoot, 'protected'),
      [
        {
          name: 'administration',
          marker: 'WAYPOINT_BUILD_SENTINEL_ADMIN_7f84e2c1',
        },
      ],
    );
  });
});
````

## File: projects/tools/builder/src/testing/README.md
````markdown
# Host isolation build test

This is an output-level test, not a source-graph unit test.

The administration implementation contains a unique string sentinel. After a complete Waypoint build the assertion scans:

```text
dist/.../browser/
dist/.../protected/
```

The build fails unless:

```text
browser/**     sentinel count = 0
protected/**   sentinel count >= 1
```

This catches the failure mode that matters: Angular/esbuild can transform names and modules heavily, but a unique string literal gives us a stable proof that the protected implementation did or did not cross the public build boundary.

The helper intentionally does not infer security from filenames, chunk names, route names, or source maps.
````

## File: projects/tools/builder/src/tests/angular-declaration-isolation.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAngularDeclarationIsolation,
} from '../analysis/validate-angular-declaration-isolation.js';

function auth(
  roles: readonly string[] = [],
  permissions: readonly string[] = [],
  allowAnonymous = false,
) {
  return {
    allowAnonymous,
    roles,
    permissions,
  } as any;
}

test('allows declaration module with a single authorization owner', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/workspace.page.mjs',
        declarations: ['WorkspacePage'],
        consumers: [
          {
            artifactKey: 'application',
            authorization: auth(['user']),
          },
        ],
      },
    ]);

  assert.deepEqual(
    diagnostics,
    [],
  );
});

test('allows containment-chain sharing', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/shell.mjs',
        declarations: ['AppShell'],
        consumers: [
          {
            artifactKey: 'application',
            authorization: auth(['user']),
          },
          {
            artifactKey: 'administration',
            authorization: auth(
              ['user', 'admin'],
            ),
          },
        ],
      },
    ]);

  assert.deepEqual(
    diagnostics,
    [],
  );
});

test('rejects declaration module across incomparable authorization domains', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/demo-pages.mjs',
        declarations: [
          'IntroPage',
          'WorkspacePage',
          'SettingsPage',
        ],
        consumers: [
          {
            artifactKey: 'public',
            authorization: auth([], [], true),
          },
          {
            artifactKey: 'application',
            authorization: auth(['user']),
          },
        ],
      },
    ]);

  assert.equal(
    diagnostics[0]?.code,
    'WPT3220',
  );
});

test('rejects admin/finance incomparable sharing', () => {
  const diagnostics =
    validateAngularDeclarationIsolation([
      {
        moduleId: '/app/admin-finance-pages.mjs',
        declarations: [
          'AdminPage',
          'FinancePage',
        ],
        consumers: [
          {
            artifactKey: 'admin',
            authorization: auth(['admin']),
          },
          {
            artifactKey: 'finance',
            authorization: auth(['finance']),
          },
        ],
      },
    ]);

  assert.equal(
    diagnostics.length,
    1,
  );
});
````

## File: projects/tools/builder/src/tests/generated-schema.spec.mjs
````javascript
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

test('Waypoint schema preserves Angular application options', async () => {
  const schema = JSON.parse(
    await fs.readFile(
      path.resolve(
        'projects/tools/builder/src/waypoint-build/schema.json',
      ),
      'utf8',
    ),
  );

  assert.ok(schema.properties?.browser);
  assert.ok(schema.properties?.outputPath);
  assert.ok(schema.properties?.tsConfig);
  assert.ok(schema.properties?.polyfills);
  assert.ok(schema.properties?.fileReplacements);
  assert.ok(schema.properties?.waypoint);
});

test('Waypoint options are isolated under one namespace', async () => {
  const schema = JSON.parse(
    await fs.readFile(
      path.resolve(
        'projects/tools/builder/src/waypoint-build/schema.json',
      ),
      'utf8',
    ),
  );

  const waypoint = schema.properties?.waypoint;

  assert.equal(
    waypoint.additionalProperties,
    false,
  );

  assert.deepEqual(
    Object.keys(waypoint.properties).sort(),
    [
      'buildManifest',
      'entry',
      'profile',
      'routesExport',
    ],
  );
});
````

## File: projects/tools/builder/src/tests/server-plan.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createServerRoutePlan,
} from '../compiler/server-plan.js';

test('derives nested route-set dependencies and inherited layout paths', () => {
  const application = {
    kind: 'route-contribution',
    slotId: 'application',
    id: 'application-core',
    entries: [
      {
        kind: 'layout',
        path: '/app',
        entries: [
          {
            kind: 'route',
            path: '/workspace/:projectId',
            name: 'workspace',
          },
          {
            kind: 'route-slot',
            id: 'administration',
          },
        ],
      },
    ],
  };

  const administration = {
    kind: 'route-contribution',
    slotId: 'administration',
    id: 'administration-core',
    entries: [
      {
        kind: 'route',
        path: '/admin',
        name: 'admin',
        policy: {
          roles: ['admin'],
          permissions: ['admin:read'],
        },
      },
    ],
  };

  const plan = createServerRoutePlan({
    rootRoutes: [
      {
        kind: 'route-slot',
        id: 'application',
      },
    ],
    contributions: [
      {
        definition: application,
        sourceFile: '/client/application.routes.ts',
        exportName: 'applicationRoutes',
      },
      {
        definition: administration,
        sourceFile: '/client/administration.routes.ts',
        exportName: 'administrationRoutes',
      },
    ],
  });

  assert.equal(
    plan.branches.find(
      branch => branch.name === 'workspace',
    )?.path,
    '/app/workspace/:projectId',
  );

  assert.equal(
    plan.branches.find(
      branch => branch.name === 'admin',
    )?.path,
    '/app/admin',
  );

  assert.deepEqual(
    plan.artifacts.find(
      artifact =>
        artifact.artifactKey
          === 'administration-core',
    )?.dependencies,
    ['application-core'],
  );
});

test('does not emit named outlet routes as separate server destinations', () => {
  const contribution = {
    kind: 'route-contribution',
    slotId: 'application',
    id: 'application-core',
    entries: [
      {
        kind: 'route',
        path: '/workspace/:id',
        name: 'workspace',
      },
      {
        kind: 'route',
        path: '/workspace/:id',
        outlet: 'sidebar',
      },
    ],
  };

  const plan = createServerRoutePlan({
    rootRoutes: [
      {
        kind: 'route-slot',
        id: 'application',
      },
    ],
    contributions: [
      {
        definition: contribution,
        sourceFile: '/client/application.routes.ts',
        exportName: 'applicationRoutes',
      },
    ],
  });

  assert.equal(
    plan.branches.length,
    1,
  );
});
````

## File: projects/tools/builder/src/tests/watch-cache.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WaypointWatchCache,
} from '../watch/watch-cache.js';

test('watch cache reuses only exact dependency fingerprint', () => {
  const cache =
    new WaypointWatchCache();

  const value = {
    fingerprint: 'A',
    analysis: {} as any,
    build: {} as any,
  };

  cache.replace(value);

  assert.equal(
    cache.get('A'),
    value,
  );

  assert.equal(
    cache.get('B'),
    undefined,
  );
});
````

## File: projects/tools/builder/src/tests/watch-dependency-reuse.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

test('host-only change may reuse Waypoint generation', () => {
  const previous = {
    waypointFingerprint: 'same',
    hostFingerprint: 'A',
  };

  const next = {
    waypointFingerprint: 'same',
    hostFingerprint: 'B',
  };

  assert.equal(
    previous.waypointFingerprint,
    next.waypointFingerprint,
  );

  assert.notEqual(
    previous.hostFingerprint,
    next.hostFingerprint,
  );
});
````

## File: projects/tools/builder/src/tests/watch-failure-preserves-publication.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

test('a failed generation leaves previous publication untouched', async () => {
  let published = 1;

  async function runGeneration(
    generation: number,
    succeeds: boolean,
  ) {
    if (!succeeds) {
      return false;
    }

    published = generation;
    return true;
  }

  assert.equal(
    await runGeneration(2, false),
    false,
  );
  assert.equal(
    published,
    1,
  );

  assert.equal(
    await runGeneration(3, true),
    true,
  );
  assert.equal(
    published,
    3,
  );
});
````

## File: projects/tools/builder/src/tests/watch-generation-lifecycle.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

test('each watch generation disposes temporary build resources', async () => {
  const events: string[] = [];

  const generation = {
    async publish() {
      events.push('publish');
      return { success: true };
    },
    async dispose() {
      events.push('dispose');
    },
  };

  try {
    await generation.publish();
  } finally {
    await generation.dispose();
  }

  assert.deepEqual(
    events,
    ['publish', 'dispose'],
  );
});
````

## File: projects/tools/builder/src/tests/watch-publication-state.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WatchPublicationState,
} from '../watch/watch-publication-state.js';

test('failed rebuild does not replace last good generation', () => {
  const state = new WatchPublicationState();

  state.commit(1);
  assert.equal(
    state.current()?.generation,
    1,
  );

  // generation 2 fails -> no commit
  assert.equal(
    state.current()?.generation,
    1,
  );

  state.commit(3);
  assert.equal(
    state.current()?.generation,
    3,
  );
});
````

## File: projects/tools/builder/src/tests/waypoint-options.spec.ts
````typescript
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveWaypointOptions,
} from '../waypoint-build/options.js';

test('Waypoint build configuration is optional', () => {
  const resolved = resolveWaypointOptions(
    'projects/apps/app2/client',
    undefined,
  );

  assert.equal(
    resolved.entry,
    'projects/apps/app2/client/src/app/app.routes.ts',
  );
  assert.equal(
    resolved.routesExport,
    'routes',
  );
  assert.equal(
    resolved.profile,
    false,
  );
  assert.equal(
    resolved.buildManifest,
    true,
  );
});

test('explicit Waypoint options override only named defaults', () => {
  const resolved = resolveWaypointOptions(
    'projects/apps/app2/client',
    {
      entry: 'src/navigation.ts',
      profile: true,
    },
  );

  assert.equal(
    resolved.entry,
    'projects/apps/app2/client/src/navigation.ts',
  );
  assert.equal(
    resolved.routesExport,
    'routes',
  );
  assert.equal(
    resolved.profile,
    true,
  );
});
````

## File: projects/tools/builder/src/watch/build-result-stream.ts
````typescript
import type {
  BuilderOutput,
} from '@angular-devkit/architect';
import type {
  Observable,
} from 'rxjs';

export async function* builderResults(
  output: Observable<BuilderOutput>,
): AsyncGenerator<BuilderOutput> {
  const queue: BuilderOutput[] = [];
  let done = false;
  let failure: unknown;
  let wake: (() => void) | undefined;

  const subscription = output.subscribe({
    next(value) {
      queue.push(value);
      wake?.();
      wake = undefined;
    },

    error(error) {
      failure = error;
      done = true;
      wake?.();
      wake = undefined;
    },

    complete() {
      done = true;
      wake?.();
      wake = undefined;
    },
  });

  try {
    while (!done || queue.length > 0) {
      if (queue.length === 0) {
        await new Promise<void>(
          resolve => {
            wake = resolve;
          },
        );
        continue;
      }

      yield queue.shift()!;
    }

    if (failure) {
      throw failure;
    }
  } finally {
    subscription.unsubscribe();
  }
}
````

## File: projects/tools/builder/src/watch/dependency-fingerprint.ts
````typescript
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface DependencyFingerprint {
  readonly key: string;
  readonly files: readonly string[];
}

/**
 * Fingerprints only files that participate in Waypoint's navigation/protected
 * build graph. Host-only application edits do not invalidate this fingerprint.
 */
export async function fingerprintFiles(
  files: readonly string[],
): Promise<DependencyFingerprint> {
  const normalized = [...new Set(
    files.map(file => path.resolve(file)),
  )].sort();

  const hash = crypto.createHash('sha256');

  for (const file of normalized) {
    hash.update(file);
    hash.update('\0');

    try {
      const stat = await fs.stat(file);

      hash.update(String(stat.size));
      hash.update('\0');
      hash.update(String(stat.mtimeMs));
      hash.update('\0');
    } catch {
      hash.update('missing');
      hash.update('\0');
    }
  }

  return Object.freeze({
    key: hash.digest('hex'),
    files: Object.freeze(normalized),
  });
}
````

## File: projects/tools/builder/src/watch/watch-cache.ts
````typescript
import type {
  WaypointAnalysis,
} from '../compiler/compiler/analyze.js';
import type {
  PreparedWaypointBuild,
} from '../compiler/compiler/prepare-build.js';

export interface CachedWaypointGeneration {
  readonly fingerprint: string;
  readonly analysis: WaypointAnalysis;
  readonly build: PreparedWaypointBuild;
}

export class WaypointWatchCache {
  #current: CachedWaypointGeneration | undefined;

  get(
    fingerprint: string,
  ): CachedWaypointGeneration | undefined {
    return this.#current?.fingerprint === fingerprint
      ? this.#current
      : undefined;
  }

  replace(
    next: CachedWaypointGeneration,
  ): CachedWaypointGeneration | undefined {
    const previous = this.#current;
    this.#current = next;
    return previous;
  }

  take(): CachedWaypointGeneration | undefined {
    const current = this.#current;
    this.#current = undefined;
    return current;
  }
}
````

## File: projects/tools/builder/src/watch/watch-dependencies.ts
````typescript
import path from 'node:path';

import type {
  WaypointAnalysis,
} from '../compiler/compiler/analyze.js';

/**
 * Returns the authored source files that affect Waypoint analysis/planning.
 *
 * The exact field names should be wired to the resolved semantic/module graph
 * already produced by analyze(). Do not scan the whole workspace.
 */
export function waypointAnalysisDependencies(
  analysis: WaypointAnalysis,
): readonly string[] {
  const values = new Set<string>();

  values.add(
    path.resolve(
      analysis.planned.entry,
    ),
  );

  const semanticFiles =
    (analysis.semantic as any)?.sourceFiles;

  if (Array.isArray(semanticFiles)) {
    for (const file of semanticFiles) {
      if (typeof file === 'string') {
        values.add(path.resolve(file));
      }
    }
  }

  const moduleFiles =
    (analysis as any).navigationModule?.files;

  if (Array.isArray(moduleFiles)) {
    for (const file of moduleFiles) {
      if (typeof file === 'string') {
        values.add(path.resolve(file));
      }
    }
  }

  return Object.freeze(
    [...values].sort(),
  );
}
````

## File: projects/tools/builder/src/watch/watch-publication-state.ts
````typescript
export interface PublishedGenerationState {
  readonly generation: number;
}

export class WatchPublicationState {
  #current: PublishedGenerationState | undefined;

  current(): PublishedGenerationState | undefined {
    return this.#current;
  }

  commit(generation: number): void {
    this.#current = Object.freeze({
      generation,
    });
  }
}
````

## File: projects/tools/builder/src/watch/watch-session-v2.ts
````typescript
import type {
  BuilderContext,
  BuilderOutput,
} from '@angular-devkit/architect';

import {
  analyze,
  type WaypointAnalysis,
} from '../compiler/compiler/analyze.js';
import {
  prepareBuild,
  type PreparedWaypointBuild,
} from '../compiler/compiler/prepare-build.js';
import {
  fingerprintFiles,
} from './dependency-fingerprint.js';
import {
  waypointAnalysisDependencies,
} from './watch-dependencies.js';
import {
  WaypointWatchCache,
} from './watch-cache.js';

export interface WaypointWatchSessionOptions {
  readonly analysisOptions: Parameters<typeof analyze>[0];
  readonly metadataRoot: string;
}

export interface WaypointWatchGeneration {
  readonly number: number;
  readonly reused: boolean;
  readonly analysis: WaypointAnalysis;
  readonly build: PreparedWaypointBuild;

  publish(): Promise<BuilderOutput>;
  dispose(): Promise<void>;
}

export interface WaypointWatchSessionV2 {
  nextGeneration(): Promise<WaypointWatchGeneration>;
  dispose(): Promise<void>;
}

/**
 * Persistent watch session with dependency-aware reuse.
 *
 * We first analyze to know the authoritative dependency set. After that, if the
 * dependency fingerprint is unchanged, the previous prepared Waypoint build can
 * be reused instead of recreating AOT/protected state.
 */
export function createWaypointWatchSessionV2(
  options: WaypointWatchSessionOptions,
  _context: BuilderContext,
): WaypointWatchSessionV2 {
  const cache = new WaypointWatchCache();

  let generation = 0;
  let disposed = false;
  let knownDependencies: readonly string[] | undefined;
  let knownFingerprint: string | undefined;

  async function nextGeneration(): Promise<WaypointWatchGeneration> {
    if (disposed) {
      throw new Error(
        'Waypoint watch session is already disposed.',
      );
    }

    const number = ++generation;

    if (
      knownDependencies
      && knownFingerprint
    ) {
      const current =
        await fingerprintFiles(
          knownDependencies,
        );

      const reusable =
        cache.get(current.key);

      if (reusable) {
        return generationFromCache(
          number,
          reusable.analysis,
          reusable.build,
        );
      }
    }

    const analysis = await analyze(
      options.analysisOptions,
    );

    if (!analysis.success || !analysis.plan) {
      throw new Error(
        `Waypoint analysis failed for watch generation ${number}.`,
      );
    }

    knownDependencies =
      waypointAnalysisDependencies(
        analysis,
      );

    const fingerprint =
      await fingerprintFiles(
        knownDependencies,
      );

    const build = await prepareBuild(
      analysis,
      {
        metadataRoot:
          options.metadataRoot,
      },
    );

    const previous = cache.replace({
      fingerprint:
        fingerprint.key,
      analysis,
      build,
    });

    knownFingerprint =
      fingerprint.key;

    if (
      previous
      && previous.build !== build
    ) {
      await previous.build.dispose();
    }

    return Object.freeze({
      number,
      reused: false,
      analysis,
      build,

      async publish() {
        const result =
          await build.publish();

        return result.success
          ? { success: true }
          : {
              success: false,
              error:
                `Waypoint publication failed for generation ${number}.`,
            };
      },

      async dispose() {
        /*
         * Cached build survives this generation.
         * Session.dispose() owns its final cleanup.
         */
      },
    });
  }

  function generationFromCache(
    number: number,
    analysis: WaypointAnalysis,
    build: PreparedWaypointBuild,
  ): WaypointWatchGeneration {
    return Object.freeze({
      number,
      reused: true,
      analysis,
      build,

      async publish() {
        /*
         * If nothing in Waypoint's dependency graph changed, publication is
         * already current. Host-only Angular changes require no protected
         * republish.
         */
        return {
          success: true,
        };
      },

      async dispose() {},
    });
  }

  return Object.freeze({
    nextGeneration,

    async dispose() {
      if (disposed) return;
      disposed = true;

      const current = cache.take();

      if (current) {
        await current.build.dispose();
      }
    },
  });
}
````

## File: projects/tools/builder/src/watch/watch-session.ts
````typescript
import type {
  BuilderContext,
  BuilderOutput,
} from '@angular-devkit/architect';

import type {
  WaypointAnalysis,
} from '../compiler/compiler/analyze.js';
import {
  analyze,
} from '../compiler/compiler/analyze.js';
import {
  prepareBuild,
  type PreparedWaypointBuild,
} from '../compiler/compiler/prepare-build.js';

export interface WaypointWatchOptions {
  readonly analysisOptions: Parameters<typeof analyze>[0];
  readonly metadataRoot: string;
}

export interface WatchGeneration {
  readonly number: number;
  readonly analysis: WaypointAnalysis;
  readonly build?: PreparedWaypointBuild;

  publish(): Promise<BuilderOutput>;
  dispose(): Promise<void>;
}

export interface WaypointWatchSession {
  nextGeneration(): Promise<WatchGeneration>;
  dispose(): Promise<void>;
}

export function createWaypointWatchSession(
  options: WaypointWatchOptions,
  _context: BuilderContext,
): WaypointWatchSession {
  let generationNumber = 0;
  let disposed = false;

  async function nextGeneration(): Promise<WatchGeneration> {
    if (disposed) {
      throw new Error('Waypoint watch session is already disposed.');
    }

    const number = ++generationNumber;
    const analysis = await analyze(options.analysisOptions);

    if (!analysis.success || !analysis.plan) {
      return Object.freeze({
        number,
        analysis,

        async publish() {
          return {
            success: false,
            error:
              `Waypoint analysis failed for generation ${number}.`,
          };
        },

        async dispose() {},
      });
    }

    const build = await prepareBuild(
      analysis,
      {
        metadataRoot: options.metadataRoot,
      },
    );

    return Object.freeze({
      number,
      analysis,
      build,

      async publish() {
        const result = await build.publish();

        return result.success
          ? { success: true }
          : {
              success: false,
              error:
                `Waypoint publication failed for generation ${number}.`,
            };
      },

      dispose() {
        return build.dispose();
      },
    });
  }

  return Object.freeze({
    nextGeneration,

    async dispose() {
      disposed = true;
    },
  });
}
````

## File: projects/tools/builder/src/waypoint-build/options.ts
````typescript
import path from 'node:path';

export interface WaypointOptions {
  readonly entry?: string;
  readonly routesExport?: string;
  readonly profile?: boolean;
  readonly buildManifest?: boolean;
}

export interface ResolvedWaypointOptions {
  readonly entry: string;
  readonly routesExport: string;
  readonly profile: boolean;
  readonly buildManifest: boolean;
}

export function resolveWaypointOptions(
  projectRoot: string,
  options: WaypointOptions | undefined,
): ResolvedWaypointOptions {
  return Object.freeze({
    entry: path.join(
      projectRoot,
      options?.entry ?? 'src/app/app.routes.ts',
    ),
    routesExport: options?.routesExport ?? 'routes',
    profile: options?.profile ?? false,
    buildManifest: options?.buildManifest ?? true,
  });
}
````

## File: projects/tools/builder/src/waypoint-build/schema-source.json
````json
{
  "$comment": "Do not edit schema.json manually. It is generated from the installed @angular/build application schema plus this Waypoint extension definition.",
  "waypoint": {
    "type": "object",
    "description": "Waypoint privilege-aware build options.",
    "additionalProperties": false,
    "default": {},
    "properties": {
      "entry": {
        "type": "string",
        "default": "src/app/app.routes.ts"
      },
      "routesExport": {
        "type": "string",
        "default": "routes"
      },
      "profile": {
        "type": "boolean",
        "default": false
      },
      "buildManifest": {
        "type": "boolean",
        "default": true
      }
    }
  }
}
````

## File: projects/tools/builder/src/waypoint-build/schema.patch.ts
````typescript
/*
Do not add a Waypoint-specific watch option.

The generated schema already inherits Angular's ordinary:

  watch: boolean

Waypoint must honor that exact option so:

  ng build app2-client --watch

works naturally.
*/
````

## File: projects/tools/builder/src/waypoint-build/watch.patch.ts
````typescript
/*
Use createWaypointWatchSessionV2().

After each successful Angular host rebuild:

const generation =
  await session.nextGeneration();

if (generation.reused) {
  context.logger.info(
    `Waypoint generation ${generation.number}: navigation/protected graph unchanged; reused previous build.`,
  );
}

const published =
  await generation.publish();

yield published;

A host-only edit now produces:

  Angular incremental rebuild
  Waypoint fingerprint hit
  no analyze/AOT/protected rebundle
  no runtime metadata republish

A route/component/policy edit in Waypoint's tracked dependency graph produces:

  fingerprint miss
  analyze
  prepare/AOT
  validate
  publish new generation
*/
````

## File: projects/tools/builder/src/waypoint-build/watch.ts
````typescript
import type {
  BuilderContext,
  BuilderOutput,
  BuilderRun,
} from '@angular-devkit/architect';

import {
  createWaypointWatchSession,
} from '../watch/watch-session.js';
import {
  builderResults,
} from '../watch/build-result-stream.js';

export interface RunWaypointWatchOptions {
  readonly delegatedRun: BuilderRun;
  readonly context: BuilderContext;
  readonly analysisOptions: Parameters<
    typeof createWaypointWatchSession
  >[0]['analysisOptions'];
  readonly metadataRoot: string;
  readonly reportDiagnostics: (
    diagnostics: readonly {
      level: string;
      code?: string;
      message: string;
    }[],
    context: BuilderContext,
  ) => void;
}

/**
 * Coordinates one persistent Angular watch run with disposable Waypoint build
 * generations.
 *
 * The last successfully published Waypoint generation remains live when a later
 * Angular or Waypoint rebuild fails.
 */
export async function* runWaypointWatch(
  options: RunWaypointWatchOptions,
): AsyncGenerator<BuilderOutput> {
  const session = createWaypointWatchSession(
    {
      analysisOptions:
        options.analysisOptions,
      metadataRoot:
        options.metadataRoot,
    },
    options.context,
  );

  try {
    for await (
      const angularResult
      of builderResults(
        options.delegatedRun.output,
      )
    ) {
      if (!angularResult.success) {
        yield angularResult;
        continue;
      }

      const generation =
        await session.nextGeneration();

      try {
        options.reportDiagnostics(
          generation.analysis.diagnostics,
          options.context,
        );

        if (!generation.analysis.success) {
          yield {
            success: false,
            error:
              `Waypoint analysis failed for generation ${generation.number}.`,
          };
          continue;
        }

        const published =
          await generation.publish();

        yield published;
      } finally {
        await generation.dispose();
      }
    }
  } finally {
    await session.dispose();
    await options.delegatedRun.stop();
  }
}
````

## File: projects/tools/builder/builders.json
````json
{
  "$schema": "../node_modules/@angular-devkit/architect/src/builders-schema.json",
  "builders": {
    "run-script": {
      "implementation": "./src/run-script/index.cjs",
      "schema": "./src/run-script/schema.json",
      "description": "Runs a local Node.js script."
    },
    "with-prerequisites": {
      "implementation": "./src/with-prerequisites/index.cjs",
      "schema": "./src/with-prerequisites/schema.json",
      "description": "Runs prerequisite targets before delegating to another target."
    },
    "waypoint-build": {
      "implementation": "./src/waypoint-build/index.cjs",
      "schema": "./src/waypoint-build/schema.json",
      "description": "Compile Waypoint artifacts, then run the Angular client build."
    }
  }
}
````

## File: projects/tools/builder/package.json
````json
{
  "name": "@epikodelabs/waypoint-builder",
  "version": "0.0.0",
  "private": true,
  "builders": "./builders.json",
  "dependencies": {
    "@angular-devkit/architect": "^0.2100.0"
  }
}
````

## File: templates/server-node-ts/src/app/app.config.server.ts
````typescript
import {
  type ApplicationConfig,
  mergeApplicationConfig,
} from '@angular/core';
import {
  provideServerRendering,
  withRoutes,
} from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
  ],
};

export const config =
  mergeApplicationConfig(appConfig, serverConfig);
````

## File: templates/server-node-ts/src/app/app.config.ts
````typescript
import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideServerRouter } from '@epikodelabs/waypoint/server';

import { routes } from './app.routes';
import { loadProtectedRouteBranch } from './protected-route-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideServerRouter(routes, {
      viewTransitions: true,
      resolveRoutes: loadProtectedRouteBranch,
    }),
  ],
};
````

## File: templates/server-node-ts/src/app/app.css
````css
:host { display: block; min-height: 100vh; }
.app-frame { min-height: 100vh; padding: 1.5rem; }
.masthead {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 88rem;
  margin: 0 auto 1.5rem;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  background: var(--panel-color);
}
.brand, nav a { color: var(--ink-strong); text-decoration: none; }
nav { display: flex; flex-wrap: wrap; gap: .6rem; }
nav a { padding: .7rem 1rem; border-radius: 999px; }
````

## File: templates/server-node-ts/src/app/app.html
````html
<div class="app-frame">
  <header class="masthead">
    <a class="brand" [routerLink]="'/'">Waypoint</a>
    <nav>
      <a [routerLink]="'/'">Overview</a>
      <a [routerLink]="'/app/workspace/101?view=overview&page=1&filters=open'">Workspace</a>
      <a [routerLink]="'/app/reports'">Reports</a>
      <a [routerLink]="'/legacy'">Redirect</a>
    </nav>
  </header>
  <router-outlet />
</div>
````

## File: templates/server-node-ts/src/app/app.routes.server.ts
````typescript
import { RenderMode, type ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
````

## File: templates/server-node-ts/src/app/app.routes.ts
````typescript
import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';

/**
 * The server-hosted browser app ships the same minimal navigation skeleton as
 * the standalone client. Protected route implementations and metadata are not
 * bundled here; compiler artifacts attach to these ownership slots at runtime.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
````

## File: templates/server-node-ts/src/app/app.ts
````typescript
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@epikodelabs/waypoint';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
````

## File: templates/server-node-ts/src/index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Waypoint Runtime</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body><app-root></app-root></body>
</html>
````

## File: templates/server-node-ts/src/main.server.ts
````typescript
import {
  type BootstrapContext,
  bootstrapApplication,
} from '@angular/platform-browser';

import { config } from './app/app.config.server';
import { App } from './app/app';

export default (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);
````

## File: templates/server-node-ts/src/main.ts
````typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch(error => console.error(error));
````

## File: templates/server-node-ts/src/route-auth.ts
````typescript
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ServerPrincipal } from '@epikodelabs/waypoint/server';

declare global {
  namespace Express {
    interface Request {
      principal?: ServerPrincipal;
    }
  }
}

export interface DemoPrincipalProfile {
  readonly id: string;
  readonly principal: ServerPrincipal;
  readonly landingTargets: readonly string[];
}

const demoProfiles: Readonly<Record<string, DemoPrincipalProfile>> = {
  nora: {
    id: 'nora',
    principal: {
      subject: 'nora',
      roles: new Set(['user']),
      permissions: new Set([
        'project:read',
        'draft:write',
        'reports:read',
      ]),
    },
    landingTargets: [
      '/app/settings?section=access',
      '/',
    ],
  },
  lev: {
    id: 'lev',
    principal: {
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
    landingTargets: [
      '/app/admin',
      '/app/settings?section=access',
      '/',
    ],
  },
};

export function demoPrincipalProfile(
  identity: unknown,
): DemoPrincipalProfile | undefined {
  if (typeof identity !== 'string') return undefined;
  return demoProfiles[identity.trim()];
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return '';
  }
}

export const readPrincipal: RequestHandler = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  const token = request.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    ?? request.header('cookie')
      ?.split(';')
      .map(value => value.trim())
      .find(value => value.startsWith('identity='))
      ?.slice('identity='.length);

  request.principal = token
    ? demoPrincipalProfile(safeDecodeURIComponent(token))?.principal
    : undefined;
  next();
};
````

## File: templates/server-node-ts/src/styles.css
````css
:root {
  --app-bg: linear-gradient(180deg, #f5f7fb, #edf2f9);
  --panel-color: rgb(255 255 255 / .8);
  --border-color: rgb(54 86 131 / .12);
  --ink-strong: #162033;
  --ink-body: #31405d;
}
* { box-sizing: border-box; }
html, body { min-height: 100%; }
body {
  margin: 0;
  background: var(--app-bg);
  color: var(--ink-body);
  font-family: "Segoe UI Variable Text", sans-serif;
}
````

## File: .editorconfig
````
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.ts]
quote_type = single
ij_typescript_use_double_quotes = false

[*.md]
max_line_length = off
trim_trailing_whitespace = false
````

## File: .prettierrc
````
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
````

## File: projects/apps/app1/src/app/routes/application.routes.ts
````typescript
import { inject } from '@angular/core';
import {
  frame,
  layout,
  lazyRoute,
  redirectRoute,
  route,
  routeSlot,
  routesFor,
  s,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoSessionService } from '../core/demo-session.service';
import {
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
  ReportsSidebarComponent,
  SettingsPage,
  SettingsSidebarComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
} from '../pages/demo-pages';

export const appHomeRoute = redirectRoute(
  '',
  '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
  {
    name: 'appHome',
  },
);

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

export const reportsRoute = lazyRoute(
  '/reports',
  () =>
    import('../pages/reports.page')
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

const branchEntries = [
  appHomeRoute,
  workspaceRoute,
  workspaceSidebarRoute,
  settingsRoute,
  settingsSidebarRoute,
  editorRoute,
  editorSidebarRoute,
  reportsRoute,
  reportsSidebarRoute,
] as const satisfies NavigationTree;

const entries = [
  layout('/app', DemoShellComponent, [
    ...branchEntries,
    routeSlot('administration'),
  ]),
] as const satisfies NavigationTree;

export const applicationRoutes = routesFor('application', 'application-core', entries);
````

## File: projects/apps/app2/client/src/app/routes/application.routes.ts
````typescript
import { inject } from '@angular/core';
import {
  frame,
  layout,
  lazyRoute,
  redirectRoute,
  route,
  routeSlot,
  routesFor,
  s,
  type NavigationTree,
} from '@epikodelabs/waypoint';

import { DemoSessionService } from '../core/demo-session.service';
import {
  DemoShellComponent,
  EditorPage,
  EditorSidebarComponent,
  ReportsSidebarComponent,
  SettingsPage,
  SettingsSidebarComponent,
  WorkspacePage,
  WorkspaceSidebarComponent,
} from '../pages/demo-pages';

export const appHomeRoute = redirectRoute(
  '',
  '/app/workspace/101?view=overview&page=1&filters=open&filters=recent',
  {
    name: 'appHome',
  },
);

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

export const reportsRoute = lazyRoute(
  '/reports',
  () =>
    import('../pages/reports.page')
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

const branchEntries = [
  appHomeRoute,
  workspaceRoute,
  workspaceSidebarRoute,
  settingsRoute,
  settingsSidebarRoute,
  editorRoute,
  editorSidebarRoute,
  reportsRoute,
  reportsSidebarRoute,
] as const satisfies NavigationTree;

const entries = [
  layout('/app', DemoShellComponent, [
    ...branchEntries,
    routeSlot('administration'),
  ]),
] as const satisfies NavigationTree;

export const applicationRoutes = routesFor('application', 'application-core', entries);
````

## File: projects/apps/app2/client/tsconfig.app.json
````json
{
  "extends": "../../../../tsconfig.json",
  "compilerOptions": { "types": [] },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": [
    "src/**/*.spec.ts",
    "src/app/demo/**/*.ts",
    "src/app/navigation/**/*.ts"
  ]
}
````

## File: projects/apps/app2/client/tsconfig.artifacts.json
````json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "outDir": "../../../../out-tsc/app2-client-artifacts",
    "declaration": false,
    "sourceMap": false
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts",
    "src/app/demo/**/*.ts",
    "src/app/navigation/**/*.ts"
  ]
}
````

## File: projects/libraries/waypoint/server/browser-delivery.patch.ts
````typescript
/*
Final public ServerNavigationResolverOptions:

export interface ServerNavigationResolverOptions {
  readonly endpoint?: string;
  readonly fetch?: ServerNavigationFetch;
  readonly importModule?: ServerNavigationModuleImporter;
  readonly artifactRefreshRetries?: number;
}

Remove:
  hostModules
  ServerNavigationHostModules import
  registerServerNavigationHostModules(...)
  hostModules presence checks

The generated build-time runtime registrar now populates the internal bridge.
*/
````

## File: projects/libraries/waypoint/server/server-delivery.ts
````typescript
/** Stable wire protocol version for server-resolved Waypoint navigation. */
export const WAYPOINT_SERVER_DELIVERY_VERSION = 2 as const;

export type ServerArtifactDeliveryKind = 'route' | 'shared';

/** One browser-loadable artifact selected and authorized by the server. */
export interface ServerArtifactDelivery {
  readonly kind: ServerArtifactDeliveryKind;
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;
}

/**
 * Complete server-authorized delivery plan for one requested destination.
 *
 * Artifacts are dependency-first. Shared artifacts may appear in the plan, but
 * only route artifacts contribute `routesFor()` definitions to navigation.
 */
export interface ServerNavigationResolution {
  readonly version: typeof WAYPOINT_SERVER_DELIVERY_VERSION;
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

export function isServerNavigationResolution(
  value: unknown,
): value is ServerNavigationResolution {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerNavigationResolution>;
  return candidate.version === WAYPOINT_SERVER_DELIVERY_VERSION
    && nonEmptyString(candidate.artifactKey)
    && Array.isArray(candidate.artifacts)
    && candidate.artifacts.every(isServerArtifactDelivery);
}

export function isServerArtifactDelivery(
  value: unknown,
): value is ServerArtifactDelivery {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ServerArtifactDelivery>;
  return (candidate.kind === 'route' || candidate.kind === 'shared')
    && nonEmptyString(candidate.artifactKey)
    && nonEmptyString(candidate.moduleUrl)
    && nonEmptyString(candidate.hash);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
````

## File: projects/libraries/waypoint/server/server-express.ts
````typescript
import type { ServerArtifactRecord, ServerPrincipal } from './server-routing';
import type { ServerRouter } from './server-router';
import {
  createServerRouterHttpHandler,
  type ServerHttpHeaders,
} from './server-http';

export interface ExpressLikeRequest {
  readonly query: Readonly<Record<string, unknown>>;
  readonly params: Readonly<Record<string, string | readonly string[] | undefined>>;
  readonly body?: unknown;
}

export interface ExpressLikeResponse {
  status(code: number): ExpressLikeResponse;
  set(headers: ServerHttpHeaders): ExpressLikeResponse;
  json(body: unknown): unknown;
  end(): unknown;
  sendFile(path: string, callback: (error?: Error) => void): unknown;
  readonly headersSent: boolean;
}

export type ExpressLikeNext = (error?: unknown) => void;

export interface ExpressServerRouterReloadOptions<
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
> {
  readonly resetPrincipal?: (
    request: TRequest,
    response: TResponse,
  ) => void | Promise<void>;
  readonly publicLocation?: string;
  readonly landingTargets?: readonly string[];
}

export interface ExpressServerRouterAdapterOptions<
  TArtifact extends ServerArtifactRecord,
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
> {
  readonly router: Pick<ServerRouter<TArtifact>, 'resolve' | 'resolveLanding' | 'resolveModule'>;
  readonly principalFrom?: (request: TRequest) => ServerPrincipal | undefined;
  readonly artifactPathFor: (artifact: TArtifact) => string;
  readonly reload?: ExpressServerRouterReloadOptions<TRequest, TResponse>;
}

export interface ExpressServerRouterHandlers<
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
> {
  readonly resolve: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
  readonly module: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
  readonly reload: (
    request: TRequest,
    response: TResponse,
    next: ExpressLikeNext,
  ) => Promise<void>;
}

/**
 * Creates Express-compatible handlers without importing Express at runtime.
 * Applications remain responsible only for mounting the handlers and mapping
 * an authorized artifact descriptor to its local published file path.
 */
export function createExpressServerRouterHandlers<
  TArtifact extends ServerArtifactRecord,
  TRequest extends ExpressLikeRequest = ExpressLikeRequest,
  TResponse extends ExpressLikeResponse = ExpressLikeResponse,
>(
  options: ExpressServerRouterAdapterOptions<TArtifact, TRequest, TResponse>,
): ExpressServerRouterHandlers<TRequest, TResponse> {
  const http = createServerRouterHttpHandler<
    TArtifact,
    Readonly<{
      request: TRequest;
      response: TResponse;
    }>
  >(options.router, {
    reload: options.reload
      ? {
          publicLocation: options.reload.publicLocation,
          landingTargets: options.reload.landingTargets,
          resetPrincipal: ({ request, response }) =>
            options.reload?.resetPrincipal?.(request, response),
        }
      : undefined,
  });
  const principalFrom = options.principalFrom ?? (() => undefined);

  return Object.freeze({
    async resolve(
      request: TRequest,
      response: ExpressLikeResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const result = await http.resolve({
          target: request.query['path'],
          principal: principalFrom(request),
        });

        response
          .status(result.status)
          .set(result.headers)
          .json(result.body);
      } catch (error) {
        next(error);
      }
    },

    async module(
      request: TRequest,
      response: ExpressLikeResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const result = await http.module({
          artifactKey: request.params['artifactKey'],
          hash: request.params['hash'],
          principal: principalFrom(request),
        });

        response.status(result.status).set(result.headers);
        if (result.kind === 'empty') {
          response.end();
          return;
        }

        let file: string;
        try {
          file = options.artifactPathFor(result.artifact);
        } catch (error) {
          next(error);
          return;
        }

        response.sendFile(file, (error?: Error) => {
          if (error && !response.headersSent) next(error);
        });
      } catch (error) {
        next(error);
      }
    },

    async reload(
      request: TRequest,
      response: TResponse,
      next: ExpressLikeNext,
    ) {
      try {
        const body =
          request.body && typeof request.body === 'object'
            ? request.body as {
                readonly reason?: unknown;
                readonly target?: unknown;
              }
            : {};

        const result = await http.reload({
          reason: body.reason,
          target: body.target,
          principal: principalFrom(request),
          context: Object.freeze({
            request,
            response,
          }),
        });

        response
          .status(result.status)
          .set(result.headers)
          .json(result.body);
      } catch (error) {
        next(error);
      }
    },
  });
}
````

## File: projects/libraries/waypoint/server/server-http.ts
````typescript
import type { ServerNavigationResolution } from './server-delivery';
import {
  ServerArtifactResolutionError,
  type ServerArtifactRecord,
  type ServerPrincipal,
} from './server-routing';
import type { ServerRouter } from './server-router';

export const WAYPOINT_PRIVATE_NO_STORE_HEADERS = Object.freeze({
  'Cache-Control': 'private, no-store',
  Vary: 'Authorization, Cookie',
} as const);

export const WAYPOINT_MODULE_HEADERS = Object.freeze({
  ...WAYPOINT_PRIVATE_NO_STORE_HEADERS,
  'Content-Type': 'text/javascript; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
} as const);

export type ServerHttpHeaders = Readonly<Record<string, string>>;

export interface ServerResolveRequest {
  readonly target: unknown;
  readonly principal?: ServerPrincipal;
}

export interface ServerModuleRequest {
  readonly artifactKey: unknown;
  readonly hash: unknown;
  readonly principal?: ServerPrincipal;
}

export type ServerReloadReason =
  | 'reset'
  | 'principal-change';

export interface ServerReloadRequest<
  TContext = unknown,
> {
  readonly reason?: unknown;
  readonly target?: unknown;
  readonly principal?: ServerPrincipal;
  readonly context?: TContext;
}

export interface ServerReloadOptions<
  TContext = unknown,
> {
  readonly resetPrincipal?: (context: TContext) => void | Promise<void>;
  readonly publicLocation?: string;
  readonly landingTargets?: readonly string[];
}

export interface ServerReloadResult {
  readonly version: 1;
  readonly location: string;
}

export interface ServerJsonResponse<T> {
  readonly kind: 'json';
  readonly status: number;
  readonly headers: ServerHttpHeaders;
  readonly body: T;
}

export interface ServerEmptyResponse {
  readonly kind: 'empty';
  readonly status: number;
  readonly headers: ServerHttpHeaders;
}

export interface ServerArtifactResponse<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> {
  readonly kind: 'artifact';
  readonly status: 200;
  readonly headers: ServerHttpHeaders;
  readonly artifact: TArtifact;
}

export type ServerResolveResponse =
  | ServerJsonResponse<ServerNavigationResolution>
  | ServerJsonResponse<{ readonly error: string }>;

export type ServerModuleResponse<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
> = ServerArtifactResponse<TArtifact> | ServerEmptyResponse;

export type ServerReloadResponse =
  | ServerJsonResponse<ServerReloadResult>
  | ServerJsonResponse<{ readonly error: string }>;

export interface ServerRouterHttpHandler<
  TArtifact extends ServerArtifactRecord = ServerArtifactRecord,
  TContext = unknown,
> {
  resolve(request: ServerResolveRequest): Promise<ServerResolveResponse>;
  module(request: ServerModuleRequest): Promise<ServerModuleResponse<TArtifact>>;
  reload(request: ServerReloadRequest<TContext>): Promise<ServerReloadResponse>;
}

/**
 * Maps the framework-neutral Server Router API to stable HTTP semantics.
 *
 * Unknown and unauthorized routes deliberately share the same 404 response.
 * Direct module requests also collapse missing, stale, and unauthorized
 * artifacts to 404 so HTTP does not become a route or artifact discovery
 * oracle. Compiler publication failures are exposed as 503 only during route
 * resolution, where the server already knows the requested route is routable.
 */
export function createServerRouterHttpHandler<
  TArtifact extends ServerArtifactRecord,
  TContext = unknown,
>(
  router: Pick<ServerRouter<TArtifact>, 'resolve' | 'resolveLanding' | 'resolveModule'>,
  options: Readonly<{
    readonly reload?: ServerReloadOptions<TContext>;
  }> = {},
): ServerRouterHttpHandler<TArtifact, TContext> {
  const reloadOptions = options.reload;

  return Object.freeze({
    async resolve(request: ServerResolveRequest) {
      const target = stringValue(request.target);
      if (!target) {
        return json(400, { error: 'Invalid path.' });
      }

      try {
        const resolution = await router.resolve(target, request.principal);
        return resolution
          ? json(200, resolution)
          : json(404, { error: 'Route not found.' });
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) {
          return json(503, { error: 'Navigation artifact unavailable.' });
        }
        throw error;
      }
    },

    async module(request: ServerModuleRequest) {
      const artifactKey = stringValue(request.artifactKey);
      const hash = stringValue(request.hash);
      if (!artifactKey || !hash) return empty(404);

      try {
        const artifact = await router.resolveModule(
          artifactKey,
          hash,
          request.principal,
        );

        return artifact
          ? Object.freeze({
              kind: 'artifact' as const,
              status: 200 as const,
              headers: WAYPOINT_MODULE_HEADERS,
              artifact,
            })
          : empty(404);
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) return empty(404);
        throw error;
      }
    },

    async reload(request: ServerReloadRequest<TContext>) {
      const reason = reloadReasonValue(request.reason);
      if (!reason) {
        return json(400, { error: 'Invalid reload reason.' });
      }

      const target = optionalStringValue(request.target);
      if (request.target !== undefined && !target) {
        return json(400, { error: 'Invalid reload target.' });
      }

      const normalizedTarget = target
        ? normalizeInternalTarget(target)
        : null;
      if (target && !normalizedTarget) {
        return json(400, { error: 'Invalid reload target.' });
      }

      if (
        reason === 'principal-change'
        && !reloadOptions?.resetPrincipal
      ) {
        return json(501, {
          error: 'Principal reset is not configured.',
        });
      }

      try {
        let principal = request.principal;
        if (reason === 'principal-change') {
          await reloadOptions!.resetPrincipal!(request.context as TContext);
          principal = undefined;
        }

        const location = await selectReloadLocation(
          router,
          principal,
          normalizedTarget ?? undefined,
          reason,
          reloadOptions,
        );

        return location
          ? json(200, {
              version: 1 as const,
              location,
            })
          : json(403, {
              error: 'No authorized reload destination.',
            });
      } catch (error) {
        if (error instanceof ServerArtifactResolutionError) {
          return json(503, { error: 'Navigation artifact unavailable.' });
        }
        throw error;
      }
    },
  });
}

function json<T>(status: number, body: T): ServerJsonResponse<T> {
  return Object.freeze({
    kind: 'json',
    status,
    headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
    body,
  });
}

function empty(status: number): ServerEmptyResponse {
  return Object.freeze({
    kind: 'empty',
    status,
    headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
  });
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function optionalStringValue(value: unknown): string | undefined | null {
  if (value === undefined) return undefined;
  return stringValue(value);
}

function reloadReasonValue(value: unknown): ServerReloadReason | null {
  return value === 'reset' || value === 'principal-change'
    ? value
    : null;
}

function normalizeInternalTarget(target: string): string | null {
  try {
    const url = new URL(target, 'http://waypoint.local');
    if (url.origin !== 'http://waypoint.local') {
      return null;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

async function selectReloadLocation<
  TArtifact extends ServerArtifactRecord,
  TContext,
>(
  router: Pick<ServerRouter<TArtifact>, 'resolve' | 'resolveLanding'>,
  principal: ServerPrincipal | undefined,
  target: string | undefined,
  reason: ServerReloadReason,
  options: ServerReloadOptions<TContext> | undefined,
): Promise<string | null> {
  if (target) {
    const resolution = await router.resolve(target, principal);
    if (resolution) {
      return target;
    }
  }

  const fallbacks = reason === 'principal-change'
    ? [
        ...(options?.publicLocation ? [options.publicLocation] : []),
        ...(options?.landingTargets ?? []),
      ]
    : [...(options?.landingTargets ?? [])];

  if (fallbacks.length === 0) {
    return null;
  }

  return router.resolveLanding(
    Object.freeze(fallbacks),
    principal,
  );
}
````

## File: projects/libraries/waypoint/server/server-routing.patch.ts
````typescript
/*
In createServerNavigationResolution(), include the artifact kind in the wire
descriptor:

return Object.freeze({
  kind: artifact.kind,
  artifactKey: artifact.artifactKey,
  moduleUrl,
  hash: artifact.hash,
});

This is the only new server->browser metadata exposed. Authorization, policies,
route-set ownership, consumers and dependency graphs remain server-private.
*/
````

## File: projects/libraries/waypoint/server/server-routing.ts
````typescript
import {
  WAYPOINT_SERVER_DELIVERY_VERSION,
  type ServerArtifactDelivery,
  type ServerNavigationResolution,
} from './server-delivery';

export interface ServerRoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface ServerPrincipal {
  readonly subject: string;
  readonly roles: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;
}

/** Minimal server-side branch provenance needed to authorize artifact code. */
export interface ServerRouteBranch {
  readonly id: string;
  readonly routeSetId?: string;
  readonly policies: readonly ServerRoutePolicy[];
}

/** Minimal compiler artifact metadata needed by the server routing contract. */
export interface ServerArtifactRecord {
  readonly artifactKey: string;
  readonly routeSetId: string;
  readonly dependencies: readonly string[];
  readonly branchIds: readonly string[];
  readonly file?: string;
  readonly hash?: string;
}

export interface ServerArtifactIndex {
  readonly artifacts: readonly ServerArtifactRecord[];
}

export class ServerArtifactResolutionError extends Error {
  constructor(
    public readonly code: 'missing' | 'unavailable' | 'cycle' | 'invalid',
    message: string,
  ) {
    super(message);
    this.name = 'ServerArtifactResolutionError';
  }
}

/** Resolves an artifact and all transitive dependencies in dependency-first order. */
export function resolveServerArtifactChain<T extends ServerArtifactRecord>(
  index: { readonly artifacts: readonly T[] },
  artifactKey: string,
): readonly T[] {
  const byKey = new Map<string, T>();
  for (const artifact of index.artifacts) {
    if (byKey.has(artifact.artifactKey)) {
      throw new ServerArtifactResolutionError(
        'invalid',
        `Duplicate artifact key "${artifact.artifactKey}" in the server index.`,
      );
    }
    byKey.set(artifact.artifactKey, artifact);
  }
  const ordered: T[] = [];
  const completed = new Set<string>();
  const active = new Set<string>();

  const visit = (key: string): void => {
    if (completed.has(key)) return;
    if (active.has(key)) {
      throw new ServerArtifactResolutionError(
        'cycle',
        `Artifact dependency cycle includes "${key}".`,
      );
    }

    const artifact = byKey.get(key);
    if (!artifact) {
      throw new ServerArtifactResolutionError(
        'missing',
        `Artifact "${key}" is missing from the server index.`,
      );
    }
    if (!artifact.file || !artifact.hash) {
      throw new ServerArtifactResolutionError(
        'unavailable',
        `Artifact "${key}" has not been published.`,
      );
    }

    active.add(key);
    for (const dependency of artifact.dependencies) visit(dependency);
    active.delete(key);
    completed.add(key);
    ordered.push(artifact);
  };

  visit(artifactKey);
  return Object.freeze(ordered);
}

export function requiredServerBranchIds(
  artifacts: readonly ServerArtifactRecord[],
): ReadonlySet<string> {
  return new Set(artifacts.flatMap(artifact => artifact.branchIds));
}

export function isServerPolicyAllowed(
  policy: ServerRoutePolicy,
  principal?: ServerPrincipal,
): boolean {
  if (policy.allowAnonymous) return true;
  if (!principal) return false;

  const roles = policy.roles ?? [];
  return (roles.length === 0 || roles.some(role => principal.roles.has(role)))
    && (policy.permissions ?? [])
      .every(permission => principal.permissions.has(permission));
}

/**
 * An artifact is an atomic code-delivery boundary. It is authorized only when
 * every branch whose code it contains belongs to the artifact's route set and
 * every inherited policy on every contained branch is allowed.
 */
export function isServerArtifactAuthorized(
  artifact: ServerArtifactRecord,
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  return artifact.branchIds.length > 0
    && artifact.branchIds.every(branchId => {
      const branch = branches.get(branchId);
      return !!branch
        && branch.routeSetId === artifact.routeSetId
        && branch.policies.every(policy =>
          isServerPolicyAllowed(policy, principal));
    });
}

export function isServerArtifactChainAuthorized(
  artifacts: readonly ServerArtifactRecord[],
  branches: ReadonlyMap<string, ServerRouteBranch>,
  principal?: ServerPrincipal,
): boolean {
  return artifacts.every(artifact =>
    isServerArtifactAuthorized(artifact, branches, principal));
}

/**
 * Converts an already-authorized dependency chain to the public wire contract.
 * No route, slot, policy, branch, source-file, or dependency metadata crosses
 * this boundary.
 */
export function createServerNavigationResolution<T extends ServerArtifactRecord>(
  artifactKey: string,
  artifacts: readonly T[],
  moduleUrlFor: (artifact: T) => string,
): ServerNavigationResolution {
  if (artifacts.length === 0 || !artifacts.some(item => item.artifactKey === artifactKey)) {
    throw new ServerArtifactResolutionError(
      'missing',
      `Artifact delivery plan does not contain requested artifact "${artifactKey}".`,
    );
  }

  const delivery: ServerArtifactDelivery[] = artifacts.map(artifact => {
    if (!artifact.file || !artifact.hash) {
      throw new ServerArtifactResolutionError(
        'unavailable',
        `Artifact "${artifact.artifactKey}" has not been published.`,
      );
    }

    const moduleUrl = moduleUrlFor(artifact);
    if (!moduleUrl.trim()) {
      throw new ServerArtifactResolutionError(
        'unavailable',
        `Artifact "${artifact.artifactKey}" has no delivery URL.`,
      );
    }

    return Object.freeze({
      kind: 'route' as const,
      artifactKey: artifact.artifactKey,
      moduleUrl,
      hash: artifact.hash,
    });
  });

  return Object.freeze({
    version: WAYPOINT_SERVER_DELIVERY_VERSION,
    artifactKey,
    artifacts: Object.freeze(delivery),
  });
}
````

## File: projects/libraries/waypoint/src/lib/adapter-utils.ts
````typescript
import {
  type DestroyRef,
  type EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';

import { ROUTER_LOCATION_CHANGE_EVENT } from './router-events';

export type MaybePromise<T> = T | PromiseLike<T>;

export interface Destroyable {
  destroy(): void;
}

export class ModuleRegistry {
  private readonly refs: Destroyable[] = [];

  add(ref: Destroyable): void {
    this.refs.push(ref);
  }

  dispose(onError: (error: unknown) => void = console.error): void {
    for (let index = this.refs.length - 1; index >= 0; index--) {
      try {
        this.refs[index].destroy();
      } catch (error) {
        onError(error);
      }
    }
    this.refs.length = 0;
  }
}

export function unwrapDefault<T>(value: T | { default: T }): T {
  return value !== null && typeof value === 'object' && 'default' in value
    ? (value as { default: T }).default
    : (value as T);
}

/**
 * Invokes a handler inside Angular's synchronous injection context.
 *
 * The handler may call inject() during its initial synchronous execution.
 * Dependencies needed after an await boundary must be captured before the
 * handler yields, because Angular does not preserve injection context across
 * arbitrary asynchronous continuations.
 */
export function runWithInjector<TContext, TResult>(
  injector: EnvironmentInjector,
  handler: (context: TContext) => MaybePromise<TResult>,
  context: TContext,
): Promise<TResult> {
  return runInInjectionContext(injector, () => Promise.resolve(handler(context)));
}

export function watchRouterLocation(
  destroyRef: DestroyRef,
  refresh: () => void,
): void {
  if (typeof window === 'undefined') {
    return;
  }

  const listener = () => refresh();
  window.addEventListener(ROUTER_LOCATION_CHANGE_EVENT, listener);
  window.addEventListener('popstate', listener);

  destroyRef.onDestroy(() => {
    window.removeEventListener(ROUTER_LOCATION_CHANGE_EVENT, listener);
    window.removeEventListener('popstate', listener);
  });
}
````

## File: projects/libraries/waypoint/src/lib/navigation-commit.ts
````typescript
import type { HistoryUpdate } from './history';
import type {
  ActiveRender,
  NavigationCompletion,
  NavigationResult,
  PreparedOutlet,
} from './navigation-executor';
import type {
  ActivatedRoute,
  Route,
  ViewTransitionContext,
} from './vanilla-router';

export interface NavigationCommitContext {
  readonly disposed: () => boolean;
  readonly latestRequestId: () => number;
  readonly maxRedirects: number;
  readonly currentRoute: () => ActivatedRoute | null;
  readonly setCurrentRoute: (route: ActivatedRoute | null) => void;
  readonly clearPendingState: () => void;
  readonly setError: (error: unknown) => void;

  readonly runWithViewTransition: (
    context: ViewTransitionContext,
    action: () => void,
  ) => void;

  readonly customCommit?: (
    outlets: readonly PreparedOutlet[],
  ) => void;
  readonly render: (
    outletName: string,
    node: Node,
    route: ActivatedRoute,
  ) => void;
  readonly renderPrimary: (
    node: Node,
    route: ActivatedRoute,
  ) => void;
  readonly renderNotFound: (url: URL) => void;
  readonly renderError: (error: unknown, url: URL) => void;
  readonly resolveOutlet: () => HTMLElement | null;
  readonly notifyOutletActivate: (
    outlet: HTMLElement,
    component: unknown,
  ) => void;

  readonly activeRenders: Map<string, ActiveRender>;
  readonly activeRoutes: Map<string, ActivatedRoute>;
  readonly disposeRender: (render: ActiveRender | null) => void;
  readonly replaceActiveRender: (
    outletName: string,
    render: ActiveRender | null,
  ) => void;
  readonly disposeAllRenders: () => void;

  readonly commitHistory: (
    update: HistoryUpdate,
    href: string,
  ) => void;
  readonly rollbackHistory: (
    update: HistoryUpdate,
  ) => void;
  readonly createHistoryUpdate: (
    href: string,
    replace: boolean,
    state: unknown,
  ) => HistoryUpdate;
  readonly readHistoryState: () => unknown;
  readonly writeHistory: (
    href: string,
    replace: boolean,
    state: unknown,
  ) => void;
  readonly dispatchLocationChange: () => void;

  readonly resolveAppUrl: (target: string) => URL;
  readonly currentOrigin: () => string;
  readonly requestNavigation: (
    url: URL,
    redirectCount: number,
    completion: NavigationCompletion,
    historyUpdate: HistoryUpdate,
  ) => void;
  readonly requestExternalNavigation: (
    url: URL,
    completion: NavigationCompletion,
    historyUpdate: HistoryUpdate,
  ) => void;

  readonly restoreActiveUrl: () => void;
  readonly restoreScroll: (update: HistoryUpdate) => void;
  readonly restorePreviousScroll: (update: HistoryUpdate) => void;
  readonly settleRequest: (
    completion: NavigationCompletion,
    success: boolean,
  ) => void;
  readonly notifyStateChange: () => void;
  readonly runAfterEnterTransitions: (
    from: ActivatedRoute | null,
    to: ActivatedRoute,
  ) => void;
  readonly dispatchRouteChange: (route: ActivatedRoute) => void;
  readonly trace: (message: string, ...values: unknown[]) => void;
}

export function commitNavigation(
  result: NavigationResult,
  context: NavigationCommitContext,
): void {
  if (
    context.disposed()
    || result.request.id !== context.latestRequestId()
  ) {
    disposePreparedResult(result);
    return;
  }

  switch (result.type) {
    case 'success':
      commitSuccess(result, context);
      return;

    case 'redirect':
      commitRedirect(result, context);
      return;

    case 'blocked':
      context.restoreActiveUrl();
      context.rollbackHistory(result.request.historyUpdate);
      context.clearPendingState();
      context.setError(null);
      context.trace('Navigation blocked');
      context.restorePreviousScroll(result.request.historyUpdate);
      context.settleRequest(result.request.completion, false);
      context.notifyStateChange();
      return;

    case 'not-found':
      commitNotFound(result, context);
      return;

    case 'error':
      commitError(result, context);
      return;
  }
}

function commitSuccess(
  result: Extract<NavigationResult, { readonly type: 'success' }>,
  context: NavigationCommitContext,
): void {
  const previousRoute = context.currentRoute();

  context.runWithViewTransition({
    url: result.request.url,
    from: previousRoute,
    to: result.route,
    phase: 'success',
    routeConfig: result.route.config,
  }, () => commitPreparedOutlets(result.outlets, context));

  context.commitHistory(
    result.request.historyUpdate,
    hrefOf(result.request.url),
  );
  context.setCurrentRoute(result.route);
  context.clearPendingState();
  context.setError(null);
  context.dispatchRouteChange(result.route);
  context.trace('Navigation completed', result.route.path);
  context.restoreScroll(result.request.historyUpdate);
  context.settleRequest(result.request.completion, true);
  context.notifyStateChange();
  context.runAfterEnterTransitions(previousRoute, result.route);
}

function commitPreparedOutlets(
  outlets: readonly PreparedOutlet[],
  context: NavigationCommitContext,
): void {
  const customCommit = context.customCommit;
  const nextNames = new Set(outlets.map(outlet => outlet.name));

  // A custom group commit remains atomic: old renders stay active until the
  // complete group has committed successfully. The built-in/per-outlet
  // renderer disposes old views first so disposal hooks still observe the
  // view attached to its outlet.
  if (!customCommit) {
    for (const render of context.activeRenders.values()) {
      context.disposeRender(render);
    }
    context.activeRenders.clear();
    context.activeRoutes.clear();
  }

  try {
    if (customCommit) {
      customCommit(outlets);
    } else {
      for (const outlet of outlets) {
        if (outlet.name === '') {
          context.renderPrimary(outlet.node, outlet.route);
        } else {
          context.render(outlet.name, outlet.node, outlet.route);
        }
      }
    }
  } catch (error) {
    for (const outlet of outlets) {
      outlet.rendered.dispose();
    }
    throw error;
  }

  if (customCommit) {
    for (const name of context.activeRenders.keys()) {
      if (!nextNames.has(name)) {
        context.replaceActiveRender(name, null);
        context.activeRoutes.delete(name);
      }
    }
  }

  for (const outlet of outlets) {
    if (customCommit) {
      context.replaceActiveRender(outlet.name, outlet.rendered);
    } else {
      context.activeRenders.set(outlet.name, outlet.rendered);
    }
    context.activeRoutes.set(outlet.name, outlet.route);

    if (!customCommit && outlet.name === '') {
      const target = outlet.node.parentElement ?? context.resolveOutlet();
      if (target) {
        context.notifyOutletActivate(target, outlet.component);
      }
    }
  }
}

function commitRedirect(
  result: Extract<NavigationResult, { readonly type: 'redirect' }>,
  context: NavigationCommitContext,
): void {
  if (result.request.redirectCount >= context.maxRedirects) {
    commitNavigation({
      type: 'error',
      request: result.request,
      error: new Error(
        `Maximum redirect count of ${context.maxRedirects} exceeded`,
      ),
    }, context);
    return;
  }

  const url = context.resolveAppUrl(result.redirectTo);
  if (url.origin !== context.currentOrigin()) {
    context.requestExternalNavigation(
      url,
      result.request.completion,
      result.request.historyUpdate,
    );
    return;
  }

  const href = hrefOf(url);
  const state = context.readHistoryState();
  const update = context.createHistoryUpdate(
    href,
    result.replace,
    state,
  );

  context.writeHistory(href, result.replace, state);
  context.dispatchLocationChange();
  context.requestNavigation(
    url,
    result.request.redirectCount + 1,
    result.request.completion,
    update,
  );
}

function commitNotFound(
  result: Extract<NavigationResult, { readonly type: 'not-found' }>,
  context: NavigationCommitContext,
): void {
  context.runWithViewTransition({
    url: result.request.url,
    from: context.currentRoute(),
    to: null,
    phase: 'not-found',
    routeConfig: null,
  }, () => {
    context.renderNotFound(result.request.url);
    context.disposeAllRenders();
  });

  context.commitHistory(
    result.request.historyUpdate,
    hrefOf(result.request.url),
  );
  context.setCurrentRoute(null);
  context.clearPendingState();
  context.setError(null);
  context.trace('Route not found', result.request.url.pathname);
  context.restoreScroll(result.request.historyUpdate);
  context.settleRequest(result.request.completion, false);
  context.notifyStateChange();
}

function commitError(
  result: Extract<NavigationResult, { readonly type: 'error' }>,
  context: NavigationCommitContext,
): void {
  context.restoreActiveUrl();

  if (!result.preserveActive) {
    context.runWithViewTransition({
      url: result.request.url,
      from: context.currentRoute(),
      to: null,
      phase: 'error',
      routeConfig: null,
      error: result.error,
    }, () => {
      context.renderError(result.error, result.request.url);
      context.disposeAllRenders();
    });
  }

  context.rollbackHistory(result.request.historyUpdate);
  if (!result.preserveActive) {
    context.setCurrentRoute(null);
  }
  context.clearPendingState();
  context.setError(result.error);
  context.trace('Navigation failed', result.error);
  context.restorePreviousScroll(result.request.historyUpdate);
  context.settleRequest(result.request.completion, false);
  context.notifyStateChange();
}

function disposePreparedResult(result: NavigationResult): void {
  if (result.type !== 'success') {
    return;
  }

  for (const outlet of result.outlets) {
    outlet.rendered.dispose();
  }
}

function hrefOf(url: URL): string {
  return url.pathname + url.search + url.hash;
}
````

## File: projects/libraries/waypoint/src/lib/navigation-executor.ts
````typescript
import type { HistoryUpdate } from './history';
import type { RouteRuntime } from './route-runtime';
import {
  recognizeRoute,
  type RouteCatalog,
} from './route-catalog';
import { stripBaseHref } from './router-url';

import type {
  ActivatedRoute,
  GuardResult,
  NavigationContext,
  NavigationPhase,
  NavigationTransitionDefinition,
  NavigationTransitionFn,
  PrepareRouteDataFn,
  RenderableRoute,
  Route,
  RouteData,
  RouteParams,
  RouteQuery,
} from './vanilla-router';

export interface NavigationCompletion {
  settled: boolean;
  resolve(success: boolean): void;
}

export interface NavigationRequest {
  readonly id: number;
  readonly url: URL;
  readonly redirectCount: number;
  readonly completion: NavigationCompletion;
  readonly historyUpdate: HistoryUpdate;
}

export interface ActiveRender {
  readonly controller: AbortController;
  readonly dispose: () => void;
}

export interface PreparedOutlet {
  readonly name: string;
  readonly route: ActivatedRoute;
  readonly node: Node;
  readonly component?: unknown;
  readonly rendered: ActiveRender;
}

export interface NavigationSuccess {
  readonly type: 'success';
  readonly request: NavigationRequest;
  readonly route: ActivatedRoute;
  readonly outlets: readonly PreparedOutlet[];
}

export interface NavigationRedirect {
  readonly type: 'redirect';
  readonly request: NavigationRequest;
  readonly redirectTo: string;
  readonly replace: boolean;
}

export interface NavigationBlocked {
  readonly type: 'blocked';
  readonly request: NavigationRequest;
}

export interface NavigationNotFound {
  readonly type: 'not-found';
  readonly request: NavigationRequest;
}

export interface NavigationFailure {
  readonly type: 'error';
  readonly request: NavigationRequest;
  readonly error: unknown;
  readonly preserveActive?: boolean;
}

export type NavigationResult =
  | NavigationSuccess
  | NavigationRedirect
  | NavigationBlocked
  | NavigationNotFound
  | NavigationFailure;

export class RoutePreparationError extends Error {
  constructor(
    readonly originalError: unknown,
    readonly preserveActive: boolean,
  ) {
    super(
      originalError instanceof Error
        ? originalError.message
        : String(originalError),
      { cause: originalError },
    );
    this.name = 'RoutePreparationError';
  }
}

export interface CanDeactivateEvaluationContext {
  readonly activeRoutes: readonly ActivatedRoute[];
  readonly loadRoute: (route: RenderableRoute) => Promise<RouteRuntime>;
  readonly resolveAppUrl: (target: string) => URL;
  readonly warn: (message: string, ...values: unknown[]) => void;
}

export interface NavigationExecutionContext
  extends CanDeactivateEvaluationContext {
  readonly catalog: RouteCatalog;
  readonly baseHref: string;
  readonly currentRoute: ActivatedRoute | null;
  readonly runTransitionPhase: (
    phase: keyof Pick<
      NavigationTransitionDefinition,
      'beforeEnter' | 'prepare' | 'beforeLeave'
    >,
    from: ActivatedRoute | null,
    to: ActivatedRoute,
    signal: AbortSignal,
  ) => Promise<GuardResult>;
  readonly setPhase: (
    request: NavigationRequest,
    phase: NavigationPhase,
  ) => void;
  readonly trace: (message: string, ...values: unknown[]) => void;
}

const EMPTY_DATA: RouteData = Object.freeze({});

export async function executeNavigation(
  request: NavigationRequest,
  signal: AbortSignal,
  context: NavigationExecutionContext,
): Promise<NavigationResult> {
  context.trace('Navigation started', request.url.href);
  context.setPhase(request, 'recognizing');

  const path = stripBaseHref(
    request.url.pathname,
    context.baseHref,
  );
  const match = recognizeRoute(context.catalog, path);
  throwIfAborted(signal);

  if (!match) {
    context.setPhase(request, 'guarding');
    const result = await evaluateCanDeactivate(
      request.url,
      signal,
      context,
    );

    if (result === false) {
      return { type: 'blocked', request };
    }

    const redirect = readRedirect(result);
    return redirect
      ? { type: 'redirect', request, ...redirect }
      : { type: 'not-found', request };
  }

  const primaryRoute = match.route;

  if (isRedirectRoute(primaryRoute)) {
    return {
      type: 'redirect',
      request,
      redirectTo: interpolateRedirect(
        primaryRoute.redirectTo,
        match.params,
      ),
      replace: true,
    };
  }

  const routes: readonly RenderableRoute[] = [
    primaryRoute,
    ...(primaryRoute.outlets ?? []),
  ];
  const historyState =
    request.historyUpdate.nextEntry?.state
    ?? request.historyUpdate.previousEntry?.state
    ?? null;

  let loadedRoutes: RouteRuntime[];
  try {
    loadedRoutes = await Promise.all(
      routes.map(context.loadRoute),
    );
  } catch (error) {
    throw new RoutePreparationError(
      error,
      context.currentRoute !== null && routes.length > 1,
    );
  }
  throwIfAborted(signal);

  validateOutletParsers(routes, loadedRoutes);

  const primaryLoaded = loadedRoutes[0];
  const [parsedParams, parsedQuery] = await Promise.all([
    primaryLoaded.parseParams
      ? primaryLoaded.parseParams(match.params, request.url, signal)
      : Promise.resolve(
          Object.freeze({ ...match.params }) as RouteParams,
        ),
    primaryLoaded.parseQuery
      ? primaryLoaded.parseQuery(request.url, signal)
      : Promise.resolve(readRawQuery(request.url)),
  ]);
  throwIfAborted(signal);

  const sharedParams = Object.freeze({ ...parsedParams });
  const sharedQuery = Object.freeze({ ...parsedQuery });
  const baseRoutes = routes.map<ActivatedRoute>(route => ({
    url: request.url,
    path,
    params: sharedParams,
    query: sharedQuery,
    data: Object.freeze(route.data ?? {}),
    historyState,
    config: route,
  }));

  context.setPhase(request, 'guarding');

  const transitionResult = await runRouteGuards(
    request,
    signal,
    context,
    baseRoutes,
    loadedRoutes,
  );
  if (transitionResult) {
    return transitionResult;
  }

  context.setPhase(request, 'resolving');
  const activatedRoutes = await prepareRoutes(
    baseRoutes,
    loadedRoutes,
    signal,
  );

  context.setPhase(request, 'loading');
  const outlets = await renderRoutes(
    activatedRoutes,
    loadedRoutes,
    signal,
    context.currentRoute !== null && routes.length > 1,
  );

  return {
    type: 'success',
    request,
    route: activatedRoutes[0],
    outlets,
  };
}

async function runRouteGuards(
  request: NavigationRequest,
  signal: AbortSignal,
  context: NavigationExecutionContext,
  baseRoutes: readonly ActivatedRoute[],
  loadedRoutes: readonly RouteRuntime[],
): Promise<NavigationRedirect | NavigationBlocked | null> {
  const beforeLeave = await context.runTransitionPhase(
    'beforeLeave',
    context.currentRoute,
    baseRoutes[0],
    signal,
  );
  const first = guardResult(request, beforeLeave);
  if (first) return first;

  const deactivation = await evaluateCanDeactivate(
    request.url,
    signal,
    context,
  );
  const second = guardResult(request, deactivation);
  if (second) return second;

  const beforeEnter = await context.runTransitionPhase(
    'beforeEnter',
    context.currentRoute,
    baseRoutes[0],
    signal,
  );
  const third = guardResult(request, beforeEnter);
  if (third) return third;

  for (let index = 0; index < loadedRoutes.length; index++) {
    const routeContext: NavigationContext = {
      ...baseRoutes[index],
      signal,
    };

    for (const guard of loadedRoutes[index].canActivate ?? []) {
      const result = await guard(routeContext);
      throwIfAborted(signal);
      const guarded = guardResult(request, result);
      if (guarded) return guarded;
    }
  }

  const prepare = await context.runTransitionPhase(
    'prepare',
    context.currentRoute,
    baseRoutes[0],
    signal,
  );
  return guardResult(request, prepare);
}

export async function evaluateCanDeactivate(
  nextUrl: URL,
  signal: AbortSignal,
  context: CanDeactivateEvaluationContext,
): Promise<GuardResult> {
  for (const activeRoute of context.activeRoutes) {
    const route = requireRenderableRoute(activeRoute.config);
    const loaded = await context.loadRoute(route);
    throwIfAborted(signal);

    for (const guard of loaded.canDeactivate ?? []) {
      const result = await guard({
        ...activeRoute,
        nextUrl,
        signal,
      });
      throwIfAborted(signal);

      const redirect = readRedirect(result);
      if (redirect) {
        const redirectUrl = context.resolveAppUrl(redirect.redirectTo);
        if (redirectUrl.href === nextUrl.href) {
          context.warn(
            'Ignoring canDeactivate redirect to the pending URL',
            redirect.redirectTo,
          );
          continue;
        }
        return redirect;
      }

      if (result === false) return false;
    }
  }

  return true;
}

async function prepareRoutes(
  baseRoutes: readonly ActivatedRoute[],
  loadedRoutes: readonly RouteRuntime[],
  signal: AbortSignal,
): Promise<readonly ActivatedRoute[]> {
  const prepared = new WeakMap<
    PrepareRouteDataFn,
    Promise<RouteData>
  >();

  return Promise.all(
    baseRoutes.map(async (baseRoute, index) => {
      const routeContext: NavigationContext = {
        ...baseRoute,
        signal,
      };
      const data = mergeRouteData(
        await Promise.all(
          (loadedRoutes[index].prepare ?? []).map(handler => {
            let pending = prepared.get(handler);
            if (!pending) {
              pending = Promise.resolve(handler(routeContext))
                .then(normalizePreparedRouteData);
              prepared.set(handler, pending);
            }
            return pending;
          }),
        ),
      );
      throwIfAborted(signal);

      return {
        ...baseRoute,
        data: mergeRouteData([baseRoute.data, data]),
      };
    }),
  );
}

async function renderRoutes(
  routes: readonly ActivatedRoute[],
  loadedRoutes: readonly RouteRuntime[],
  signal: AbortSignal,
  preserveActive: boolean,
): Promise<readonly PreparedOutlet[]> {
  const prepared: PreparedOutlet[] = [];

  try {
    for (let index = 0; index < routes.length; index++) {
      const route = routes[index];
      const rendered = await renderMatchedRoute(
        route,
        loadedRoutes[index],
        signal,
      );
      prepared.push({
        name: route.config.outlet?.trim() ?? '',
        route,
        ...rendered,
      });
    }
  } catch (error) {
    for (let index = prepared.length - 1; index >= 0; index--) {
      try {
        prepared[index].rendered.dispose();
      } catch {}
    }
    throw new RoutePreparationError(error, preserveActive);
  }

  return Object.freeze(prepared);
}

async function renderMatchedRoute(
  route: ActivatedRoute,
  loaded: RouteRuntime,
  signal: AbortSignal,
): Promise<{
  readonly node: Node;
  readonly component?: unknown;
  readonly rendered: ActiveRender;
}> {
  const destroyController = new AbortController();
  let output:
    | {
        readonly node: Node;
        readonly dispose?: () => void;
        readonly component?: unknown;
      }
    | undefined;

  const abortPreparedRender = () => {
    destroyController.abort();
  };

  throwIfAborted(signal);

  if (!loaded.component) {
    throw new Error(
      `Matched route "${route.config.path}" has no component`,
    );
  }

  // A component can perform asynchronous rendering. Propagate cancellation to
  // its destroySignal immediately instead of waiting for the component promise
  // to settle and for renderRoutes() to clean up earlier outlets.
  signal.addEventListener(
    'abort',
    abortPreparedRender,
    { once: true },
  );

  try {
    const value = await loaded.component(route, {
      signal,
      destroySignal: destroyController.signal,
    });

    output = isRenderedRouteNode(value)
      ? value
      : { node: value };

    throwIfAborted(signal);

    // Once preparation succeeds, navigation cancellation no longer owns this
    // render. Its lifetime is transferred to the prepared/active render.
    signal.removeEventListener(
      'abort',
      abortPreparedRender,
    );

    let disposed = false;

    return {
      node: output.node,
      component: output.component,
      rendered: {
        controller: destroyController,
        dispose: () => {
          if (disposed) {
            return;
          }

          disposed = true;
          destroyController.abort();
          output?.dispose?.();
        },
      },
    };
  } catch (error) {
    signal.removeEventListener(
      'abort',
      abortPreparedRender,
    );

    destroyController.abort();
    output?.dispose?.();

    throw error;
  }
}

function validateOutletParsers(
  routes: readonly RenderableRoute[],
  loadedRoutes: readonly RouteRuntime[],
): void {
  for (let index = 1; index < loadedRoutes.length; index++) {
    if (loadedRoutes[index].parseParams || loadedRoutes[index].parseQuery) {
      throw new Error(
        `Outlet "${routes[index].outlet}" cannot define parseParams or parseQuery`,
      );
    }
  }
}

function guardResult(
  request: NavigationRequest,
  result: GuardResult | void,
): NavigationRedirect | NavigationBlocked | null {
  const redirect = readRedirect(result);
  if (redirect) {
    return { type: 'redirect', request, ...redirect };
  }
  return result === false
    ? { type: 'blocked', request }
    : null;
}

function readRedirect(
  result: GuardResult | void,
): { readonly redirectTo: string; readonly replace: boolean } | null {
  if (typeof result === 'string') {
    return { redirectTo: result, replace: true };
  }
  if (result && typeof result === 'object' && 'redirectTo' in result) {
    return {
      redirectTo: result.redirectTo,
      replace: result.replace ?? true,
    };
  }
  return null;
}

function interpolateRedirect(
  redirectTo: string,
  params: Readonly<Record<string, string>>,
): string {
  return redirectTo.replace(
    /:([A-Za-z0-9_]+)/g,
    (_, key: string) => {
      if (!(key in params)) {
        throw new Error(
          `Missing route parameter "${key}" for redirect "${redirectTo}"`,
        );
      }
      return encodeURIComponent(params[key]);
    },
  );
}

function readRawQuery(url: URL): RouteQuery {
  const values: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    values[key] = value;
  });
  return Object.freeze(values);
}

function normalizePreparedRouteData(
  value: void | RouteData,
): RouteData {
  if (value === undefined) return EMPTY_DATA;
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      'Route prepare handlers must return an object or void.',
    );
  }
  return Object.freeze({ ...value });
}

function mergeRouteData(
  entries: readonly RouteData[],
): RouteData {
  return entries.length === 0
    ? EMPTY_DATA
    : Object.freeze(Object.assign({}, ...entries));
}

function isRedirectRoute(
  route: Route,
): route is Route & { readonly redirectTo: string } {
  return route.kind === 'redirect'
    || typeof route.redirectTo === 'string';
}

function isRenderedRouteNode(
  value: unknown,
): value is {
  readonly node: Node;
  readonly dispose?: () => void;
  readonly component?: unknown;
} {
  return value !== null
    && typeof value === 'object'
    && 'node' in value;
}

function requireRenderableRoute(
  route: ActivatedRoute['config'],
): RenderableRoute {
  if (
    route.kind === 'redirect'
    || typeof route.redirectTo === 'string'
  ) {
    throw new Error(
      `Active route "${route.path}" cannot be a redirect route.`,
    );
  }

  return route;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    throw new DOMException('Navigation aborted', 'AbortError');
  }
}
````

## File: projects/libraries/waypoint/src/lib/navigation-targets.ts
````typescript
export type PathNavigationTarget = {
  readonly path: string | URL;
};

export type NamedNavigationTarget<
  TName extends string = string,
  TParams = Record<string, unknown>,
  TQuery = Record<string, unknown>,
> = {
  readonly name: TName;
  readonly params?: TParams;
  readonly query?: TQuery;
};

/**
 * A discriminated union representing a navigation target.
 * Can be a raw URL string, a URL object, or an object specifying
 * a path or a named route with parameters.
 */
export type NavigationTarget =
  | string
  | URL
  | PathNavigationTarget
  | NamedNavigationTarget;
````

## File: projects/libraries/waypoint/src/lib/route-catalog.ts
````typescript
import {
  compileRoutePath,
  matchRoutePath,
  splitRoutePath,
} from './route-path';

import type { Route } from './vanilla-router';

export type RawRouteParams =
  Readonly<Record<string, string>>;

export interface RouteMatch {
  readonly route: Route;
  readonly params: RawRouteParams;
}

/**
 * Compiled matching behavior for one route definition.
 *
 * A matcher owns its route and returns the complete recognition result. The
 * concrete matching representation remains private to this module.
 */
export interface RouteMatcher {
  readonly route: Route;

  match(
    segments: readonly string[],
  ): RouteMatch | null;
}

/** Immutable, versioned snapshot of the router's currently known routes. */
export interface RouteCatalog {
  readonly version: number;
  readonly matchers: readonly RouteMatcher[];
}

export function createRouteCatalog(
  routes: readonly Route[],
): RouteCatalog {
  validateRouteGroups(routes);

  return Object.freeze({
    version: 0,
    matchers: compileRouteMatchers(routes),
  });
}

export function readCatalogRoutes(
  catalog: RouteCatalog,
): readonly Route[] {
  return Object.freeze(
    catalog.matchers.map(
      matcher => matcher.route,
    ),
  );
}

export function appendCatalogRoutes(
  catalog: RouteCatalog,
  routes: readonly Route[],
): RouteCatalog {
  if (routes.length === 0) {
    return catalog;
  }

  const nextRoutes = [
    ...readCatalogRoutes(catalog),
    ...routes,
  ];

  validateRouteGroups(nextRoutes);

  return Object.freeze({
    version: catalog.version + 1,
    matchers: Object.freeze([
      ...catalog.matchers,
      ...compileRouteMatchers(routes),
    ]),
  });
}

export function replaceCatalogRoutes(
  catalog: RouteCatalog,
  routes: readonly Route[],
): RouteCatalog {
  if (sameRouteReferences(catalog, routes)) {
    return catalog;
  }

  validateRouteGroups(routes);

  return Object.freeze({
    version: catalog.version + 1,
    matchers: compileRouteMatchers(routes),
  });
}

export function removeCatalogRoutes(
  catalog: RouteCatalog,
  predicate: (route: Route) => boolean,
): RouteCatalog {
  const nextRoutes = readCatalogRoutes(catalog)
    .filter(route => !predicate(route));

  if (nextRoutes.length === catalog.matchers.length) {
    return catalog;
  }

  validateRouteGroups(nextRoutes);

  return Object.freeze({
    version: catalog.version + 1,
    matchers: compileRouteMatchers(nextRoutes),
  });
}

/**
 * Recognizes one complete application path.
 *
 * Wildcard routes remain fallbacks and are selected only when no concrete
 * matcher succeeds.
 */
export function recognizeRoute(
  catalog: RouteCatalog,
  path: string,
): RouteMatch | null {
  const segments = splitRoutePath(path);
  let fallback: RouteMatcher | undefined;

  for (const matcher of catalog.matchers) {
    const path = matcher.route.path;

    if (path === '*' || path === '**') {
      fallback = matcher;
      continue;
    }

    const match = matcher.match(segments);

    if (match) {
      return match;
    }
  }

  return fallback
    ? Object.freeze({
        route: fallback.route,
        params: Object.freeze({}),
      })
    : null;
}

function createRouteMatcher(
  route: Route,
): RouteMatcher {
  let compiledPath: string | null = null;
  let compiled: ReturnType<typeof compileRoutePath> | null = null;

  return Object.freeze({
    route,

    match(
      segments: readonly string[],
    ): RouteMatch | null {
      const currentPath = route.path;

      // Wildcards are selected by recognizeRoute() only after every concrete
      // route has failed. Keeping that decision outside the matcher preserves
      // fallback ordering even when a route path is mutated at runtime.
      if (currentPath === '*' || currentPath === '**') {
        return null;
      }

      // Route definitions historically allow path mutation. Refresh the
      // compiled matcher only when the path value changes, preserving the old
      // cached-pattern behavior without recompiling on every navigation.
      if (compiled === null || compiledPath !== currentPath) {
        compiledPath = currentPath;
        compiled = compileRoutePath(currentPath);
      }

      const params = matchRoutePath(
        compiled,
        segments,
      );

      return params
        ? Object.freeze({
            route,
            params,
          })
        : null;
    },
  });
}

function compileRouteMatchers(
  routes: readonly Route[],
): readonly RouteMatcher[] {
  return Object.freeze(
    routes.map(createRouteMatcher),
  );
}

function sameRouteReferences(
  catalog: RouteCatalog,
  routes: readonly Route[],
): boolean {
  return (
    catalog.matchers.length === routes.length
    && catalog.matchers.every(
      (matcher, index) =>
        matcher.route === routes[index],
    )
  );
}

function validateRouteGroups(
  routes: readonly Route[],
): void {
  const primaryPaths = new Set<string>();

  for (const primary of routes) {
    const primaryOutlet =
      primary.outlet?.trim() ?? '';

    if (primaryOutlet) {
      throw new Error(
        `Top-level route "${primary.path}" must target the primary outlet`,
      );
    }

    if (primaryPaths.has(primary.path)) {
      throw new Error(
        `Duplicate primary route path "${primary.path}"`,
      );
    }

    primaryPaths.add(primary.path);

    const outletNames = new Set<string>();

    for (const outlet of primary.outlets ?? []) {
      const name = outlet.outlet?.trim() ?? '';

      if (!name) {
        throw new Error(
          `Secondary route for "${primary.path}" must define a named outlet`,
        );
      }

      if (outletNames.has(name)) {
        throw new Error(
          `Duplicate outlet "${name}" for route "${primary.path}"`,
        );
      }

      outletNames.add(name);

      if (outlet.path !== primary.path) {
        throw new Error(
          `Outlet "${name}" must use the primary path "${primary.path}"`,
        );
      }

      if (outlet.outlets?.length) {
        throw new Error(
          `Outlet "${name}" cannot contain nested outlets`,
        );
      }

      if (outlet.redirectTo) {
        throw new Error(
          `Outlet "${name}" cannot redirect`,
        );
      }

      if (outlet.name) {
        throw new Error(
          `Outlet "${name}" cannot define a route name`,
        );
      }

      if (outlet.preload !== undefined) {
        throw new Error(
          `Outlet "${name}" cannot define preload; the primary route owns group preloading`,
        );
      }

      if (outlet.viewTransition !== undefined) {
        throw new Error(
          `Outlet "${name}" cannot define viewTransition; the primary route owns the transition`,
        );
      }
    }

    if (primary.redirectTo && outletNames.size > 0) {
      throw new Error(
        `Redirect route "${primary.path}" cannot activate named outlets`,
      );
    }
  }
}
````

## File: projects/libraries/waypoint/src/lib/route-runtime.ts
````typescript
import type {
  CanActivateFn,
  CanDeactivateFn,
  ParseRouteParams,
  ParseRouteQuery,
  PrepareRouteDataFn,
  RedirectRoute,
  RenderableRoute,
  Route,
} from './vanilla-router';

/** Runtime capabilities resolved from a renderable route definition. */
export interface RouteRuntime {
  readonly component?: import('./vanilla-router').RouteComponent;
  readonly canActivate?: readonly CanActivateFn[];
  readonly canDeactivate?: readonly CanDeactivateFn[];
  readonly prepare?: readonly PrepareRouteDataFn[];
  readonly parseParams?: ParseRouteParams;
  readonly parseQuery?: ParseRouteQuery;
}

const routeRuntimeCache = new WeakMap<RenderableRoute, Promise<RouteRuntime>>();

export function prepareRouteRuntime(
  route: RenderableRoute,
): Promise<RouteRuntime> {
  let pending = routeRuntimeCache.get(route);

  if (!pending) {
    pending = Promise
      .resolve(
        route.load?.() ?? {},
      )
      .then(runtime => Object.freeze({
        component: runtime.component,
        canActivate: runtime.canActivate,
        canDeactivate: runtime.canDeactivate,
        prepare: runtime.prepare ?? route.prepare,
        parseParams: runtime.parseParams,
        parseQuery: runtime.parseQuery,
      }))
      .catch(error => {
        routeRuntimeCache.delete(route);
        throw error;
      });

    routeRuntimeCache.set(route, pending);
  }

  return pending;
}

export async function preloadRouteCatalog(
  routes: readonly Route[],
  trace: (message: string, ...values: unknown[]) => void,
): Promise<void> {
  for (const route of routes) {
    if (isRedirectRoute(route) || route.preload === false) {
      continue;
    }

    const group: readonly RenderableRoute[] = [
      route,
      ...(route.outlets ?? []),
    ];

    for (const member of group) {
      try {
        const runtime = await prepareRouteRuntime(member);

        if (
          member !== route
          && (runtime.parseParams || runtime.parseQuery)
        ) {
          throw new Error(
            `Outlet "${member.outlet}" cannot define parseParams or parseQuery`,
          );
        }
      } catch (error) {
        trace(
          'Route preload failed',
          member.path,
          member.outlet ?? '',
          error,
        );
      }
    }
  }
}

function isRedirectRoute(
  route: Route,
): route is RedirectRoute {
  return (
    route.kind === 'redirect'
    || typeof route.redirectTo === 'string'
  );
}
````

## File: projects/libraries/waypoint/src/lib/router-contract.ts
````typescript
import { InjectionToken } from '@angular/core';

import type { NavigationTarget } from './navigation-targets';
import type { NavigationTree } from './navigation-definitions';
import type { TypedHref, TypedNavigate } from './typed-navigation';
import type {
  ActivatedRoute,
  NavigationOptions,
  RouteRenderContext,
  RouterState,
} from './vanilla-router';

export interface RouterRevalidationOptions {
  /**
   * Removes every route and contribution previously installed through
   * server-driven resolution before revalidating the current URL.
   */
  readonly resetResolvedRoutes?: boolean;
}

export type RouterReloadReason =
  | 'reset'
  | 'principal-change';

export interface RouterReloadOptions {
  /**
   * `reset` preserves the current principal while replacing the current
   * browser realm. `principal-change` first crosses the server-controlled
   * principal boundary before the new document is loaded.
   */
  readonly reason?: RouterReloadReason;

  /**
   * Preferred destination after the new document is authorized. The server
   * still validates and may replace this destination.
   */
  readonly target?: string;
}

export class RouterReloadError extends Error {
  constructor(public readonly status: number) {
    super(`Failed to reload the current Waypoint realm: ${status}.`);
    this.name = 'RouterReloadError';
  }
}

export const ROUTE = new InjectionToken<ActivatedRoute>('ROUTE');

export const ROUTE_CONTEXT = new InjectionToken<RouteRenderContext>('ROUTE_CONTEXT');

export abstract class Router<TRoutes extends NavigationTree = any> {
  abstract get active(): boolean;
  abstract get state(): RouterState;
  abstract get displayUrl(): string;

  abstract readonly navigateTo: TypedNavigate<TRoutes>;
  abstract readonly hrefTo: TypedHref<TRoutes>;

  abstract connect(name: string, outlet: HTMLElement): void;
  abstract disconnect(name: string, outlet: HTMLElement): void;
  abstract navigate(
    target: NavigationTarget,
    options?: NavigationOptions,
  ): Promise<boolean>;
  abstract href(target: NavigationTarget | null | undefined): string | null;
  abstract revalidate(options?: RouterRevalidationOptions): Promise<boolean>;
  abstract reload(options?: RouterReloadOptions): Promise<never>;
  abstract updateHistoryState(state: unknown): void;
  abstract preload(): Promise<void>;
  abstract dispose(): void;
}
````

## File: projects/libraries/waypoint/src/lib/router-url.ts
````typescript
export type RouterUrlMode = 'navigate' | 'href';

const SERVER_LOCATION = {
  origin: 'http://localhost',
  pathname: '/',
  search: '',
  hash: '',
  href: 'http://localhost/',
} satisfies Pick<Location, 'origin' | 'pathname' | 'search' | 'hash' | 'href'>;

export function getRouterLocation(
  document: Pick<Document, 'location'> | null | undefined,
): Pick<Location, 'origin' | 'pathname' | 'search' | 'hash' | 'href'> {
  return document?.location ?? SERVER_LOCATION;
}

export function normalizePath(path: string): string {
  const normalized = `/${path}`.replace(/\/+/g, '/');
  return normalized.length > 1 && normalized.endsWith('/')
    ? normalized.slice(0, -1)
    : normalized;
}

export function normalizeBaseHref(value: string): string {
  return normalizePath(value.trim() || '/');
}

export function isPathInsideBase(pathname: string, baseHref: string): boolean {
  const base = normalizeBaseHref(baseHref);
  const path = normalizePath(pathname);
  return base === '/' || path === base || path.startsWith(`${base}/`);
}

export function stripBaseHref(pathname: string, baseHref: string): string {
  const base = normalizeBaseHref(baseHref);
  const path = normalizePath(pathname);
  if (base === '/' || !isPathInsideBase(path, base)) return path;
  return normalizePath(path.slice(base.length));
}

export function applyBaseHref(pathname: string, baseHref: string): string {
  const base = normalizeBaseHref(baseHref);
  const path = normalizePath(pathname);
  if (base === '/' || isPathInsideBase(path, base)) return path;
  return path === '/' ? base : normalizePath(`${base}/${path.slice(1)}`);
}

export function resolveRouterUrl(
  target: string | URL,
  baseHref: string,
  location: Pick<Location, 'origin' | 'pathname' | 'href'>,
  mode: RouterUrlMode,
): URL {
  if (target instanceof URL) return target;

  const value = String(target);
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return new URL(value);
  if (value.startsWith('?') || value.startsWith('#')) {
    return new URL(value, location.href);
  }

  const base = normalizeBaseHref(baseHref);
  if (value.startsWith('/')) {
    const url = new URL(value, location.origin);
    if (mode === 'href') url.pathname = applyBaseHref(url.pathname, base);
    return url;
  }

  const relativeBase = isPathInsideBase(location.pathname, base)
    ? location.href
    : `${location.origin}${base}/`;
  return new URL(value, relativeBase);
}

export function routerHref(url: URL): string {
  return `${url.pathname}${url.search}${url.hash}`;
}
````

## File: projects/libraries/waypoint/src/lib/server-host-runtime.ts
````typescript
export * from '../../server/server-host-runtime';
````

## File: projects/libraries/waypoint/src/tests/angular-testbed.init.ts
````typescript
import {
  TestBed,
  getTestBed,
} from '@angular/core/testing';

import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

export function ensureAngularTestEnvironment(): void {
  const testBed = getTestBed() as {
    platform: unknown | null;
  };

  if (testBed.platform) {
    return;
  }

  TestBed.initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),
  );
}

ensureAngularTestEnvironment();
````

## File: projects/libraries/waypoint/src/tests/env.spec.ts
````typescript
// Avoid a hard dependency on Node ambient types in browser-focused specs.
const processLike = (globalThis as { process?: { versions?: { node?: unknown } } }).process;

const isNode =
  processLike != null &&
  processLike.versions != null &&
  processLike.versions.node != null;

const isBrowser =
  typeof window !== "undefined" &&
  typeof window.document !== "undefined";

// Suite-level wrappers (describe only accepts sync functions)
/**
 * Function ndescribe.
 */
export function ndescribe(name: string, fn: () => void) {
  return isNode ? describe(name, fn) : xdescribe(name, fn);
}

/**
 * Function idescribe.
 */
export function idescribe(name: string, fn: () => void) {
  return isBrowser ? describe(name, fn) : xdescribe(name, fn);
}

// Spec-level wrappers (it allows async callbacks with DoneFn)
/**
 * Function nit.
 */
export function nit(name: string, fn: jasmine.ImplementationCallback) {
  return isNode ? it(name, fn) : xit(name, fn);
}

/**
 * Function iit.
 */
export function iit(name: string, fn: jasmine.ImplementationCallback) {
  return isBrowser ? it(name, fn) : xit(name, fn);
}

// Export environment flags too
export { isBrowser, isNode };

describe('test environment helpers', () => {
  it('loads helper wrappers', () => {
    expect(true).toBeTrue();
  });
});
````

## File: projects/libraries/waypoint/src/tests/history-manager-deep.spec.ts
````typescript
import {
  HistoryManager,
  ZERO_SCROLL,
  type HistoryUpdate,
} from '../lib/history';

interface BrowserHarness {
  readonly history: {
    state: unknown;
  };
  scrollX: number;
  scrollY: number;
}

function createHarness(
  href = '/',
  state: unknown = null,
): {
  readonly browser: BrowserHarness;
  readonly location: {
    pathname: string;
    search: string;
    hash: string;
  };
  readonly manager: HistoryManager;
} {
  const url = new URL(href, 'https://example.test');
  const browser: BrowserHarness = {
    history: { state },
    scrollX: 0,
    scrollY: 0,
  };
  const location = {
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
  };

  return {
    browser,
    location,
    manager: new HistoryManager(
      browser as unknown as Window,
      location as Location,
    ),
  };
}

describe('HistoryManager deep behavior', () => {
  it('creates one stable initial entry', () => {
    const { manager } = createHarness(
      '/start?tab=one#details',
      { initial: true },
    );

    const first = manager.createDefaultUpdate();
    const second = manager.createDefaultUpdate();

    expect(first.previousEntry)
      .toEqual(second.previousEntry);
    expect(first.previousEntry?.href)
      .toBe('/start?tab=one#details');
    expect(first.previousEntry?.state)
      .toEqual({ initial: true });
    expect(first.previousIndex).toBe(0);
    expect(first.nextIndex).toBe(0);
  });

  it('captures the current scroll before creating a push update', () => {
    const { browser, manager } =
      createHarness('/first');

    manager.createDefaultUpdate();
    browser.scrollX = 30;
    browser.scrollY = 140;

    const update = manager.createUpdate(
      '/second',
      false,
      { page: 2 },
    );

    expect(update.type).toBe('push');
    expect(update.previousScroll)
      .toEqual({ x: 30, y: 140 });
    expect(update.nextEntry?.scroll)
      .toBe(ZERO_SCROLL);
    expect(update.nextEntry?.state)
      .toEqual({ page: 2 });
  });

  it('commits a push update as the current entry', () => {
    const { manager } = createHarness('/first');
    manager.createDefaultUpdate();

    const update = manager.createUpdate(
      '/second',
      false,
      { page: 2 },
    );
    manager.commitUpdate(update, '/second');

    const current = manager.createDefaultUpdate();

    expect(current.previousIndex).toBe(1);
    expect(current.previousEntry?.href)
      .toBe('/second');
    expect(current.previousEntry?.state)
      .toEqual({ page: 2 });
  });

  it('rolls a pending push back to the previous entry', () => {
    const { manager } = createHarness('/first');
    manager.createDefaultUpdate();

    const update = manager.createUpdate(
      '/second',
      false,
      null,
    );
    manager.rollbackUpdate(update);

    const current = manager.createDefaultUpdate();

    expect(current.previousIndex).toBe(0);
    expect(current.previousEntry?.href)
      .toBe('/first');
  });

  it('preserves the entry id when replacing', () => {
    const { manager } = createHarness('/first');
    const initial =
      manager.createDefaultUpdate()
        .previousEntry!;

    const update = manager.createUpdate(
      '/replacement',
      true,
      { replaced: true },
    );

    expect(update.type).toBe('replace');
    expect(update.nextEntry?.id)
      .toBe(initial.id);

    manager.commitUpdate(
      update,
      '/replacement',
    );

    expect(
      manager.createDefaultUpdate()
        .previousEntry?.id,
    ).toBe(initial.id);
  });

  it('restores the previous entry when replacement is rolled back', () => {
    const { manager } = createHarness(
      '/first',
      { original: true },
    );
    manager.createDefaultUpdate();

    const update = manager.createUpdate(
      '/replacement',
      true,
      { replacement: true },
    );
    manager.rollbackUpdate(update);

    const current =
      manager.createDefaultUpdate()
        .previousEntry;

    expect(current?.href).toBe('/first');
    expect(current?.state)
      .toEqual({ original: true });
  });

  it('truncates forward entries after a new push branch', () => {
    const { manager } = createHarness('/a');
    manager.createDefaultUpdate();

    const toB = manager.createUpdate(
      '/b',
      false,
      null,
    );
    manager.commitUpdate(toB, '/b');

    const toC = manager.createUpdate(
      '/c',
      false,
      null,
    );
    manager.commitUpdate(toC, '/c');

    const backToB =
      manager.createPopStateUpdate('/b');
    manager.commitUpdate(backToB, '/b');

    const branch = manager.createUpdate(
      '/d',
      false,
      null,
    );
    manager.commitUpdate(branch, '/d');

    const unknownForward =
      manager.createPopStateUpdate('/c');

    expect(unknownForward.nextIndex)
      .not.toBe(2);
    expect(
      manager.createDefaultUpdate()
        .previousEntry?.href,
    ).toBe('/d');
  });

  it('resolves adjacent backward popstate entries', () => {
    const { manager } = createHarness('/a');
    manager.createDefaultUpdate();

    const toB = manager.createUpdate(
      '/b',
      false,
      null,
    );
    manager.commitUpdate(toB, '/b');

    const update =
      manager.createPopStateUpdate('/a');

    expect(update.type).toBe('popstate');
    expect(update.previousIndex).toBe(1);
    expect(update.nextIndex).toBe(0);
    expect(update.nextEntry?.href).toBe('/a');
  });

  it('resolves adjacent forward popstate entries', () => {
    const { manager } = createHarness('/a');
    manager.createDefaultUpdate();

    const toB = manager.createUpdate(
      '/b',
      false,
      null,
    );
    manager.commitUpdate(toB, '/b');

    const back =
      manager.createPopStateUpdate('/a');
    manager.commitUpdate(back, '/a');

    const forward =
      manager.createPopStateUpdate('/b');

    expect(forward.previousIndex).toBe(0);
    expect(forward.nextIndex).toBe(1);
    expect(forward.nextEntry?.href).toBe('/b');
  });

  it('chooses the nearest duplicate href during popstate resolution', () => {
    const { manager } = createHarness('/same');
    manager.createDefaultUpdate();

    for (const href of ['/x', '/same', '/y']) {
      const update = manager.createUpdate(
        href,
        false,
        null,
      );
      manager.commitUpdate(update, href);
    }

    const target =
      manager.createPopStateUpdate('/same');

    expect(target.previousIndex).toBe(3);
    expect(target.nextIndex).toBe(2);
  });

  it('reads the browser state for a popstate target', () => {
    const { browser, manager } =
      createHarness('/a');

    manager.createDefaultUpdate();
    const toB = manager.createUpdate(
      '/b',
      false,
      { old: true },
    );
    manager.commitUpdate(toB, '/b');

    browser.history.state = {
      restored: true,
    };

    const update =
      manager.createPopStateUpdate('/a');

    expect(update.nextEntry?.state)
      .toEqual({ restored: true });
  });

  it('rolls popstate bookkeeping back to the previous index', () => {
    const { manager } = createHarness('/a');
    manager.createDefaultUpdate();

    const toB = manager.createUpdate(
      '/b',
      false,
      null,
    );
    manager.commitUpdate(toB, '/b');

    const pop =
      manager.createPopStateUpdate('/a');
    manager.rollbackUpdate(pop);

    expect(
      manager.createDefaultUpdate()
        .previousEntry?.href,
    ).toBe('/b');
  });

  it('uses zero scroll for a synthesized committed push entry', () => {
    const { manager } = createHarness('/a');
    manager.createDefaultUpdate();

    const synthetic: HistoryUpdate = {
      type: 'push',
      previousIndex: 0,
      nextIndex: 1,
      previousScroll: {
        x: 10,
        y: 20,
      },
    };

    manager.commitUpdate(
      synthetic,
      '/synthetic',
    );

    expect(
      manager.createDefaultUpdate()
        .previousEntry?.scroll,
    ).toBe(ZERO_SCROLL);
  });
});
````

## File: projects/libraries/waypoint/src/tests/outlet-isolation.spec.ts
````typescript
import { ensureAngularTestEnvironment } from './angular-testbed.init';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterOutlet } from '@epikodelabs/waypoint';

ensureAngularTestEnvironment();

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class RouterOutletHost {}

describe('RouterOutlet isolation', () => {
  it('should compile the Angular-compatible router-outlet selector', async () => {
    expect(RouterOutlet).toBeTruthy();
    expect((RouterOutlet as any)['ɵdir']).toBeTruthy();

    await TestBed.configureTestingModule({
      imports: [RouterOutletHost],
    }).compileComponents();

    expect().nothing();
  });
});
````

## File: projects/libraries/waypoint/src/tests/route-catalog.spec.ts
````typescript
import type { Route } from '../lib/vanilla-router';
import {
  appendCatalogRoutes,
  createRouteCatalog,
  readCatalogRoutes,
  recognizeRoute,
  removeCatalogRoutes,
  replaceCatalogRoutes,
} from '../lib/route-catalog';

function route(path: string): Route {
  return {
    path,
    load: async () => ({
      component: () =>
        document.createTextNode(path),
    }),
  };
}

describe('RouteCatalog', () => {
  it('creates an immutable version-zero catalog', () => {
    const first = route('first');
    const catalog = createRouteCatalog([first]);

    expect(catalog.version).toBe(0);
    expect(Object.isFrozen(catalog)).toBeTrue();
    expect(Object.isFrozen(catalog.matchers)).toBeTrue();
    expect(readCatalogRoutes(catalog)).toEqual([first]);
  });

  it('returns an immutable route snapshot', () => {
    const first = route('first');
    const catalog = createRouteCatalog([first]);
    const snapshot =
      readCatalogRoutes(catalog) as Route[];

    expect(Object.isFrozen(snapshot)).toBeTrue();
    expect(() => snapshot.push(route('second')))
      .toThrow();
    expect(readCatalogRoutes(catalog)).toEqual([first]);
  });

  it('preserves identity and version for an empty append', () => {
    const catalog = createRouteCatalog([
      route('first'),
    ]);

    const next = appendCatalogRoutes(
      catalog,
      [],
    );

    expect(next).toBe(catalog);
    expect(next.version).toBe(0);
  });

  it('appends routes in order and increments the version once', () => {
    const first = route('first');
    const second = route('second');
    const third = route('third');
    const catalog = createRouteCatalog([first]);

    const next = appendCatalogRoutes(
      catalog,
      [second, third],
    );

    expect(next).not.toBe(catalog);
    expect(next.version).toBe(1);
    expect(readCatalogRoutes(next))
      .toEqual([first, second, third]);
  });

  it('rejects duplicate primary paths introduced by append', () => {
    const catalog = createRouteCatalog([
      route('same'),
    ]);

    expect(() => appendCatalogRoutes(
      catalog,
      [route('same')],
    )).toThrowError(
      /Duplicate primary route path "same"/,
    );
  });

  it('preserves identity when replacing with the same references in the same order', () => {
    const first = route('first');
    const second = route('second');
    const catalog = createRouteCatalog([
      first,
      second,
    ]);

    const next = replaceCatalogRoutes(
      catalog,
      [first, second],
    );

    expect(next).toBe(catalog);
    expect(next.version).toBe(0);
  });

  it('treats reordered references as a real replacement', () => {
    const first = route('first');
    const second = route('second');
    const catalog = createRouteCatalog([
      first,
      second,
    ]);

    const next = replaceCatalogRoutes(
      catalog,
      [second, first],
    );

    expect(next.version).toBe(1);
    expect(readCatalogRoutes(next))
      .toEqual([second, first]);
  });

  it('supports replacement with an empty catalog', () => {
    const catalog = createRouteCatalog([
      route('first'),
    ]);

    const next = replaceCatalogRoutes(
      catalog,
      [],
    );

    expect(next.version).toBe(1);
    expect(readCatalogRoutes(next)).toEqual([]);
    expect(recognizeRoute(next, '/first'))
      .toBeNull();
  });

  it('preserves identity when remove matches nothing', () => {
    const first = route('first');
    const catalog = createRouteCatalog([first]);

    const next = removeCatalogRoutes(
      catalog,
      candidate => candidate.path === 'missing',
    );

    expect(next).toBe(catalog);
    expect(next.version).toBe(0);
  });

  it('removes matching routes while preserving remaining order', () => {
    const first = route('first');
    const second = route('second');
    const third = route('third');
    const catalog = createRouteCatalog([
      first,
      second,
      third,
    ]);

    const next = removeCatalogRoutes(
      catalog,
      candidate => candidate === second,
    );

    expect(next.version).toBe(1);
    expect(readCatalogRoutes(next))
      .toEqual([first, third]);
  });

  it('recognizes exact routes and returns the original route reference', () => {
    const first = route('first');
    const catalog = createRouteCatalog([first]);

    const match = recognizeRoute(
      catalog,
      '/first',
    );

    expect(match?.route).toBe(first);
    expect(match?.params).toEqual({});
    expect(Object.isFrozen(match)).toBeTrue();
    expect(Object.isFrozen(match?.params))
      .toBeTrue();
  });

  it('extracts and decodes route parameters', () => {
    const user = route('users/:id');
    const catalog = createRouteCatalog([user]);

    const match = recognizeRoute(
      catalog,
      '/users/hello%20world',
    );

    expect(match?.route).toBe(user);
    expect(match?.params).toEqual({
      id: 'hello world',
    });
  });

  it('uses a wildcard only after every concrete route fails', () => {
    const fallback = route('**');
    const concrete = route('known');
    const catalog = createRouteCatalog([
      fallback,
      concrete,
    ]);

    expect(
      recognizeRoute(catalog, '/known')?.route,
    ).toBe(concrete);

    expect(
      recognizeRoute(catalog, '/unknown')?.route,
    ).toBe(fallback);
  });

  it('uses the last wildcard as the fallback', () => {
    const first = route('*');
    const second = route('**');
    const catalog = createRouteCatalog([
      first,
      second,
    ]);

    expect(
      recognizeRoute(catalog, '/missing')?.route,
    ).toBe(second);
  });

  it('refreshes a matcher when a concrete path changes', () => {
    const mutable = route('first');
    const catalog = createRouteCatalog([mutable]);

    expect(
      recognizeRoute(catalog, '/first')?.route,
    ).toBe(mutable);

    mutable.path = 'second';

    expect(
      recognizeRoute(catalog, '/first'),
    ).toBeNull();
    expect(
      recognizeRoute(catalog, '/second')?.route,
    ).toBe(mutable);
  });

  it('refreshes parameter extraction when a path shape changes', () => {
    const mutable = route('users/:id');
    const catalog = createRouteCatalog([mutable]);

    expect(
      recognizeRoute(
        catalog,
        '/users/7',
      )?.params,
    ).toEqual({ id: '7' });

    mutable.path = 'teams/:teamId/member/:memberId';

    expect(
      recognizeRoute(
        catalog,
        '/teams/core/member/42',
      )?.params,
    ).toEqual({
      teamId: 'core',
      memberId: '42',
    });
  });

  it('supports mutating a concrete route into a wildcard fallback', () => {
    const mutable = route('first');
    const catalog = createRouteCatalog([mutable]);

    mutable.path = '**';

    expect(
      recognizeRoute(catalog, '/anything')?.route,
    ).toBe(mutable);
    expect(
      recognizeRoute(catalog, '/anything')?.params,
    ).toEqual({});
  });

  it('supports mutating a wildcard fallback into a concrete route', () => {
    const mutable = route('**');
    const catalog = createRouteCatalog([mutable]);

    expect(
      recognizeRoute(catalog, '/anything')?.route,
    ).toBe(mutable);

    mutable.path = 'specific/:id';

    expect(
      recognizeRoute(catalog, '/anything'),
    ).toBeNull();
    expect(
      recognizeRoute(
        catalog,
        '/specific/9',
      )?.params,
    ).toEqual({ id: '9' });
  });

  it('validates duplicate outlet names', () => {
    const primary: Route = {
      ...route('project'),
      outlets: [
        {
          ...route('project'),
          outlet: 'sidebar',
        },
        {
          ...route('project'),
          outlet: 'sidebar',
        },
      ],
    };

    expect(() => createRouteCatalog([primary]))
      .toThrowError(
        /Duplicate outlet "sidebar"/,
      );
  });

  it('validates that secondary outlets use the primary path', () => {
    const primary: Route = {
      ...route('project'),
      outlets: [{
        ...route('different'),
        outlet: 'sidebar',
      }],
    };

    expect(() => createRouteCatalog([primary]))
      .toThrowError(
        /must use the primary path "project"/,
      );
  });
});
````

## File: projects/libraries/waypoint/src/tests/route-runtime.spec.ts
````typescript
import {
  preloadRouteCatalog,
  prepareRouteRuntime,
} from '../lib/route-runtime';
import type {
  RedirectRoute,
  RenderableRoute,
  RouteComponent,
} from '../lib/vanilla-router';

interface Deferred<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
  reject(error: unknown): void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((accept, fail) => {
    resolve = accept;
    reject = fail;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

const component: RouteComponent = () =>
  document.createTextNode('Route');

function renderable(
  path: string,
  overrides: Partial<RenderableRoute> = {},
): RenderableRoute {
  return {
    path,
    load: async () => ({ component }),
    ...overrides,
  };
}

describe('RouteRuntime', () => {
  it('shares one pending runtime load between concurrent callers', async () => {
    const pending = deferred<{
      component: RouteComponent;
    }>();
    const load = jasmine
      .createSpy('load')
      .and.returnValue(pending.promise);
    const route = renderable('shared', {
      load,
    });

    const first = prepareRouteRuntime(route);
    const second = prepareRouteRuntime(route);

    expect(first).toBe(second);
    expect(load).toHaveBeenCalledTimes(1);

    pending.resolve({ component });

    expect(await first).toBe(await second);
  });

  it('caches a successfully resolved runtime', async () => {
    const load = jasmine
      .createSpy('load')
      .and.resolveTo({ component });
    const route = renderable('cached', {
      load,
    });

    const first = await prepareRouteRuntime(route);
    const second = await prepareRouteRuntime(route);

    expect(second).toBe(first);
    expect(Object.isFrozen(first)).toBeTrue();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('evicts a failed load so a later call can retry', async () => {
    let attempt = 0;
    const route = renderable('retry', {
      load: async () => {
        attempt++;

        if (attempt === 1) {
          throw new Error('first failure');
        }

        return { component };
      },
    });

    await expectAsync(
      prepareRouteRuntime(route),
    ).toBeRejectedWithError('first failure');

    const runtime =
      await prepareRouteRuntime(route);

    expect(runtime.component).toBe(component);
    expect(attempt).toBe(2);
  });

  it('uses route-level prepare handlers when the loaded runtime omits prepare', async () => {
    const prepare = jasmine.createSpy('prepare');
    const route = renderable('fallback', {
      prepare: [prepare],
      load: async () => ({ component }),
    });

    const runtime =
      await prepareRouteRuntime(route);

    expect(runtime.prepare).toEqual([prepare]);
  });

  it('uses loaded prepare handlers when they are supplied', async () => {
    const routePrepare =
      jasmine.createSpy('routePrepare');
    const loadedPrepare =
      jasmine.createSpy('loadedPrepare');

    const route = renderable('override', {
      prepare: [routePrepare],
      load: async () => ({
        component,
        prepare: [loadedPrepare],
      }),
    });

    const runtime =
      await prepareRouteRuntime(route);

    expect(runtime.prepare)
      .toEqual([loadedPrepare]);
  });

  it('preserves all loaded runtime capabilities', async () => {
    const canActivate =
      jasmine.createSpy('canActivate');
    const canDeactivate =
      jasmine.createSpy('canDeactivate');
    const prepare =
      jasmine.createSpy('prepare');
    const parseParams =
      jasmine.createSpy('parseParams');
    const parseQuery =
      jasmine.createSpy('parseQuery');

    const route = renderable('capabilities', {
      load: async () => ({
        component,
        canActivate: [canActivate],
        canDeactivate: [canDeactivate],
        prepare: [prepare],
        parseParams,
        parseQuery,
      }),
    });

    const runtime =
      await prepareRouteRuntime(route);

    expect(runtime).toEqual({
      component,
      canActivate: [canActivate],
      canDeactivate: [canDeactivate],
      prepare: [prepare],
      parseParams,
      parseQuery,
    });
  });

  it('skips redirect routes during preloading', async () => {
    const redirect: RedirectRoute = {
      path: 'legacy',
      redirectTo: '/next',
    };
    const trace = jasmine.createSpy('trace');

    await preloadRouteCatalog(
      [redirect],
      trace,
    );

    expect(trace).not.toHaveBeenCalled();
  });

  it('skips routes with preload explicitly disabled', async () => {
    const load = jasmine.createSpy('load');
    const route = renderable('manual', {
      preload: false,
      load,
    });

    await preloadRouteCatalog(
      [route],
      jasmine.createSpy('trace'),
    );

    expect(load).not.toHaveBeenCalled();
  });

  it('preloads the primary route and every outlet member', async () => {
    const primaryLoad = jasmine
      .createSpy('primaryLoad')
      .and.resolveTo({ component });
    const sidebarLoad = jasmine
      .createSpy('sidebarLoad')
      .and.resolveTo({ component });

    const route = renderable('project', {
      load: primaryLoad,
      outlets: [
        renderable('project', {
          outlet: 'sidebar',
          load: sidebarLoad,
        }),
      ],
    });

    await preloadRouteCatalog(
      [route],
      jasmine.createSpy('trace'),
    );

    expect(primaryLoad).toHaveBeenCalledTimes(1);
    expect(sidebarLoad).toHaveBeenCalledTimes(1);
  });

  it('continues preloading later routes after one route fails', async () => {
    const failure = new Error('broken');
    const brokenLoad = jasmine
      .createSpy('brokenLoad')
      .and.rejectWith(failure);
    const healthyLoad = jasmine
      .createSpy('healthyLoad')
      .and.resolveTo({ component });
    const trace = jasmine.createSpy('trace');

    await preloadRouteCatalog(
      [
        renderable('broken', {
          load: brokenLoad,
        }),
        renderable('healthy', {
          load: healthyLoad,
        }),
      ],
      trace,
    );

    expect(brokenLoad).toHaveBeenCalledTimes(1);
    expect(healthyLoad).toHaveBeenCalledTimes(1);
    expect(trace).toHaveBeenCalledWith(
      'Route preload failed',
      'broken',
      '',
      failure,
    );
  });

  it('reports an invalid parser on a named outlet and continues', async () => {
    const parseQuery =
      jasmine.createSpy('parseQuery');
    const nextLoad = jasmine
      .createSpy('nextLoad')
      .and.resolveTo({ component });
    const trace = jasmine.createSpy('trace');

    const grouped = renderable('project', {
      outlets: [
        renderable('project', {
          outlet: 'sidebar',
          load: async () => ({
            component,
            parseQuery,
          }),
        }),
      ],
    });

    await preloadRouteCatalog(
      [
        grouped,
        renderable('next', {
          load: nextLoad,
        }),
      ],
      trace,
    );

    expect(trace).toHaveBeenCalledWith(
      'Route preload failed',
      'project',
      'sidebar',
      jasmine.any(Error),
    );
    expect(nextLoad).toHaveBeenCalledTimes(1);
  });

  it('reuses a runtime already populated by preload', async () => {
    const load = jasmine
      .createSpy('load')
      .and.resolveTo({ component });
    const route = renderable('preloaded', {
      load,
    });

    await preloadRouteCatalog(
      [route],
      jasmine.createSpy('trace'),
    );

    const runtime =
      await prepareRouteRuntime(route);

    expect(runtime.component).toBe(component);
    expect(load).toHaveBeenCalledTimes(1);
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-mutation.spec.ts
````typescript
import {
  createRouter,
  type NavigationTransitionDefinition,
  type Route,
  type VanillaRouter,
} from '@epikodelabs/waypoint';

import { idescribe } from './env.spec';

function routeWithComponent(
  path: string,
  text: string,
  onDestroy?: () => void,
): Route {
  return {
    path,
    load: async () => ({
      component: (_route, context) => {
        if (onDestroy) {
          context.destroySignal.addEventListener(
            'abort',
            onDestroy,
            { once: true },
          );
        }

        return document.createTextNode(text);
      },
    }),
  };
}

idescribe('Router route mutations', () => {
  let outlet: HTMLElement;
  let router: VanillaRouter;

  beforeEach(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    window.history.replaceState(null, '', '/');

    spyOn(console, 'debug');
    spyOn(console, 'error');
  });

  afterEach(() => {
    router?.dispose();
    window.history.replaceState(null, '', '/');
    outlet.remove();
  });

  function create(
    routes: readonly Route[],
    overrides: Partial<Parameters<typeof createRouter>[0]> = {},
  ): VanillaRouter {
    return createRouter({
      routes: [...routes],
      render: (_name, node) => {
        outlet.replaceChildren(node);
      },
      ...overrides,
    });
  }

  it('should expose the initial route catalog without increasing its version', () => {
    const home = routeWithComponent('', 'Home');
    const about = routeWithComponent('about', 'About');

    router = create([home, about]);

    expect(router.routeVersion).toBe(0);
    expect(router.routes()).toEqual([home, about]);
    expect(router.routes()[0]).toBe(home);
    expect(router.routes()[1]).toBe(about);
  });

  it('should preserve catalog identity for an empty append', () => {
    const home = routeWithComponent('', 'Home');
    router = create([home]);

    expect(router.addRoutes([])).toBeFalse();
    expect(router.routeVersion).toBe(0);
    expect(router.routes()).toEqual([home]);
  });

  it('should append a route and make it immediately available to navigation', async () => {
    const home = routeWithComponent('', 'Home');
    const settings = routeWithComponent('settings', 'Settings');
    router = create([home]);

    expect(router.addRoutes([settings])).toBeTrue();
    expect(router.routeVersion).toBe(1);
    expect(router.routes()).toEqual([home, settings]);

    expect(await router.navigate('/settings')).toBeTrue();
    expect(router.state.current?.config).toBe(settings);
    expect(outlet.textContent).toBe('Settings');
  });

  it('should preserve the catalog when replacing it with the same route references', () => {
    const home = routeWithComponent('', 'Home');
    const settings = routeWithComponent('settings', 'Settings');
    router = create([home, settings]);

    expect(router.replaceRoutes([home, settings])).toBeFalse();
    expect(router.routeVersion).toBe(0);
    expect(router.routes()).toEqual([home, settings]);
  });

  it('should replace the complete route catalog', async () => {
    const oldRoute = routeWithComponent('old', 'Old');
    const nextRoute = routeWithComponent('next', 'Next');
    const notFound = jasmine.createSpy('notFound');

    router = create([oldRoute], {
      renderNotFound: (_outletName, url) => {
        notFound(url.pathname);
        outlet.replaceChildren(
          document.createTextNode('Not found'),
        );
      },
    });

    expect(await router.navigate('/old')).toBeTrue();
    expect(outlet.textContent).toBe('Old');

    expect(router.replaceRoutes([nextRoute])).toBeTrue();
    expect(router.routeVersion).toBe(1);
    expect(router.routes()).toEqual([nextRoute]);

    expect(await router.navigate('/old')).toBeFalse();
    expect(notFound).toHaveBeenCalledWith('/old');
    expect(outlet.textContent).toBe('Not found');

    expect(await router.navigate('/next')).toBeTrue();
    expect(outlet.textContent).toBe('Next');
  });

  it('should preserve the active view until removal is explicitly revalidated', async () => {
    const destroyed = jasmine.createSpy('destroyed');
    const active = routeWithComponent(
      'active',
      'Active',
      destroyed,
    );

    router = create([active]);

    expect(await router.navigate('/active')).toBeTrue();
    expect(outlet.textContent).toBe('Active');

    expect(
      router.removeRoutes(route => route === active),
    ).toBeTrue();

    expect(router.routeVersion).toBe(1);
    expect(router.routes()).toEqual([]);
    expect(router.state.current?.config).toBe(active);
    expect(outlet.textContent).toBe('Active');
    expect(destroyed).not.toHaveBeenCalled();

    expect(await router.revalidate()).toBeFalse();

    expect(router.state.current).toBeNull();
    expect(destroyed).toHaveBeenCalledTimes(1);
  });

  it('should not increment the version when no route is removed', () => {
    const home = routeWithComponent('', 'Home');
    router = create([home]);

    expect(
      router.removeRoutes(route => route.path === 'missing'),
    ).toBeFalse();

    expect(router.routeVersion).toBe(0);
    expect(router.routes()).toEqual([home]);
  });

  it('should return a new route snapshot that cannot mutate catalog membership', () => {
    const home = routeWithComponent('', 'Home');
    router = create([home]);

    const snapshot =
      router.routes() as Route[];

    expect(() => snapshot.push(
      routeWithComponent('extra', 'Extra'),
    )).toThrow();

    expect(router.routes()).toEqual([home]);
    expect(router.routeVersion).toBe(0);
  });

  it('should replace transitions and use the new transition during revalidation', async () => {
    const calls: string[] = [];
    const route = routeWithComponent('', 'Home');

    const first: NavigationTransitionDefinition = {
      beforeEnter: [
        () => {
          calls.push('first');
          return true;
        },
      ],
    };

    const second: NavigationTransitionDefinition = {
      beforeEnter: [
        () => {
          calls.push('second');
          return true;
        },
      ],
    };

    router = create([route], {
      transitions: [first],
    });

    expect(await router.navigate('/')).toBeTrue();
    expect(calls).toEqual(['first']);

    expect(router.replaceTransitions([second])).toBeTrue();
    expect(await router.revalidate()).toBeTrue();
    expect(calls).toEqual(['first', 'second']);

    expect(router.replaceTransitions([second])).toBeFalse();
  });

  it('should reject every catalog mutation after disposal', () => {
    const route = routeWithComponent('', 'Home');
    router = create([route]);
    router.dispose();

    expect(() => router.addRoutes([]))
      .toThrowError(/disposed router/);
    expect(() => router.replaceRoutes([]))
      .toThrowError(/disposed router/);
    expect(() => router.removeRoutes(() => true))
      .toThrowError(/disposed router/);
    expect(() => router.replaceTransitions([]))
      .toThrowError(/disposed router/);
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-test-utils.spec.ts
````typescript
import {
  createRouter,
  type VanillaRouter,
} from '@epikodelabs/waypoint';

import {
  assertRouterInvariant,
} from './router-test-utils';

describe('assertRouterInvariant', () => {
  let router: VanillaRouter;

  afterEach(() => {
    router?.dispose();
    window.history.replaceState(null, '', '/');
  });

  it('accepts a settled router with no active route', () => {
    router = createRouter({
      routes: [],
      render: () => {},
    });

    assertRouterInvariant(router, {
      routeVersion: 0,
      routes: [],
    });
  });

  it('accepts a settled router with an active route', async () => {
    const route = {
      path: '',
      load: async () => ({
        component: () =>
          document.createTextNode('Home'),
      }),
    };

    router = createRouter({
      routes: [route],
      render: () => {},
    });

    expect(await router.navigate('/')).toBeTrue();

    assertRouterInvariant(router, {
      routeVersion: 0,
      routes: [route],
    });
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-test-utils.ts
````typescript
import type {
  Route,
  VanillaRouter,
} from '@epikodelabs/waypoint';

export interface RouterInvariantOptions {
  /**
   * Set to true only while deliberately inspecting an unsettled navigation.
   * Most tests should assert invariants after the returned navigation promise
   * has settled.
   */
  readonly allowPending?: boolean;

  /**
   * Optionally assert the exact catalog version expected by the scenario.
   */
  readonly routeVersion?: number;

  /**
   * Optionally assert exact route reference ordering.
   */
  readonly routes?: readonly Route[];
}

/**
 * Verifies public-state relationships that must hold after every settled router
 * operation. Keep this helper restricted to public API invariants so it remains
 * useful while router internals are refactored.
 */
export function assertRouterInvariant(
  router: VanillaRouter,
  options: RouterInvariantOptions = {},
): void {
  const {
    allowPending = false,
    routeVersion,
    routes,
  } = options;

  expect(Number.isInteger(router.routeVersion))
    .withContext('routeVersion must be an integer')
    .toBeTrue();
  expect(router.routeVersion)
    .withContext('routeVersion must not be negative')
    .toBeGreaterThanOrEqual(0);

  const snapshot = router.routes();

  expect(Object.isFrozen(snapshot))
    .withContext('routes() must return an immutable snapshot')
    .toBeTrue();
  expect(snapshot.every(
    route => typeof route.path === 'string',
  )).withContext(
    'every catalog route must have a string path',
  ).toBeTrue();

  if (routeVersion !== undefined) {
    expect(router.routeVersion)
      .withContext('unexpected catalog version')
      .toBe(routeVersion);
  }

  if (routes) {
    expect(snapshot.length)
      .withContext('unexpected catalog size')
      .toBe(routes.length);

    routes.forEach((route, index) => {
      expect(snapshot[index])
        .withContext(
          `unexpected route reference at index ${index}`,
        )
        .toBe(route);
    });
  }

  if (!allowPending) {
    expect(router.state.pending)
      .withContext(
        'router must not remain pending after a settled operation',
      )
      .toBeFalse();
    expect(router.state.phase)
      .withContext(
        'navigation phase must clear after a settled operation',
      )
      .toBeNull();
  }

  const current = router.state.current;

  if (current === null) {
    expect(router.state.routeConfig)
      .withContext(
        'routeConfig must be null without a current route',
      )
      .toBeNull();
    expect(router.state.path)
      .withContext(
        'path must be empty without a current route',
      )
      .toBe('');
    expect(router.state.params)
      .withContext(
        'params must be empty without a current route',
      )
      .toEqual({});
    expect(router.state.query)
      .withContext(
        'query must be empty without a current route',
      )
      .toEqual({});
    expect(router.state.data)
      .withContext(
        'data must be empty without a current route',
      )
      .toEqual({});
    return;
  }

  expect(router.state.routeConfig)
    .withContext(
      'routeConfig must reference the current route config',
    )
    .toBe(current.config);
  expect(router.state.path)
    .withContext(
      'state.path must mirror current.path',
    )
    .toBe(current.path);
  expect(router.state.params)
    .withContext(
      'state.params must reference current.params',
    )
    .toBe(current.params);
  expect(router.state.query)
    .withContext(
      'state.query must reference current.query',
    )
    .toBe(current.query);
  expect(router.state.data)
    .withContext(
      'state.data must reference current.data',
    )
    .toBe(current.data);
  expect(router.state.historyState)
    .withContext(
      'historyState must mirror the current route',
    )
    .toBe(current.historyState);
}
````

## File: projects/libraries/waypoint/src/tests/server-delivery.spec.ts
````typescript
import {
  isServerNavigationResolution,
  WAYPOINT_SERVER_DELIVERY_VERSION,
  type ServerNavigationResolution,
} from '../lib/server-delivery';

describe('server delivery contract', () => {
  const valid: ServerNavigationResolution = {
    version: WAYPOINT_SERVER_DELIVERY_VERSION,
    artifactKey: 'leaf',
    artifacts: [
      {
        artifactKey: 'parent',
        moduleUrl: '/api/navigation/modules/parent.js',
        hash: 'PARENT',
      },
      {
        artifactKey: 'leaf',
        moduleUrl: '/api/navigation/modules/leaf.js',
        hash: 'LEAF',
      },
    ],
  };

  it('accepts a versioned dependency-first resolution', () => {
    expect(isServerNavigationResolution(valid)).toBeTrue();
  });

  it('rejects unknown protocol versions', () => {
    expect(isServerNavigationResolution({ ...valid, version: 2 })).toBeFalse();
  });

  it('allows the requested artifact before redirect-followed artifacts', () => {
    expect(isServerNavigationResolution({
      ...valid,
      artifactKey: 'parent',
    })).toBeTrue();
  });

  it('requires the requested artifact to be present in the delivery plan', () => {
    expect(isServerNavigationResolution({
      ...valid,
      artifactKey: 'missing',
    })).toBeFalse();
  });

  it('rejects duplicate artifact descriptors', () => {
    expect(isServerNavigationResolution({
      ...valid,
      artifacts: [valid.artifacts[0], valid.artifacts[0]],
      artifactKey: 'parent',
    })).toBeFalse();
  });

  it('does not accept route or authorization metadata as a substitute for delivery fields', () => {
    expect(isServerNavigationResolution({
      version: 1,
      artifactKey: 'leaf',
      artifacts: [{
        artifactKey: 'leaf',
        branchIds: ['hidden'],
        policies: [{ roles: ['admin'] }],
      }],
    })).toBeFalse();
  });
});
````

## File: projects/libraries/waypoint/src/tests/server-routing.spec.ts
````typescript
import {
  createServerNavigationResolution,
  isServerArtifactAuthorized,
  isServerArtifactChainAuthorized,
  requiredServerBranchIds,
  resolveServerArtifactChain,
  type ServerArtifactIndex,
  type ServerArtifactRecord,
  type ServerPrincipal,
  type ServerRouteBranch,
} from '../lib/server-routing';

function artifact(
  artifactKey: string,
  dependencies: readonly string[],
  branchIds: readonly string[],
): ServerArtifactRecord {
  return {
    artifactKey,
    routeSetId: artifactKey,
    dependencies,
    branchIds,
    file: `../artifacts/${artifactKey}-HASH.js`,
    hash: 'HASH',
  };
}

function branch(
  id: string,
  routeSetId: string,
  permissions: readonly string[] = [],
): ServerRouteBranch {
  return {
    id,
    policies: [{ permissions }],
    routeSetId,
  };
}

const principal: ServerPrincipal = {
  subject: 'user',
  roles: new Set(['user']),
  permissions: new Set(['read']),
};

describe('server routing', () => {
  it('resolves dependencies on the server in dependency-first order', () => {
    const index: ServerArtifactIndex = {
      artifacts: [
        artifact('root', [], ['root-branch']),
        artifact('child', ['root'], ['child-branch']),
        artifact('leaf', ['child'], ['leaf-branch']),
      ],
    };

    const chain = resolveServerArtifactChain(index, 'leaf');

    expect(chain.map(item => item.artifactKey)).toEqual([
      'root',
      'child',
      'leaf',
    ]);
    expect([...requiredServerBranchIds(chain)]).toEqual([
      'root-branch',
      'child-branch',
      'leaf-branch',
    ]);
  });

  it('rejects duplicate artifact keys instead of resolving an ambiguous index', () => {
    const index: ServerArtifactIndex = {
      artifacts: [
        artifact('duplicate', [], ['first']),
        artifact('duplicate', [], ['second']),
      ],
    };

    expect(() => resolveServerArtifactChain(index, 'duplicate')).toThrowError(
      /duplicate artifact key/i,
    );
  });

  it('rejects cyclic artifact graphs rather than exposing partial delivery', () => {
    const index: ServerArtifactIndex = {
      artifacts: [
        artifact('a', ['b'], ['a-branch']),
        artifact('b', ['a'], ['b-branch']),
      ],
    };

    expect(() => resolveServerArtifactChain(index, 'a')).toThrowError(
      /dependency cycle/i,
    );
  });

  it('authorizes an atomic artifact only when every contained branch is allowed', () => {
    const descriptor = artifact('workspace', [], ['allowed', 'hidden']);
    const branches = new Map<string, ServerRouteBranch>([
      ['allowed', branch('allowed', 'workspace', ['read'])],
      ['hidden', branch('hidden', 'workspace', ['admin'])],
    ]);

    expect(isServerArtifactAuthorized(
      descriptor,
      branches,
      principal,
    )).toBeFalse();

    branches.set('hidden', branch('hidden', 'workspace', ['read']));
    expect(isServerArtifactAuthorized(
      descriptor,
      branches,
      principal,
    )).toBeTrue();
  });

  it('rejects a dependency chain when any artifact is unauthorized', () => {
    const chain = [
      artifact('parent', [], ['parent']),
      artifact('child', ['parent'], ['child']),
    ];
    const branches = new Map<string, ServerRouteBranch>([
      ['parent', branch('parent', 'parent', ['admin'])],
      ['child', branch('child', 'child', ['read'])],
    ]);

    expect(isServerArtifactChainAuthorized(
      chain,
      branches,
      principal,
    )).toBeFalse();
  });

  it('rejects missing or mismatched branch provenance', () => {
    const descriptor = artifact('workspace', [], ['branch']);

    expect(isServerArtifactAuthorized(
      descriptor,
      new Map(),
      principal,
    )).toBeFalse();
    expect(isServerArtifactAuthorized(
      descriptor,
      new Map([['branch', branch('branch', 'other', ['read'])]]),
      principal,
    )).toBeFalse();
  });

  it('creates a versioned wire response without leaking server routing metadata', () => {
    const chain = [
      artifact('parent', [], ['parent-branch']),
      artifact('leaf', ['parent'], ['leaf-branch']),
    ];

    const resolution = createServerNavigationResolution(
      'leaf',
      chain,
      item => `/modules/${item.artifactKey}.js`,
    );

    expect(resolution.version).toBe(1);
    expect(resolution.artifactKey).toBe('leaf');
    expect(resolution.artifacts).toEqual([
      {
        artifactKey: 'parent',
        moduleUrl: '/modules/parent.js',
        hash: 'HASH',
      },
      {
        artifactKey: 'leaf',
        moduleUrl: '/modules/leaf.js',
        hash: 'HASH',
      },
    ]);
    expect('dependencies' in resolution.artifacts[0]).toBeFalse();
    expect('branchIds' in resolution.artifacts[0]).toBeFalse();
    expect('routeSetId' in resolution.artifacts[0]).toBeFalse();
  });
});
````

## File: projects/libraries/waypoint/src/tests/server-source.spec.ts
````typescript
import {
  type ServerRoutableBranch,
  type ServerRouterIndex,
  type ServerRouterShard,
} from '../lib/server-router';
import { createServerRouterSnapshotSource as createSource } from '../lib/server-source';
import type { ServerArtifactRecord } from '../lib/server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly hash: string;
}

interface Branch extends ServerRoutableBranch {
  readonly kind: 'route';
}

function artifact(hash: string): Artifact {
  return {
    artifactKey: 'feature',
    routeSetId: 'feature',
    dependencies: [],
    branchIds: ['feature-home'],
    hash,
  };
}

function index(hash: string, files = ['feature.json']): ServerRouterIndex<Artifact> {
  return {
    shards: files.map(file => ({ prefix: '/', file })),
    artifacts: [artifact(hash)],
  };
}

function shard(path = '/feature'): ServerRouterShard<Branch> {
  return {
    branches: [{
      id: 'feature-home',
      kind: 'route',
      path,
      routeSetId: 'feature',
      policies: [],
    }],
  };
}

describe('server router snapshot source', () => {
  it('loads one immutable generation once and serves shards from memory', async () => {
    let indexLoads = 0;
    let shardLoads = 0;
    const source = createSource<Artifact, Branch>({
      async loadIndex() { indexLoads++; return index('A'); },
      async loadShard() { shardLoads++; return shard(); },
    });

    const first = await source.loadSnapshot();
    const second = await source.loadSnapshot();

    expect(second).toBe(first);
    expect(indexLoads).toBe(1);
    expect(shardLoads).toBe(1);
    expect(await first.loadShard('feature.json')).toBe(await first.loadShard('feature.json'));
    expect(shardLoads).toBe(1);
  });

  it('deduplicates shard files while preparing a generation', async () => {
    let shardLoads = 0;
    const source = createSource<Artifact, Branch>({
      async loadIndex() { return index('A', ['feature.json', 'feature.json']); },
      async loadShard() { shardLoads++; return shard(); },
    });

    await source.loadSnapshot();
    expect(shardLoads).toBe(1);
  });

  it('publishes a refresh only after every shard in the new generation loads', async () => {
    let generation = 'A';
    let fail = false;
    const source = createSource<Artifact, Branch>({
      async loadIndex() { return index(generation); },
      async loadShard() {
        if (fail) throw new Error('publication incomplete');
        return shard(`/feature/${generation}`);
      },
    });

    const stable = await source.loadSnapshot();
    generation = 'B';
    fail = true;
    await expectAsync(source.refresh()).toBeRejectedWithError(/publication incomplete/);

    expect(await source.loadSnapshot()).toBe(stable);
    expect(stable.index.artifacts[0]?.hash).toBe('A');

    fail = false;
    const refreshed = await source.refresh();
    expect(refreshed).not.toBe(stable);
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
  });

  it('shares concurrent publication attempts', async () => {
    let indexLoads = 0;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const source = createSource<Artifact, Branch>({
      async loadIndex() { indexLoads++; await gate; return index('A'); },
      async loadShard() { return shard(); },
    });

    const first = source.loadSnapshot();
    const second = source.refresh();
    release();

    expect(await second).toBe(await first);
    expect(indexLoads).toBe(1);
  });


  it('refreshes automatically when the cheap publication revision changes', async () => {
    let generation = 'A';
    let indexLoads = 0;
    const source = createSource<Artifact, Branch>({
      async revision() { return generation; },
      async loadIndex() { indexLoads++; return index(generation); },
      async loadShard() { return shard(`/feature/${generation}`); },
    });

    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('A');
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('A');
    expect(indexLoads).toBe(1);

    generation = 'B';
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
    expect(indexLoads).toBe(2);
  });

  it('does not let callers after invalidation join an older in-flight publication', async () => {
    let generation = 'A';
    let releaseFirst!: () => void;
    let indexLoads = 0;
    const firstGate = new Promise<void>(resolve => { releaseFirst = resolve; });
    const source = createSource<Artifact, Branch>({
      async loadIndex() {
        indexLoads++;
        const captured = generation;
        if (indexLoads === 1) await firstGate;
        return index(captured);
      },
      async loadShard() { return shard(); },
    });

    const stale = source.loadSnapshot();
    generation = 'B';
    source.invalidate();
    const fresh = source.loadSnapshot();
    releaseFirst();

    expect((await fresh).index.artifacts[0]?.hash).toBe('B');
    expect((await stale).index.artifacts[0]?.hash).toBe('A');
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
    expect(indexLoads).toBe(2);
  });

  it('invalidates the cached generation explicitly', async () => {
    let generation = 'A';
    const source = createSource<Artifact, Branch>({
      async loadIndex() { return index(generation); },
      async loadShard() { return shard(); },
    });

    await source.loadSnapshot();
    generation = 'B';
    source.invalidate();

    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
  });
});
````

## File: projects/tools/builder/src/compiler/analyze.ts
````typescript
import fs from 'node:fs';
import path from 'node:path';

import {
  loadNavigationSnapshot,
  type NavigationSnapshot,
} from './navigation-snapshot.js';
import {
  createServerRoutePlan,
  type ServerRoutePlan,
} from './server-plan.js';

export interface AnalyzeOptions {
  readonly entry: string;
  readonly serverOutput: string;
  readonly artifactsOutput: string;
  readonly buildManifestOutput?: string;
  readonly profile?: boolean;
}

export interface WaypointAnalysis {
  readonly success: boolean;
  readonly diagnostics: readonly {
    readonly level: 'error' | 'warning' | 'info';
    readonly code?: string;
    readonly message: string;
  }[];
  readonly planned: {
    readonly entry: string;
    readonly projectRoot: string;
    readonly serverOutput: string;
    readonly artifactsOutput: string;
    readonly buildManifestOutput?: string;
  };
  readonly snapshot?: NavigationSnapshot;
  readonly plan?: ServerRoutePlan;
}

export async function analyze(
  options: AnalyzeOptions,
): Promise<WaypointAnalysis> {
  const entry =
    path.resolve(
      options.entry,
    );

  const diagnostics: Array<{
    level: 'error' | 'warning' | 'info';
    code?: string;
    message: string;
  }> = [];

  const projectRoot =
    findProjectRoot(entry);

  const planned =
    Object.freeze({
      entry,
      projectRoot,
      serverOutput:
        path.resolve(
          options.serverOutput,
        ),
      artifactsOutput:
        path.resolve(
          options.artifactsOutput,
        ),
      buildManifestOutput:
        options.buildManifestOutput
          ? path.resolve(
              options.buildManifestOutput,
            )
          : undefined,
    });

  if (!fs.existsSync(entry)) {
    diagnostics.push({
      level: 'error',
      code: 'WPT1001',
      message:
        `Waypoint navigation entry does not exist: ${entry}`,
    });

    return Object.freeze({
      success: false,
      diagnostics:
        Object.freeze(diagnostics),
      planned,
    });
  }

  try {
    const metadataRoot =
      path.dirname(
        planned.serverOutput,
      );

    const snapshot =
      await loadNavigationSnapshot(
        projectRoot,
        entry,
        metadataRoot,
      );

    const plan =
      createServerRoutePlan(
        snapshot,
      );

    if (plan.artifacts.length === 0) {
      diagnostics.push({
        level: 'warning',
        code: 'WPT2001',
        message:
          'No routesFor() contributions were discovered.',
      });
    }

    return Object.freeze({
      success: true,
      diagnostics:
        Object.freeze(diagnostics),
      planned,
      snapshot,
      plan,
    });
  } catch (error) {
    diagnostics.push({
      level: 'error',
      code: 'WPT1002',
      message:
        error instanceof Error
          ? error.message
          : String(error),
    });

    return Object.freeze({
      success: false,
      diagnostics:
        Object.freeze(diagnostics),
      planned,
    });
  }
}

function findProjectRoot(
  entry: string,
): string {
  let current =
    path.dirname(entry);

  while (true) {
    if (
      fs.existsSync(
        path.join(
          current,
          'tsconfig.app.json',
        ),
      )
    ) {
      return current;
    }

    const parent =
      path.dirname(current);

    if (parent === current) {
      throw new Error(
        `Could not locate Angular project root for "${entry}".`,
      );
    }

    current = parent;
  }
}
````

## File: projects/tools/builder/src/compiler/index.ts
````typescript
export {
  analyze,
  type WaypointAnalysis,
} from './analyze.js';

export {
  createBuildLayout,
  type WaypointBuildLayout,
} from './build-layout.js';

export {
  prepareBuild,
  type PreparedWaypointBuild,
} from './prepare-build.js';
````

## File: projects/tools/builder/src/compiler/prepare-build.ts
````typescript
import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  WaypointAnalysis,
} from './analyze.js';
import {
  publishServerRouteOutput,
} from './server-output.js';

export interface PrepareBuildOptions {
  readonly metadataRoot: string;
}

export interface PreparedWaypointBuild {
  readonly host: {
    readonly routesEntry: string;
    readonly runtimeEntry: string;
  };

  publish(): Promise<{
    readonly success: boolean;
    readonly diagnostics: readonly {
      readonly level: 'error' | 'warning' | 'info';
      readonly code?: string;
      readonly message: string;
    }[];
  }>;

  rollback(): Promise<void>;
  dispose(): Promise<void>;
}

export async function prepareBuild(
  analysis: WaypointAnalysis,
  options: PrepareBuildOptions,
): Promise<PreparedWaypointBuild> {
  if (
    !analysis.success
    || !analysis.plan
  ) {
    throw new Error(
      'Cannot prepare Waypoint build from failed analysis.',
    );
  }

  const metadataRoot =
    path.resolve(
      options.metadataRoot,
    );

  const hostRoot =
    path.join(
      metadataRoot,
      'host',
    );

  const routesEntry =
    path.join(
      hostRoot,
      'routes.ts',
    );

  const runtimeEntry =
    path.join(
      hostRoot,
      'runtime.js',
    );

  await fs.mkdir(
    hostRoot,
    {
      recursive: true,
    },
  );

  /*
   * Keep the browser host route source minimal. The protected contribution
   * modules are deliberately absent from the initial application build.
   */
  await fs.writeFile(
    routesEntry,
    [
      `import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';`,
      ``,
      `export const routes = [`,
      `  routeSlot('public'),`,
      `  routeSlot('application'),`,
      `] as const satisfies NavigationTree;`,
      ``,
    ].join('\n'),
    'utf8',
  );

  await fs.writeFile(
    runtimeEntry,
    [
      `// Waypoint generated host runtime bootstrap.`,
      ``,
    ].join('\n'),
    'utf8',
  );

  return Object.freeze({
    host: Object.freeze({
      routesEntry,
      runtimeEntry,
    }),

    async publish() {
      await publishServerRouteOutput(
        analysis.plan!,
        analysis.planned.serverOutput,
      );

      if (
        analysis.planned
          .buildManifestOutput
      ) {
        await fs.mkdir(
          path.dirname(
            analysis.planned
              .buildManifestOutput,
          ),
          {
            recursive: true,
          },
        );

        await fs.writeFile(
          analysis.planned
            .buildManifestOutput,
          JSON.stringify(
            {
              version: 1,
              entry:
                analysis.planned.entry,
              routeSets:
                analysis.plan!.artifacts.map(
                  artifact => ({
                    artifactKey:
                      artifact.artifactKey,
                    routeSetId:
                      artifact.routeSetId,
                    dependencies:
                      artifact.dependencies,
                    branches:
                      artifact.branchIds,
                  }),
                ),
            },
            null,
            2,
          ) + '\n',
          'utf8',
        );
      }

      return {
        success: true,
        diagnostics: [],
      };
    },

    async rollback() {},
    async dispose() {},
  });
}
````

## File: projects/tools/builder/src/waypoint-build/options.patch.ts
````typescript
/*
Keep the conventional entry default:

  src/app/app.routes.ts

Do NOT add filesystem/main.ts graph discovery for the entry filename.

Reason:
- app.routes.ts is an explicit Angular-facing application boundary;
- app.config.ts imports it directly;
- discovery would make build behavior depend on filename/search heuristics;
- non-standard layouts already have the optional waypoint.entry escape hatch.

Also remove routesExport/rootExport from the builder-facing options now that the
navigation-module export graph is authoritative.
*/
````

## File: templates/server-node-ts/README.md
````markdown
## Server Node TypeScript Template

This template shows the minimum server-side setup for Waypoint's
server-authorized route delivery model in a Node + TypeScript host.

It includes:

- principal extraction from HTTP requests
- server router creation
- compiler output snapshot loading
- navigation resolve and module endpoints
- browser app wiring for server-resolved route delivery

`projects/apps/app2/server` is expected to use its own copied files.
This directory is a starter tree, not a live source dependency for the demo
app build.
````

## File: templates/server-node-ts/tsconfig.app.json
````json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": { "types": [] },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
````

## File: templates/server-node-ts/tsconfig.spec.json
````json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
````

## File: .gitignore
````
# See https://docs.github.com/get-started/getting-started-with-git/ignoring-files for more about ignoring files.

# Compiled output
**/dist
/tmp
/out-tsc
/bazel-out

# Node
**/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/mcp.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings
__screenshots__/

# System files
.DS_Store
Thumbs.db
````

## File: docs/choosing-a-navigation-library.md
````markdown
# Choosing a Navigation Library

The navigation ecosystem consists of three libraries with a shared vocabulary but different navigation models.

They intentionally solve different problems.

All three libraries share the same design principles:

- typed navigation
- builder-style APIs
- layouts
- frames
- typed params and query schemas
- standalone-first Angular
- function-based lifecycle
- modern TypeScript

If you've learned one, the others will feel familiar.

The difference is **where navigation authority lives and how navigation itself is modeled**.

---

# Waypoint

**Server-side routing for Angular.**

Waypoint is designed for applications where the server should control which routes and route artifacts a browser is allowed to receive.

Routes are authored in TypeScript, compiled into server authorization metadata and browser artifacts, and delivered according to server-side policy. The client does not need to receive the complete protected route catalog up front.

Choose Waypoint when your application needs:

- server-authorized route delivery
- protected route artifacts
- role- or permission-based navigation
- deep linking and browser history
- layouts and named outlets
- typed URLs
- route lifecycle
- independently owned route branches

Waypoint still provides a familiar URL-based Angular routing runtime, but its defining feature is that route visibility and route-code delivery can be controlled before protected navigation reaches the browser.

---

# Routty

**The smallest possible router.**

Routty focuses on simplicity.

Instead of supporting every navigation scenario, it embraces flat route definitions with a tiny API surface.

Choose Routty when you want:

- minimal bundle size
- flat route tables
- straightforward applications
- libraries
- demos
- internal tools

If your application doesn't need advanced navigation concepts, Routty keeps everything intentionally small.

---

# Switchboard

**Navigation as a graph.**

Switchboard isn't centered around URLs.

Instead, applications are described as states connected by transitions.

Navigation becomes moving through a graph rather than matching paths.

This model is particularly well suited for:

- onboarding
- checkout
- installers
- editors
- workflow systems
- kiosk applications
- embedded applications
- state-driven experiences

Instead of asking

> "Which URL should I navigate to?"

you ask

> "Which state can I transition to?"

---

# Shared vocabulary

Although the navigation models differ, the ecosystem deliberately shares the same language.

```ts
route(...)
layout(...)
frame(...)
lazyRoute(...)
redirect(...)
```

Schemas are identical.

```ts
s.string(...)
s.number(...)
s.boolean(...)
s.array(...)
```

Lifecycle concepts remain familiar.

Moving between libraries shouldn't require relearning the API.

---

# Which library should I choose?

| If your application... | Choose |
|-------------------------|--------|
| needs server-controlled route visibility or route-code delivery | **Waypoint** |
| needs the smallest possible URL router | **Routty** |
| is built around workflows or state transitions | **Switchboard** |

Choose **Waypoint** when route authorization and delivery belong on the server.

Choose **Routty** when simplicity is the primary goal.

Choose **Switchboard** when navigation itself is part of the application's business logic.

---

# One philosophy, different models

These libraries are not editions of the same router.

Each optimizes for a different navigation problem.

Waypoint asks:

> Which routes should the server make available to this client?

Routty asks:

> What's the simplest way to reach this URL destination?

Switchboard asks:

> Which transition is valid from the current state?
````

## File: projects/apps/app1/tsconfig.spec.json
````json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.d.ts", "src/**/*.spec.ts"]
}
````

## File: projects/apps/app2/client/src/app/core/demo-session.service.ts
````typescript
import {
  inject,
  Injectable,
  InjectionToken,
  signal,
  type Provider,
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
  readonly prefersDraftGuard: boolean;
}

export interface WorkspaceSnapshot {
  readonly projectId: number;
  readonly loadOrder: number;
  readonly activeUserName: string;
  readonly activeUserRole: string;
  readonly recommendedDraftId: number;
  readonly suggestedFilters: readonly string[];
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
    prefersDraftGuard: false,
  },
] satisfies readonly DemoUser[]);

function readIdentityCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const identity = document.cookie
    .split(';')
    .map(value => value.trim())
    .find(value => value.startsWith('identity='))
    ?.slice('identity='.length);

  if (!identity) return null;

  try {
    return decodeURIComponent(identity);
  } catch {
    return null;
  }
}

function readSafeLocation(payload: unknown): string {
  if (
    !payload
    || typeof payload !== 'object'
    || typeof (payload as { location?: unknown }).location !== 'string'
  ) {
    throw new Error('Server returned an invalid navigation response.');
  }

  const location =
    (payload as { location: string }).location;

  if (
    !location.startsWith('/')
    || location.startsWith('//')
  ) {
    throw new Error('Server returned an unsafe navigation response.');
  }

  return location;
}

function initialDemoUser(): DemoUser {
  const identity = readIdentityCookie();
  return demoUsers.find(user => user.id === identity) ?? demoUsers[0];
}

export type DemoPrincipalSwitcher = (
  session: DemoSessionService,
  userId: string,
) => Promise<void>;

export const DEMO_PRINCIPAL_SWITCHER = new InjectionToken<DemoPrincipalSwitcher>(
  'DEMO_PRINCIPAL_SWITCHER',
);

@Injectable({
  providedIn: 'root',
})
export class DemoSessionService {
  readonly users = demoUsers;
  private readonly initialUser = initialDemoUser();
  private readonly router = inject(Router);
  private readonly principalSwitcher = inject(
    DEMO_PRINCIPAL_SWITCHER,
    { optional: true },
  );
  readonly currentUserId = signal(this.initialUser.id);
  readonly draftDirty = signal(
    this.initialUser.prefersDraftGuard,
  );
  readonly workspaceLoads = signal(0);
  private readonly realmIdentity = readIdentityCookie();

  constructor() {
    if (typeof window === 'undefined') return;

    window.addEventListener('pageshow', () => {
      if (readIdentityCookie() !== this.realmIdentity) {
        void this.router.reload().catch(() => {
          window.location.reload();
        });
      }
    });
  }

  currentUser(): DemoUser {
    return this.users.find(
      user => user.id === this.currentUserId(),
    ) ?? this.users[0];
  }

  activateLocalUser(userId: string): DemoUser {
    const user = this.users.find(candidate => candidate.id === userId);
    if (!user) {
      throw new Error(`Unknown demo principal "${userId}".`);
    }

    this.currentUserId.set(user.id);
    this.draftDirty.set(user.prefersDraftGuard);
    this.workspaceLoads.set(0);

    return user;
  }

  async switchPrincipal(userId: string): Promise<void> {
    if (this.principalSwitcher) {
      await this.principalSwitcher(this, userId);
      return;
    }

    const currentIdentity = readIdentityCookie();
    if (currentIdentity && currentIdentity !== userId) {
      await this.router.reload({
        reason: 'principal-change',
        target: `/?account=${encodeURIComponent(userId)}`,
      });
    }

    const response = await fetch('/api/session/principal', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identity: userId }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to activate principal "${userId}": ${response.status}.`,
      );
    }

    const payload: unknown = await response.json();
    window.location.replace(readSafeLocation(payload));
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

}

export function provideLocalDemoPrincipalSwitching(): Provider {
  return {
    provide: DEMO_PRINCIPAL_SWITCHER,
    useFactory: () => {
      return async (session: DemoSessionService, userId: string) => {
        const user = session.activateLocalUser(userId);
        const filters = user.focusFilters
          .map(filter => `filters=${encodeURIComponent(filter)}`)
          .join('&');
        const target =
          `/app/workspace/${user.homeProjectId}`
          + `?view=${encodeURIComponent(user.preferredView)}`
          + `&page=1`
          + (filters ? `&${filters}` : '');

        /*
         * Cross the account boundary with a full document load so route state,
         * resolved contributions, and view-local data from the previous
         * principal do not remain live in memory.
         */
        document.cookie =
          `identity=${encodeURIComponent(user.id)}; Path=/; SameSite=Lax`;
        window.location.replace(target);
      };
    },
  };
}
````

## File: projects/apps/app2/server/src/app/app.config.ts
````typescript
import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideServerRouter,
} from '@epikodelabs/waypoint/server';

import { routes } from './app.routes';
import { administrationRoutes } from '../../../client/src/app/routes/administration.routes';
import { applicationRoutes } from '../../../client/src/app/routes/application.routes';
import { publicRoutes } from '../../../client/src/app/routes/public.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    ...provideServerRouter(routes, {
      viewTransitions: true,
      contributions: [
        publicRoutes,
        applicationRoutes,
        administrationRoutes,
      ],
    }),
  ],
};
````

## File: projects/apps/app2/server/src/server.ts
````typescript
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import path from 'node:path';
import {
  createExpressServerRouterHandlers,
  createServerRouter,
} from '@epikodelabs/waypoint/server';

import {
  compilerOutputSource,
  resolveOutputPath,
  type ArtifactDescriptor,
  type Branch,
} from './compiler-output.js';
import { demoPrincipalProfile, readPrincipal } from './route-auth.js';

const browserDistFolder = path.join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

const serverRouter = createServerRouter<ArtifactDescriptor, Branch>({
  loadSnapshot: compilerOutputSource.loadSnapshot,
  moduleUrlFor: artifact =>
    `/api/navigation/modules/${encodeURIComponent(artifact.artifactKey)}`
    + `/${encodeURIComponent(artifact.hash ?? '')}`,
});

const navigation = createExpressServerRouterHandlers<
  ArtifactDescriptor,
  Request,
  Response
>({
  router: serverRouter,
  principalFrom: request => request.principal,
  artifactPathFor: artifact => {
    if (!artifact.file) {
      throw new Error(`Artifact "${artifact.artifactKey}" has no published file.`);
    }
    return resolveOutputPath(artifact.file);
  },
  reload: {
    publicLocation: '/?account=choose',
    landingTargets: ['/?account=choose'],
    async resetPrincipal(_request, response) {
      response
        .set({
          'Clear-Site-Data': '"cache"',
        })
        .clearCookie('identity', {
          path: '/',
          sameSite: 'lax',
        });
    },
  },
});

app.use(express.json({ limit: '16kb' }));
app.use(readPrincipal);

app.post('/api/session/principal', async (request, response, next) => {
  try {
    const profile = demoPrincipalProfile(request.body?.identity);
    if (!profile) {
      response.status(400).set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      }).json({ error: 'Unknown demo principal.' });
      return;
    }

    const location = await serverRouter.resolveLanding(
      profile.landingTargets,
      profile.principal,
    );
    if (!location) {
      response.status(403).set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      }).json({ error: 'No authorized landing route.' });
      return;
    }

    response
      .status(200)
      .set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      })
      .cookie('identity', profile.id, {
        path: '/',
        sameSite: 'lax',
      })
      .json({ location });
  } catch (error) {
    next(error);
  }
});

app.get('/api/ping', (_request, response) => {
  response.json({
    ok: true,
    runtime: 'express',
    renderedAt: new Date().toISOString(),
  });
});

app.post('/api/navigation/reload', navigation.reload);
app.get('/api/navigation/resolve', navigation.resolve);
app.get('/api/navigation/modules/:artifactKey/:hash', navigation.module);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use(
  (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    angularApp
      .handle(request)
      .then(result =>
        result
          ? writeResponseToNodeResponse(result, response)
          : next(),
      )
      .catch(next);
  },
);

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, error => {
    if (error) throw error;

    console.log(
      `Node Express server listening on http://localhost:${port}`,
    );
  });
}

export const reqHandler = createNodeRequestHandler(app);
````

## File: projects/libraries/waypoint/server/public-api.ts
````typescript
export * from './browser-delivery';
export * from './server-delivery';
export * from './server-express';
export * from './server-host-runtime';
export * from './server-http';
export * from './server-router';
export * from './server-routing';
export * from './server-source';
export {
  provideServerRouter,
  type NamedRouteDefinition,
  type ResolvedNavigationConfiguration,
  type RouteResolution,
  type RouteResolutionContext,
  RouterReloadError,
  type RouterReloadOptions,
  type RouterReloadReason,
  type RouterOptions,
} from '@epikodelabs/waypoint';
export { type RouterRevalidationOptions } from '@epikodelabs/waypoint';
````

## File: projects/libraries/waypoint/src/lib/route-adapter.ts
````typescript
import {
  reflectComponentType,
  type EnvironmentInjector,
  type Type,
} from '@angular/core';

import type { NavigationProviders } from './navigation-definitions';
import type { ActivatedRoute, RouteComponent } from './vanilla-router';

const componentInputs =
  new WeakMap<
    Type<unknown>,
    readonly {
      readonly templateName: string;
      readonly propName: string;
    }[]
  >();

export interface InputBindingTarget {
  setInput(name: string, value: unknown): void;
}

export type RouteComponentRenderer = (
  component: Type<unknown>,
  injector: EnvironmentInjector,
  routeProviders?: NavigationProviders,
) => RouteComponent;

export interface RouteAdapterContext {
  readonly injector: EnvironmentInjector;
  readonly render: RouteComponentRenderer;
}

export function adaptRouteComponent(
  component: Type<unknown>,
  context: RouteAdapterContext,
  routeProviders?: NavigationProviders,
): RouteComponent {
  return context.render(component, context.injector, routeProviders);
}

export function bindRouteInputs(
  target: InputBindingTarget,
  component: Type<unknown>,
  route: ActivatedRoute,
): void {
  let inputs =
    componentInputs.get(component);

  if (!inputs) {
    inputs =
      reflectComponentType(component)
        ?.inputs ?? [];

    componentInputs.set(
      component,
      inputs,
    );
  }

  const data = route.data ?? {};
  // Parsed route inputs stay grouped by their source so component bindings are
  // explicit and collision-free.
  const values: Record<string, unknown> = {
    url: route.url,
    path: route.path,
    params: {
      ...route.params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(((data as any)?.__params ?? {}) as Record<string, unknown>),
    },
    query: {
      ...route.query,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(((data as any)?.__query ?? {}) as Record<string, unknown>),
    },
    data: Object.fromEntries(
      Object.entries(data).filter(
        ([key]) =>
          key !== '__params' &&
          key !== '__query',
      ),
    ),
    historyState: route.historyState,
    config: route.config,
  };

  for (const input of inputs) {
    const value =
      values[input.templateName] ??
      values[input.propName];

    if (value !== undefined) {
      target.setInput(input.templateName, value);
    }
  }
}
````

## File: projects/libraries/waypoint/src/lib/route-path.ts
````typescript
export type RoutePathSegment =
  | {
      readonly kind: 'literal';
      readonly value: string;
    }
  | {
      readonly kind: 'parameter';
      readonly name: string;
    };

export interface CompiledRoutePath {
  readonly source: string;
  readonly segments: readonly RoutePathSegment[];
  readonly parameterNames: readonly string[];
  readonly patternKey: string;
}

const PARAMETER_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function splitRoutePath(path: string): readonly string[] {
  return Object.freeze(
    path
      .split('/')
      .filter(Boolean),
  );
}

export function joinRoutePath(
  parent: string,
  child: string,
): string {
  const joined = [
    ...splitRoutePath(parent),
    ...splitRoutePath(child),
  ].join('/');

  return joined ? `/${joined}` : '/';
}

export function compileRoutePath(path: string): CompiledRoutePath {
  const rawSegments = splitRoutePath(path);
  const parameterNames: string[] = [];

  const segments = rawSegments.map<RoutePathSegment>((segment) => {
    if (!segment.startsWith(':')) {
      return Object.freeze({
        kind: 'literal',
        value: segment,
      });
    }

    const name = segment.slice(1);
    if (!PARAMETER_NAME.test(name)) {
      throw new Error(
        `Invalid path parameter segment "${segment}" in route "${path}". ` +
        'Parameter names must match [A-Za-z_][A-Za-z0-9_]*.',
      );
    }

    parameterNames.push(name);
    return Object.freeze({
      kind: 'parameter',
      name,
    });
  });

  return Object.freeze({
    source: path,
    segments: Object.freeze(segments),
    parameterNames: Object.freeze(parameterNames),
    patternKey: segments
      .map(segment => segment.kind === 'parameter' ? ':' : segment.value)
      .join('/'),
  });
}

export function extractRouteParamNames(path: string): readonly string[] {
  return compileRoutePath(path).parameterNames;
}

function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function matchRoutePath(
  pattern: CompiledRoutePath,
  path: string | readonly string[],
): Readonly<Record<string, string>> | null {
  const actualSegments =
    typeof path === 'string'
      ? splitRoutePath(path)
      : path;

  if (pattern.segments.length !== actualSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let index = 0; index < pattern.segments.length; index++) {
    const expected = pattern.segments[index]!;
    const actual = actualSegments[index];

    if (actual === undefined) {
      return null;
    }

    if (expected.kind === 'parameter') {
      params[expected.name] = decodeRouteSegment(actual);
      continue;
    }

    if (expected.value !== actual) {
      return null;
    }
  }

  return Object.freeze(params);
}
````

## File: projects/libraries/waypoint/src/lib/route-slots.ts
````typescript
import type {
  NavigationTree,
  RouteContributionDefinition,
  RouteSlotDefinition,
} from './navigation-definitions';

export function routeSlot<
  const TId extends string,
>(
  id: TId,
): RouteSlotDefinition<TId> {
  return Object.freeze({
    kind: 'route-slot',
    id: normalizeRouteIdentity(id, 'Route slot') as TId,
  });
}

export function routesFor<
  const TSlotId extends string,
  const TId extends string,
  const TEntries extends NavigationTree,
>(
  slotId: TSlotId,
  id: TId,
  entries: TEntries,
): RouteContributionDefinition<TSlotId, TId, TEntries> {
  return Object.freeze({
    kind: 'route-contribution',
    slotId: normalizeRouteIdentity(
      slotId,
      'Route contribution slot',
    ) as TSlotId,
    id: normalizeRouteIdentity(
      id,
      'Route contribution',
    ) as TId,
    entries,
  });
}

export function normalizeRouteIdentity(
  value: string,
  label: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${label} id must not be empty.`);
  }

  return normalized;
}
````

## File: projects/libraries/waypoint/src/lib/router-events.ts
````typescript
export const OUTLET_ACTIVATE_EVENT = 'waypoint:outlet-activate';
export const OUTLET_DEACTIVATE_EVENT = 'waypoint:outlet-deactivate';
export const ROUTER_LOCATION_CHANGE_EVENT = 'waypoint:location-change';

const OUTLET_QUERY = 'router-outlet';

function isOutletElement(
  element: HTMLElement,
  targetName: string,
): boolean {
  const tagName = element.tagName.toLowerCase();
  if (
    tagName !== 'router-outlet'
  ) {
    return false;
  }

  return (element.getAttribute('name') ?? '') === targetName;
}

export function dispatchOutletLifecycleEvent(
  target: EventTarget,
  type: typeof OUTLET_ACTIVATE_EVENT | typeof OUTLET_DEACTIVATE_EVENT,
  component: unknown,
): void {
  target.dispatchEvent(
    new CustomEvent(type, {
      detail: component,
    }),
  );
}

export function dispatchRouterLocationChange(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(
      ROUTER_LOCATION_CHANGE_EVENT,
    ),
  );
}

export function findOutlet(
  node: Node,
  name?: string | null,
): HTMLElement | null {
  if (!(node instanceof Element || node instanceof DocumentFragment)) {
    return null;
  }

  const targetName = name ?? '';

  if (
    node instanceof HTMLElement &&
    isOutletElement(node, targetName)
  ) {
    return node;
  }

  return (
    Array.from(
      node.querySelectorAll<HTMLElement>(OUTLET_QUERY),
    ).find(element =>
      isOutletElement(element, targetName),
    ) ?? null
  );
}

export function findContainingOutlet(
  node: Element,
): HTMLElement | null {
  return node.closest<HTMLElement>(OUTLET_QUERY);
}
````

## File: projects/libraries/waypoint/src/lib/server-delivery.ts
````typescript
export * from '../../server/server-delivery';
````

## File: projects/libraries/waypoint/src/lib/server-express.ts
````typescript
export * from '../../server/server-express';
````

## File: projects/libraries/waypoint/src/lib/server-http.ts
````typescript
export * from '../../server/server-http';
````

## File: projects/libraries/waypoint/src/lib/typed-navigation.ts
````typescript
import type {
  InferParamType,
  InferQueryInputType,
  InferQueryType,
  ParamSchemaRecord,
  QuerySchemaRecord,
} from './query-schema';
import type {
  RouteDefinition, NavigationTree
} from './navigation-definitions';

/**
 * Extracts named parameter tokens from path string templates (e.g. "/users/:id")
 */
export type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

/**
 * Recursively flattens all routes and layout entries into a union of leaf routes.
 */
export type LeafRouteDefinitions<TRoutes extends NavigationTree> =
  TRoutes[number] extends infer TEntry ? TEntry extends { kind: 'route' } ? TEntry : TEntry extends { kind: 'layout', entries: infer TEntries extends NavigationTree } ? LeafRouteDefinitions<TEntries> : never : never;

type RouteName<TRoute> = TRoute extends RouteDefinition<
  string,
  infer TName,
  ParamSchemaRecord | undefined,
  QuerySchemaRecord | undefined
>
  ? Extract<TName, string>
  : never;

/**
 * Extracts route names safely across layout entries without deep recursion.
 */
export type ExtractRouteNames<TRoutes extends NavigationTree> =
  RouteName<LeafRouteDefinitions<TRoutes>>;

/**
 * Infers route path parameter types from paramsSchema or path template tokens.
 */
export type InferRouteParams<TRoute> =
  TRoute extends RouteDefinition<
    infer TPath extends string,
    string | undefined,
    infer TParamsSchema,
    QuerySchemaRecord | undefined
  >
    ? [TParamsSchema] extends [ParamSchemaRecord]
      ? InferParamType<TParamsSchema>
      : [ExtractPathParams<TPath>] extends [never]
        ? Record<string, never>
        : Readonly<Record<ExtractPathParams<TPath>, string>>
    : Record<string, unknown>;

/**
 * Infers route query parameter types from querySchema or searchSchema.
 */
export type InferRouteQuery<TRoute> =
  TRoute extends RouteDefinition<
    string,
    string | undefined,
    ParamSchemaRecord | undefined,
    infer TQuerySchema
  >
    ? [TQuerySchema] extends [QuerySchemaRecord]
      ? InferQueryType<TQuerySchema>
      : Record<string, unknown>
    : Record<string, unknown>;

export type InferRouteQueryInput<TRoute> =
  TRoute extends RouteDefinition<
    string,
    string | undefined,
    ParamSchemaRecord | undefined,
    infer TQuerySchema
  >
    ? [TQuerySchema] extends [QuerySchemaRecord]
      ? InferQueryInputType<TQuerySchema>
      : Record<string, unknown>
    : Record<string, unknown>;

type HasRequiredParams<TRoute> =
  InferRouteParams<TRoute> extends infer TParams
    ? keyof TParams extends never
      ? false
      : TParams extends Record<string, never>
      ? false
      : true
    : false;

/**
 * Maps options (params, query, search, navigation state) for a target route name.
 */
export type RouteOptionsByName<
  TRoutes extends NavigationTree,
  TName extends string,
> = LeafRouteDefinitions<TRoutes> extends infer TRoute
  ? TRoute extends RouteDefinition<string, TName, any, any>
    ? HasRequiredParams<TRoute> extends true
      ? {
          readonly params: InferRouteParams<TRoute>;
          readonly query?: InferRouteQueryInput<TRoute>;
          readonly state?: unknown;
          readonly replace?: boolean;
        }
      : {
          readonly params?: InferRouteParams<TRoute>;
          readonly query?: InferRouteQueryInput<TRoute>;
          readonly state?: unknown;
          readonly replace?: boolean;
        }
    : never
  : never;

/**
 * Strongly-typed navigation proxy for Router.
 */
export type TypedNavigate<TRoutes extends NavigationTree> = {
  [K in ExtractRouteNames<TRoutes>]: (
    options?: RouteOptionsByName<TRoutes, K>,
  ) => Promise<boolean>;
};

/**
 * Strongly-typed href generator proxy for Router.
 */
export type TypedHref<TRoutes extends NavigationTree> = {
  [K in ExtractRouteNames<TRoutes>]: (
    options?: RouteOptionsByName<TRoutes, K>,
  ) => string | null;
};

type Simplify<T> = { readonly [K in keyof T]: T[K] };
type MergeData<TLeft, TRight> = Simplify<TLeft & TRight>;

type StaticRouteData<TEntry> =
  TEntry extends { readonly data?: infer TData }
    ? TData extends Readonly<Record<string, unknown>>
      ? TData
      : Readonly<Record<string, never>>
    : Readonly<Record<string, never>>;

type FrameData<TEntry> =
  TEntry extends { readonly frame?: infer TFrame }
    ? import('./navigation-definitions').InferFrameData<TFrame>
    : Readonly<Record<string, never>>;

type PreparedDataForName<
  TEntries extends NavigationTree,
  TName extends string,
  TInherited = Readonly<Record<string, never>>,
> =
  TEntries[number] extends infer TEntry
    ? TEntry extends {
        readonly kind: 'layout';
        readonly entries: infer TChildren extends NavigationTree;
      }
      ? PreparedDataForName<
          TChildren,
          TName,
          MergeData<TInherited, MergeData<StaticRouteData<TEntry>, FrameData<TEntry>>>
        >
      : TEntry extends {
          readonly kind: 'route';
          readonly name?: infer TRouteName;
        }
        ? TRouteName extends TName
          ? MergeData<TInherited, MergeData<StaticRouteData<TEntry>, FrameData<TEntry>>>
          : never
        : never
    : never;

/**
 * Infers the complete activated data for a named route, including enclosing
 * layout data and all frame prepare results. Unknown names resolve to never.
 */
export type InferNavigationPreparedData<
  TEntries extends NavigationTree,
  TName extends string,
> = PreparedDataForName<TEntries, TName>;
````

## File: projects/libraries/waypoint/src/tests/adapters.spec.ts
````typescript
import { Component, Input } from '@angular/core';

import {
  adaptRouteComponent,
  bindRouteInputs,
  type NavigationProviders,
} from '@epikodelabs/waypoint';

@Component({
  template: '',
})
class TestRouteComponent {}

type ActivatedRoute = Parameters<typeof bindRouteInputs>[2];

function createRoute(
  overrides: Partial<ActivatedRoute> = {},
): ActivatedRoute {
  return {
    path: '/projects/42',
    params: {},
    query: {},
    data: {},
    ...overrides,
  } as ActivatedRoute;
}

describe('router adapters', () => {
  it('binds route inputs by source instead of flattening them', () => {
    const target = {
      setInput: jasmine.createSpy('setInput'),
    };

    @Component({ template: '' })
    class TestInputsComponent {
      @Input() params!: Record<string, unknown>;
      @Input() query!: Record<string, unknown>;
      @Input() data!: Record<string, unknown>;
      @Input() projectId!: number;
    }

    const route = createRoute({
      params: {
        projectId: '7',
        section: 'overview',
      },
      query: {
        tab: 'activity',
        sort: 'oldest',
      },
      data: {
        'project-id': 42,
        user: 'Ada',
        __params: {
          projectId: 42,
        },
        __query: {
          tab: 'settings',
        },
        sort: 'recent',
      },
    });

    bindRouteInputs(target, TestInputsComponent, route);

    expect(target.setInput).toHaveBeenCalledTimes(3);
    expect(target.setInput).toHaveBeenCalledWith(
      'params',
      {
        projectId: 42,
        section: 'overview',
      },
    );
    expect(target.setInput).toHaveBeenCalledWith(
      'query',
      {
        tab: 'settings',
        sort: 'oldest',
      },
    );
    expect(target.setInput).toHaveBeenCalledWith(
      'data',
      {
        'project-id': 42,
        user: 'Ada',
        sort: 'recent',
      },
    );
    expect(target.setInput).not.toHaveBeenCalledWith('projectId', jasmine.anything());
  });

  it('returns the renderer-produced route component and passes route providers', () => {
    const providers: NavigationProviders = [
      {
        provide: 'ROUTE_MESSAGE',
        useValue: 'scoped',
      },
    ];

    const rendered = jasmine.createSpy('rendered');
    const render = jasmine
      .createSpy('render')
      .and.returnValue(rendered);

    const context = {
      injector: {
        kind: 'injector',
      },
      render,
    } as any;

    const routeComponent = adaptRouteComponent(
      TestRouteComponent,
      context,
      providers,
    );

    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(
      TestRouteComponent,
      context.injector,
      providers,
    );
    expect(routeComponent).toBe(rendered);
  });
});
````

## File: projects/libraries/waypoint/src/tests/browser-delivery.spec.ts
````typescript
import {
  createServerNavigationResolver,
  isRouteContributionDefinition,
  type ServerNavigationFetch,
} from '../lib/browser-delivery';
import type { RouteContributionDefinition } from '../lib/navigation-definitions';

function contribution(
  id: string,
  slotId = 'application',
): RouteContributionDefinition {
  return {
    kind: 'route-contribution',
    id,
    slotId,
    entries: [],
  };
}

function response(
  status: number,
  body: unknown,
): Awaited<ReturnType<ServerNavigationFetch>> {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  };
}

describe('browser server delivery', () => {
  it('validates route contribution exports', () => {
    expect(isRouteContributionDefinition(contribution('workspace'))).toBeTrue();
    expect(isRouteContributionDefinition({
      kind: 'route-contribution',
      id: '',
      slotId: 'application',
      entries: [],
    })).toBeFalse();
    expect(isRouteContributionDefinition({
      kind: 'route-contribution',
      id: 'workspace',
      slotId: 'application',
      entries: {},
    })).toBeFalse();
  });

  it('requests one server resolution and imports artifacts dependency-first', async () => {
    const requests: string[] = [];
    const imports: string[] = [];
    const fetch: ServerNavigationFetch = async input => {
      requests.push(input);
      return response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [
          { artifactKey: 'shell', moduleUrl: '/modules/shell.js', hash: 'SHELL' },
          { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'WORK' },
        ],
      });
    };

    const resolve = createServerNavigationResolver({
      fetch,
      async importModule(url) {
        imports.push(url);
        return {
          default: contribution(url.includes('shell') ? 'shell' : 'workspace'),
        };
      },
    });

    const result = await resolve(new URL(
      'https://waypoint.test/app/workspace/101?view=overview#details',
    ));

    expect(requests).toEqual([
      '/api/navigation/resolve?path=%2Fapp%2Fworkspace%2F101%3Fview%3Doverview%23details',
    ]);
    expect(imports).toEqual(['/modules/shell.js', '/modules/workspace.js']);
    expect(result?.contributions?.map(item => item.id)).toEqual([
      'shell',
      'workspace',
    ]);
  });

  it('treats hidden and unknown destinations identically', async () => {
    const resolve = createServerNavigationResolver({
      fetch: async () => response(404, { error: 'Route not found.' }),
      importModule: async () => {
        throw new Error('must not import');
      },
    });

    expect(await resolve(new URL('https://waypoint.test/hidden'))).toBeNull();
  });

  it('rejects malformed delivery responses before importing code', async () => {
    let imports = 0;
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [],
      }),
      importModule: async () => {
        imports += 1;
        return {};
      },
    });

    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/invalid Waypoint navigation resolution/i);
    expect(imports).toBe(0);
  });

  it('deduplicates concurrent imports for the same content identity', async () => {
    let imports = 0;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const fetch: ServerNavigationFetch = async () => response(200, {
      version: 1,
      artifactKey: 'workspace',
      artifacts: [
        { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH' },
      ],
    });
    const resolver = createServerNavigationResolver({
      fetch,
      async importModule() {
        imports += 1;
        await gate;
        return { default: contribution('workspace') };
      },
    });

    const first = resolver(new URL('https://waypoint.test/app/workspace'));
    const second = resolver(new URL('https://waypoint.test/app/workspace'));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(imports).toBe(1);

    release();
    await Promise.all([first, second]);
    expect(imports).toBe(1);
  });

  it('loads a new content hash under the same stable artifact key', async () => {
    let hash = 'A';
    const imports: string[] = [];
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [{
          artifactKey: 'workspace',
          moduleUrl: `/modules/workspace-${hash}.js`,
          hash,
        }],
      }),
      async importModule(url) {
        imports.push(url);
        return { default: contribution(`workspace-${hash}`) };
      },
    });

    await resolve(new URL('https://waypoint.test/app/workspace'));
    hash = 'B';
    await resolve(new URL('https://waypoint.test/app/workspace'));
    await resolve(new URL('https://waypoint.test/app/workspace'));

    expect(imports).toEqual([
      '/modules/workspace-A.js',
      '/modules/workspace-B.js',
    ]);
  });

  it('evicts a failed artifact import so a later resolution can retry', async () => {
    let attempts = 0;
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [
          { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH' },
        ],
      }),
      async importModule() {
        attempts += 1;
        if (attempts === 1) throw new Error('temporary import failure');
        return { default: contribution('workspace') };
      },
    });

    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/temporary import failure/);
    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeResolved();
    expect(attempts).toBe(2);
  });

  it('rejects modules that do not export a routesFor contribution', async () => {
    const resolve = createServerNavigationResolver({
      fetch: async () => response(200, {
        version: 1,
        artifactKey: 'workspace',
        artifacts: [
          { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH' },
        ],
      }),
      importModule: async () => ({ default: [] }),
    });

    await expectAsync(resolve(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/did not export a route contribution/i);
  });

  it('requires host module identities when using native artifact imports', () => {
    expect(() => createServerNavigationResolver()).toThrowError(/hostModules/i);
  });

  it('requires the active Waypoint identity for native artifact imports', () => {
    expect(() => createServerNavigationResolver({
      hostModules: {
        '@angular/core': {},
      },
    })).toThrowError(/@epikodelabs\/waypoint/i);
  });

  it('supports a custom resolution endpoint', async () => {
    let request = '';
    const resolve = createServerNavigationResolver({
      endpoint: '/internal/waypoint/resolve?',
      fetch: async input => {
        request = input;
        return response(404, null);
      },
      importModule: async () => ({ default: contribution('unused') }),
    });

    await resolve(new URL('https://waypoint.test/app'));
    expect(request).toBe('/internal/waypoint/resolve?path=%2Fapp');
  });
});

// Hardening: delivery work follows router cancellation and publication generations.
describe('browser delivery hardening', () => {
  it('passes an abort signal to server resolution and stops before importing artifacts', async () => {
    let seenSignal: AbortSignal | undefined;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let imports = 0;
    const resolver = createServerNavigationResolver({
      async fetch(_input, init) {
        seenSignal = init.signal;
        await gate;
        return response(200, {
          version: 1,
          artifactKey: 'workspace',
          artifacts: [
            { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH' },
          ],
        });
      },
      async importModule() {
        imports += 1;
        return { default: contribution('workspace') };
      },
    });
    const controller = new AbortController();
    const pending = resolver(
      new URL('https://waypoint.test/app/workspace'),
      { signal: controller.signal },
    );

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(seenSignal).toBe(controller.signal);
    controller.abort();
    release();

    await expectAsync(pending).toBeRejected();
    expect(imports).toBe(0);
  });

  it('re-resolves once when an artifact URL becomes stale during publication', async () => {
    let resolution = 0;
    const imports: string[] = [];
    const resolver = createServerNavigationResolver({
      async fetch() {
        resolution += 1;
        const hash = resolution === 1 ? 'OLD' : 'NEW';
        return response(200, {
          version: 1,
          artifactKey: 'workspace',
          artifacts: [{
            artifactKey: 'workspace',
            moduleUrl: `/modules/workspace-${hash}.js`,
            hash,
          }],
        });
      },
      async importModule(url) {
        imports.push(url);
        if (url.endsWith('-OLD.js')) {
          throw new Error('404 during publication rollover');
        }
        return { default: contribution('workspace') };
      },
    });

    const result = await resolver(new URL('https://waypoint.test/app/workspace'));

    expect(resolution).toBe(2);
    expect(imports).toEqual([
      '/modules/workspace-OLD.js',
      '/modules/workspace-NEW.js',
    ]);
    expect(result?.contributions[0]?.id).toBe('workspace');
  });

  it('does not retry deterministic malformed artifact exports', async () => {
    let resolutions = 0;
    const resolver = createServerNavigationResolver({
      async fetch() {
        resolutions += 1;
        return response(200, {
          version: 1,
          artifactKey: 'workspace',
          artifacts: [
            { artifactKey: 'workspace', moduleUrl: '/modules/workspace.js', hash: 'HASH' },
          ],
        });
      },
      importModule: async () => ({ default: [] }),
    });

    await expectAsync(resolver(new URL('https://waypoint.test/app/workspace')))
      .toBeRejectedWithError(/did not export a route contribution/i);
    expect(resolutions).toBe(1);
  });
});
````

## File: projects/libraries/waypoint/src/tests/query-schema-strict.spec.ts
````typescript
import {
  parseParams,
  parseQuery,
  s,
} from '../lib/query-schema';

describe('strict route schema parsing', () => {
  it('rejects numbers below their minimum instead of clamping them', () => {
    expect(() => parseParams(
      { id: s.number({ min: 1 }) },
      { id: '0' },
    )).toThrowError(/below the minimum 1/);
  });

  it('rejects numbers above their maximum instead of clamping them', () => {
    expect(() => parseParams(
      { page: s.number({ max: 10 }) },
      { page: '11' },
    )).toThrowError(/above the maximum 10/);
  });

  it('rejects invalid booleans instead of treating them as false', () => {
    expect(() => parseQuery(
      { enabled: s.boolean() },
      new URL('https://example.test/?enabled=banana'),
    )).toThrowError(/Invalid boolean value/);
  });

  it('does not use a default to hide an invalid supplied value', () => {
    expect(() => parseQuery(
      { page: s.number({ default: 1 }) },
      new URL('https://example.test/?page=nope'),
    )).toThrowError(/Invalid number value/);
  });

  it('rejects missing required path parameters', () => {
    expect(() => parseParams(
      { id: s.number() },
      {},
    )).toThrowError(/Missing required path parameter "id"/);
  });
});
````

## File: projects/libraries/waypoint/src/tests/query-schema.spec.ts
````typescript
import {
  s,
  serializeQuery,
} from '@epikodelabs/waypoint';

describe('query schema serialization', () => {
  it('omits array values that match the schema default', () => {
    const query =
      serializeQuery(
        {
          filters: s.array(['active', 'recent']),
          page: s.number({ default: 1 }),
        },
        {
          filters: ['active', 'recent'],
          page: 1,
        },
      );

    expect(query).toBe('');
  });

  it('serializes array values when they differ from the schema default', () => {
    const query =
      serializeQuery(
        {
          filters: s.array(['active']),
        },
        {
          filters: ['active', 'recent'],
        },
      );

    expect(query).toBe('?filters=active&filters=recent');
  });
});
````

## File: projects/libraries/waypoint/src/tests/route-path.spec.ts
````typescript
import {
  compileRoutePath,
  joinRoutePath,
  matchRoutePath,
} from '../lib/route-path';

describe('route path', () => {
  it('compiles literals and parameters once', () => {
    const pattern = compileRoutePath('/teams/:teamId/users/:userId');

    expect(pattern.parameterNames).toEqual(['teamId', 'userId']);
    expect(pattern.patternKey).toBe('teams/:/users/:');
  });

  it('rejects malformed parameter segments', () => {
    expect(() => compileRoutePath('/users/:user-id')).toThrowError(
      /Invalid path parameter segment/,
    );
  });

  it('matches and decodes parameter values', () => {
    const match = matchRoutePath(
      compileRoutePath('/users/:id'),
      '/users/hello%20world',
    );

    expect(match).toEqual({ id: 'hello world' });
  });

  it('requires an exact segment count', () => {
    const pattern = compileRoutePath('/users/:id');

    expect(matchRoutePath(pattern, '/users')).toBeNull();
    expect(matchRoutePath(pattern, '/users/1/details')).toBeNull();
  });

  it('joins normalized route paths', () => {
    expect(joinRoutePath('/app/', '/users/:id/')).toBe('/app/users/:id');
  });
});
````

## File: projects/libraries/waypoint/src/tests/route-slots.spec.ts
````typescript
import { Component } from '@angular/core';

import {
  routesFor,
  routeSlot,
} from '../lib/route-slots';
import { layout, route } from '../lib/route-builders';
import {
  compileNavigation,
  createRouteRegistry,
} from '../lib/route-compiler';

@Component({ template: '' })
class AppLayout {}

@Component({ template: '' })
class AdminLayout {}

@Component({ template: '' })
class HomePage {}

@Component({ template: '' })
class UsersPage {}

@Component({ template: '' })
class RolesPage {}

describe('Waypoint retained route slots', () => {
  it('compiles contributions relative to the declared slot position', () => {
    const routes = [
      layout('/app', AppLayout, [
        route('/home', HomePage),
        layout('/admin', AdminLayout, [
          routeSlot('administration'),
        ]),
      ]),
    ] as const;

    const administration = routesFor(
      'administration',
      'admin-core',
      [
        route('/users', UsersPage, { name: 'adminUsers' }),
        route('/roles', RolesPage, { name: 'adminRoles' }),
      ],
    );

    const registry = createRouteRegistry(routes, [administration]);

    expect(registry.namedRoutes.get('adminUsers')?.fullPath)
      .toBe('/app/admin/users');
    expect(registry.namedRoutes.get('adminRoles')?.fullPath)
      .toBe('/app/admin/roles');
  });

  it('retains empty slots in the registry', () => {
    const routes = [
      layout('/app', AppLayout, [
        route('/home', HomePage, { name: 'home' }),
        routeSlot('optional-features'),
      ]),
    ] as const;

    const registry = createRouteRegistry(routes);
    const slot = registry.slots.get('optional-features');

    expect(registry.namedRoutes.get('home')?.fullPath).toBe('/app/home');
    expect(registry.groups.length).toBe(1);
    expect(slot?.parentPath).toBe('/app');
    expect(slot?.layouts.map(layout => layout.path)).toEqual(['/app']);
  });

  it('retains contribution identity and compiled route provenance', () => {
    const routes = [
      layout('/app', AppLayout, [
        routeSlot('administration'),
      ]),
    ] as const;
    const contribution = routesFor(
      'administration',
      'admin-users',
      [route('/users', UsersPage, { name: 'adminUsers' })],
    );

    const registry = createRouteRegistry(routes, [contribution]);
    const compiledContribution = registry.contributions.get('admin-users');
    const namedRoute = registry.namedRoutes.get('adminUsers');

    expect(compiledContribution?.slotId).toBe('administration');
    expect(compiledContribution?.routes.length).toBe(1);
    expect(compiledContribution?.routes[0].path).toBe('/app/users');
    expect(compiledContribution?.routes[0].slotId).toBe('administration');
    expect(compiledContribution?.routes[0].contributionId).toBe('admin-users');
    expect(namedRoute?.slotId).toBe('administration');
    expect(namedRoute?.contributionId).toBe('admin-users');
  });

  it('exposes retained identities through compileNavigation', () => {
    const routes = [routeSlot('features')] as const;
    const contribution = routesFor(
      'features',
      'feature-a',
      [route('/feature', UsersPage)],
    );

    const compiled = compileNavigation(routes, [contribution]);

    expect(compiled.slots.has('features')).toBeTrue();
    expect(compiled.contributions.has('feature-a')).toBeTrue();
    expect(compiled.routes[0].path).toBe('/feature');
  });

  it('rejects duplicate slot ids', () => {
    const routes = [
      routeSlot('features'),
      layout('/app', AppLayout, [routeSlot('features')]),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /Duplicate route slot id "features"/,
    );
  });

  it('rejects unknown contribution slots', () => {
    const contribution = routesFor(
      'missing',
      'missing-feature',
      [route('/feature', UsersPage)],
    );

    expect(() => createRouteRegistry([], [contribution])).toThrowError(
      /targets unknown route slot "missing"/,
    );
  });

  it('rejects duplicate contribution ids', () => {
    const routes = [
      routeSlot('first'),
      routeSlot('second'),
    ] as const;
    const first = routesFor('first', 'feature', []);
    const second = routesFor('second', 'feature', []);

    expect(() => createRouteRegistry(routes, [first, second])).toThrowError(
      /Duplicate route contribution id "feature"/,
    );
  });

  it('validates inherited parameter collisions in contributed routes', () => {
    const routes = [
      layout('/devices/:id', AppLayout, [
        routeSlot('device-features'),
      ]),
    ] as const;
    const contribution = routesFor(
      'device-features',
      'boards',
      [route('/boards/:id', UsersPage)],
    );

    expect(() => createRouteRegistry(routes, [contribution])).toThrowError(
      /Duplicate path parameter ":id"/,
    );
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-configuration.spec.ts
````typescript
import {
  createRouter,
  type NavigationTransitionDefinition,
  type Route,
  type VanillaRouter,
} from '@epikodelabs/waypoint';

import { idescribe } from './env.spec';
import {
  assertRouterInvariant,
} from './router-test-utils';

interface Deferred<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;

  return {
    promise: new Promise<T>(
      accept => {
        resolve = accept;
      },
    ),
    resolve,
  };
}

function route(
  path: string,
  text: string,
): Route {
  return {
    path,
    load: async () => ({
      component: () =>
        document.createTextNode(text),
    }),
  };
}

idescribe('Router atomic configuration replacement', () => {
  let outlet: HTMLElement;
  let router: VanillaRouter;

  beforeEach(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    window.history.replaceState(null, '', '/');

    spyOn(console, 'debug');
    spyOn(console, 'error');
  });

  afterEach(() => {
    router?.dispose();
    window.history.replaceState(null, '', '/');
    outlet.remove();
  });

  it('returns false when route and transition references are unchanged', () => {
    const home = route('', 'Home');
    const transition:
      NavigationTransitionDefinition = {};

    router = createRouter({
      routes: [home],
      transitions: [transition],
      outlet,
    });

    expect(
      router.replaceConfiguration({
        routes: [home],
        transitions: [transition],
      }),
    ).toBeFalse();

    assertRouterInvariant(router, {
      routeVersion: 0,
      routes: [home],
    });
  });

  it('replaces routes and transitions in one transaction', async () => {
    const oldRoute = route('', 'Old');
    const nextRoute = route('', 'Next');
    const calls: string[] = [];

    const oldTransition:
      NavigationTransitionDefinition = {
        beforeEnter: [
          () => {
            calls.push('old');
            return true;
          },
        ],
      };

    const nextTransition:
      NavigationTransitionDefinition = {
        beforeEnter: [
          () => {
            calls.push('next');
            return true;
          },
        ],
      };

    router = createRouter({
      routes: [oldRoute],
      transitions: [oldTransition],
      outlet,
    });

    expect(await router.navigate('/'))
      .toBeTrue();
    expect(calls).toEqual(['old']);
    expect(outlet.textContent).toBe('Old');

    expect(
      router.replaceConfiguration({
        routes: [nextRoute],
        transitions: [nextTransition],
      }),
    ).toBeTrue();

    // Configuration changes what the router knows, not what is currently
    // rendered. Revalidation remains explicit.
    expect(outlet.textContent).toBe('Old');
    expect(router.state.current?.config)
      .toBe(oldRoute);

    expect(await router.revalidate())
      .toBeTrue();

    expect(calls).toEqual(['old', 'next']);
    expect(outlet.textContent).toBe('Next');

    assertRouterInvariant(router, {
      routeVersion: 1,
      routes: [nextRoute],
    });
  });

  it('does not increment routeVersion for a transition-only update', async () => {
    const home = route('', 'Home');
    const first:
      NavigationTransitionDefinition = {};
    const second:
      NavigationTransitionDefinition = {
        beforeEnter: [() => true],
      };

    router = createRouter({
      routes: [home],
      transitions: [first],
      outlet,
    });

    expect(
      router.replaceConfiguration({
        routes: [home],
        transitions: [second],
      }),
    ).toBeTrue();

    expect(router.routeVersion).toBe(0);
    expect(await router.revalidate())
      .toBeTrue();

    assertRouterInvariant(router, {
      routeVersion: 0,
      routes: [home],
    });
  });

  it('increments routeVersion once when both parts change', () => {
    const oldRoute = route('', 'Old');
    const nextRoute = route('', 'Next');

    router = createRouter({
      routes: [oldRoute],
      transitions: [],
      outlet,
    });

    expect(
      router.replaceConfiguration({
        routes: [nextRoute],
        transitions: [{}],
      }),
    ).toBeTrue();

    expect(router.routeVersion).toBe(1);
    expect(router.routes()).toEqual([nextRoute]);
  });

  it('cancels one pending navigation when both parts change', async () => {
    const loading = deferred<{
      component: () => Node;
    }>();
    const slow: Route = {
      path: 'slow',
      load: () => loading.promise,
    };
    const next = route('next', 'Next');

    router = createRouter({
      routes: [slow],
      transitions: [],
      outlet,
    });

    const navigation =
      router.navigate('/slow');

    await Promise.resolve();

    expect(
      router.replaceConfiguration({
        routes: [next],
        transitions: [{}],
      }),
    ).toBeTrue();

    loading.resolve({
      component: () =>
        document.createTextNode('Slow'),
    });

    await expectAsync(navigation)
      .toBeResolvedTo(false);
    expect(router.state.current).toBeNull();
    expect(router.routeVersion).toBe(1);
  });

  it('validates the next route catalog before cancelling navigation', async () => {
    const loading = deferred<{
      component: () => Node;
    }>();
    const slow: Route = {
      path: 'slow',
      load: () => loading.promise,
    };

    router = createRouter({
      routes: [slow],
      transitions: [],
      outlet,
    });

    const navigation =
      router.navigate('/slow');

    await Promise.resolve();

    expect(() =>
      router.replaceConfiguration({
        routes: [
          route('duplicate', 'One'),
          route('duplicate', 'Two'),
        ],
        transitions: [{}],
      }),
    ).toThrowError(
      /Duplicate primary route path "duplicate"/,
    );

    // Rejected configuration did not cancel the existing request.
    expect(router.state.pending).toBeTrue();

    loading.resolve({
      component: () =>
        document.createTextNode('Slow'),
    });

    await expectAsync(navigation)
      .toBeResolvedTo(true);

    expect(outlet.textContent).toBe('Slow');
    expect(router.routeVersion).toBe(0);
  });

  it('keeps replaceRoutes and replaceTransitions as compatible wrappers', () => {
    const first = route('', 'First');
    const second = route('', 'Second');
    const transition:
      NavigationTransitionDefinition = {};

    router = createRouter({
      routes: [first],
      transitions: [],
      outlet,
    });

    expect(router.replaceRoutes([second]))
      .toBeTrue();
    expect(router.routeVersion).toBe(1);

    expect(
      router.replaceTransitions([transition]),
    ).toBeTrue();
    expect(router.routeVersion).toBe(1);

    expect(router.replaceRoutes([second]))
      .toBeFalse();
    expect(
      router.replaceTransitions([transition]),
    ).toBeFalse();
  });

  it('throws after disposal', () => {
    const home = route('', 'Home');

    router = createRouter({
      routes: [home],
      outlet,
    });

    router.dispose();

    expect(() =>
      router.replaceConfiguration({
        routes: [home],
        transitions: [],
      }),
    ).toThrowError(
      /Cannot replace configuration on a disposed router/,
    );
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-events.spec.ts
````typescript
import {
  OUTLET_ACTIVATE_EVENT,
  OUTLET_DEACTIVATE_EVENT,
  ROUTER_LOCATION_CHANGE_EVENT,
  dispatchOutletLifecycleEvent,
  dispatchRouterLocationChange,
} from '../lib/router-events';

describe('Waypoint browser events', () => {
  it('dispatches one namespaced outlet activation event', () => {
    const target = new EventTarget();
    const component = { id: 1 };
    let currentCount = 0;
    let legacyCount = 0;
    let received: unknown;

    target.addEventListener(
      OUTLET_ACTIVATE_EVENT,
      event => {
        currentCount++;
        received = (event as CustomEvent<unknown>).detail;
      },
    );

    target.addEventListener(
      'vanilla-router-activate',
      () => legacyCount++,
    );

    dispatchOutletLifecycleEvent(
      target,
      OUTLET_ACTIVATE_EVENT,
      component,
    );

    expect(currentCount).toBe(1);
    expect(legacyCount).toBe(0);
    expect(received).toBe(component);
  });

  it('dispatches one namespaced outlet deactivation event', () => {
    const target = new EventTarget();
    const component = { id: 2 };
    let currentCount = 0;
    let legacyCount = 0;

    target.addEventListener(
      OUTLET_DEACTIVATE_EVENT,
      () => currentCount++,
    );

    target.addEventListener(
      'vanilla-router-deactivate',
      () => legacyCount++,
    );

    dispatchOutletLifecycleEvent(
      target,
      OUTLET_DEACTIVATE_EVENT,
      component,
    );

    expect(currentCount).toBe(1);
    expect(legacyCount).toBe(0);
  });

  it('dispatches one namespaced location-change event', () => {
    let currentCount = 0;
    let legacyCount = 0;

    const currentListener = () => currentCount++;
    const legacyListener = () => legacyCount++;

    window.addEventListener(
      ROUTER_LOCATION_CHANGE_EVENT,
      currentListener,
    );
    window.addEventListener(
      'vanilla-router-locationchange',
      legacyListener,
    );

    try {
      dispatchRouterLocationChange();

      expect(currentCount).toBe(1);
      expect(legacyCount).toBe(0);
    } finally {
      window.removeEventListener(
        ROUTER_LOCATION_CHANGE_EVENT,
        currentListener,
      );
      window.removeEventListener(
        'vanilla-router-locationchange',
        legacyListener,
      );
    }
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-platform.spec.ts
````typescript
import { HistoryManager } from '../lib/history';
import { getRouterLocation } from '../lib/router-url';

describe('Waypoint router platform', () => {
  it('provides a stable server location when no document is available', () => {
    const location = getRouterLocation(null);

    expect(location.origin).toBe('http://localhost');
    expect(location.pathname).toBe('/');
    expect(location.search).toBe('');
    expect(location.hash).toBe('');
    expect(location.href).toBe('http://localhost/');
  });

  it('uses the provided document location', () => {
    const location = {
      origin: 'https://example.test',
      pathname: '/app/projects',
      search: '?tab=activity',
      hash: '#details',
      href: 'https://example.test/app/projects?tab=activity#details',
    } as Location;

    expect(getRouterLocation({ location })).toBe(location);
  });

  it('supports a history manager without browser globals', () => {
    const manager = new HistoryManager(
      null,
      {
        pathname: '/server',
        search: '?render=1',
        hash: '#top',
      },
    );

    const update = manager.createDefaultUpdate();

    expect(update.previousEntry?.href).toBe('/server?render=1#top');
    expect(update.previousScroll).toEqual({ x: 0, y: 0 });
    expect(update.previousEntry?.state).toBeNull();
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-races.spec.ts
````typescript
import {
  createRouter,
  type Route,
  type VanillaRouter,
} from '@epikodelabs/waypoint';

import { idescribe } from './env.spec';

interface Deferred<T> {
  readonly promise: Promise<T>;
  resolve(value: T): void;
  reject(error: unknown): void;
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;

  const promise = new Promise<T>((accept, fail) => {
    resolve = accept;
    reject = fail;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

function delay(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function immediateRoute(
  path: string,
  text: string,
): Route {
  return {
    path,
    load: async () => ({
      component: () =>
        document.createTextNode(text),
    }),
  };
}

idescribe('Router mutation races', () => {
  let outlet: HTMLElement;
  let router: VanillaRouter;

  beforeEach(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    window.history.replaceState(null, '', '/');

    spyOn(console, 'debug');
    spyOn(console, 'error');
  });

  afterEach(() => {
    router?.dispose();
    window.history.replaceState(null, '', '/');
    outlet.remove();
  });

  function create(routes: readonly Route[]): VanillaRouter {
    return createRouter({
      routes: [...routes],
      render: (_name, node) => {
        outlet.replaceChildren(node);
      },
    });
  }

  it('should settle a navigation as false when a route mutation cancels it', async () => {
    const loading = deferred<{
      component: () => Node;
    }>();

    const slow: Route = {
      path: 'slow',
      load: () => loading.promise,
    };

    router = create([slow]);

    const navigation = router.navigate('/slow');
    await Promise.resolve();

    expect(router.state.pending).toBeTrue();
    expect(
      router.addRoutes([
        immediateRoute('other', 'Other'),
      ]),
    ).toBeTrue();

    loading.resolve({
      component: () =>
        document.createTextNode('Slow'),
    });

    await expectAsync(navigation)
      .toBeResolvedTo(false);
    await delay();

    expect(router.state.current).toBeNull();
    expect(outlet.textContent).toBe('');
  });

  it('should allow a newer navigation to win when an older lazy load resolves later', async () => {
    const loading = deferred<{
      component: () => Node;
    }>();

    const slow: Route = {
      path: 'slow',
      load: () => loading.promise,
    };

    const fast = immediateRoute(
      'fast',
      'Fast',
    );

    router = create([slow, fast]);

    const first = router.navigate('/slow');
    await Promise.resolve();

    const second = router.navigate('/fast');

    await expectAsync(second)
      .toBeResolvedTo(true);

    loading.resolve({
      component: () =>
        document.createTextNode('Slow'),
    });

    await expectAsync(first)
      .toBeResolvedTo(false);

    expect(router.state.current?.config).toBe(fast);
    expect(outlet.textContent).toBe('Fast');

    await delay();

    expect(router.state.current?.config).toBe(fast);
    expect(outlet.textContent).toBe('Fast');
  });

  it('should ignore an obsolete lazy-load failure after a newer navigation succeeds', async () => {
    const loading = deferred<{
      component: () => Node;
    }>();

    const slow: Route = {
      path: 'slow',
      load: () => loading.promise,
    };

    const fast = immediateRoute(
      'fast',
      'Fast',
    );

    router = create([slow, fast]);

    const first = router.navigate('/slow');
    await Promise.resolve();

    expect(await router.navigate('/fast'))
      .toBeTrue();

    loading.reject(
      new Error('obsolete failure'),
    );

    await expectAsync(first)
      .toBeResolvedTo(false);
    await delay();

    expect(router.state.current?.config).toBe(fast);
    expect(router.state.error).toBeNull();
    expect(outlet.textContent).toBe('Fast');
  });

  it('should dispose a prepared primary outlet when mutation cancels a pending sidebar render', async () => {
    const sidebarRender = deferred<Node>();
    const primaryDestroyed =
      jasmine.createSpy('primaryDestroyed');
    const sidebarDestroyed =
      jasmine.createSpy('sidebarDestroyed');
    const sidebarStarted =
      deferred<void>();

    const grouped: Route = {
      path: 'project',
      load: async () => ({
        component: (_route, context) => {
          context.destroySignal.addEventListener(
            'abort',
            primaryDestroyed,
            { once: true },
          );

          return document.createTextNode('Project');
        },
      }),
      outlets: [{
        path: 'project',
        outlet: 'sidebar',
        load: async () => ({
          component: (_route, context) => {
            context.destroySignal.addEventListener(
              'abort',
              sidebarDestroyed,
              { once: true },
            );

            sidebarStarted.resolve();

            return sidebarRender.promise;
          },
        }),
      }],
    };

    router = create([grouped]);

    const navigation =
      router.navigate('/project');

    await sidebarStarted.promise;

    // The primary outlet has been prepared, while the sidebar component is
    // still rendering. Replacing the catalog must cancel and clean up both.
    expect(
      router.replaceRoutes([
        immediateRoute('next', 'Next'),
      ]),
    ).toBeTrue();

    expect(sidebarDestroyed)
      .toHaveBeenCalledTimes(1);

    sidebarRender.resolve(
      document.createTextNode('Sidebar'),
    );

    await expectAsync(navigation)
      .toBeResolvedTo(false);
    await delay();

    expect(primaryDestroyed)
      .toHaveBeenCalledTimes(1);
    expect(sidebarDestroyed)
      .toHaveBeenCalledTimes(1);
    expect(router.state.current).toBeNull();
    expect(outlet.textContent).toBe('');
  });

  it('should revalidate only against the replacement catalog', async () => {
    const oldRoute = immediateRoute(
      '',
      'Old',
    );
    const nextRoute = immediateRoute(
      '',
      'Next',
    );

    router = create([oldRoute]);

    expect(await router.navigate('/'))
      .toBeTrue();
    expect(outlet.textContent).toBe('Old');

    expect(
      router.replaceRoutes([nextRoute]),
    ).toBeTrue();

    expect(await router.revalidate())
      .toBeTrue();

    expect(router.state.current?.config)
      .toBe(nextRoute);
    expect(outlet.textContent).toBe('Next');
  });

  it('should prevent a cancelled prepare result from replacing a newer route', async () => {
    const preparation = deferred<
      Readonly<Record<string, unknown>>
    >();

    const slow: Route = {
      path: 'slow',
      load: async () => ({
        prepare: [
          () => preparation.promise,
        ],
        component: route =>
          document.createTextNode(
            String(route.data['message']),
          ),
      }),
    };

    const fast = immediateRoute(
      'fast',
      'Fast',
    );

    router = create([slow, fast]);

    const first = router.navigate('/slow');
    await Promise.resolve();

    expect(await router.navigate('/fast'))
      .toBeTrue();

    preparation.resolve({
      message: 'Slow',
    });

    await expectAsync(first)
      .toBeResolvedTo(false);
    await delay();

    expect(router.state.current?.config).toBe(fast);
    expect(router.state.error).toBeNull();
    expect(outlet.textContent).toBe('Fast');
  });
});
````

## File: projects/libraries/waypoint/src/tests/router-redirect-chain.spec.ts
````typescript
import {
  createRouter,
  type Route,
  type VanillaRouter,
  type VanillaRouterConfig,
} from '@epikodelabs/waypoint';

import { idescribe } from './env.spec';
import {
  assertRouterInvariant,
} from './router-test-utils';

function route(
  path: string,
  text: string,
): Route {
  return {
    path,
    load: async () => ({
      component: () =>
        document.createTextNode(text),
    }),
  };
}

idescribe('Router redirect chains', () => {
  let outlet: HTMLElement;
  let router: VanillaRouter;

  beforeEach(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    window.history.replaceState(null, '', '/');

    spyOn(console, 'debug');
    spyOn(console, 'error');
  });

  afterEach(() => {
    router?.dispose();
    window.history.replaceState(null, '', '/');
    outlet.remove();
  });

  function create(
    routes: Route[],
    overrides: Partial<VanillaRouterConfig> = {},
  ): VanillaRouter {
    return createRouter({
      routes,
      outlet,
      ...overrides,
    });
  }

  it('follows a multi-step static redirect chain', async () => {
    const final = route('final', 'Final');

    router = create([
      {
        path: 'one',
        redirectTo: '/two',
      },
      {
        path: 'two',
        redirectTo: '/final',
      },
      final,
    ]);

    expect(await router.navigate('/one'))
      .toBeTrue();

    expect(window.location.pathname)
      .toBe('/final');
    expect(router.state.current?.config)
      .toBe(final);
    expect(outlet.textContent).toBe('Final');

    assertRouterInvariant(router);
  });

  it('interpolates parameters across a redirect', async () => {
    const user = route('users/:id', 'User');

    router = create([
      {
        path: 'legacy/:id',
        redirectTo: '/users/:id',
      },
      user,
    ]);

    expect(
      await router.navigate(
        '/legacy/hello%20world',
      ),
    ).toBeTrue();

    expect(window.location.pathname)
      .toBe('/users/hello%20world');
    expect(router.state.params)
      .toEqual({ id: 'hello world' });

    assertRouterInvariant(router);
  });

  it('preserves navigation state across a redirect chain', async () => {
    const final = route('final', 'Final');

    router = create([
      {
        path: 'start',
        redirectTo: '/middle',
      },
      {
        path: 'middle',
        redirectTo: '/final',
      },
      final,
    ]);

    const state = {
      token: 'abc',
      attempt: 4,
    };

    expect(
      await router.navigate(
        '/start',
        { state },
      ),
    ).toBeTrue();

    expect(window.history.state).toEqual(state);
    expect(router.state.historyState)
      .toEqual(state);

    assertRouterInvariant(router);
  });

  it('uses a guard redirect and carries its replace option', async () => {
    const source: Route = {
      path: 'source',
      load: async () => ({
        canActivate: [
          () => ({
            redirectTo: '/target',
            replace: false,
          }),
        ],
        component: () =>
          document.createTextNode('Source'),
      }),
    };
    const target = route('target', 'Target');

    router = create([source, target]);

    const pushState = spyOn(
      window.history,
      'pushState',
    ).and.callThrough();

    expect(await router.navigate('/source'))
      .toBeTrue();

    expect(window.location.pathname)
      .toBe('/target');
    expect(pushState).toHaveBeenCalledWith(
      null,
      '',
      '/target',
    );
    expect(router.state.current?.config)
      .toBe(target);

    assertRouterInvariant(router);
  });

  it('fails when a redirect references a missing parameter', async () => {
    router = create([
      {
        path: 'legacy',
        redirectTo: '/users/:id',
      },
      route('users/:id', 'User'),
    ]);

    await expectAsync(router.navigate('/legacy'))
      .toBeRejectedWithError(/Missing route parameter "id"/);

    expect(router.state.current).toBeNull();
    expect(
      (router.state.error as Error).message,
    ).toContain(
      'Missing route parameter "id"',
    );
    expect(window.location.pathname).toBe('/');
  });

  it('stops a redirect loop at maxRedirects', async () => {
    router = create(
      [
        {
          path: 'a',
          redirectTo: '/b',
        },
        {
          path: 'b',
          redirectTo: '/a',
        },
      ],
      {
        maxRedirects: 3,
      },
    );

    await expectAsync(router.navigate('/a'))
      .toBeRejectedWithError(/Maximum redirect count of 3 exceeded/);

    expect(
      (router.state.error as Error).message,
    ).toContain(
      'Maximum redirect count of 3 exceeded',
    );
    expect(router.state.pending).toBeFalse();
    expect(router.state.phase).toBeNull();
  });

  it('delegates an external redirect to navigateExternal', async () => {
    const navigateExternal =
      jasmine.createSpy('navigateExternal');

    const source: Route = {
      path: 'source',
      load: async () => ({
        canActivate: [
          () => ({
            redirectTo:
              'https://external.test/path',
            replace: true,
          }),
        ],
        component: () =>
          document.createTextNode('Source'),
      }),
    };

    router = create([source], {
      navigateExternal,
    });

    expect(await router.navigate('/source'))
      .toBeTrue();

    expect(navigateExternal)
      .toHaveBeenCalledTimes(1);
    expect(
      navigateExternal.calls.mostRecent()
        .args[0].href,
    ).toBe(
      'https://external.test/path',
    );
    expect(router.state.current).toBeNull();
  });

  it('does not render an intermediate redirect route', async () => {
    const rendered: string[] = [];
    const final: Route = {
      path: 'final',
      load: async () => ({
        component: () => {
          rendered.push('final');
          return document.createTextNode('Final');
        },
      }),
    };

    router = create([
      {
        path: 'start',
        redirectTo: '/final',
      },
      final,
    ]);

    expect(await router.navigate('/start'))
      .toBeTrue();

    expect(rendered).toEqual(['final']);
    expect(outlet.textContent).toBe('Final');

    assertRouterInvariant(router);
  });

  it('keeps query and hash values on an explicit redirect target', async () => {
    const final = route('final', 'Final');

    router = create([
      {
        path: 'start',
        redirectTo:
          '/final?tab=activity#details',
      },
      final,
    ]);

    expect(await router.navigate('/start'))
      .toBeTrue();

    expect(window.location.pathname)
      .toBe('/final');
    expect(window.location.search)
      .toBe('?tab=activity');
    expect(window.location.hash)
      .toBe('#details');
    expect(router.state.query)
      .toEqual({ tab: 'activity' });

    assertRouterInvariant(router);
  });
});
````

## File: projects/libraries/waypoint/src/tests/server-express.spec.ts
````typescript
import {
  createExpressServerRouterHandlers,
  type ExpressLikeNext,
  type ExpressLikeRequest,
  type ExpressLikeResponse,
} from '../lib/server-express';
import type { ServerArtifactRecord } from '../lib/server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly file: string;
  readonly hash: string;
}

const artifact: Artifact = {
  artifactKey: 'workspace',
  routeSetId: 'workspace-set',
  dependencies: [],
  branchIds: ['workspace-home'],
  file: '../artifacts/workspace.js',
  hash: 'ABC123',
};

class ResponseDouble implements ExpressLikeResponse {
  statusCode = 0;
  headers: Readonly<Record<string, string>> = {};
  jsonBody: unknown;
  ended = false;
  sentFile?: string;
  headersSent = false;
  fileError?: Error;

  status(code: number): ExpressLikeResponse {
    this.statusCode = code;
    return this;
  }

  set(headers: Readonly<Record<string, string>>): ExpressLikeResponse {
    this.headers = {
      ...this.headers,
      ...headers,
    };
    return this;
  }

  json(body: unknown): unknown {
    this.jsonBody = body;
    this.headersSent = true;
    return body;
  }

  end(): unknown {
    this.ended = true;
    this.headersSent = true;
    return undefined;
  }

  sendFile(path: string, callback: (error?: Error) => void): unknown {
    this.sentFile = path;
    if (!this.fileError) this.headersSent = true;
    callback(this.fileError);
    return undefined;
  }
}

function request(
  query: Readonly<Record<string, unknown>> = {},
  params: Readonly<Record<string, string | undefined>> = {},
  body?: unknown,
): ExpressLikeRequest {
  return { query, params, body };
}

function nextSpy(): { next: ExpressLikeNext; errors: unknown[] } {
  const errors: unknown[] = [];
  return {
    errors,
    next(error) {
      if (error !== undefined) errors.push(error);
    },
  };
}

describe('Express server router adapter', () => {
  it('translates route resolution to an Express response', async () => {
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          return {
            version: 2 as const,
            artifactKey: 'workspace',
            artifacts: [{
              kind: 'route' as const,
              artifactKey: 'workspace',
              moduleUrl: '/modules/workspace/ABC123',
              hash: 'ABC123',
            }],
          };
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return null;
        },
      },
      artifactPathFor: item => item.file,
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.resolve(request({ path: '/workspace' }), response, next);

    expect(response.statusCode).toBe(200);
    expect((response.jsonBody as { artifactKey: string }).artifactKey)
      .toBe('workspace');
    expect(errors).toEqual([]);
  });

  it('passes the application principal into both router operations', async () => {
    const seen: unknown[] = [];
    const principal = {
      subject: 'reader',
      roles: new Set(['user']),
      permissions: new Set(['read']),
    };
    const handlers = createExpressServerRouterHandlers<Artifact, ExpressLikeRequest>({
      router: {
        async resolve(_target, actual) {
          seen.push(actual);
          return null;
        },
        async resolveLanding(_targets, actual) {
          seen.push(actual);
          return null;
        },
        async resolveModule(_key, _hash, actual) {
          seen.push(actual);
          return null;
        },
      },
      principalFrom: () => principal,
      artifactPathFor: item => item.file,
    });
    const { next } = nextSpy();

    await handlers.resolve(
      request({ path: '/workspace' }),
      new ResponseDouble(),
      next,
    );
    await handlers.module(
      request({}, { artifactKey: 'workspace', hash: 'ABC123' }),
      new ResponseDouble(),
      next,
    );

    expect(seen).toEqual([principal, principal]);
  });

  it('sends only an already-authorized artifact file', async () => {
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          return null;
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return artifact;
        },
      },
      artifactPathFor: item => `/published/${item.artifactKey}-${item.hash}.js`,
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.module(
      request({}, { artifactKey: 'workspace', hash: 'ABC123' }),
      response,
      next,
    );

    expect(response.statusCode).toBe(200);
    expect(response.sentFile).toBe('/published/workspace-ABC123.js');
    expect(errors).toEqual([]);
  });

  it('does not call artifactPathFor for unauthorized module requests', async () => {
    let mapped = false;
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          return null;
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return null;
        },
      },
      artifactPathFor() {
        mapped = true;
        return '/should-not-be-used.js';
      },
    });
    const response = new ResponseDouble();
    const { next } = nextSpy();

    await handlers.module(
      request({}, { artifactKey: 'private', hash: 'guess' }),
      response,
      next,
    );

    expect(response.statusCode).toBe(404);
    expect(response.ended).toBeTrue();
    expect(mapped).toBeFalse();
  });

  it('forwards unexpected failures to Express next()', async () => {
    const failure = new Error('storage failed');
    const handlers = createExpressServerRouterHandlers<Artifact>({
      router: {
        async resolve() {
          throw failure;
        },
        async resolveLanding() {
          return null;
        },
        async resolveModule() {
          return null;
        },
      },
      artifactPathFor: item => item.file,
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.resolve(request({ path: '/workspace' }), response, next);

    expect(errors).toEqual([failure]);
  });

  it('translates reload responses and lets reset hooks touch the response', async () => {
    const principal = {
      subject: 'reader',
      roles: new Set(['user']),
      permissions: new Set(['read']),
    };
    const resetBodies: unknown[] = [];
    const handlers = createExpressServerRouterHandlers<
      Artifact,
      ExpressLikeRequest,
      ResponseDouble
    >({
      router: {
        async resolve() {
          return null;
        },
        async resolveLanding(targets, actual) {
          expect(actual).toBeUndefined();
          return typeof targets[0] === 'string'
            ? targets[0]
            : null;
        },
        async resolveModule() {
          return null;
        },
      },
      principalFrom: () => principal,
      artifactPathFor: item => item.file,
      reload: {
        publicLocation: '/?account=choose',
        async resetPrincipal(request, response) {
          resetBodies.push(request.body);
          response.set({
            'Clear-Site-Data': '"cache"',
          });
        },
      },
    });
    const response = new ResponseDouble();
    const { next, errors } = nextSpy();

    await handlers.reload(
      request({}, {}, {
        reason: 'principal-change',
        target: '/app/workspace/101',
      }),
      response,
      next,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers).toEqual({
      'Clear-Site-Data': '"cache"',
      'Cache-Control': 'private, no-store',
      Vary: 'Authorization, Cookie',
    });
    expect(response.jsonBody).toEqual({
      version: 1,
      location: '/?account=choose',
    });
    expect(resetBodies).toEqual([{
      reason: 'principal-change',
      target: '/app/workspace/101',
    }]);
    expect(errors).toEqual([]);
  });
});
````

## File: projects/libraries/waypoint/src/tests/server-http.spec.ts
````typescript
import {
  createServerRouterHttpHandler,
  WAYPOINT_MODULE_HEADERS,
  WAYPOINT_PRIVATE_NO_STORE_HEADERS,
} from '../lib/server-http';
import {
  ServerArtifactResolutionError,
  type ServerArtifactRecord,
} from '../lib/server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly file: string;
  readonly hash: string;
}

const artifact: Artifact = {
  artifactKey: 'workspace',
  routeSetId: 'workspace-set',
  dependencies: [],
  branchIds: ['workspace-home'],
  file: '../artifacts/workspace.js',
  hash: 'ABC123',
};

describe('server HTTP handler', () => {
  it('rejects malformed resolve requests before invoking the router', async () => {
    let calls = 0;
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        calls += 1;
        return null;
      },
      async resolveLanding() {
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    const response = await handler.resolve({ target: ['not', 'a', 'path'] });

    expect(calls).toBe(0);
    expect(response).toEqual({
      kind: 'json',
      status: 400,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Invalid path.' },
    });
  });

  it('uses the same private 404 for unknown and unauthorized routes', async () => {
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return null;
      },
      async resolveLanding() {
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.resolve({ target: '/admin' })).toEqual({
      kind: 'json',
      status: 404,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Route not found.' },
    });
  });

  it('returns authorized resolution using private non-cacheable headers', async () => {
    const resolution = {
      version: 2 as const,
      artifactKey: 'workspace',
      artifacts: [{
        kind: 'route' as const,
        artifactKey: 'workspace',
        moduleUrl: '/modules/workspace/ABC123',
        hash: 'ABC123',
      }],
    };
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return resolution;
      },
      async resolveLanding() {
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.resolve({ target: '/workspace' })).toEqual({
      kind: 'json',
      status: 200,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: resolution,
    });
  });

  it('maps publication failure to 503 only on authorized route resolution', async () => {
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        throw new ServerArtifactResolutionError(
          'unavailable',
          'Artifact is not published.',
        );
      },
      async resolveLanding() {
        throw new ServerArtifactResolutionError(
          'unavailable',
          'Artifact is not published.',
        );
      },
      async resolveModule() {
        throw new ServerArtifactResolutionError(
          'unavailable',
          'Artifact is not published.',
        );
      },
    });

    expect(await handler.resolve({ target: '/workspace' })).toEqual({
      kind: 'json',
      status: 503,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Navigation artifact unavailable.' },
    });

    expect((await handler.module({
      artifactKey: 'workspace',
      hash: 'ABC123',
    })).status).toBe(404);
  });

  it('returns an authorized artifact without exposing its file in JSON', async () => {
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return null;
      },
      async resolveLanding() {
        return null;
      },
      async resolveModule() {
        return artifact;
      },
    });

    expect(await handler.module({
      artifactKey: 'workspace',
      hash: 'ABC123',
    })).toEqual({
      kind: 'artifact',
      status: 200,
      headers: WAYPOINT_MODULE_HEADERS,
      artifact,
    });
  });

  it('collapses malformed, stale, missing, and unauthorized module requests to 404', async () => {
    let calls = 0;
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        return null;
      },
      async resolveLanding() {
        return null;
      },
      async resolveModule() {
        calls += 1;
        return null;
      },
    });

    expect((await handler.module({ artifactKey: '', hash: 'ABC123' })).status)
      .toBe(404);
    expect(calls).toBe(0);

    expect((await handler.module({
      artifactKey: 'workspace',
      hash: 'old',
    })).status).toBe(404);
    expect(calls).toBe(1);
  });

  it('returns a private reload destination when the current target is still authorized', async () => {
    const principal = {
      subject: 'reader',
      roles: new Set(['user']),
      permissions: new Set(['read']),
    };
    const seenTargets: string[] = [];
    const seenPrincipals: unknown[] = [];
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve(target, actual) {
        seenTargets.push(String(target));
        seenPrincipals.push(actual);
        return {
          version: 2 as const,
          artifactKey: 'workspace',
          artifacts: [{
            kind: 'route' as const,
            artifactKey: 'workspace',
            moduleUrl: '/modules/workspace/ABC123',
            hash: 'ABC123',
          }],
        };
      },
      async resolveLanding() {
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.reload({
      reason: 'reset',
      target: '/workspace?tab=files',
      principal,
    })).toEqual({
      kind: 'json',
      status: 200,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: {
        version: 1,
        location: '/workspace?tab=files',
      },
    });
    expect(seenTargets).toEqual(['/workspace?tab=files']);
    expect(seenPrincipals).toEqual([principal]);
  });

  it('resets the principal before selecting a new public reload destination', async () => {
    const seenPrincipals: unknown[] = [];
    const resetContexts: string[] = [];
    const handler = createServerRouterHttpHandler<
      Artifact,
      Readonly<{ sessionId: string }>
    >({
      async resolve(_target, principal) {
        seenPrincipals.push(principal);
        return null;
      },
      async resolveLanding(targets, principal) {
        seenPrincipals.push(principal);
        return typeof targets[0] === 'string'
          ? targets[0]
          : null;
      },
      async resolveModule() {
        return null;
      },
    }, {
      reload: {
        publicLocation: '/?account=choose',
        async resetPrincipal(context) {
          resetContexts.push(context.sessionId);
        },
      },
    });

    expect(await handler.reload({
      reason: 'principal-change',
      target: '/admin',
      principal: {
        subject: 'admin',
        roles: new Set(['admin']),
        permissions: new Set(['manage']),
      },
      context: {
        sessionId: 'session-1',
      },
    })).toEqual({
      kind: 'json',
      status: 200,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: {
        version: 1,
        location: '/?account=choose',
      },
    });
    expect(resetContexts).toEqual(['session-1']);
    expect(seenPrincipals).toEqual([undefined, undefined]);
  });

  it('rejects external reload targets before invoking the router', async () => {
    let calls = 0;
    const handler = createServerRouterHttpHandler<Artifact>({
      async resolve() {
        calls += 1;
        return null;
      },
      async resolveLanding() {
        calls += 1;
        return null;
      },
      async resolveModule() {
        return null;
      },
    });

    expect(await handler.reload({
      reason: 'reset',
      target: 'https://evil.example/phish',
    })).toEqual({
      kind: 'json',
      status: 400,
      headers: WAYPOINT_PRIVATE_NO_STORE_HEADERS,
      body: { error: 'Invalid reload target.' },
    });
    expect(calls).toBe(0);
  });
});
````

## File: projects/tools/builder/src/waypoint-build/index.cjs
````javascript
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// projects/tools/builder/src/waypoint-build/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_node_path6 = __toESM(require("node:path"));
var import_architect = require("@angular-devkit/architect");

// projects/tools/builder/src/compiler/analyze.ts
var import_node_fs = __toESM(require("node:fs"));
var import_node_path2 = __toESM(require("node:path"));

// projects/tools/builder/src/compiler/navigation-snapshot.ts
var import_promises = __toESM(require("node:fs/promises"));
var import_node_path = __toESM(require("node:path"));
var import_node_url = require("node:url");
var import_esbuild = require("esbuild");
var import_typescript = __toESM(require("typescript"));
async function loadNavigationSnapshot(projectRoot, entry, metadataRoot) {
  const routeFiles = await discoverRouteModules(
    import_node_path.default.join(projectRoot, "src"),
    entry
  );
  const generatedRoot = import_node_path.default.join(
    metadataRoot,
    "analysis"
  );
  const generatedSourceRoot = import_node_path.default.join(
    generatedRoot,
    "sources"
  );
  await import_promises.default.mkdir(
    generatedSourceRoot,
    { recursive: true }
  );
  const waypointStubFile = import_node_path.default.join(
    generatedSourceRoot,
    "waypoint-stub.ts"
  );
  await import_promises.default.writeFile(
    waypointStubFile,
    waypointStubSource(),
    "utf8"
  );
  const transformedModules = await Promise.all(
    [entry, ...routeFiles].map(
      (file, index) => writeTransformedRouteModule(
        file,
        import_node_path.default.join(
          generatedSourceRoot,
          `module-${index}.ts`
        ),
        waypointStubFile
      )
    )
  );
  const [transformedEntry, ...transformedRoutes] = transformedModules;
  const sourceFile = import_node_path.default.join(
    generatedRoot,
    "navigation-snapshot.entry.ts"
  );
  const bundleFile = import_node_path.default.join(
    generatedRoot,
    "navigation-snapshot.mjs"
  );
  const imports = transformedRoutes.map(
    (file, index) => `import * as routeModule${index} from ${JSON.stringify(asImportPath(file))};`
  );
  const moduleDescriptors = routeFiles.map(
    (file, index) => `{ sourceFile: ${JSON.stringify(file)}, exports: routeModule${index} }`
  );
  await import_promises.default.writeFile(
    sourceFile,
    [
      `import { routes as rootRoutes } from ${JSON.stringify(asImportPath(transformedEntry))};`,
      ...imports,
      "",
      `export default {`,
      `  rootRoutes,`,
      `  modules: [${moduleDescriptors.join(",")}],`,
      `};`,
      ""
    ].join("\n"),
    "utf8"
  );
  await (0, import_esbuild.build)({
    entryPoints: [sourceFile],
    outfile: bundleFile,
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    sourcemap: false,
    logLevel: "silent"
  });
  const loaded = await import(`${(0, import_node_url.pathToFileURL)(bundleFile).href}?t=${Date.now()}`);
  const payload = loaded.default;
  if (!Array.isArray(payload.rootRoutes)) {
    throw new Error(
      `Waypoint entry "${entry}" did not export a NavigationTree named "routes".`
    );
  }
  const contributions = [];
  for (const module2 of payload.modules ?? []) {
    if (typeof module2.sourceFile !== "string" || !module2.exports || typeof module2.exports !== "object") {
      continue;
    }
    for (const [exportName, value] of Object.entries(
      module2.exports
    )) {
      if (!isContribution(value)) continue;
      contributions.push(Object.freeze({
        definition: value,
        sourceFile: module2.sourceFile,
        exportName
      }));
    }
  }
  return Object.freeze({
    rootRoutes: Object.freeze([...payload.rootRoutes]),
    contributions: Object.freeze(contributions)
  });
}
async function discoverRouteModules(sourceRoot, entry) {
  const files = [];
  async function visit(directory) {
    let entries;
    try {
      entries = await import_promises.default.readdir(
        directory,
        { withFileTypes: true }
      );
    } catch {
      return;
    }
    for (const item of entries) {
      const absolute = import_node_path.default.join(
        directory,
        item.name
      );
      if (item.isDirectory()) {
        await visit(absolute);
        continue;
      }
      if (!item.isFile() || !item.name.endsWith(".routes.ts") || import_node_path.default.resolve(absolute) === import_node_path.default.resolve(entry) || item.name.endsWith(".spec.ts")) {
        continue;
      }
      files.push(import_node_path.default.resolve(absolute));
    }
  }
  await visit(sourceRoot);
  return Object.freeze(
    files.sort()
  );
}
async function writeTransformedRouteModule(sourcePath, outputPath, waypointStubFile) {
  const sourceText = await import_promises.default.readFile(
    sourcePath,
    "utf8"
  );
  const sourceFile = import_typescript.default.createSourceFile(
    sourcePath,
    sourceText,
    import_typescript.default.ScriptTarget.Latest,
    true,
    import_typescript.default.ScriptKind.TS
  );
  let cursor = 0;
  let transformed = "";
  for (const statement of sourceFile.statements) {
    if (!import_typescript.default.isImportDeclaration(statement)) {
      continue;
    }
    transformed += sourceText.slice(
      cursor,
      statement.getFullStart()
    );
    transformed += transformImportDeclaration(
      statement,
      outputPath,
      waypointStubFile
    );
    cursor = statement.getEnd();
  }
  transformed += sourceText.slice(cursor);
  transformed = transformed.replace(
    /\bimport\s*\(/g,
    "__waypointDynamicImport("
  );
  const prelude = [
    `const __waypointStubValue = new Proxy(function () {}, {`,
    `  get() { return __waypointStubValue; },`,
    `  apply() { return undefined; },`,
    `  construct() { return {}; },`,
    `});`,
    `const __waypointDynamicImport = async () => ({});`,
    ""
  ].join("\n");
  await import_promises.default.writeFile(
    outputPath,
    `${prelude}${transformed}`,
    "utf8"
  );
  return outputPath;
}
function transformImportDeclaration(statement, outputPath, waypointStubFile) {
  const specifier = statement.moduleSpecifier.text;
  const clause = statement.importClause;
  if (!clause || clause.isTypeOnly) {
    return "";
  }
  if (specifier === "@epikodelabs/waypoint") {
    const relative = toRelativeImport(
      outputPath,
      waypointStubFile
    );
    return rewriteImportSpecifier(
      clause,
      relative
    );
  }
  return stubImportBindings(clause);
}
function rewriteImportSpecifier(clause, specifier) {
  const parts = [];
  if (clause.name) {
    parts.push(clause.name.text);
  }
  if (clause.namedBindings && import_typescript.default.isNamespaceImport(
    clause.namedBindings
  )) {
    parts.push(
      `* as ${clause.namedBindings.name.text}`
    );
  } else if (clause.namedBindings && import_typescript.default.isNamedImports(
    clause.namedBindings
  )) {
    parts.push(
      `{ ${clause.namedBindings.elements.map(
        (element) => element.propertyName ? `${element.propertyName.text} as ${element.name.text}` : element.name.text
      ).join(", ")} }`
    );
  }
  if (parts.length === 0) {
    return "";
  }
  return `import ${parts.join(", ")} from ${JSON.stringify(asImportPath(specifier))};`;
}
function stubImportBindings(clause) {
  const statements = [];
  if (clause.name) {
    statements.push(
      `const ${clause.name.text} = __waypointStubValue;`
    );
  }
  if (clause.namedBindings && import_typescript.default.isNamespaceImport(
    clause.namedBindings
  )) {
    statements.push(
      `const ${clause.namedBindings.name.text} = __waypointStubValue;`
    );
  } else if (clause.namedBindings && import_typescript.default.isNamedImports(
    clause.namedBindings
  )) {
    for (const element of clause.namedBindings.elements) {
      statements.push(
        `const ${element.name.text} = __waypointStubValue;`
      );
    }
  }
  return statements.join("\n");
}
function toRelativeImport(fromFile, toFile) {
  const relative = import_node_path.default.relative(
    import_node_path.default.dirname(fromFile),
    toFile
  );
  return relative.startsWith(".") ? relative : `./${relative}`;
}
function waypointStubSource() {
  return [
    `export function routeSlot(id) {`,
    `  return { kind: 'route-slot', id };`,
    `}`,
    ``,
    `export function routesFor(slotId, id, entries) {`,
    `  return { kind: 'route-contribution', slotId, id, entries };`,
    `}`,
    ``,
    `export function route(path, view, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function redirectRoute(path, redirectTo, options = {}) {`,
    `  return { kind: 'redirect', path, redirectTo, ...options };`,
    `}`,
    ``,
    `export function layout(path, view, entries, options = {}) {`,
    `  return { kind: 'layout', path, entries, ...options };`,
    `}`,
    ``,
    `export function lazyRoute(path, loader, options = {}) {`,
    `  return { kind: 'route', path, ...options };`,
    `}`,
    ``,
    `export function frame(component, options = {}) {`,
    `  return { component, ...options };`,
    `}`,
    ``,
    `export const s = Object.freeze({`,
    `  number(options = {}) { return { kind: 'number', ...options }; },`,
    `  string(value) { return { kind: 'string', value }; },`,
    `  array() { return { kind: 'array' }; },`,
    `  optional(value) { return { kind: 'optional', value }; },`,
    `  boolean() { return { kind: 'boolean' }; },`,
    `});`,
    ""
  ].join("\n");
}
function isContribution(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return candidate.kind === "route-contribution" && typeof candidate.slotId === "string" && candidate.slotId.trim().length > 0 && typeof candidate.id === "string" && candidate.id.trim().length > 0 && Array.isArray(candidate.entries);
}
function asImportPath(file) {
  return file.split(import_node_path.default.sep).join("/");
}

// projects/tools/builder/src/compiler/server-plan.ts
function createServerRoutePlan(snapshot) {
  const contributionsBySlot = indexContributions(
    snapshot.contributions
  );
  const contributionSources = new Map(
    snapshot.contributions.map(
      (contribution) => [
        contribution.definition.id,
        contribution
      ]
    )
  );
  const context = {
    contributionsBySlot,
    contributionSources,
    artifacts: /* @__PURE__ */ new Map(),
    branches: [],
    active: /* @__PURE__ */ new Set(),
    nextBranchId: 1
  };
  compileEntries(
    snapshot.rootRoutes,
    "/",
    [],
    context
  );
  for (const contribution of snapshot.contributions) {
    if (!context.artifacts.has(
      contribution.definition.id
    )) {
      throw new Error(
        `Route contribution "${contribution.definition.id}" targets unreachable slot "${contribution.definition.slotId}".`
      );
    }
  }
  return Object.freeze({
    branches: Object.freeze(
      [...context.branches]
    ),
    artifacts: Object.freeze(
      [...context.artifacts.values()].map(
        (artifact) => Object.freeze({
          kind: artifact.kind,
          artifactKey: artifact.artifactKey,
          routeSetId: artifact.routeSetId,
          dependencies: Object.freeze(
            [...artifact.dependencies]
          ),
          branchIds: Object.freeze(
            [...artifact.branchIds]
          ),
          sourceFile: artifact.sourceFile,
          exportName: artifact.exportName
        })
      )
    )
  });
}
function compileEntries(entries, parentPath, inheritedPolicies, context, provenance) {
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    if (entry.kind === "layout") {
      compileEntries(
        entry.entries ?? [],
        joinRoutePath(
          parentPath,
          String(entry.path ?? "")
        ),
        appendPolicy(
          inheritedPolicies,
          entry.policy
        ),
        context,
        provenance
      );
      continue;
    }
    if (entry.kind === "route-slot") {
      const slotId = String(entry.id ?? "").trim();
      for (const contribution of context.contributionsBySlot.get(
        slotId
      ) ?? []) {
        compileContribution(
          contribution,
          parentPath,
          inheritedPolicies,
          context,
          provenance
        );
      }
      continue;
    }
    if (entry.kind !== "route" && entry.kind !== "redirect") {
      continue;
    }
    if (entry.kind === "route" && typeof entry.outlet === "string" && entry.outlet.length > 0) {
      continue;
    }
    if (!provenance) {
      continue;
    }
    const pathValue = joinRoutePath(
      parentPath,
      String(entry.path ?? "")
    );
    const id = `${provenance.contributionId}:${context.nextBranchId++}`;
    const branch = Object.freeze({
      id,
      kind: entry.kind,
      path: pathValue,
      staticPrefix: staticPrefix(pathValue),
      name: typeof entry.name === "string" ? entry.name : void 0,
      redirectTo: entry.kind === "redirect" ? compileRedirect(
        parentPath,
        String(entry.redirectTo ?? "")
      ) : void 0,
      policies: Object.freeze(
        appendPolicy(
          inheritedPolicies,
          entry.policy
        )
      ),
      routeSetId: provenance.contributionId
    });
    context.branches.push(
      branch
    );
    const artifact = context.artifacts.get(
      provenance.contributionId
    );
    artifact?.branchIds.push(id);
  }
}
function compileContribution(contribution, parentPath, inheritedPolicies, context, parentProvenance) {
  const id = String(
    contribution.definition.id
  ).trim();
  if (context.active.has(id)) {
    throw new Error(
      `Recursive route contribution "${id}" was detected.`
    );
  }
  let artifact = context.artifacts.get(id);
  if (!artifact) {
    artifact = {
      kind: "route",
      artifactKey: id,
      routeSetId: id,
      dependencies: /* @__PURE__ */ new Set(),
      branchIds: [],
      sourceFile: contribution.sourceFile,
      exportName: contribution.exportName
    };
    context.artifacts.set(
      id,
      artifact
    );
  }
  if (parentProvenance && parentProvenance.contributionId !== id) {
    artifact.dependencies.add(
      parentProvenance.contributionId
    );
  }
  context.active.add(id);
  try {
    compileEntries(
      contribution.definition.entries,
      parentPath,
      inheritedPolicies,
      context,
      {
        contributionId: id
      }
    );
  } finally {
    context.active.delete(id);
  }
}
function indexContributions(contributions) {
  const output = /* @__PURE__ */ new Map();
  const ids = /* @__PURE__ */ new Set();
  for (const contribution of contributions) {
    const id = String(
      contribution.definition.id
    ).trim();
    const slotId = String(
      contribution.definition.slotId
    ).trim();
    if (ids.has(id)) {
      throw new Error(
        `Duplicate route contribution id "${id}".`
      );
    }
    ids.add(id);
    const current = output.get(slotId) ?? [];
    current.push(contribution);
    output.set(slotId, current);
  }
  return output;
}
function appendPolicy(policies, value) {
  if (!isPolicy(value)) {
    return policies;
  }
  return Object.freeze([
    ...policies,
    Object.freeze({
      allowAnonymous: value.allowAnonymous,
      roles: value.roles ? Object.freeze(
        [...value.roles]
      ) : void 0,
      permissions: value.permissions ? Object.freeze(
        [...value.permissions]
      ) : void 0
    })
  ]);
}
function isPolicy(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return (candidate.allowAnonymous === void 0 || typeof candidate.allowAnonymous === "boolean") && (candidate.roles === void 0 || Array.isArray(candidate.roles) && candidate.roles.every(
    (item) => typeof item === "string"
  )) && (candidate.permissions === void 0 || Array.isArray(
    candidate.permissions
  ) && candidate.permissions.every(
    (item) => typeof item === "string"
  ));
}
function joinRoutePath(parent, child) {
  const left = normalizePath(parent);
  if (!child.trim()) {
    return left;
  }
  const right = child.trim().replace(
    /^\/+|\/+$/g,
    ""
  );
  if (!right) return left;
  return normalizePath(
    left === "/" ? `/${right}` : `${left}/${right}`
  );
}
function normalizePath(value) {
  const normalized = `/${value}`.replace(/\/+/g, "/").replace(/\/+$/g, "");
  return normalized || "/";
}
function compileRedirect(parentPath, target) {
  if (/^[A-Za-z][A-Za-z\d+.-]*:/.test(
    target
  ) || target.startsWith("//") || target.startsWith("/")) {
    return target;
  }
  return joinRoutePath(
    parentPath,
    target
  );
}
function staticPrefix(routePath) {
  const segments = normalizePath(routePath).split("/").filter(Boolean);
  const staticSegments = [];
  for (const segment of segments) {
    if (segment.startsWith(":")) {
      break;
    }
    staticSegments.push(segment);
  }
  return staticSegments.length > 0 ? `/${staticSegments.join("/")}` : "/";
}
function commonStaticPrefix(branches) {
  if (branches.length === 0) {
    return "/";
  }
  const split = branches.map(
    (branch) => branch.staticPrefix.split("/").filter(Boolean)
  );
  const first = split[0];
  const common = [];
  for (let index = 0; index < first.length; index++) {
    const value = first[index];
    if (split.every(
      (segments) => segments[index] === value
    )) {
      common.push(value);
      continue;
    }
    break;
  }
  return common.length > 0 ? `/${common.join("/")}` : "/";
}

// projects/tools/builder/src/compiler/analyze.ts
async function analyze(options) {
  const entry = import_node_path2.default.resolve(
    options.entry
  );
  const diagnostics = [];
  const projectRoot = findProjectRoot(entry);
  const planned = Object.freeze({
    entry,
    projectRoot,
    serverOutput: import_node_path2.default.resolve(
      options.serverOutput
    ),
    artifactsOutput: import_node_path2.default.resolve(
      options.artifactsOutput
    ),
    buildManifestOutput: options.buildManifestOutput ? import_node_path2.default.resolve(
      options.buildManifestOutput
    ) : void 0
  });
  if (!import_node_fs.default.existsSync(entry)) {
    diagnostics.push({
      level: "error",
      code: "WPT1001",
      message: `Waypoint navigation entry does not exist: ${entry}`
    });
    return Object.freeze({
      success: false,
      diagnostics: Object.freeze(diagnostics),
      planned
    });
  }
  try {
    const metadataRoot = import_node_path2.default.dirname(
      planned.serverOutput
    );
    const snapshot = await loadNavigationSnapshot(
      projectRoot,
      entry,
      metadataRoot
    );
    const plan = createServerRoutePlan(
      snapshot
    );
    if (plan.artifacts.length === 0) {
      diagnostics.push({
        level: "warning",
        code: "WPT2001",
        message: "No routesFor() contributions were discovered."
      });
    }
    return Object.freeze({
      success: true,
      diagnostics: Object.freeze(diagnostics),
      planned,
      snapshot,
      plan
    });
  } catch (error) {
    diagnostics.push({
      level: "error",
      code: "WPT1002",
      message: error instanceof Error ? error.message : String(error)
    });
    return Object.freeze({
      success: false,
      diagnostics: Object.freeze(diagnostics),
      planned
    });
  }
}
function findProjectRoot(entry) {
  let current = import_node_path2.default.dirname(entry);
  while (true) {
    if (import_node_fs.default.existsSync(
      import_node_path2.default.join(
        current,
        "tsconfig.app.json"
      )
    )) {
      return current;
    }
    const parent = import_node_path2.default.dirname(current);
    if (parent === current) {
      throw new Error(
        `Could not locate Angular project root for "${entry}".`
      );
    }
    current = parent;
  }
}

// projects/tools/builder/src/compiler/build-layout.ts
var import_node_path3 = __toESM(require("node:path"));
function createBuildLayout(outputPath) {
  const root = import_node_path3.default.resolve(outputPath);
  const metadataRoot = import_node_path3.default.join(
    root,
    ".waypoint"
  );
  return Object.freeze({
    root,
    publicRoot: import_node_path3.default.join(
      root,
      "browser"
    ),
    protectedRoot: import_node_path3.default.join(
      root,
      "protected"
    ),
    metadataRoot,
    manifest: import_node_path3.default.join(
      metadataRoot,
      "manifest.json"
    ),
    serverRoot: import_node_path3.default.join(
      metadataRoot,
      "server"
    )
  });
}

// projects/tools/builder/src/compiler/prepare-build.ts
var import_promises3 = __toESM(require("node:fs/promises"));
var import_node_path5 = __toESM(require("node:path"));

// projects/tools/builder/src/compiler/server-output.ts
var import_node_crypto = __toESM(require("node:crypto"));
var import_promises2 = __toESM(require("node:fs/promises"));
var import_node_path4 = __toESM(require("node:path"));
async function publishServerRouteOutput(plan, serverRoot) {
  const absoluteRoot = import_node_path4.default.resolve(serverRoot);
  const temporaryRoot = `${absoluteRoot}.tmp-${process.pid}-${Date.now()}`;
  await import_promises2.default.rm(
    temporaryRoot,
    {
      recursive: true,
      force: true
    }
  );
  await import_promises2.default.mkdir(
    import_node_path4.default.join(
      temporaryRoot,
      "shards"
    ),
    {
      recursive: true
    }
  );
  const shardDescriptors = [];
  for (const artifact of plan.artifacts) {
    const branches = plan.branches.filter(
      (branch) => branch.routeSetId === artifact.routeSetId
    );
    const shardFile = `shards/${safeFileName(artifact.routeSetId)}.json`;
    await import_promises2.default.writeFile(
      import_node_path4.default.join(
        temporaryRoot,
        shardFile
      ),
      JSON.stringify(
        {
          version: 1,
          branches
        },
        null,
        2
      ) + "\n",
      "utf8"
    );
    shardDescriptors.push({
      prefix: commonStaticPrefix(branches),
      file: shardFile
    });
  }
  const artifacts = plan.artifacts.map(
    (artifact) => ({
      kind: artifact.kind,
      artifactKey: artifact.artifactKey,
      routeSetId: artifact.routeSetId,
      dependencies: artifact.dependencies,
      branchIds: artifact.branchIds
      /*
       * Browser artifact publication is a later builder phase. Keep file/hash
       * absent until that phase supplies a real physical artifact. The server
       * can still match and authorize routes from this metadata, and it will
       * refuse module delivery until a physical artifact is published.
       */
    })
  );
  const index = {
    version: 1,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    shards: shardDescriptors.sort(
      (left, right) => right.prefix.length - left.prefix.length
    ),
    artifacts,
    generationHash: import_node_crypto.default.createHash("sha256").update(
      JSON.stringify({
        shards: shardDescriptors,
        artifacts
      })
    ).digest("hex").slice(0, 16)
  };
  await import_promises2.default.writeFile(
    import_node_path4.default.join(
      temporaryRoot,
      "server-index.json"
    ),
    JSON.stringify(
      index,
      null,
      2
    ) + "\n",
    "utf8"
  );
  await import_promises2.default.rm(
    absoluteRoot,
    {
      recursive: true,
      force: true
    }
  );
  await import_promises2.default.rename(
    temporaryRoot,
    absoluteRoot
  );
  return Object.freeze({
    indexPath: import_node_path4.default.join(
      absoluteRoot,
      "server-index.json"
    )
  });
}
function safeFileName(value) {
  const normalized = value.replace(
    /[^A-Za-z0-9._-]+/g,
    "-"
  );
  return normalized || "routes";
}

// projects/tools/builder/src/compiler/prepare-build.ts
async function prepareBuild(analysis, options) {
  if (!analysis.success || !analysis.plan) {
    throw new Error(
      "Cannot prepare Waypoint build from failed analysis."
    );
  }
  const metadataRoot = import_node_path5.default.resolve(
    options.metadataRoot
  );
  const hostRoot = import_node_path5.default.join(
    metadataRoot,
    "host"
  );
  const routesEntry = import_node_path5.default.join(
    hostRoot,
    "routes.ts"
  );
  const runtimeEntry = import_node_path5.default.join(
    hostRoot,
    "runtime.js"
  );
  await import_promises3.default.mkdir(
    hostRoot,
    {
      recursive: true
    }
  );
  await import_promises3.default.writeFile(
    routesEntry,
    [
      `import { routeSlot, type NavigationTree } from '@epikodelabs/waypoint';`,
      ``,
      `export const routes = [`,
      `  routeSlot('public'),`,
      `  routeSlot('application'),`,
      `] as const satisfies NavigationTree;`,
      ``
    ].join("\n"),
    "utf8"
  );
  await import_promises3.default.writeFile(
    runtimeEntry,
    [
      `// Waypoint generated host runtime bootstrap.`,
      ``
    ].join("\n"),
    "utf8"
  );
  return Object.freeze({
    host: Object.freeze({
      routesEntry,
      runtimeEntry
    }),
    async publish() {
      await publishServerRouteOutput(
        analysis.plan,
        analysis.planned.serverOutput
      );
      if (analysis.planned.buildManifestOutput) {
        await import_promises3.default.mkdir(
          import_node_path5.default.dirname(
            analysis.planned.buildManifestOutput
          ),
          {
            recursive: true
          }
        );
        await import_promises3.default.writeFile(
          analysis.planned.buildManifestOutput,
          JSON.stringify(
            {
              version: 1,
              entry: analysis.planned.entry,
              routeSets: analysis.plan.artifacts.map(
                (artifact) => ({
                  artifactKey: artifact.artifactKey,
                  routeSetId: artifact.routeSetId,
                  dependencies: artifact.dependencies,
                  branches: artifact.branchIds
                })
              )
            },
            null,
            2
          ) + "\n",
          "utf8"
        );
      }
      return {
        success: true,
        diagnostics: []
      };
    },
    async rollback() {
    },
    async dispose() {
    }
  });
}

// projects/tools/builder/src/waypoint-build/index.ts
async function execute(options, context) {
  try {
    if (!context.target) {
      throw new Error(
        "Waypoint build requires an Architect project target context."
      );
    }
    const workspaceRoot = context.workspaceRoot;
    const projectMetadata = await context.getProjectMetadata(context.target.project);
    const projectRoot = typeof projectMetadata["root"] === "string" ? projectMetadata["root"] : "";
    const angularOptions = angularApplicationOptions(options);
    const outputPath = resolveOutputPath(
      workspaceRoot,
      angularOptions["outputPath"]
    );
    const layout = createBuildLayout(outputPath);
    const waypoint = options.waypoint ?? {};
    const entry = import_node_path6.default.resolve(
      workspaceRoot,
      projectRoot,
      waypoint.entry ?? "src/app/app.routes.ts"
    );
    const analysis = await analyze({
      entry,
      serverOutput: layout.serverRoot,
      artifactsOutput: layout.protectedRoot,
      buildManifestOutput: waypoint.buildManifest === false ? void 0 : layout.buildManifest,
      routesExport: waypoint.routesExport,
      profile: waypoint.profile
    });
    reportDiagnostics(
      analysis.diagnostics,
      context
    );
    if (!analysis.success || !analysis.plan) {
      return {
        success: false,
        error: "Waypoint analysis failed."
      };
    }
    const build2 = await prepareBuild(
      analysis,
      {
        metadataRoot: layout.metadataRoot
      }
    );
    try {
      const delegatedOptions = {
        ...angularOptions,
        fileReplacements: [
          ...normalizeReplacements(
            angularOptions["fileReplacements"]
          ),
          {
            replace: angularWorkspacePath(
              workspaceRoot,
              analysis.planned.entry
            ),
            with: angularWorkspacePath(
              workspaceRoot,
              build2.host.routesEntry
            )
          }
        ],
        polyfills: [
          ...normalizePolyfills(
            angularOptions["polyfills"]
          ),
          angularWorkspacePath(
            workspaceRoot,
            build2.host.runtimeEntry
          )
        ]
      };
      const delegated = await context.scheduleBuilder(
        "@angular/build:application",
        delegatedOptions,
        {
          target: context.target
        }
      );
      try {
        const angularResult = await delegated.result;
        if (!angularResult.success) {
          await build2.rollback();
          return angularResult;
        }
      } finally {
        await delegated.stop();
      }
      const published = await build2.publish();
      reportDiagnostics(
        published.diagnostics,
        context
      );
      return published.success ? { success: true } : {
        success: false,
        error: "Waypoint publication failed."
      };
    } finally {
      await build2.dispose();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    context.logger.error(message);
    return {
      success: false,
      error: message
    };
  }
}
function angularWorkspacePath(workspaceRoot, absolutePath) {
  const relative = import_node_path6.default.relative(
    workspaceRoot,
    absolutePath
  );
  if (relative === ".." || relative.startsWith(`..${import_node_path6.default.sep}`) || import_node_path6.default.isAbsolute(relative)) {
    throw new Error(
      `Waypoint generated path "${absolutePath}" is outside workspace "${workspaceRoot}".`
    );
  }
  return relative.split(import_node_path6.default.sep).join("/");
}
function angularApplicationOptions(options) {
  const {
    waypoint: _waypoint,
    ...angular
  } = options;
  return angular;
}
function normalizeReplacements(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || typeof item.replace !== "string" || typeof item.with !== "string") {
      return [];
    }
    return [{
      replace: item.replace,
      with: item.with
    }];
  });
}
function normalizePolyfills(value) {
  if (typeof value === "string") {
    return [value];
  }
  return Array.isArray(value) ? value.filter(
    (item) => typeof item === "string"
  ) : [];
}
function resolveOutputPath(workspaceRoot, value) {
  if (typeof value === "string" && value.length > 0) {
    return import_node_path6.default.resolve(
      workspaceRoot,
      value
    );
  }
  if (value && typeof value === "object" && typeof value.base === "string") {
    return import_node_path6.default.resolve(
      workspaceRoot,
      value.base
    );
  }
  throw new Error(
    "Waypoint build requires Angular application outputPath."
  );
}
function reportDiagnostics(diagnostics, context) {
  for (const diagnostic of diagnostics) {
    const text = diagnostic.code ? `${diagnostic.code}: ${diagnostic.message}` : diagnostic.message;
    if (diagnostic.level === "error") {
      context.logger.error(text);
    } else if (diagnostic.level === "warning") {
      context.logger.warn(text);
    } else {
      context.logger.info(text);
    }
  }
}
var index_default = (0, import_architect.createBuilder)(
  execute
);
````

## File: projects/tools/builder/src/waypoint-build/schema.json
````json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "title": "Waypoint Angular application build",
  "description": "Angular application builder options plus an optional Waypoint configuration object.",
  "type": "object",
  "properties": {
    "waypoint": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "entry": {
          "type": "string",
          "default": "src/app/app.routes.ts"
        },
        "routesExport": {
          "type": "string",
          "default": "routes"
        },
        "profile": {
          "type": "boolean",
          "default": false
        },
        "buildManifest": {
          "type": "boolean",
          "default": true
        }
      }
    }
  },
  "additionalProperties": true
}
````

## File: templates/server-node-ts/src/compiler-output.ts
````typescript
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createServerRouterSnapshotSource } from '@epikodelabs/waypoint/server';
import type {
  ServerRouterIndex,
  ServerRouterShard,
  ServerArtifactRecord,
  ServerRouteBranch,
  ServerRoutePolicy,
} from '@epikodelabs/waypoint/server';

export interface Branch extends ServerRouteBranch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly policies: readonly ServerRoutePolicy[];
  readonly routeSetId?: string;
}

export interface ArtifactDescriptor extends ServerArtifactRecord {}

export interface ServerIndex extends ServerRouterIndex<ArtifactDescriptor> {
  readonly version: 1;
  readonly generatedAt: string;
  readonly shards: readonly {
    readonly prefix: string;
    readonly file: string;
  }[];
  readonly artifacts: readonly ArtifactDescriptor[];
}

export interface ServerShard extends ServerRouterShard<Branch> {
  readonly version: 1;
  readonly branches: readonly Branch[];
}

const workspaceRoot =
  path.resolve(process.cwd());

const packagedOutputRoot =
  path.resolve(import.meta.dirname, '../waypoint');

const defaultOutputRoot =
  existsSync(
    path.join(
      packagedOutputRoot,
      'server-index.json',
    ),
  )
    ? packagedOutputRoot
    : path.resolve(
        workspaceRoot,
        'dist/app2-client/.waypoint/server',
      );

const outputRoot =
  process.env['WAYPOINT_OUTPUT_ROOT']
    ? path.resolve(
        process.env['WAYPOINT_OUTPUT_ROOT'],
      )
    : defaultOutputRoot;

const indexPath =
  process.env['WAYPOINT_SERVER_INDEX']
    ? path.resolve(
        process.env['WAYPOINT_SERVER_INDEX'],
      )
    : path.join(
        outputRoot,
        'server-index.json',
      );

export function loadServerIndex(): Promise<ServerIndex> {
  return readJson<ServerIndex>(indexPath);
}

export async function readServerOutputRevision(): Promise<string> {
  const stat = await fs.stat(indexPath, { bigint: true });
  return `${stat.mtimeNs}:${stat.size}`;
}

export function resolveOutputPath(relative: string): string {
  const root = path.resolve(path.dirname(indexPath));
  const absolute = path.resolve(root, relative);
  const relation = path.relative(root, absolute);

  if (
    relation === '..'
    || relation.startsWith(`..${path.sep}`)
    || path.isAbsolute(relation)
  ) {
    throw new Error(
      `Compiler output path "${relative}" escapes "${root}".`,
    );
  }

  return absolute;
}

export function loadShard(file: string): Promise<ServerShard> {
  return readJson<ServerShard>(resolveOutputPath(file));
}

/** Cached, atomically refreshable view of one published compiler generation. */
export const compilerOutputSource = createServerRouterSnapshotSource<
  ArtifactDescriptor,
  Branch
>({
  loadIndex: loadServerIndex,
  loadShard,
  revision: readServerOutputRevision,
});

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, 'utf8')) as T;
}
````

## File: templates/server-node-ts/src/server.ts
````typescript
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import path from 'node:path';
import {
  createExpressServerRouterHandlers,
  createServerRouter,
} from '@epikodelabs/waypoint/server';

import {
  compilerOutputSource,
  resolveOutputPath,
  type ArtifactDescriptor,
  type Branch,
} from './compiler-output.js';
import { demoPrincipalProfile, readPrincipal } from './route-auth.js';

const browserDistFolder = path.join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1'],
});

const serverRouter = createServerRouter<ArtifactDescriptor, Branch>({
  loadSnapshot: compilerOutputSource.loadSnapshot,
  moduleUrlFor: artifact =>
    `/api/navigation/modules/${encodeURIComponent(artifact.artifactKey)}`
    + `/${encodeURIComponent(artifact.hash ?? '')}`,
});

const navigation = createExpressServerRouterHandlers<
  ArtifactDescriptor,
  Request,
  Response
>({
  router: serverRouter,
  principalFrom: request => request.principal,
  artifactPathFor: artifact => {
    if (!artifact.file) {
      throw new Error(`Artifact "${artifact.artifactKey}" has no published file.`);
    }
    return resolveOutputPath(artifact.file);
  },
  reload: {
    publicLocation: '/?account=choose',
    landingTargets: ['/?account=choose'],
    async resetPrincipal(_request, response) {
      response
        .set({
          'Clear-Site-Data': '"cache"',
        })
        .clearCookie('identity', {
          path: '/',
          sameSite: 'lax',
        });
    },
  },
});

app.use(express.json({ limit: '16kb' }));
app.use(readPrincipal);

app.post('/api/session/principal', async (request, response, next) => {
  try {
    const profile = demoPrincipalProfile(request.body?.identity);
    if (!profile) {
      response.status(400).set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      }).json({ error: 'Unknown demo principal.' });
      return;
    }

    const location = await serverRouter.resolveLanding(
      profile.landingTargets,
      profile.principal,
    );
    if (!location) {
      response.status(403).set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      }).json({ error: 'No authorized landing route.' });
      return;
    }

    response
      .status(200)
      .set({
        'Cache-Control': 'private, no-store',
        Vary: 'Authorization, Cookie',
      })
      .cookie('identity', profile.id, {
        path: '/',
        sameSite: 'lax',
      })
      .json({ location });
  } catch (error) {
    next(error);
  }
});

app.get('/api/ping', (_request, response) => {
  response.json({
    ok: true,
    runtime: 'express',
    renderedAt: new Date().toISOString(),
  });
});

app.post('/api/navigation/reload', navigation.reload);
app.get('/api/navigation/resolve', navigation.resolve);
app.get('/api/navigation/modules/:artifactKey/:hash', navigation.module);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use(
  (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    angularApp
      .handle(request)
      .then(result =>
        result
          ? writeResponseToNodeResponse(result, response)
          : next(),
      )
      .catch(next);
  },
);

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  app.listen(port, error => {
    if (error) throw error;

    console.log(
      `Node Express server listening on http://localhost:${port}`,
    );
  });
}

export const reqHandler = createNodeRequestHandler(app);
````

## File: projects/apps/app1/tsconfig.app.json
````json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": { "types": [] },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
````

## File: projects/apps/app2/server/src/compiler-output.ts
````typescript
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

import { createServerRouterSnapshotSource } from '@epikodelabs/waypoint/server';
import type {
  ServerRouterIndex,
  ServerRouterShard,
  ServerArtifactRecord,
  ServerRouteBranch,
  ServerRoutePolicy,
} from '@epikodelabs/waypoint/server';

export interface Branch extends ServerRouteBranch {
  readonly id: string;
  readonly kind: 'route' | 'redirect';
  readonly path: string;
  readonly staticPrefix: string;
  readonly name?: string;
  readonly policies: readonly ServerRoutePolicy[];
  readonly routeSetId?: string;
}

export interface ArtifactDescriptor extends ServerArtifactRecord {}

export interface ServerIndex extends ServerRouterIndex<ArtifactDescriptor> {
  readonly version: 1;
  readonly generatedAt: string;
  readonly shards: readonly {
    readonly prefix: string;
    readonly file: string;
  }[];
  readonly artifacts: readonly ArtifactDescriptor[];
}

export interface ServerShard extends ServerRouterShard<Branch> {
  readonly version: 1;
  readonly branches: readonly Branch[];
}

const workspaceRoot =
  path.resolve(process.cwd());

const packagedOutputRoot =
  path.resolve(import.meta.dirname, '../waypoint');

const defaultOutputRoot =
  existsSync(
    path.join(
      packagedOutputRoot,
      'server-index.json',
    ),
  )
    ? packagedOutputRoot
    : path.resolve(
        workspaceRoot,
        'dist/app2-client/.waypoint/server',
      );

const outputRoot =
  process.env['WAYPOINT_OUTPUT_ROOT']
    ? path.resolve(
        process.env['WAYPOINT_OUTPUT_ROOT'],
      )
    : defaultOutputRoot;

const indexPath =
  process.env['WAYPOINT_SERVER_INDEX']
    ? path.resolve(
        process.env['WAYPOINT_SERVER_INDEX'],
      )
    : path.join(
        outputRoot,
        'server-index.json',
      );

export function loadServerIndex(): Promise<ServerIndex> {
  return readJson<ServerIndex>(indexPath);
}

export async function readServerOutputRevision(): Promise<string> {
  const stat = await statWithRetry(indexPath);
  return `${stat.mtimeMs}:${stat.size}`;
}

export function resolveOutputPath(relative: string): string {
  const root = path.resolve(path.dirname(indexPath));
  const absolute = path.resolve(root, relative);
  const relation = path.relative(root, absolute);

  if (
    relation === '..'
    || relation.startsWith(`..${path.sep}`)
    || path.isAbsolute(relation)
  ) {
    throw new Error(
      `Compiler output path "${relative}" escapes "${root}".`,
    );
  }

  return absolute;
}

export function loadShard(file: string): Promise<ServerShard> {
  return readJson<ServerShard>(resolveOutputPath(file));
}

/** Cached, atomically refreshable view of one published compiler generation. */
export const compilerOutputSource = createServerRouterSnapshotSource<
  ArtifactDescriptor,
  Branch
>({
  loadIndex: loadServerIndex,
  loadShard,
  revision: readServerOutputRevision,
});

async function readJson<T>(file: string): Promise<T> {
  const contents = await readFileWithRetry(file);
  return JSON.parse(contents) as T;
}

const RETRY_DELAY_MS = 100;
const RETRY_TIMEOUT_MS = 5000;

async function statWithRetry(
  file: string,
): Promise<Awaited<ReturnType<typeof fs.stat>>> {
  return retryMissingFile(
    () => fs.stat(file, { bigint: true }),
    file,
  );
}

async function readFileWithRetry(
  file: string,
): Promise<string> {
  return retryMissingFile(
    () => fs.readFile(file, 'utf8'),
    file,
  );
}

async function retryMissingFile<T>(
  action: () => Promise<T>,
  file: string,
): Promise<T> {
  const deadline =
    Date.now() + RETRY_TIMEOUT_MS;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      return await action();
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw error;
      }

      lastError = error;
      await delay(RETRY_DELAY_MS);
    }
  }

  throw lastError ?? new Error(
    `Timed out waiting for compiler output "${file}".`,
  );
}

function isMissingFileError(
  error: unknown,
): error is NodeJS.ErrnoException {
  return !!error
    && typeof error === 'object'
    && 'code' in error
    && (error as NodeJS.ErrnoException).code === 'ENOENT';
}

function delay(
  ms: number,
): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
````

## File: projects/libraries/waypoint/client/public-api.ts
````typescript
export {
  provideRouter as provideClientRouter,
  provideRouter,
  Router,
  ROUTE,
  ROUTE_CONTEXT,
  RouterLink,
  RouterOutlet,
  route,
  redirectRoute,
  layout,
  lazyLayout,
  lazyRoute,
  routeSlot,
  routesFor,
  type NavigationTree,
  type NamedRouteDefinition,
  type ResolvedNavigationConfiguration,
  type RouteResolution,
  type RouteResolutionContext,
  type RouterOptions,
} from '@epikodelabs/waypoint';
export { type RouterRevalidationOptions } from '@epikodelabs/waypoint';
export {
  RouterReloadError,
  type RouterReloadOptions,
  type RouterReloadReason,
} from '@epikodelabs/waypoint';
````

## File: projects/libraries/waypoint/server/browser-delivery.ts
````typescript
import type {
  NavigationTree,
  RouteContributionDefinition,
} from '@epikodelabs/waypoint';
import {
  registerServerNavigationHostModules,
  type ServerNavigationHostModules,
} from './server-host-runtime';
import {
  isServerNavigationResolution,
  type ServerArtifactDelivery,
} from './server-delivery';

export interface ServerNavigationFetchResponse {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
}

export type ServerNavigationFetch = (
  input: string,
  init: Readonly<{
    readonly credentials: 'same-origin';
    readonly headers: Readonly<Record<string, string>>;
    readonly signal?: AbortSignal;
  }>,
) => Promise<ServerNavigationFetchResponse>;

export type ServerNavigationModuleImporter = (
  moduleUrl: string,
) => Promise<unknown>;

export interface ServerNavigationResolverOptions {
  readonly endpoint?: string;
  readonly fetch?: ServerNavigationFetch;
  readonly importModule?: ServerNavigationModuleImporter;
  readonly artifactRefreshRetries?: number;
  readonly hostModules?: ServerNavigationHostModules;
}

export interface ServerNavigationResolverContext {
  readonly signal?: AbortSignal;
}

export interface ServerResolvedNavigationConfiguration {
  readonly contributions: readonly RouteContributionDefinition[];
}

export type ServerNavigationResolver = (
  url: URL,
  context?: ServerNavigationResolverContext,
) => Promise<ServerResolvedNavigationConfiguration | null>;

interface RouteModule {
  readonly default?: unknown;
}

export class ServerNavigationArtifactLoadError extends Error {
  constructor(
    public readonly descriptor: ServerArtifactDelivery,
    public override readonly cause: unknown,
  ) {
    super(
      `Failed to load server navigation artifact "${descriptor.artifactKey}" from "${descriptor.moduleUrl}".`,
    );
    this.name = 'ServerNavigationArtifactLoadError';
  }
}

/**
 * Browser half of Waypoint Server Delivery Contract v2.
 *
 * The server sends an already-authorized dependency-first artifact plan.
 * Shared artifacts are imported for their module side effects / ESM dependency
 * registration only. Route artifacts must export a routesFor() contribution.
 */
export function createServerNavigationResolver(
  options: ServerNavigationResolverOptions = {},
): ServerNavigationResolver {
  if (!options.importModule && !options.hostModules) {
    throw new Error(
      'Native server navigation imports require hostModules so delivered Angular artifacts share the host application runtime.',
    );
  }

  if (
    !options.importModule
    && !options.hostModules?.['@epikodelabs/waypoint']
  ) {
    throw new Error(
      'Native server navigation imports require hostModules["@epikodelabs/waypoint"] to share the active Waypoint runtime identity.',
    );
  }

  if (options.hostModules) {
    registerServerNavigationHostModules(options.hostModules);
  }

  const endpoint = normalizeEndpoint(options.endpoint ?? '/api/navigation/resolve');
  const fetchNavigation = options.fetch ?? defaultFetch;
  const importModule = options.importModule ?? defaultImportModule;
  const artifactRefreshRetries = normalizeRetryCount(
    options.artifactRefreshRetries ?? 1,
  );

  const loadedArtifacts = new Map<string, Promise<unknown>>();
  const latestIdentityByArtifact = new Map<string, string>();

  async function importArtifact(
    descriptor: ServerArtifactDelivery,
  ): Promise<unknown> {
    const identity = deliveryIdentity(descriptor);
    const existing = loadedArtifacts.get(identity);
    if (existing) return existing;

    const previousIdentity = latestIdentityByArtifact.get(descriptor.artifactKey);
    if (previousIdentity && previousIdentity !== identity) {
      loadedArtifacts.delete(previousIdentity);
    }
    latestIdentityByArtifact.set(descriptor.artifactKey, identity);

    const pending = (async () => {
      try {
        return await importModule(descriptor.moduleUrl);
      } catch (error) {
        throw new ServerNavigationArtifactLoadError(descriptor, error);
      }
    })();

    loadedArtifacts.set(identity, pending);

    try {
      return await pending;
    } catch (error) {
      if (loadedArtifacts.get(identity) === pending) {
        loadedArtifacts.delete(identity);
      }
      if (latestIdentityByArtifact.get(descriptor.artifactKey) === identity) {
        latestIdentityByArtifact.delete(descriptor.artifactKey);
      }
      throw error;
    }
  }

  async function importRouteContribution(
    descriptor: ServerArtifactDelivery,
  ): Promise<RouteContributionDefinition> {
    const loaded = await importArtifact(descriptor) as RouteModule;
    const contribution = loaded?.default;

    if (!isRouteContributionDefinition(contribution)) {
      throw new Error(
        `Route artifact "${descriptor.artifactKey}" did not export a route contribution.`,
      );
    }

    return contribution;
  }

  async function resolveOnce(
    url: URL,
    signal?: AbortSignal,
    retryingArtifact?: ServerNavigationArtifactLoadError,
  ): Promise<ServerResolvedNavigationConfiguration | null> {
    throwIfAborted(signal);
    const target = `${url.pathname}${url.search}${url.hash}`;
    const response = await fetchNavigation(
      resolutionRequestUrl(endpoint, target),
      {
        credentials: 'same-origin',
        headers: Object.freeze({ Accept: 'application/json' }),
        signal,
      },
    );

    throwIfAborted(signal);
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Failed to resolve "${target}": ${response.status}.`);
    }

    const payload = await response.json();
    throwIfAborted(signal);

    if (!isServerNavigationResolution(payload)) {
      throw new Error(
        `Server returned an invalid Waypoint navigation resolution for "${target}".`,
      );
    }

    if (retryingArtifact) {
      const candidate = payload.artifacts.find(artifact =>
        artifact.artifactKey === retryingArtifact.descriptor.artifactKey,
      );
      if (
        candidate
        && deliveryIdentity(candidate) === deliveryIdentity(retryingArtifact.descriptor)
      ) {
        throw unwrapArtifactLoadError(retryingArtifact);
      }
    }

    const contributions: RouteContributionDefinition[] = [];

    for (const artifact of payload.artifacts) {
      throwIfAborted(signal);

      if (artifact.kind === 'shared') {
        await importArtifact(artifact);
        continue;
      }

      contributions.push(await importRouteContribution(artifact));
    }

    throwIfAborted(signal);
    return Object.freeze({
      contributions: Object.freeze(contributions),
    });
  }

  return async (
    url: URL,
    context: ServerNavigationResolverContext = {},
  ): Promise<ServerResolvedNavigationConfiguration | null> => {
    let retryingArtifact: ServerNavigationArtifactLoadError | undefined;

    for (let attempt = 0; ; attempt++) {
      try {
        return await resolveOnce(url, context.signal, retryingArtifact);
      } catch (error) {
        if (
          !(error instanceof ServerNavigationArtifactLoadError)
          || attempt >= artifactRefreshRetries
          || context.signal?.aborted
        ) {
          throw error;
        }
        retryingArtifact = error;
      }
    }
  };
}

function normalizeEndpoint(endpoint: string): string {
  const normalized = endpoint.trim();
  if (!normalized) {
    throw new Error('Server navigation endpoint must not be empty.');
  }

  return normalized;
}

function normalizeRetryCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Server navigation artifactRefreshRetries must be a non-negative number.');
  }

  return Math.floor(value);
}

function resolutionRequestUrl(
  endpoint: string,
  target: string,
): string {
  const separator =
    endpoint.includes('?')
      ? (endpoint.endsWith('?') || endpoint.endsWith('&') ? '' : '&')
      : '?';

  return `${endpoint}${separator}path=${encodeURIComponent(target)}`;
}

function deliveryIdentity(
  descriptor: ServerArtifactDelivery,
): string {
  return `${descriptor.artifactKey}:${descriptor.hash}`;
}

function unwrapArtifactLoadError(
  error: ServerNavigationArtifactLoadError,
): Error {
  return error.cause instanceof Error
    ? error.cause
    : new Error(String(error.cause));
}

function throwIfAborted(signal?: AbortSignal): void {
  if (!signal?.aborted) return;

  throw signal.reason instanceof Error
    ? signal.reason
    : new Error('The operation was aborted.');
}

const defaultFetch: ServerNavigationFetch = async (
  input,
  init,
) => {
  return fetch(input, init);
};

const defaultImportModule: ServerNavigationModuleImporter = async (
  moduleUrl,
) => {
  return import(/* @vite-ignore */ moduleUrl);
};

export function isRouteContributionDefinition(
  value: unknown,
): value is RouteContributionDefinition<string, string, NavigationTree> {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate =
    value as Partial<RouteContributionDefinition<string, string, NavigationTree>>;

  return candidate.kind === 'route-contribution'
    && typeof candidate.id === 'string'
    && candidate.id.trim().length > 0
    && typeof candidate.slotId === 'string'
    && candidate.slotId.trim().length > 0
    && Array.isArray(candidate.entries);
}
````

## File: projects/libraries/waypoint/src/lib/browser-delivery.ts
````typescript
export * from '../../server/browser-delivery';
````

## File: projects/libraries/waypoint/src/lib/history.ts
````typescript
export interface ScrollPosition {
  readonly x: number;
  readonly y: number;
}

export interface HistoryEntry {
  readonly id: number;
  readonly href: string;
  readonly scroll: ScrollPosition;
  readonly state: unknown;
}

export interface HistoryUpdate {
  readonly type: 'none' | 'push' | 'replace' | 'popstate';
  readonly previousIndex: number;
  readonly nextIndex: number;
  readonly previousEntry?: HistoryEntry;
  readonly previousScroll: ScrollPosition;
  readonly nextEntry?: HistoryEntry;
}

export const ZERO_SCROLL: ScrollPosition = Object.freeze({ x: 0, y: 0 });

export class HistoryManager {
  constructor(
    private readonly browserWindow: Pick<Window, 'history' | 'scrollX' | 'scrollY'> | null =
      typeof window === 'undefined' ? null : window,
    private readonly location: Pick<Location, 'pathname' | 'search' | 'hash'> =
      typeof window === 'undefined'
        ? { pathname: '/', search: '', hash: '' }
        : window.location,
    private readonly decorateState: (state: unknown, entryId: number) => unknown =
      state => state,
    private readonly readEntryId: (state: unknown) => number | null =
      () => null,
  ) {}

  private entries: HistoryEntry[] = [];
  private index = -1;
  private nextId = 1;

  private get currentHref(): string {
    return this.location.pathname + this.location.search + this.location.hash;
  }

  private readScroll(): ScrollPosition {
    return {
      x: this.browserWindow?.scrollX ?? 0,
      y: this.browserWindow?.scrollY ?? 0,
    };
  }

  private readHistoryState(): unknown {
    return this.browserWindow?.history.state ?? null;
  }

  private allocateId(): number {
    return this.nextId++;
  }

  private ensureHistoryEntry(): void {
    if (this.entries.length > 0) return;

    const browserState = this.readHistoryState();
    const existingId = this.readEntryId(browserState);
    const id = existingId ?? this.allocateId();
    this.nextId = Math.max(this.nextId, id + 1);

    this.entries = [{
      id,
      href: this.currentHref,
      scroll: this.readScroll(),
      state: this.decorateState(browserState, id),
    }];
    this.index = 0;
  }

  private saveCurrentScroll(): ScrollPosition {
    const scroll = this.readScroll();
    const entry = this.entries[this.index];
    if (entry) this.entries[this.index] = { ...entry, scroll };
    return scroll;
  }

  createDefaultUpdate(): HistoryUpdate {
    this.ensureHistoryEntry();
    return {
      type: 'none',
      previousIndex: this.index,
      nextIndex: this.index,
      previousScroll: this.readScroll(),
      previousEntry: this.entries[this.index],
      nextEntry: this.entries[this.index],
    };
  }

  createUpdate(href: string, replace: boolean, state: unknown): HistoryUpdate {
    this.ensureHistoryEntry();
    const previousScroll = this.saveCurrentScroll();
    const previousIndex = this.index;
    const current = this.entries[this.index];
    const id = replace && current ? current.id : this.allocateId();
    const nextEntry: HistoryEntry = {
      id,
      href,
      scroll: replace ? previousScroll : ZERO_SCROLL,
      state: this.decorateState(state, id),
    };

    if (replace) {
      const previousEntry = this.entries[this.index];
      this.entries[this.index] = nextEntry;
      return { type: 'replace', previousIndex, nextIndex: this.index, previousEntry, previousScroll, nextEntry };
    }

    this.entries = this.entries.slice(0, this.index + 1);
    this.entries.push(nextEntry);
    return {
      type: 'push', previousIndex, nextIndex: this.index + 1, previousScroll,
      previousEntry: this.entries[previousIndex], nextEntry,
    };
  }

  createPopStateUpdate(href: string): HistoryUpdate {
    this.ensureHistoryEntry();
    const previousScroll = this.saveCurrentScroll();
    const previousIndex = this.index;
    const browserState = this.readHistoryState();
    const entryId = this.readEntryId(browserState);
    const resolvedIndex = entryId === null
      ? this.findHistoryIndexByHref(href)
      : this.entries.findIndex(entry => entry.id === entryId);
    const nextIndex = resolvedIndex >= 0
      ? resolvedIndex
      : this.entries[previousIndex - 1]
        ? previousIndex - 1
        : previousIndex;
    const existing = this.entries[nextIndex];
    const id = entryId ?? existing?.id ?? this.allocateId();
    const nextEntry: HistoryEntry = existing
      ? { ...existing, id, href, state: this.decorateState(browserState, id) }
      : { id, href, scroll: ZERO_SCROLL, state: this.decorateState(browserState, id) };

    return {
      type: 'popstate', previousIndex, nextIndex, previousScroll,
      previousEntry: this.entries[previousIndex], nextEntry,
    };
  }

  private findHistoryIndexByHref(href: string): number {
    const previous = this.entries[this.index - 1];
    if (previous?.href === href) return this.index - 1;
    const next = this.entries[this.index + 1];
    if (next?.href === href) return this.index + 1;

    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (let index = 0; index < this.entries.length; index++) {
      if (this.entries[index]?.href !== href || index === this.index) continue;
      const distance = Math.abs(index - this.index);
      if (distance < bestDistance) { bestIndex = index; bestDistance = distance; }
    }
    return bestIndex;
  }

  rollbackUpdate(update: HistoryUpdate): void {
    switch (update.type) {
      case 'push':
        this.entries = this.entries.slice(0, update.previousIndex + 1);
        this.index = update.previousIndex;
        return;
      case 'replace':
        if (update.previousEntry && update.previousIndex >= 0) {
          this.entries[update.previousIndex] = update.previousEntry;
        }
        this.index = update.previousIndex;
        return;
      case 'popstate':
      case 'none':
        this.index = update.previousIndex;
        return;
    }
  }

  commitUpdate(update: HistoryUpdate, href: string): void {
    this.index = update.nextIndex;
    const previous = this.entries[this.index];
    this.entries[this.index] = update.nextEntry ?? {
      id: previous?.id ?? this.allocateId(),
      href,
      scroll: update.type === 'replace' ? update.previousScroll : ZERO_SCROLL,
      state: this.decorateState(null, previous?.id ?? this.nextId - 1),
    };
  }
}
````

## File: projects/libraries/waypoint/src/lib/query-schema.ts
````typescript
type ScalarSchema =
  | StringSchema
  | NumberSchema
  | BooleanSchema
  | DateSchema;

type NonOptionalSchema =
  | ScalarSchema
  | ArraySchema;

export type QuerySchema =
  | NonOptionalSchema
  | OptionalSchema<NonOptionalSchema>;

export type ParamSchema = ScalarSchema;

export type QuerySchemaRecord = Readonly<Record<string, QuerySchema>>;
export type ParamSchemaRecord = Readonly<Record<string, ParamSchema>>;

interface StringSchema {
  readonly _type: 'string';
  readonly default?: string;
}

interface NumberSchema {
  readonly _type: 'number';
  readonly default?: number;
  readonly min?: number;
  readonly max?: number;
}

interface BooleanSchema {
  readonly _type: 'boolean';
  readonly default?: boolean;
}

interface ArraySchema {
  readonly _type: 'array';
  readonly default?: readonly string[];
}

interface DateSchema {
  readonly _type: 'date';
  readonly default?: Date;
}

interface OptionalSchema<T extends NonOptionalSchema> {
  readonly _type: 'optional';
  readonly inner: T;
}

export const s = {
  string: (defaultValue?: string): StringSchema => ({
    _type: 'string',
    default: defaultValue,
  }),

  number: (opts?: {
    default?: number;
    min?: number;
    max?: number;
  }): NumberSchema => ({
    _type: 'number',
    ...opts,
  }),

  boolean: (defaultValue?: boolean): BooleanSchema => ({
    _type: 'boolean',
    default: defaultValue,
  }),

  array: (defaultValue?: readonly string[]): ArraySchema => ({
    _type: 'array',
    default: defaultValue,
  }),

  date: (defaultValue?: Date): DateSchema => ({
    _type: 'date',
    default: defaultValue,
  }),

  optional: <T extends NonOptionalSchema>(inner: T): OptionalSchema<T> => ({
    _type: 'optional',
    inner,
  }),
} as const;

type SchemaValue<TSchema extends QuerySchema | ParamSchema> =
  TSchema extends OptionalSchema<infer TInner>
    ? SchemaValue<TInner>
    : TSchema extends StringSchema
      ? string
      : TSchema extends NumberSchema
        ? number
        : TSchema extends BooleanSchema
          ? boolean
          : TSchema extends ArraySchema
            ? readonly string[]
            : TSchema extends DateSchema
              ? Date
              : unknown;

export type InferQueryType<T extends Record<string, QuerySchema>> = {
  [K in keyof T as T[K] extends OptionalSchema<NonOptionalSchema>
    ? never
    : K]: SchemaValue<T[K]>;
} & {
  [K in keyof T as T[K] extends OptionalSchema<NonOptionalSchema>
    ? K
    : never]?: SchemaValue<T[K]>;
};

export type InferQueryInputType<T extends Record<string, QuerySchema>> = {
  [K in keyof T]?: SchemaValue<T[K]>;
};

export type InferParamType<T extends Record<string, ParamSchema>> = {
  [K in keyof T]: SchemaValue<T[K]>;
};

function parseValue(
  spec: QuerySchema | ParamSchema,
  raw: string | undefined,
): unknown {
  if (raw === undefined) {
    if (spec._type === 'optional') return undefined;
    return undefined;
  }

  switch (spec._type) {
    case 'string':
      return raw;
    case 'number': {
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        throw new Error(
          `Invalid number value "${raw}".`,
        );
      }

      if (spec.min !== undefined && value < spec.min) {
        throw new Error(
          `Number value "${raw}" is below the minimum ${spec.min}.`,
        );
      }

      if (spec.max !== undefined && value > spec.max) {
        throw new Error(
          `Number value "${raw}" is above the maximum ${spec.max}.`,
        );
      }

      return value;
    }
    case 'boolean':
      if (raw === 'true' || raw === '1') {
        return true;
      }

      if (raw === 'false' || raw === '0') {
        return false;
      }

      throw new Error(
        `Invalid boolean value "${raw}". Expected true, false, 1, or 0.`,
      );
    case 'date': {
      const value = new Date(raw);
      if (!Number.isNaN(value.getTime())) {
        return value;
      }

      throw new Error(
        `Invalid date value "${raw}".`,
      );
    }
    case 'optional':
      return parseValue(spec.inner, raw);
    default:
      return raw;
  }
}

function getDefault(spec: QuerySchema): unknown {
  switch (spec._type) {
    case 'string':
      return spec.default ?? '';
    case 'number':
      return spec.default ?? 0;
    case 'boolean':
      return spec.default ?? false;
    case 'array':
      return Object.freeze([...(spec.default ?? [])]);
    case 'date':
      return spec.default
        ? new Date(spec.default.getTime())
        : new Date();
    case 'optional':
      return undefined;
    default:
      return undefined;
  }
}

function parseQueryInternal(
  schema: Record<string, QuerySchema>,
  url: URL,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, spec] of Object.entries(schema)) {
    const allValues = url.searchParams.getAll(key);
    const raw = allValues[0];

    if (spec._type === 'array') {
      result[key] =
        allValues.length > 0
          ? Object.freeze([...allValues])
          : Object.freeze([...(spec.default ?? [])]);
      continue;
    }

    if (spec._type === 'optional' && raw === undefined) {
      continue;
    }

    const parsed = parseValue(spec, raw);
    result[key] = parsed !== undefined ? parsed : getDefault(spec);
  }

  return Object.freeze(result);
}

export function parseQuery<T extends Record<string, QuerySchema>>(
  schema: T,
  url: URL,
): InferQueryType<T> {
  return parseQueryInternal(schema, url) as InferQueryType<T>;
}

export function parseQueryRecord(
  schema: Record<string, QuerySchema>,
  url: URL,
): Record<string, unknown> {
  return parseQueryInternal(schema, url);
}

export function parseParams<T extends Record<string, ParamSchema>>(
  schema: T,
  params: Record<string, string>,
): InferParamType<T> {
  const result: Record<string, unknown> = {};

  for (const [key, spec] of Object.entries(schema)) {
    const raw = params[key];

    if (raw === undefined) {
      throw new Error(
        `Missing required path parameter "${key}".`,
      );
    }

    result[key] = parseValue(spec, raw);
  }

  return Object.freeze(result) as InferParamType<T>;
}

export function parseParamsRecord(
  schema: Record<string, ParamSchema>,
  params: Record<string, string>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, spec] of Object.entries(schema)) {
    const raw = params[key];

    if (raw === undefined) {
      throw new Error(
        `Missing required path parameter "${key}".`,
      );
    }

    result[key] = parseValue(spec, raw);
  }

  return Object.freeze(result);
}

function unwrapOptionalQuerySchema(
  schema: QuerySchema,
): QuerySchema {
  let current = schema;

  while (current._type === 'optional') {
    current = current.inner;
  }

  return current;
}

export function serializeQuery<
  const T extends QuerySchemaRecord,
>(
  schema: T,
  values: Readonly<Record<string, unknown>>,
): string {
  return serializeQueryRecord(
    schema,
    values,
  );
}

export function serializeQueryRecord(
  schema: QuerySchemaRecord,
  values: Readonly<Record<string, unknown>>,
): string {
  const params =
    new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      continue;
    }

    const declared =
      schema[key];

    if (!declared) {
      continue;
    }

    const spec =
      unwrapOptionalQuerySchema(
        declared,
      );

    if (
      spec._type === 'array' &&
      Array.isArray(value)
    ) {
      const defaultValue =
        getDefault(spec);
      const isDefault =
        Array.isArray(defaultValue)
        && value.length === defaultValue.length
        && value.every(
          (item, index) =>
            item ===
              defaultValue[index],
        );

      if (!isDefault) {
        for (const item of value) {
          params.append(
            key,
            String(item),
          );
        }
      }

      continue;
    }

    if (
      spec._type === 'date' &&
      value instanceof Date
    ) {
      params.set(
        key,
        value.toISOString(),
      );

      continue;
    }

    if (value !== getDefault(declared)) {
      params.set(
        key,
        String(value),
      );
    }
  }

  const search =
    params.toString();

  return search
    ? `?${search}`
    : '';
}

function serializeValue(
  spec: QuerySchema | ParamSchema,
  value: unknown,
): string {
  if (spec._type === 'optional') {
    return serializeValue(spec.inner, value);
  }

  if (spec._type === 'date' && value instanceof Date) {
    return value.toISOString();
  }

  if (spec._type === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}

export function serializeParams<T extends Record<string, ParamSchema>>(
  schema: T,
  values: InferParamType<T>,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      continue;
    }

    const spec = schema[key];
    if (!spec) {
      params[key] = String(value);
      continue;
    }

    params[key] = serializeValue(spec, value);
  }

  return params;
}
````

## File: projects/libraries/waypoint/src/lib/server-source.ts
````typescript
export * from '../../server/server-source';
````

## File: projects/libraries/waypoint/src/tests/route-compiler.spec.ts
````typescript
import {
  layout,
  route,
  s,
} from '@epikodelabs/waypoint';

import { createRouteRegistry } from '../lib/route-compiler';

class TestPage {}
class TestLayout {}

describe('route compiler parameter validation', () => {
  it('rejects duplicate parameter names across layouts and leaf routes', () => {
    const routes = [
      layout('/teams/:id', TestLayout, [
        route('/members/:id', TestPage),
      ]),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /Duplicate path parameter ":id" in compiled route "\/teams\/:id\/members\/:id"/,
    );
  });

  it('rejects paramsSchema keys that are absent from the compiled path', () => {
    const routes = [
      route('/users/:userId', TestPage, {
        paramsSchema: {
          id: s.number(),
        },
      }),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /paramsSchema declares "id".*does not contain ":id"/,
    );
  });

  it('requires every path parameter to be declared when paramsSchema is present', () => {
    const routes = [
      route('/teams/:teamId/users/:userId', TestPage, {
        paramsSchema: {
          teamId: s.number(),
        },
      }),
    ] as const;

    expect(() => createRouteRegistry(routes)).toThrowError(
      /contains ":userId", but paramsSchema does not declare it/,
    );
  });

  it('accepts an exact paramsSchema for the compiled path', () => {
    const routes = [
      layout('/teams/:teamId', TestLayout, [
        route('/users/:userId', TestPage, {
          paramsSchema: {
            teamId: s.number(),
            userId: s.number(),
          },
        }),
      ]),
    ] as const;

    expect(() => createRouteRegistry(routes)).not.toThrow();
  });
  it('preserves server policy metadata without changing runtime compilation', () => {
    const protectedRoute = route('/admin', TestPage, {
      policy: {
        roles: ['admin'],
        permissions: ['admin:read'],
      },
    });

    const registry = createRouteRegistry([protectedRoute]);

    expect(protectedRoute.policy).toEqual({
      roles: ['admin'],
      permissions: ['admin:read'],
    });
    expect(registry.groups[0]?.primary.route).toBe(protectedRoute);
  });

});
````

## File: projects/libraries/waypoint/src/tests/router-history-regression.spec.ts
````typescript
import {
  createRouter,
  type Route,
  type VanillaRouter,
  type VanillaRouterConfig,
} from '@epikodelabs/waypoint';

import { idescribe } from './env.spec';
import {
  assertRouterInvariant,
} from './router-test-utils';

function delay(ms = 50): Promise<void> {
  return new Promise(resolve =>
    setTimeout(resolve, ms),
  );
}

function route(
  path: string,
  text: string,
  overrides: Partial<Route> = {},
): Route {
  return {
    path,
    load: async () => ({
      component: () =>
        document.createTextNode(text),
    }),
    ...overrides,
  };
}

idescribe('Router history rollback regressions', () => {
  let outlet: HTMLElement;
  let router: VanillaRouter;

  beforeEach(() => {
    outlet = document.createElement('div');
    document.body.appendChild(outlet);
    window.history.replaceState(
      { initial: true },
      '',
      '/',
    );

    spyOn(console, 'debug');
    spyOn(console, 'error');
  });

  afterEach(() => {
    router?.dispose();
    window.history.replaceState(null, '', '/');
    outlet.remove();
  });

  function create(
    routes: Route[],
    overrides: Partial<VanillaRouterConfig> = {},
  ): VanillaRouter {
    return createRouter({
      routes,
      render: (_name, node) => {
        outlet.replaceChildren(node);
      },
      ...overrides,
    });
  }

  it('restores the active URL when a pushed navigation is blocked', async () => {
    const home: Route = {
      path: '',
      load: async () => ({
        component: () =>
          document.createTextNode('Home'),
        canDeactivate: [() => false],
      }),
    };

    router = create([
      home,
      route('about', 'About'),
    ]);

    expect(await router.navigate('/'))
      .toBeTrue();
    expect(await router.navigate('/about'))
      .toBeFalse();

    expect(window.location.pathname).toBe('/');
    expect(router.state.current?.config)
      .toBe(home);
    expect(outlet.textContent).toBe('Home');

    assertRouterInvariant(router);
  });

  it('restores the active URL when a replace navigation is blocked', async () => {
    const home: Route = {
      path: '',
      load: async () => ({
        component: () =>
          document.createTextNode('Home'),
        canDeactivate: [() => false],
      }),
    };

    router = create([
      home,
      route('about', 'About'),
    ]);

    expect(await router.navigate('/'))
      .toBeTrue();
    expect(
      await router.replace(
        '/about',
        { attempted: true },
      ),
    ).toBeFalse();

    expect(window.location.pathname).toBe('/');
    expect(window.history.state)
      .not.toEqual({ attempted: true });
    expect(router.state.current?.config)
      .toBe(home);

    assertRouterInvariant(router);
  });

  it('preserves the current history state when a navigation is blocked', async () => {
    const home: Route = {
      path: '',
      load: async () => ({
        component: () =>
          document.createTextNode('Home'),
        canDeactivate: [() => false],
      }),
    };

    router = create([
      home,
      route('next', 'Next'),
    ]);

    expect(
      await router.navigate('/', {
        state: { session: 7 },
      }),
    ).toBeTrue();

    expect(await router.navigate('/next'))
      .toBeFalse();

    expect(window.history.state)
      .toEqual({ session: 7 });
    expect(router.state.historyState)
      .toEqual({ session: 7 });

    assertRouterInvariant(router);
  });

  it('restores the prior URL after a route load failure', async () => {
    const home = route('', 'Home');
    const broken: Route = {
      path: 'broken',
      load: async () => {
        throw new Error('Load failed');
      },
    };

    router = create([home, broken]);

    expect(await router.navigate('/'))
      .toBeTrue();
    await expectAsync(router.navigate('/broken'))
      .toBeRejectedWithError('Load failed');

    expect(window.location.pathname).toBe('/');
    expect(router.state.error)
      .toEqual(jasmine.any(Error));
    expect(
      (router.state.error as Error).message,
    ).toBe('Load failed');

    // A single-route preparation failure replaces the active view with error
    // output, but browser history still returns to the previously committed URL.
    expect(router.state.current).toBeNull();
    expect(router.state.pending).toBeFalse();
    expect(router.state.phase).toBeNull();
  });

  it('does not leave a failed custom commit in browser history', async () => {
    let commits = 0;
    const home = route('', 'Home');
    const next = route('next', 'Next');

    router = create(
      [home, next],
      {
        commit: outlets => {
          commits++;

          if (commits === 2) {
            throw new Error('Commit failed');
          }

          outlet.replaceChildren(
            outlets[0].node,
          );
        },
      },
    );

    expect(await router.navigate('/'))
      .toBeTrue();
    await expectAsync(router.navigate('/next'))
      .toBeRejectedWithError('Commit failed');

    expect(window.location.pathname).toBe('/');
    expect(
      (router.state.error as Error).message,
    ).toBe('Commit failed');
    expect(router.state.pending).toBeFalse();
    expect(router.state.phase).toBeNull();
  });

  it('restores a popstate destination when canDeactivate blocks back navigation', async () => {
    const home = route('', 'Home');
    const about: Route = {
      path: 'about',
      load: async () => ({
        component: () =>
          document.createTextNode('About'),
        canDeactivate: [() => false],
      }),
    };

    router = create([home, about]);
    router.start();

    expect(await router.navigate('/'))
      .toBeTrue();
    expect(await router.navigate('/about'))
      .toBeTrue();

    window.history.back();
    await delay(100);

    expect(window.location.pathname)
      .toBe('/about');
    expect(router.state.current?.config)
      .toBe(about);
    expect(outlet.textContent).toBe('About');

    assertRouterInvariant(router);
  });

  it('preserves active state when a grouped secondary outlet fails to prepare', async () => {
    const stable = route('', 'Stable');
    const grouped: Route = {
      path: 'project',
      load: async () => ({
        component: () =>
          document.createTextNode('Project'),
      }),
      outlets: [{
        path: 'project',
        outlet: 'sidebar',
        load: async () => {
          throw new Error('Sidebar failed');
        },
      }],
    };

    router = create([stable, grouped]);

    expect(await router.navigate('/'))
      .toBeTrue();
    await expectAsync(router.navigate('/project'))
      .toBeRejectedWithError('Sidebar failed');

    expect(window.location.pathname).toBe('/');
    expect(router.state.current?.config)
      .toBe(stable);
    expect(outlet.textContent).toBe('Stable');
    expect(
      (router.state.error as Error).message,
    ).toBe('Sidebar failed');

    assertRouterInvariant(router);
  });

  it('keeps revalidation out of browser history', async () => {
    let prepareCount = 0;
    const home: Route = {
      path: '',
      load: async () => ({
        prepare: [
          () => ({
            count: ++prepareCount,
          }),
        ],
        component: active =>
          document.createTextNode(
            String(active.data['count']),
          ),
      }),
    };

    router = create([home]);

    expect(await router.navigate('/'))
      .toBeTrue();

    const length = window.history.length;
    const state = window.history.state;

    expect(await router.revalidate())
      .toBeTrue();

    expect(window.history.length).toBe(length);
    expect(window.history.state).toBe(state);
    expect(outlet.textContent).toBe('2');

    assertRouterInvariant(router);
  });
});
````

## File: projects/libraries/waypoint/src/tests/typed-navigation.spec.ts
````typescript
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
````

## File: projects/libraries/waypoint/src/tests/typed-prepare.spec.ts
````typescript
import type { Type } from '@angular/core';

import {
  frame,
  lazyFrame,
  route,
} from '../lib/route-builders';
import type {
  InferFrameData,
  InferRoutePreparedData,
} from '../lib/navigation-definitions';

function expectType<T>(_value: T): void {}

class ProjectPage {}

interface Project {
  readonly id: number;
  readonly name: string;
}

describe('typed frame preparation', () => {
  it('preserves prepare handlers at runtime', async () => {
    const project: Project = {
      id: 7,
      name: 'Waypoint',
    };

    const view = frame(ProjectPage, {
      prepare: [
        async () => ({ project }),
        () => ({ permissions: ['read'] as const }),
      ],
    });

    const first = await view.prepare?.[0]?.({} as never);
    const second = await view.prepare?.[1]?.({} as never);

    expect(first).toEqual({ project });
    expect(second).toEqual({ permissions: ['read'] });
  });

  it('supports the same inference for lazy frames', () => {
    const view = lazyFrame(
      async () => ProjectPage,
      {
        prepare: [
          () => ({ projectId: 42 }),
        ],
        afterEnter: [activated => {
          const projectId: number = activated.data.projectId;
          expect(projectId).toBe(42);
        }],
      },
    );

    expect(view.kind).toBe('frame');
  });
});

const project: Project = {
  id: 1,
  name: 'Typed preparation',
};

const projectFrame = frame(ProjectPage as Type<unknown>, {
  prepare: [
    async () => ({ project }),
    () => ({ permissions: ['read', 'write'] as const }),
  ],

  afterEnter: [activated => {
    expectType<string>(activated.data.project.name);
    expectType<'read' | 'write'>(activated.data.permissions[0]);

    // @ts-expect-error prepare did not provide a customer value
    activated.data.customer;
  }],

  beforeLeave: [active => {
    expectType<number>(active.data.project.id);
    return true;
  }],
});

const projectRoute = route('/projects/:projectId', projectFrame, {
  name: 'project',
});

type ProjectFrameData = InferFrameData<typeof projectFrame>;
type ProjectRouteData = InferRoutePreparedData<typeof projectRoute>;

const frameData: ProjectFrameData = {
  project,
  permissions: ['read', 'write'],
};

const routeData: ProjectRouteData = frameData;
expectType<ProjectRouteData>(routeData);
````

## File: projects/libraries/waypoint/src/public-api.ts
````typescript
/** Public API surface of the routing library. */
export * from './lib';
````

## File: projects/tools/builder/scripts/generate-waypoint-schema.mjs.patch
````diff
/*
Final Waypoint-specific schema should contain only:

waypoint: {
  entry?: string;
  profile?: boolean;
  buildManifest?: boolean;
}

Remove routesExport/rootExport compatibility options from the builder schema.

The compiler CLI may retain a deprecated low-level compatibility switch for one
release if desired, but it should not be part of the application build surface.
*/
````

## File: projects/apps/app1/src/app/app.css
````css
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
````

## File: projects/apps/app1/src/app/app.html
````html
<div class="app-frame">
  <header class="masthead">
    <a class="brand" [routerLink]="'/'">
      <span class="brand-mark">WP</span>
      <span>
        <strong>Waypoint</strong>
        <small>Native Client Playground</small>
      </span>
    </a>

    <nav class="top-nav" aria-label="Primary navigation">
      <a [routerLink]="'/'">Overview</a>
      <a
        [routerLink]="'/app/workspace/101?view=overview&page=1&filters=open'"
      >
        Workspace
      </a>
      <a [routerLink]="'/app/reports'">Lazy Reports</a>
      <a [routerLink]="'/legacy'">Redirect</a>
    </nav>
  </header>

  <router-outlet />
</div>
````

## File: projects/apps/app1/src/index.html
````html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Waypoint Runtime</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body><app-root></app-root></body>
</html>
````

## File: projects/apps/app1/src/main.ts
````typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch(error => console.error(error));
````

## File: projects/apps/app1/src/styles.css
````css
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
````

## File: projects/apps/app2/client/src/app/app.config.ts
````typescript
import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  provideRouter,
} from '@epikodelabs/waypoint';

import { routes } from './app.routes';
import { administrationRoutes } from './routes/administration.routes';
import { applicationRoutes } from './routes/application.routes';
import { publicRoutes } from './routes/public.routes';
import { provideLocalDemoPrincipalSwitching } from './core/demo-session.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ApplicationModule,
      BrowserModule,
    ),
    provideBrowserGlobalErrorListeners(),
    provideLocalDemoPrincipalSwitching(),
    ...provideRouter(routes, {
      viewTransitions: true,
      contributions: [
        publicRoutes,
        applicationRoutes,
        administrationRoutes,
      ],
    }),
  ],
};
````

## File: projects/libraries/waypoint/src/lib/route-builders.ts
````typescript
import type { Type } from '@angular/core';

import type { ParamSchemaRecord, QuerySchemaRecord } from './query-schema';
import type {
  FrameHooks,
  FramePrepareFn,
  FrameView,
  InferPreparedData,
  LayoutDefinition,
  LayoutOptions,
  Lazy,
  NavigationTree,
  RedirectRouteDefinition,
  RenderableRoute,
  RouteOptions,
  ViewDefinition,
} from './navigation-definitions';

function isFrame(value: unknown): value is FrameView<any> {
  return typeof value === 'object'
    && value !== null
    && 'kind' in value
    && value.kind === 'frame';
}

function isEagerFrame(
  value: FrameView<any>,
): value is FrameView<any> & { readonly component: Type<unknown> } {
  return 'component' in value && value.component !== undefined;
}

type ViewRecord<TFrame extends FrameView<any> | undefined = FrameView<any> | undefined> =
  ViewDefinition & {
    readonly frame?: TFrame;
  };

function createViewRecord<TFrame extends FrameView<any>>(
  view: TFrame,
): ViewRecord<TFrame>;
function createViewRecord(
  view: Type<unknown>,
): ViewRecord<undefined>;
function createViewRecord(
  view: Type<unknown> | FrameView<any>,
): ViewRecord {
  if (isFrame(view)) {
    if (isEagerFrame(view)) {
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

function createLazyViewRecord<TFrame extends FrameView<any>>(
  view: TFrame,
): ViewRecord<TFrame>;
function createLazyViewRecord(
  view: Lazy<Type<unknown>>,
): ViewRecord<undefined>;
function createLazyViewRecord(
  view: Lazy<Type<unknown>> | FrameView<any>,
): ViewRecord {
  if (isFrame(view)) {
    if (isEagerFrame(view)) {
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

export function frame(
  component: Type<unknown>,
  hooks?: FrameHooks<undefined>,
): FrameView<Readonly<Record<string, never>>>;
export function frame<
  const TPrepare extends readonly FramePrepareFn[],
>(
  component: Type<unknown>,
  hooks: FrameHooks<TPrepare> & { readonly prepare: TPrepare },
): FrameView<InferPreparedData<TPrepare>>;
export function frame(
  component: Type<unknown>,
  hooks: FrameHooks<any> = {},
): FrameView<any> {
  return {
    kind: 'frame',
    component,
    ...hooks,
  };
}

export function lazyFrame(
  loadComponent: Lazy<Type<unknown>>,
  hooks?: FrameHooks<undefined>,
): FrameView<Readonly<Record<string, never>>>;
export function lazyFrame<
  const TPrepare extends readonly FramePrepareFn[],
>(
  loadComponent: Lazy<Type<unknown>>,
  hooks: FrameHooks<TPrepare> & { readonly prepare: TPrepare },
): FrameView<InferPreparedData<TPrepare>>;
export function lazyFrame(
  loadComponent: Lazy<Type<unknown>>,
  hooks: FrameHooks<any> = {},
): FrameView<any> {
  return {
    kind: 'frame',
    loadComponent,
    ...hooks,
  };
}

export function route<
  const TPath extends string,
  const TName extends string | undefined = undefined,
  const TParamsSchema extends ParamSchemaRecord | undefined = undefined,
  const TQuerySchema extends QuerySchemaRecord | undefined = undefined,
>(
  path: TPath,
  component: Type<unknown>,
  options?: RouteOptions<TName, TParamsSchema, TQuerySchema>,
): RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema, undefined>;
export function route<
  const TPath extends string,
  const TFrame extends FrameView<any>,
  const TName extends string | undefined = undefined,
  const TParamsSchema extends ParamSchemaRecord | undefined = undefined,
  const TQuerySchema extends QuerySchemaRecord | undefined = undefined,
>(
  path: TPath,
  component: TFrame,
  options?: RouteOptions<TName, TParamsSchema, TQuerySchema>,
): RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema, TFrame>;
export function route<
  const TPath extends string,
  const TName extends string | undefined = undefined,
  const TParamsSchema extends ParamSchemaRecord | undefined = undefined,
  const TQuerySchema extends QuerySchemaRecord | undefined = undefined,
>(
  path: TPath,
  component: Type<unknown> | FrameView<any>,
  options: RouteOptions<TName, TParamsSchema, TQuerySchema> = {},
): RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema> {
  return {
    kind: 'route',
    path,
    ...createViewRecord(component as Type<unknown>),
    ...options,
  } as RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema>;
}

export function lazyRoute<
  const TPath extends string,
  const TName extends string | undefined = undefined,
  const TParamsSchema extends ParamSchemaRecord | undefined = undefined,
  const TQuerySchema extends QuerySchemaRecord | undefined = undefined,
>(
  path: TPath,
  loadComponent: Lazy<Type<unknown>>,
  options?: RouteOptions<TName, TParamsSchema, TQuerySchema>,
): RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema, undefined>;
export function lazyRoute<
  const TPath extends string,
  const TFrame extends FrameView<any>,
  const TName extends string | undefined = undefined,
  const TParamsSchema extends ParamSchemaRecord | undefined = undefined,
  const TQuerySchema extends QuerySchemaRecord | undefined = undefined,
>(
  path: TPath,
  loadComponent: TFrame,
  options?: RouteOptions<TName, TParamsSchema, TQuerySchema>,
): RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema, TFrame>;
export function lazyRoute<
  const TPath extends string,
  const TName extends string | undefined = undefined,
  const TParamsSchema extends ParamSchemaRecord | undefined = undefined,
  const TQuerySchema extends QuerySchemaRecord | undefined = undefined,
>(
  path: TPath,
  loadComponent: Lazy<Type<unknown>> | FrameView<any>,
  options: RouteOptions<TName, TParamsSchema, TQuerySchema> = {},
): RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema> {
  return {
    kind: 'route',
    path,
    ...createLazyViewRecord(loadComponent as Lazy<Type<unknown>>),
    ...options,
  } as RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema>;
}

export function redirectRoute<
  const TPath extends string,
  const TRedirectTo extends string,
  const TName extends string | undefined = undefined,
>(
  path: TPath,
  redirectTo: TRedirectTo,
  options: Omit<
    RouteOptions<TName, undefined, undefined>,
    'redirectTo' | 'paramsSchema' | 'querySchema' | 'outlet'
  > = {},
): RedirectRouteDefinition<TPath, TName> {
  return {
    kind: 'redirect',
    path,
    redirectTo,
    ...options,
  };
}

export function layout<
  const TPath extends string,
  const TEntries extends NavigationTree,
>(
  path: TPath,
  component: Type<unknown>,
  entries: TEntries,
  options?: LayoutOptions,
): LayoutDefinition<TPath, TEntries, undefined>;
export function layout<
  const TPath extends string,
  const TEntries extends NavigationTree,
  const TFrame extends FrameView<any>,
>(
  path: TPath,
  component: TFrame,
  entries: TEntries,
  options?: LayoutOptions,
): LayoutDefinition<TPath, TEntries, TFrame>;
export function layout<
  const TPath extends string,
  const TEntries extends NavigationTree,
>(
  path: TPath,
  component: Type<unknown> | FrameView<any>,
  entries: TEntries,
  options: LayoutOptions = {},
): LayoutDefinition<TPath, TEntries, any> {
  return {
    kind: 'layout',
    path,
    ...createViewRecord(component as Type<unknown>),
    entries,
    ...options,
  } as LayoutDefinition<TPath, TEntries>;
}

export function lazyLayout<
  const TPath extends string,
  const TEntries extends NavigationTree,
>(
  path: TPath,
  loadComponent: Lazy<Type<unknown>>,
  entries: TEntries,
  options?: LayoutOptions,
): LayoutDefinition<TPath, TEntries, undefined>;
export function lazyLayout<
  const TPath extends string,
  const TEntries extends NavigationTree,
  const TFrame extends FrameView<any>,
>(
  path: TPath,
  loadComponent: TFrame,
  entries: TEntries,
  options?: LayoutOptions,
): LayoutDefinition<TPath, TEntries, TFrame>;
export function lazyLayout<
  const TPath extends string,
  const TEntries extends NavigationTree,
>(
  path: TPath,
  loadComponent: Lazy<Type<unknown>> | FrameView<any>,
  entries: TEntries,
  options: LayoutOptions = {},
): LayoutDefinition<TPath, TEntries, any> {
  return {
    kind: 'layout',
    path,
    ...createLazyViewRecord(loadComponent as Lazy<Type<unknown>>),
    entries,
    ...options,
  } as LayoutDefinition<TPath, TEntries>;
}
````

## File: projects/libraries/waypoint/src/lib/route-renderer.ts
````typescript
import {
  ApplicationRef,
  EnvironmentInjector,
  Injector,
  Type,
  createComponent,
  createEnvironmentInjector,
} from '@angular/core';

import {
  bindRouteInputs,
} from './route-adapter';

import type {
  NavigationProviders,
} from './navigation-definitions';

import {
  OUTLET_ACTIVATE_EVENT,
  OUTLET_DEACTIVATE_EVENT,
  dispatchOutletLifecycleEvent,
  findContainingOutlet,
  findOutlet,
} from './router-events';

import type {
  ActivatedRoute,
  RenderedRouteNode,
  RouteComponent,
  RouteRenderContext,
} from './vanilla-router';

export interface RouteRenderTokens {
  readonly routeToken: unknown;
  readonly contextToken: unknown;
}

export interface ResolvedRouteView {
  readonly component:
    Type<unknown>;
  readonly providers?:
    NavigationProviders;
  readonly label: string;
}

interface RenderedLayer {
  readonly rendered:
    RenderedRouteNode;
  readonly injector?:
    EnvironmentInjector;
}

function replaceChildNodes(
  target: Node & {
    replaceChildren?: (...nodes: Node[]) => void;
    firstChild: ChildNode | null;
    removeChild(node: ChildNode): void;
    appendChild<T extends Node>(node: T): T;
  },
  ...nodes: Node[]
): void {
  if (typeof target.replaceChildren === 'function') {
    target.replaceChildren(...nodes);
    return;
  }

  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  for (const node of nodes) {
    target.appendChild(node);
  }
}


function createScopedInjector(
  providers:
    NavigationProviders | undefined,
  parent: EnvironmentInjector,
  label: string,
): EnvironmentInjector | undefined {
  if (!providers?.length) {
    return undefined;
  }

  try {
    return createEnvironmentInjector(
      Array.from(providers),
      parent,
      label,
    );
  } catch (error) {
    throw new Error(
      `Failed to create route injector for "${label}": ` +
      (error instanceof Error ? error.message : String(error)),
      { cause: error },
    );
  }
}

function createAngularComponent(
  appRef: ApplicationRef,
  documentRef: Document,
  tokens: RouteRenderTokens,
  component: Type<unknown>,
  environmentInjector:
    EnvironmentInjector,
  route: ActivatedRoute,
  context: RouteRenderContext,
): RenderedRouteNode {
  const host =
    documentRef.createElement(
      'route-host',
    );

  const elementInjector =
    Injector.create({
      parent:
        environmentInjector,
      providers: [
        {
          provide:
            tokens.routeToken,
          useValue: route,
        },
        {
          provide:
            tokens.contextToken,
          useValue: context,
        },
      ],
    });

  const ref =
    createComponent(
      component,
      {
        hostElement: host,
        elementInjector,
        environmentInjector,
      },
    );

  let attached = false;
  let disposed = false;
  let containingOutlet: HTMLElement | null = null;

  try {
    try {
      bindRouteInputs(
        ref,
        component,
        route,
      );
    } catch (error) {
      throw new Error(
        `Failed to bind route inputs for "${component.name || 'anonymous component'}": ` +
        (error instanceof Error ? error.message : String(error)),
        { cause: error },
      );
    }

    appRef.attachView(
      ref.hostView,
    );

    attached = true;

    ref.changeDetectorRef
      .detectChanges();
  } catch (error) {
    if (attached) {
      try {
        appRef.detachView(
          ref.hostView,
        );
      } catch {}
    }

    ref.destroy();
    throw error;
  }

  return {
    node: host,
    component: ref.instance,

    dispose(): void {
      if (disposed) {
        return;
      }

      disposed = true;

      containingOutlet ??=
        (host as Node & {
          __streamixOutlet?: HTMLElement;
        }).__streamixOutlet ?? null;

      const outlet =
        containingOutlet ??
        findContainingOutlet(host);

      if (outlet) {
        dispatchOutletLifecycleEvent(
          outlet,
          OUTLET_DEACTIVATE_EVENT,
          ref.instance,
        );
      }

      try {
        if (attached) {
          appRef.detachView(
            ref.hostView,
          );

          attached = false;
        }
      } finally {
        ref.destroy();
        host.remove();
      }
    },
  };
}

function disposeLayers(
  layers:
    readonly RenderedLayer[],
): void {
  const errors: unknown[] = [];

  for (
    let index =
      layers.length - 1;
    index >= 0;
    index--
  ) {
    const layer =
      layers[index];

    try {
      layer.rendered
        .dispose?.();
    } catch (error) {
      errors.push(error);
    }

    try {
      layer.injector
        ?.destroy();
    } catch (error) {
      errors.push(error);
    }
  }

  if (errors.length === 1) {
    throw errors[0];
  }

  if (errors.length > 1) {
    throw new AggregateError(
      errors,
      'Multiple errors occurred while disposing a route view.',
    );
  }
}

export function composeAngularRouteView(
  appRef: ApplicationRef,
  documentRef: Document,
  rootInjector:
    EnvironmentInjector,
  tokens: RouteRenderTokens,
  views:
    readonly ResolvedRouteView[],
): RouteComponent {
  return async (
    route,
    context,
  ) => {
    const layers:
      RenderedLayer[] = [];

    let parentInjector =
      rootInjector;

    try {
      for (
        let index = 0;
        index < views.length;
        index++
      ) {
        const view =
          views[index];

        const scopedInjector =
          createScopedInjector(
            view.providers,
            parentInjector,
            view.label,
          );

        const activeInjector =
          scopedInjector ??
          parentInjector;

        const rendered =
          createAngularComponent(
            appRef,
            documentRef,
            tokens,
            view.component,
            activeInjector,
            route,
            context,
          );

        const parent =
          layers[
            layers.length - 1
          ];

        if (parent) {
          // The route outlet selects the application-level render target.
          // Layout layers always compose through their primary child outlet.
          const outletName = '';
          const outlet = findOutlet(parent.rendered.node, outletName);

          if (!outlet) {
            throw new Error(
              `Cannot render "${view.label}": ` +
              `the parent layout has no router outlet` +
              (outletName ? ` named "${outletName}"` : ` (primary)`),
            );
          }

          replaceChildNodes(outlet, rendered.node);

          // Capture the outlet while the node is attached. Parent-layer
          // disposal may detach this host before its own dispose() runs.
          const renderedNode =
            rendered.node as Node & {
              __streamixOutlet?: HTMLElement;
            };
          renderedNode.__streamixOutlet = outlet;

          if (
            rendered.component !==
            undefined
          ) {
            dispatchOutletLifecycleEvent(
              outlet,
              OUTLET_ACTIVATE_EVENT,
              rendered.component,
            );
          }
        }

        layers.push({
          rendered,
          injector:
            scopedInjector,
        });

        parentInjector =
          activeInjector;
      }

      const first =
        layers[0];

      const last =
        layers[
          layers.length - 1
        ];

      if (!first || !last) {
        throw new Error(
          'A route view requires at least one component.',
        );
      }

      return {
        node:
          first.rendered.node,
        component:
          last.rendered.component,

        dispose(): void {
          disposeLayers(layers);
        },
      };
    } catch (error) {
      disposeLayers(layers);
      throw error;
    }
  };
}

export function composeAngularLeafRouteView(
  appRef: ApplicationRef,
  documentRef: Document,
  rootInjector:
    EnvironmentInjector,
  tokens: RouteRenderTokens,
  views:
    readonly ResolvedRouteView[],
): RouteComponent {
  return async (
    route,
    context,
  ) => {
    const scopedInjectors:
      EnvironmentInjector[] = [];

    let parentInjector =
      rootInjector;

    try {
      for (const view of views) {
        const scopedInjector =
          createScopedInjector(
            view.providers,
            parentInjector,
            view.label,
          );

        if (scopedInjector) {
          scopedInjectors.push(
            scopedInjector,
          );
          parentInjector =
            scopedInjector;
        }
      }

      const leaf =
        views[
          views.length - 1
        ];

      if (!leaf) {
        throw new Error(
          'A route view requires at least one component.',
        );
      }

      const rendered =
        createAngularComponent(
          appRef,
          documentRef,
          tokens,
          leaf.component,
          parentInjector,
          route,
          context,
        );

      return {
        node:
          rendered.node,
        component:
          rendered.component,

        dispose(): void {
          const errors: unknown[] = [];

          try {
            rendered.dispose?.();
          } catch (error) {
            errors.push(error);
          }

          for (
            let index =
              scopedInjectors.length - 1;
            index >= 0;
            index--
          ) {
            try {
              scopedInjectors[
                index
              ].destroy();
            } catch (error) {
              errors.push(error);
            }
          }

          if (errors.length === 1) {
            throw errors[0];
          }

          if (errors.length > 1) {
            throw new AggregateError(
              errors,
              'Multiple errors occurred while disposing a route view.',
            );
          }
        },
      };
    } catch (error) {
      for (
        let index =
          scopedInjectors.length - 1;
        index >= 0;
        index--
      ) {
        try {
          scopedInjectors[
            index
          ].destroy();
        } catch {}
      }

      throw error;
    }
  };
}
````

## File: projects/libraries/waypoint/src/lib/router-outlet.ts
````typescript
import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';

import { Router } from './router-contract';

@Directive({ selector: 'router-outlet', standalone: true })
export class RouterOutlet implements OnInit {
  private readonly router = inject(Router);
  private readonly element = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private connectedName = '';

  @Input() name = '';

  ngOnInit(): void {
    this.connectedName = this.resolveName();

    if (!this.shouldConnect(this.connectedName)) {
      return;
    }

    this.router.connect(this.connectedName, this.element);
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (!this.shouldConnect(this.connectedName)) {
        return;
      }

      this.router.disconnect(this.connectedName, this.element);
    });
  }

  private resolveName(): string {
    return (this.name || this.element.getAttribute('name') || '').trim();
  }

  private shouldConnect(name: string): boolean {
    return name !== '' || this.element.closest('route-host') === null;
  }
}
````

## File: projects/libraries/waypoint/src/lib/server-routing.ts
````typescript
export * from '../../server/server-routing';
````

## File: projects/libraries/waypoint/src/tests/router-link.spec.ts
````typescript
import { ensureAngularTestEnvironment } from './angular-testbed.init';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  RouterLink,
  RouterOutlet,
  Router,
  provideRouter,
  route,
} from '@epikodelabs/waypoint';

ensureAngularTestEnvironment();

function delay(ms = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function dispatchAnchorClick(target: HTMLAnchorElement): boolean {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0,
  });

  let defaultPrevented = false;
  const cleanupListener = (currentEvent: MouseEvent) => {
    defaultPrevented = currentEvent.defaultPrevented;
    currentEvent.preventDefault();
  };

  document.addEventListener('click', cleanupListener);
  try {
    target.dispatchEvent(event);
  } finally {
    document.removeEventListener('click', cleanupListener);
  }

  return defaultPrevented;
}

@Component({
  standalone: true,
  template: '<h1>Home</h1>',
})
class HomeComponent {}

@Component({
  standalone: true,
  template: '<h1>About</h1>',
})
class AboutComponent {}

@Component({
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: '<a [routerLink]="target">About</a><router-outlet />',
})
class RouterLinkHostComponent {
  target = '/about';
}

describe('RouterLink', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.resetTestingModule();
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    router?.dispose();
  });

  it('binds href for routerLink and navigates through anchor clicks', async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        AboutComponent,
        RouterLinkHostComponent,
      ],
      providers: [
        ...provideRouter([
          route('/', HomeComponent),
          route('/about', AboutComponent),
        ]),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RouterLinkHostComponent);
    router = TestBed.inject(Router);

    fixture.detectChanges();
    await delay();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const anchor = host.querySelector('a');

    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('/about');

    const defaultPrevented = dispatchAnchorClick(anchor as HTMLAnchorElement);

    await delay();
    fixture.detectChanges();

    expect(defaultPrevented).toBeTrue();
    expect(router.state.current?.path).toBe('/about');
    expect(host.textContent).toContain('About');
  });
});
````

## File: projects/libraries/waypoint/src/tests/server-router.spec.ts
````typescript
import {
  createServerRouter,
  isPathPrefix,
  matchRoutePattern,
  matchesRoutePattern,
  type ServerArtifactRecord,
  type ServerRoutableBranch,
  type ServerRouterIndex,
  type ServerRouterShard,
} from '../lib/server-router';
import type { ServerPrincipal } from '../lib/server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly file: string;
  readonly hash: string;
}

interface Branch extends ServerRoutableBranch {
  readonly kind: 'route' | 'redirect';
}

const principal: ServerPrincipal = {
  subject: 'reader',
  roles: new Set(['user']),
  permissions: new Set(['read']),
};

const adminPrincipal: ServerPrincipal = {
  subject: 'admin',
  roles: new Set(['admin']),
  permissions: new Set(['read', 'admin']),
};

function artifact(
  artifactKey: string,
  routeSetId: string,
  dependencies: readonly string[],
  branchIds: readonly string[],
  hash = `${artifactKey}-hash`,
): Artifact {
  return {
    artifactKey,
    routeSetId,
    dependencies,
    branchIds,
    file: `../artifacts/${artifactKey}.js`,
    hash,
  };
}

function branch(
  id: string,
  path: string,
  routeSetId: string,
  permissions: readonly string[] = ['read'],
): Branch {
  return {
    id,
    kind: 'route',
    path,
    routeSetId,
    policies: [{ permissions }],
  };
}

function redirectBranch(
  id: string,
  path: string,
  redirectTo: string,
  routeSetId: string,
  permissions: readonly string[] = ['read'],
): Branch {
  return {
    id,
    kind: 'redirect',
    path,
    redirectTo,
    routeSetId,
    policies: [{ permissions }],
  };
}


function snapshot(
  index: ServerRouterIndex<Artifact>,
  loadShard: (file: string) => ServerRouterShard<Branch>,
) {
  return async () => ({
    index,
    async loadShard(file: string) {
      return loadShard(file);
    },
  });
}

function fixture() {
  const index: ServerRouterIndex<Artifact> = {
    shards: [
      { prefix: '/', file: 'root.json' },
      { prefix: '/app', file: 'app.json' },
      { prefix: '/app/admin', file: 'admin.json' },
    ],
    artifacts: [
      artifact('shell', 'shell-set', [], ['shell-home']),
      artifact('workspace', 'workspace-set', ['shell'], ['workspace-home']),
      artifact('admin', 'admin-set', ['shell'], ['admin-home']),
    ],
  };

  const shards = new Map<string, ServerRouterShard<Branch>>([
    ['root.json', {
      branches: [branch('shell-home', '/', 'shell-set')],
    }],
    ['app.json', {
      branches: [branch(
        'workspace-home',
        '/app/workspace/:projectId',
        'workspace-set',
      )],
    }],
    ['admin.json', {
      branches: [branch('admin-home', '/app/admin', 'admin-set', ['admin'])],
    }],
  ]);

  const router = createServerRouter<Artifact, Branch>({
    loadSnapshot: snapshot(index, file => {
      const shard = shards.get(file);
      if (!shard) throw new Error(`Missing shard ${file}`);
      return shard;
    }),
    moduleUrlFor(item) {
      return `/modules/${item.artifactKey}/${item.hash}`;
    },
  });

  return { index, router };
}

describe('server router', () => {
  it('matches dynamic route patterns exactly', () => {
    expect(matchesRoutePattern(
      '/app/workspace/:projectId',
      '/app/workspace/101',
    )).toBeTrue();
    expect(matchesRoutePattern(
      '/app/workspace/:projectId',
      '/app/workspace/101/settings',
    )).toBeFalse();
  });

  it('extracts encoded dynamic segments for server redirect interpolation', () => {
    expect(matchRoutePattern(
      '/legacy/:projectId',
      '/legacy/hello%20world',
    )).toEqual({ projectId: 'hello%20world' });
  });

  it('treats shard prefixes as path prefixes rather than string prefixes', () => {
    expect(isPathPrefix('/app', '/app')).toBeTrue();
    expect(isPathPrefix('/app', '/app/admin')).toBeTrue();
    expect(isPathPrefix('/app', '/application')).toBeFalse();
    expect(isPathPrefix('/', '/anything')).toBeTrue();
  });

  it('selects the most specific shard and resolves a destination', async () => {
    const { router } = fixture();

    const matched = await router.match('/app/workspace/101?view=overview');

    expect(matched?.id).toBe('workspace-home');
  });

  it('returns one dependency-first authorized delivery plan', async () => {
    const { router } = fixture();

    const resolution = await router.resolve(
      '/app/workspace/101?view=overview',
      principal,
    );

    expect(resolution).toEqual({
      version: 1,
      artifactKey: 'workspace',
      artifacts: [
        {
          artifactKey: 'shell',
          moduleUrl: '/modules/shell/shell-hash',
          hash: 'shell-hash',
        },
        {
          artifactKey: 'workspace',
          moduleUrl: '/modules/workspace/workspace-hash',
          hash: 'workspace-hash',
        },
      ],
    });
  });

  it('resolves internal redirects across separately delivered artifacts', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [
        artifact('legacy', 'legacy-set', [], ['legacy']),
        artifact('target', 'target-set', [], ['target']),
      ],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('legacy', '/legacy/:projectId', '/projects/:projectId', 'legacy-set'),
        branch('target', '/projects/:projectId', 'target-set'),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      loadSnapshot: snapshot(index, () => shard),
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
    });

    expect(await router.resolve('/legacy/hello%20world', principal)).toEqual({
      version: 1,
      artifactKey: 'legacy',
      artifacts: [
        {
          artifactKey: 'legacy',
          moduleUrl: '/modules/legacy/legacy-hash',
          hash: 'legacy-hash',
        },
        {
          artifactKey: 'target',
          moduleUrl: '/modules/target/target-hash',
          hash: 'target-hash',
        },
      ],
    });
  });

  it('does not deliver a redirect source when its internal target is unauthorized', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [
        artifact('legacy', 'legacy-set', [], ['legacy']),
        artifact('admin', 'admin-set', [], ['admin']),
      ],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('legacy', '/legacy-admin', '/admin', 'legacy-set'),
        branch('admin', '/admin', 'admin-set', ['admin']),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      loadSnapshot: snapshot(index, () => shard),
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
    });

    expect(await router.resolve('/legacy-admin', principal)).toBeNull();
  });

  it('stops internal server redirect loops before returning a delivery plan', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [
        artifact('a', 'a-set', [], ['a']),
        artifact('b', 'b-set', [], ['b']),
      ],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('a', '/a', '/b', 'a-set'),
        redirectBranch('b', '/b', '/a', 'b-set'),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      loadSnapshot: snapshot(index, () => shard),
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
      maxRedirects: 3,
    });

    expect(await router.resolve('/a', principal)).toBeNull();
  });

  it('keeps external redirects as one authorized source artifact', async () => {
    const index: ServerRouterIndex<Artifact> = {
      shards: [{ prefix: '/', file: 'root.json' }],
      artifacts: [artifact('external', 'external-set', [], ['external'])],
    };
    const shard: ServerRouterShard<Branch> = {
      branches: [
        redirectBranch('external', '/external', 'https://example.com/docs', 'external-set'),
      ],
    };
    const router = createServerRouter<Artifact, Branch>({
      loadSnapshot: snapshot(index, () => shard),
      moduleUrlFor(item) { return `/modules/${item.artifactKey}/${item.hash}`; },
    });

    expect((await router.resolve('/external', principal))?.artifactKey).toBe('external');
  });

  it('rejects ambiguous route-set to artifact mappings', async () => {
    const { index, router } = fixture();
    (index.artifacts as Artifact[]).push(
      artifact('workspace-shadow', 'workspace-set', [], ['workspace-home']),
    );

    await expectAsync(
      router.resolve('/app/workspace/101', principal),
    ).toBeRejectedWithError(/maps to multiple server artifacts/i);
  });

  it('does not resolve an unauthorized destination', async () => {
    const { router } = fixture();

    expect(await router.resolve('/app/admin', principal)).toBeNull();
  });

  it('selects the first server-authorized landing target', async () => {
    const { router } = fixture();

    expect(await router.resolveLanding(
      ['/app/admin', '/app/workspace/101?view=overview'],
      principal,
    )).toBe('/app/workspace/101?view=overview');
  });

  it('keeps the preferred landing when the new principal is authorized', async () => {
    const { router } = fixture();

    expect(await router.resolveLanding(
      ['/app/admin', '/app/workspace/101?view=overview'],
      adminPrincipal,
    )).toBe('/app/admin');
  });

  it('does not return an external landing target', async () => {
    const { router } = fixture();

    expect(await router.resolveLanding(
      ['https://example.com/app/workspace/101'],
      principal,
    )).toBeNull();
  });

  it('authorizes a module through its complete dependency chain', async () => {
    const { router } = fixture();

    const resolved = await router.resolveModule(
      'workspace',
      'workspace-hash',
      principal,
    );

    expect(resolved?.artifactKey).toBe('workspace');
  });

  it('rejects stale hashes without revealing another artifact version', async () => {
    const { router } = fixture();

    expect(await router.resolveModule(
      'workspace',
      'old-hash',
      principal,
    )).toBeNull();
  });

  it('rejects direct module access when the artifact itself is unauthorized', async () => {
    const { router } = fixture();

    expect(await router.resolveModule(
      'admin',
      'admin-hash',
      principal,
    )).toBeNull();
  });

  it('rejects absolute external navigation targets', async () => {
    const { router } = fixture();

    expect(await router.resolve(
      'https://example.com/app/workspace/101',
      principal,
    )).toBeNull();
  });
});
````

## File: projects/libraries/waypoint/package.json
````json
{
  "name": "@epikodelabs/waypoint",
  "version": "1.0.1",
  "peerDependencies": {
    "@angular/common": ">=16.0.0",
    "@angular/core": ">=16.0.0"
  },
  "dependencies": {
    "tslib": "^2.8.1"
  },
  "sideEffects": false,
  "description": "Server-side routing for Angular with server-authorized route and code delivery."
}
````

## File: projects/tools/builder/src/waypoint-build/index.integration.patch.ts
````typescript
/*
Builder now starts with the same compiler analysis:

const analysis = await analyze({
  entry,
  serverOutput: layout.serverRoot,
  artifactsOutput: layout.protectedRoot,
  buildManifestOutput: layout.buildManifest,
  routesExport: options.routesExport,
  profile: options.profile,
});

report(analysis.diagnostics, context);

if (!analysis.success || !analysis.plan) {
  return {
    success: false,
    error: 'Waypoint analysis failed.',
  };
}

const pipeline = await prepareBuildPipeline(
  analysis.planned,
  analysis.plan,
);

try {
  // builder-specific host phase
  const hostRuntime = await emitHostRuntimeEntry(
    ...,
    pipeline.session.sources.hostRuntimeModules,
  );

  const hostEntry = planHostEntry(
    analysis.plan,
    ...,
  );

  const angular = await runAngularHost(...);

  if (!angular.success) {
    await pipeline.publication.rollback();
    return angular;
  }

  const published = await pipeline.publish();
  ...
} finally {
  await pipeline.dispose();
}

Builder and CLI/compiler now share the same:
  analyze()
  prepareBuildPipeline()

Their only difference is that the builder inserts the Angular host build between
preparation and publication.
*/
````

## File: projects/tools/builder/src/waypoint-build/index.patch.ts
````typescript
/*
Replace:

import {
  analyze,
  createBuildLayout,
  prepareBuild,
} from '../../compiler/src/lib/index.js';

With:

import {
  analyze,
  createBuildLayout,
  prepareBuild,
} from '../compiler/index.js';

Also remove routesExport from the builder-facing option shape.
*/
````

## File: projects/apps/app1/src/app/app.ts
````typescript
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@epikodelabs/waypoint';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
````

## File: projects/apps/app2/client/src/app/app.routes.ts
````typescript
import {
  routeSlot,
  type NavigationTree,
} from '@epikodelabs/waypoint';

/**
 * App 2 ships only the ownership slots in the initial client bundle.
 * Server-resolved contributions attach to these slots at runtime.
 */
export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
````

## File: projects/libraries/waypoint/src/lib/route-compiler.ts
````typescript
import type {
  LayoutDefinition,
  NavigationTree,
  RouteContributionDefinition,
  RouteDefinition,
  RouteSlotDefinition,
} from './navigation-definitions';
import {
  compileRoutePath,
  extractRouteParamNames,
  joinRoutePath,
} from './route-path';
import { normalizeRouteIdentity } from './route-slots';

export interface CompiledRoute {
  readonly route: RouteDefinition;
  readonly path: string;
  readonly redirectTo?: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly slotId?: string;
  readonly contributionId?: string;
}

export interface CompiledRouteGroup {
  readonly path: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly primary: CompiledRoute;
  readonly outlets: readonly CompiledRoute[];
}

export interface CompiledRouteSlot {
  readonly id: string;
  readonly parentPath: string;
  readonly layouts: readonly LayoutDefinition[];
  readonly definition: RouteSlotDefinition;
}

export interface CompiledRouteContribution {
  readonly id: string;
  readonly slotId: string;
  readonly definition: RouteContributionDefinition;
  readonly routes: readonly CompiledRoute[];
}

export interface CompiledNavigation {
  readonly routes: readonly CompiledRoute[];
  readonly slots: ReadonlyMap<string, CompiledRouteSlot>;
  readonly contributions: ReadonlyMap<string, CompiledRouteContribution>;
}

export interface RouteRegistryRecord {
  readonly route: RouteDefinition;
  readonly fullPath: string;
  readonly slotId?: string;
  readonly contributionId?: string;
}

export interface RouteRegistry {
  readonly namedRoutes: ReadonlyMap<string, RouteRegistryRecord>;
  readonly groups: readonly CompiledRouteGroup[];
  readonly slots: ReadonlyMap<string, CompiledRouteSlot>;
  readonly contributions: ReadonlyMap<string, CompiledRouteContribution>;
}

interface CompileContext {
  readonly contributionsBySlot: ReadonlyMap<
    string,
    readonly RouteContributionDefinition[]
  >;
  readonly contributionIds: Set<string>;
  readonly activeContributionIds: Set<string>;
  readonly slots: Map<string, CompiledRouteSlot>;
  readonly contributions: Map<string, CompiledRouteContribution>;
  readonly output: CompiledRoute[];
}

export { joinRoutePath } from './route-path';

export function compileRedirect(
  parentPath: string,
  redirectTo: string | undefined,
): string | undefined {
  if (!redirectTo) {
    return undefined;
  }

  if (
    /^[A-Za-z][A-Za-z\d+.-]*:/.test(redirectTo) ||
    redirectTo.startsWith('//')
  ) {
    return redirectTo;
  }

  return redirectTo.startsWith('/')
    ? joinRoutePath('/', redirectTo)
    : joinRoutePath(parentPath, redirectTo);
}

export function compileNavigation(
  entries: NavigationTree,
  contributions: readonly RouteContributionDefinition[] = [],
): CompiledNavigation {
  const contributionsBySlot = indexContributions(contributions);
  const context: CompileContext = {
    contributionsBySlot,
    contributionIds: new Set(),
    activeContributionIds: new Set(),
    slots: new Map(),
    contributions: new Map(),
    output: [],
  };

  compileEntries(entries, '/', Object.freeze([]), context);

  for (const contribution of contributions) {
    if (!context.slots.has(contribution.slotId)) {
      throw new Error(
        `Route contribution "${contribution.id}" targets unknown route slot ` +
        `"${contribution.slotId}".`,
      );
    }
  }

  return Object.freeze({
    routes: Object.freeze([...context.output]),
    slots: context.slots,
    contributions: context.contributions,
  });
}

export function compileRoutes(
  entries: NavigationTree,
  parentPath = '/',
  layouts: readonly LayoutDefinition[] = [],
  output: CompiledRoute[] = [],
): readonly CompiledRoute[] {
  const context: CompileContext = {
    contributionsBySlot: new Map(),
    contributionIds: new Set(),
    activeContributionIds: new Set(),
    slots: new Map(),
    contributions: new Map(),
    output,
  };

  compileEntries(entries, parentPath, layouts, context);
  return output;
}

function compileEntries(
  entries: NavigationTree,
  parentPath: string,
  layouts: readonly LayoutDefinition[],
  context: CompileContext,
  provenance?: {
    readonly slotId: string;
    readonly contributionId: string;
  },
): void {
  for (const entry of entries) {
    if (entry.kind === 'route-slot') {
      compileSlot(entry, parentPath, layouts, context);
      continue;
    }

    if (entry.kind === 'layout') {
      compileEntries(
        entry.entries,
        joinRoutePath(parentPath, entry.path),
        Object.freeze([...layouts, entry]),
        context,
        provenance,
      );
      continue;
    }

    context.output.push({
      route: entry,
      path: joinRoutePath(parentPath, entry.path),
      redirectTo: entry.kind === 'redirect'
        ? compileRedirect(parentPath, entry.redirectTo)
        : undefined,
      layouts,
      slotId: provenance?.slotId,
      contributionId: provenance?.contributionId,
    });
  }
}

function compileSlot(
  definition: RouteSlotDefinition,
  parentPath: string,
  layouts: readonly LayoutDefinition[],
  context: CompileContext,
): void {
  const id = normalizeRouteIdentity(definition.id, 'Route slot');

  if (context.slots.has(id)) {
    throw new Error(
      `Duplicate route slot id "${id}". ` +
      'Route slot ids must be globally unique.',
    );
  }

  context.slots.set(id, Object.freeze({
    id,
    parentPath,
    layouts,
    definition,
  }));

  for (const contribution of context.contributionsBySlot.get(id) ?? []) {
    compileContribution(contribution, parentPath, layouts, context);
  }
}

function compileContribution(
  definition: RouteContributionDefinition,
  parentPath: string,
  layouts: readonly LayoutDefinition[],
  context: CompileContext,
): void {
  const id = normalizeRouteIdentity(definition.id, 'Route contribution');
  const slotId = normalizeRouteIdentity(
    definition.slotId,
    `Route contribution "${id}" slot`,
  );

  if (context.contributionIds.has(id)) {
    throw new Error(
      `Duplicate route contribution id "${id}". ` +
      'Route contribution ids must be globally unique.',
    );
  }

  if (context.activeContributionIds.has(id)) {
    throw new Error(
      `Recursive route contribution "${id}" was detected.`,
    );
  }

  context.contributionIds.add(id);
  context.activeContributionIds.add(id);

  const start = context.output.length;
  try {
    compileEntries(
      definition.entries,
      parentPath,
      layouts,
      context,
      { slotId, contributionId: id },
    );
  } finally {
    context.activeContributionIds.delete(id);
  }

  const routes = Object.freeze(context.output.slice(start));
  context.contributions.set(id, Object.freeze({
    id,
    slotId,
    definition,
    routes,
  }));
}

function indexContributions(
  contributions: readonly RouteContributionDefinition[],
): ReadonlyMap<string, readonly RouteContributionDefinition[]> {
  const bySlot = new Map<string, RouteContributionDefinition[]>();
  const ids = new Set<string>();

  for (const contribution of contributions) {
    const id = normalizeRouteIdentity(contribution.id, 'Route contribution');
    const slotId = normalizeRouteIdentity(
      contribution.slotId,
      `Route contribution "${id}" slot`,
    );

    if (ids.has(id)) {
      throw new Error(
        `Duplicate route contribution id "${id}". ` +
        'Route contribution ids must be globally unique.',
      );
    }

    ids.add(id);
    const current = bySlot.get(slotId) ?? [];
    current.push(contribution);
    bySlot.set(slotId, current);
  }

  return bySlot;
}

export function groupRoutes(
  compiled: readonly CompiledRoute[],
): readonly CompiledRouteGroup[] {
  const groups = new Map<string, CompiledRouteGroup>();

  for (const route of compiled) {
    const key = `${route.path}#${route.layouts.map(layout => layout.path).join('/')}`;
    let group = groups.get(key);

    if (!group) {
      if (route.route.kind === 'route' && route.route.outlet) {
        throw new Error(
          `Named outlet route "${route.route.name ?? route.path}" with path ` +
          `"${route.path}" has no corresponding primary outlet route with the same path.`,
        );
      }

      group = {
        path: route.path,
        layouts: route.layouts,
        primary: route,
        outlets: [],
      };
      groups.set(key, group);
      continue;
    }

    if (route.route.kind === 'redirect' || !route.route.outlet) {
      throw new Error(
        `Duplicate primary route for path "${route.path}" under the same layout chain.`,
      );
    }

    groups.set(key, {
      ...group,
      outlets: [...group.outlets, route],
    });
  }

  return Array.from(groups.values());
}

export function createRouteRegistry(
  entries: NavigationTree,
  contributions: readonly RouteContributionDefinition[] = [],
): RouteRegistry {
  const compiled = compileNavigation(entries, contributions);
  const groups = groupRoutes(compiled.routes);
  validateRouteGroups(groups);

  const namedRoutes = new Map<string, RouteRegistryRecord>();
  const literalPaths = new Map<string, RouteDefinition>();
  const patterns = new Map<string, string>();

  for (const compiledRoute of groups.flatMap(group => [
    group.primary,
    ...group.outlets,
  ])) {
    const { route, path } = compiledRoute;
    validateCompiledRouteParams(route, path);

    const previous = literalPaths.get(path);
    if (
      previous &&
      previous.kind === 'route' &&
      route.kind === 'route' &&
      !previous.outlet &&
      !route.outlet
    ) {
      throw new Error(`Duplicate compiled route path "${path}".`);
    }
    literalPaths.set(path, route);

    const pattern = compileRoutePath(path).patternKey;
    const previousPattern = patterns.get(pattern);
    if (previousPattern && previousPattern !== path) {
      throw new Error(
        `Conflicting route patterns "${previousPattern}" and "${path}".`,
      );
    }
    patterns.set(pattern, path);

    if (!route.name) {
      continue;
    }

    if (namedRoutes.has(route.name)) {
      throw new Error(
        `Duplicate route name "${route.name}". ` +
        'Route names must be globally unique.',
      );
    }

    namedRoutes.set(route.name, {
      route,
      fullPath: path,
      slotId: compiledRoute.slotId,
      contributionId: compiledRoute.contributionId,
    });
  }

  return {
    namedRoutes,
    groups,
    slots: compiled.slots,
    contributions: compiled.contributions,
  };
}

function validateCompiledRouteParams(
  route: RouteDefinition,
  path: string,
): void {
  if (route.kind === 'redirect') {
    return;
  }

  const paramNames = extractRouteParamNames(path);
  const seen = new Set<string>();

  for (const name of paramNames) {
    if (seen.has(name)) {
      throw new Error(
        `Duplicate path parameter ":${name}" in compiled route "${path}". ` +
        'Path parameter names must be unique across the complete layout and route path.',
      );
    }
    seen.add(name);
  }

  const schema = route.paramsSchema;
  if (!schema) {
    return;
  }

  const schemaNames = Object.keys(schema);
  for (const name of schemaNames) {
    if (!seen.has(name)) {
      throw new Error(
        `paramsSchema declares "${name}", but compiled route "${path}" ` +
        `does not contain ":${name}".`,
      );
    }
  }

  const declared = new Set(schemaNames);
  for (const name of paramNames) {
    if (!declared.has(name)) {
      throw new Error(
        `Compiled route "${path}" contains ":${name}", but paramsSchema ` +
        'does not declare it. Declare every path parameter when paramsSchema is present.',
      );
    }
  }
}

function validateRouteGroups(
  groups: readonly CompiledRouteGroup[],
): void {
  const names = new Set<string>();

  for (const group of groups) {
    const primaryName = group.primary.route.name;
    if (primaryName) {
      if (names.has(primaryName)) {
        throw new Error(
          `Duplicate route name "${primaryName}". Route names must be globally unique.`,
        );
      }
      names.add(primaryName);
    }

    if (group.primary.redirectTo && group.outlets.length > 0) {
      throw new Error(
        `A redirect route cannot have named outlets. Path: "${group.path}"`,
      );
    }

    const outletNames = new Set<string>();
    for (const outlet of group.outlets) {
      if (outlet.route.kind === 'redirect') {
        throw new Error(
          `Named outlet routes cannot be redirects. Route path: "${group.path}"`,
        );
      }

      const outletName = outlet.route.outlet!;
      if (outletNames.has(outletName)) {
        throw new Error(
          `Duplicate outlet named "${outletName}" for route path "${group.path}".`,
        );
      }
      outletNames.add(outletName);

      if (outlet.route.name) {
        throw new Error(
          `Named outlet routes cannot have a "name" property. Route path: ` +
          `"${group.path}", outlet: "${outletName}"`,
        );
      }
      if (outlet.route.paramsSchema || outlet.route.querySchema) {
        throw new Error(
          'Named outlet routes cannot define paramsSchema or querySchema.',
        );
      }
      if (outlet.route.viewTransition !== undefined) {
        throw new Error(
          'Named outlet routes cannot define viewTransition.',
        );
      }
      if (outlet.route.preload !== undefined) {
        throw new Error('Named outlet routes cannot define preload.');
      }
    }
  }
}
````

## File: projects/libraries/waypoint/src/lib/router-link.ts
````typescript
import {
  DOCUMENT,
} from '@angular/common';

import {
  DestroyRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  inject,
} from '@angular/core';

import {
  getRouterLocation,
} from './router-url';

import {
  watchRouterLocation,
} from './adapter-utils';

import type {
  NavigationTarget,
  PathNavigationTarget,
} from './navigation-targets';

import { Router } from './router-contract';

type RouterLinkCommands =
  readonly unknown[];

type RouterLinkInput =
  | NavigationTarget
  | RouterLinkCommands
  | null
  | undefined;

function buildPathFromCommands(
  commands: RouterLinkCommands,
): string {
  if (commands.length === 0) {
    return '';
  }

  let path = '';

  for (const command of commands) {
    if (command === null || command === undefined) {
      continue;
    }

    const segment =
      String(command).trim();

    if (!segment) {
      continue;
    }

    if (!path) {
      path = segment;
      continue;
    }

    path =
      `${path.replace(/\/+$/, '')}/${segment.replace(/^\/+/, '')}`;
  }

  return path;
}

function appendQueryParams(
  url: URL,
  queryParams:
    Readonly<Record<string, unknown>>,
): void {
  url.search = '';

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry === null || entry === undefined) {
          continue;
        }

        url.searchParams.append(key, String(entry));
      }

      continue;
    }

    url.searchParams.set(key, String(value));
  }
}

@Directive({
  selector: 'a[routerLink],area[routerLink]',
  standalone: true,
})
export class RouterLink implements OnChanges {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject(
    ElementRef<HTMLAnchorElement | HTMLAreaElement>,
  ).nativeElement;

  @Input() routerLink: RouterLinkInput;
  @Input() queryParams:
    Readonly<Record<string, unknown>> |
    null |
    undefined;
  @Input() fragment: string | null | undefined;
  @Input() state: unknown;
  @Input() replaceUrl = false;

  @HostBinding('attr.href')
  href: string | null = null;

  constructor() {
    watchRouterLocation(
      this.destroyRef,
      () => this.refreshHref(),
    );
  }

  ngOnChanges(): void {
    this.refreshHref();
  }

  @HostListener('click', ['$event'])
  async handleClick(event: Event): Promise<void> {
    if (!(event instanceof MouseEvent)) {
      return;
    }

    if (!this.href) {
      return;
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (
      this.element.target &&
      this.element.target !== '_self'
    ) {
      return;
    }

    if (
      this.element.hasAttribute('download') ||
      this.element.rel
        .split(/\s+/)
        .includes('external')
    ) {
      return;
    }

    event.preventDefault();

    try {
      await this.router.navigate(
        this.href,
        {
          replace: this.replaceUrl,
          state: this.state,
        },
      );
    } catch {
      // Router state already records the actionable navigation error. The DOM
      // click contract is still best-effort, so keep the failure local here.
    }
  }

  private refreshHref(): void {
    const target =
      this.resolveTarget();

    if (!target) {
      this.href = null;
      return;
    }

    const href =
      this.router.href(target);

    if (!href) {
      this.href = null;
      return;
    }

    if (
      !this.queryParams &&
      this.fragment === undefined
    ) {
      this.href = href;
      return;
    }

    const url =
      new URL(
        href,
        getRouterLocation(this.document).origin,
      );

    if (this.queryParams) {
      appendQueryParams(
        url,
        this.queryParams,
      );
    }

    if (this.fragment !== undefined) {
      url.hash = this.fragment
        ? `#${this.fragment.replace(/^#/, '')}`
        : '';
    }

    this.href =
      `${url.pathname}${url.search}${url.hash}`;
  }

  private resolveTarget():
    NavigationTarget | null {
    const link =
      this.routerLink;

    if (link === null || link === undefined) {
      return null;
    }

    if (Array.isArray(link)) {
      return this.withQueryParams({
        path: buildPathFromCommands(link),
      });
    }

    if (
      typeof link === 'string' ||
      link instanceof URL
    ) {
      return this.withQueryParams(
        link,
      );
    }

    if ('name' in link) {
      return {
        ...link,
        query:
          this.queryParams
            ? {
                ...(link.query ?? {}),
                ...this.queryParams,
              }
            : link.query,
      };
    }

    return this.withQueryParams(
      link as PathNavigationTarget,
    );
  }

  private withQueryParams(
    target:
      string |
      URL |
      PathNavigationTarget,
  ): NavigationTarget {
    if (!this.queryParams) {
      return target;
    }

    const href =
      typeof target === 'string'
        ? target
        : target instanceof URL
          ? target.href
          : target.path;

    const url =
      new URL(
        href,
        getRouterLocation(this.document).href,
      );

    appendQueryParams(
      url,
      this.queryParams,
    );

    if (this.fragment !== undefined) {
      url.hash = this.fragment
        ? `#${this.fragment.replace(/^#/, '')}`
        : '';
    }

    return {
      path:
        `${url.pathname}${url.search}${url.hash}`,
    };
  }
}
````

## File: projects/apps/app1/src/app/app.routes.ts
````typescript
import {
  routeSlot,
  type NavigationTree,
} from '@epikodelabs/waypoint';

export { publicRoutes } from './routes/public.routes';
export { applicationRoutes } from './routes/application.routes';

export const routes = [
  routeSlot('public'),
  routeSlot('application'),
] as const satisfies NavigationTree;
````

## File: projects/libraries/waypoint/src/lib/navigation-definitions.ts
````typescript
import type { EnvironmentProviders, Provider, Type } from '@angular/core';
import type { ParamSchemaRecord, QuerySchemaRecord } from './query-schema';
import type {
  ActivatedRoute,
  CanActivateFn as RouterCanActivateFn,
  DeactivationContext,
  GuardResult,
  NavigationContext,
  RouteData,
} from './vanilla-router';

export type MaybePromise<T> = T | PromiseLike<T>;
export type Lazy<T> = () => MaybePromise<T | { readonly default: T }>;

export type NavigationProvider = Provider | EnvironmentProviders;
export type NavigationProviders = readonly NavigationProvider[];

export interface RoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export type RouteRedirect = {
  readonly redirectTo: string | URL;
  readonly replace?: boolean;
};

export type EmptyRouteData = Readonly<Record<string, never>>;

export type FramePrepareResult = void | RouteData;

export type FramePrepareFn<
  TResult extends FramePrepareResult = FramePrepareResult,
> = (
  context: NavigationContext,
) => MaybePromise<TResult>;

type AwaitedPrepareResult<TPrepare> =
  TPrepare extends (...args: never[]) => infer TResult
    ? Exclude<Awaited<TResult>, void>
    : never;

type UnionToIntersection<T> =
  (T extends unknown ? (value: T) => void : never) extends
    (value: infer TIntersection) => void
      ? TIntersection
      : never;

type Simplify<T> = {
  readonly [TKey in keyof T]: T[TKey];
};

/**
 * Merges the object results of all prepare handlers in a frame.
 * A handler returning void contributes no keys.
 */
export type InferPreparedData<
  TPrepare extends readonly FramePrepareFn[] | undefined,
> = [TPrepare] extends [readonly FramePrepareFn[]]
  ? [AwaitedPrepareResult<TPrepare[number]>] extends [never]
    ? Readonly<Record<string, never>>
    : Simplify<UnionToIntersection<AwaitedPrepareResult<TPrepare[number]>>>
  : EmptyRouteData;

export type FrameAfterEnterFn<
  TData extends RouteData = RouteData,
> = (
  route: ActivatedRoute<TData>,
) => MaybePromise<void>;

export type FrameBeforeLeaveFn<
  TData extends RouteData = RouteData,
> = (
  route: DeactivationContext<TData>,
) => MaybePromise<GuardResult>;

export interface FrameHooks<
  TPrepare extends readonly FramePrepareFn[] | undefined =
    readonly FramePrepareFn[] | undefined,
> {
  readonly beforeEnter?: readonly RouterCanActivateFn[];
  readonly beforeLeave?: readonly FrameBeforeLeaveFn<InferPreparedData<TPrepare>>[];
  readonly prepare?: TPrepare;
  readonly afterEnter?: readonly FrameAfterEnterFn<InferPreparedData<TPrepare>>[];
}

export interface EagerViewDefinition {
  readonly component: Type<unknown>;
  readonly loadComponent?: never;
}

export interface LazyViewDefinition {
  readonly component?: never;
  readonly loadComponent: Lazy<Type<unknown>>;
}

export type ViewDefinition = EagerViewDefinition | LazyViewDefinition;

export type FrameView<
  TData extends RouteData = EmptyRouteData,
> = ViewDefinition & {
  readonly kind: 'frame';
  readonly beforeEnter?: readonly RouterCanActivateFn[];
  readonly beforeLeave?: readonly FrameBeforeLeaveFn<TData>[];
  readonly prepare?: readonly FramePrepareFn[];
  readonly afterEnter?: readonly FrameAfterEnterFn<TData>[];
};

export type InferFrameData<TFrame> =
  TFrame extends FrameView<infer TData>
    ? TData
    : EmptyRouteData;

export interface RouteDefinitionBase<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
> {
  readonly path: TPath;
  readonly name?: TName;
  readonly data?: Readonly<Record<string, unknown>>;
  readonly providers?: NavigationProviders;
  /** Server authorization metadata consumed by the Waypoint compiler. */
  readonly policy?: RoutePolicy;
}

export interface RenderableRouteDefinitionBase<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
> extends RouteDefinitionBase<TPath, TName> {
  readonly kind: 'route';
  readonly outlet?: string;
  readonly preload?: boolean;
  readonly viewTransition?: boolean;
  readonly paramsSchema?: TParamsSchema;
  readonly querySchema?: TQuerySchema;
}

export type RouteOptions<
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
> = Omit<
  RenderableRouteDefinitionBase<string, TName, TParamsSchema, TQuerySchema>,
  'kind' | 'path'
>;

export interface RedirectRouteDefinition<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
> extends RouteDefinitionBase<TPath, TName> {
  readonly kind: 'redirect';
  readonly redirectTo: string;
}

export type RenderableRoute<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> = RenderableRouteDefinitionBase<TPath, TName, TParamsSchema, TQuerySchema> &
  ViewDefinition & {
    readonly frame?: TFrame;
    readonly redirectTo?: never;
  };

export type RouteDefinition<
  TPath extends string = string,
  TName extends string | undefined = string | undefined,
  TParamsSchema extends ParamSchemaRecord | undefined = ParamSchemaRecord | undefined,
  TQuerySchema extends QuerySchemaRecord | undefined = QuerySchemaRecord | undefined,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> =
  | RedirectRouteDefinition<TPath, TName>
  | RenderableRoute<TPath, TName, TParamsSchema, TQuerySchema, TFrame>;

export type InferRoutePreparedData<TRoute> =
  TRoute extends RenderableRoute<string, string | undefined, any, any, infer TFrame>
    ? TFrame extends FrameView<any>
      ? InferFrameData<TFrame>
      : Readonly<Record<string, never>>
    : EmptyRouteData;

export interface LayoutDefinitionBase<
  TPath extends string = string,
  TEntries extends NavigationTree = NavigationTree,
> {
  readonly kind: 'layout';
  readonly path: TPath;
  readonly entries: TEntries;
  readonly providers?: NavigationProviders;
  /** Server authorization metadata inherited by descendant navigation. */
  readonly policy?: RoutePolicy;
}

export type LayoutOptions = Omit<
  LayoutDefinitionBase,
  'kind' | 'path' | 'entries'
>;

export type LayoutDefinition<
  TPath extends string = string,
  TEntries extends NavigationTree = NavigationTree,
  TFrame extends FrameView<any> | undefined = FrameView<any> | undefined,
> = LayoutDefinitionBase<TPath, TEntries> &
  ViewDefinition & {
    readonly frame?: TFrame;
  };

export interface RouteSlotDefinition<
  TId extends string = string,
> {
  readonly kind: 'route-slot';
  readonly id: TId;
}

export interface RouteContributionDefinition<
  TSlotId extends string = string,
  TId extends string = string,
  TEntries extends NavigationTree = NavigationTree,
> {
  readonly kind: 'route-contribution';
  readonly slotId: TSlotId;
  readonly id: TId;
  readonly entries: TEntries;
}

export type AnyRouteDefinition = RouteDefinition<any, any, any, any, any>;
export type AnyLayoutDefinition = LayoutDefinition<any, any, any>;
export type AnyRouteSlotDefinition = RouteSlotDefinition<any>;
export type AnyRouteContributionDefinition = RouteContributionDefinition<any, any, any>;

export type NavigationEntry =
  | AnyRouteDefinition
  | AnyLayoutDefinition
  | AnyRouteSlotDefinition;
export type NavigationTree = readonly NavigationEntry[];
````

## File: projects/libraries/waypoint/src/lib/server-router.ts
````typescript
export * from '../../server/server-router';
````

## File: projects/apps/app1/src/app/app.config.ts
````typescript
import {
  type ApplicationConfig,
  ApplicationModule,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@epikodelabs/waypoint';
import {
  applicationRoutes,
  publicRoutes,
  routes,
} from './app.routes';
import { provideLocalDemoPrincipalSwitching } from './core/demo-session.service';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(ApplicationModule, BrowserModule),
    provideBrowserGlobalErrorListeners(),
    provideLocalDemoPrincipalSwitching(),
    ...provideRouter(routes, {
      viewTransitions: true,
      contributions: [
        publicRoutes,
        applicationRoutes,
      ],
    }),
  ],
};
````

## File: projects/libraries/waypoint/src/tests/router.spec.ts
````typescript
import { createRouter, type Route, type VanillaRouter, type VanillaRouterConfig } from '@epikodelabs/waypoint';
import { idescribe } from './env.spec';

function unwrapTestComponent<T>(value: T | { default: T }): T {
  return value != null && typeof value === 'object' && 'default' in value
    ? value.default
    : value as T;
}
// Helper function for async testing
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Helper function to create test components
function createComponent(text: string): () => Node {
    return () => document.createTextNode(text);
}
function completeViewTransition(
    callback: () => void | PromiseLike<void>
): { finished: Promise<void> } {
    return {
        finished: Promise.resolve(callback()).then(() => undefined)
    };
}
function dispatchAnchorClick(target: HTMLAnchorElement, init: MouseEventInit = {}): boolean {
    const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0,
        ...init
    });
    let defaultPrevented = false;
    const cleanupListener = (currentEvent: MouseEvent) => {
        defaultPrevented = currentEvent.defaultPrevented;
        currentEvent.preventDefault();
    };
    document.addEventListener('click', cleanupListener);
    try {
        target.dispatchEvent(event);
    }
    finally {
        document.removeEventListener('click', cleanupListener);
    }
    return defaultPrevented;
}
// Helper to create a route object with component (since Route doesn't have 'component' property)
function routeWithComponent(path: string, text: string): Route {
    return {
        path,
        load: async () => ({
            component: unwrapTestComponent(await (() => Promise.resolve(createComponent(text)))())
        })
    };
}
idescribe('Router', () => {
    let outlet: HTMLElement;
    let router: VanillaRouter;
    beforeEach(() => {
        // Create a DOM outlet for testing
        outlet = document.createElement('div');
        outlet.id = 'test-outlet';
        document.body.appendChild(outlet);
        // Reset URL
        window.history.replaceState(null, '', '/');
        // Spy on console methods
        spyOn(console, 'debug');
        spyOn(console, 'error');
    });
    afterEach(() => {
        if (router) {
            router.dispose();
        }
        if (outlet.parentNode) {
            document.body.removeChild(outlet);
        }
    });
    describe('creation', () => {
        it('should create a router instance', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            expect(router).toBeDefined();
            expect(router.state).toBeDefined();
            expect(router.state.current).toBeNull();
            expect(router.state.pending).toBeFalse();
            expect(router.state.phase).toBeNull();
            expect(router.state.path).toBe('');
            expect(router.state.params).toEqual({});
            expect(router.state.query).toEqual({});
            expect(router.state.data).toEqual({});
            expect(router.state.routeConfig).toBeNull();
        });
        it('should use default outlet when not provided', () => {
            const app = document.createElement('div');
            app.id = 'app';
            document.body.appendChild(app);
            const defaultRouter = createRouter({
                routes: [routeWithComponent('', 'Home')]
            });
            expect(defaultRouter).toBeDefined();
            defaultRouter.dispose();
            document.body.removeChild(app);
        });
        it('should normalize baseHref', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            expect(router.href('/about')).toBe('/app/about');
        });
    });
    describe('navigation', () => {
        it('should navigate to a route', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            await delay(50);
            expect(router.state.current?.path).toBe('/about');
            expect(router.state.current?.config.path).toBe('about');
            expect(outlet.textContent).toBe('About');
            expect(router.state.routeConfig?.path).toBe('about');
        });
        it('should resolve navigation after the route has rendered', async () => {
            router = createRouter({
                routes: [routeWithComponent('about', 'About')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            });
            const completed = await router.navigate('/about');
            expect(completed).toBeTrue();
            expect(router.state.current?.path).toBe('/about');
            expect(outlet.textContent).toBe('About');
        });
        it('should notify outlet activation through the config hook', async () => {
            const onOutletActivate = jasmine.createSpy('onOutletActivate');
            router = createRouter({
                routes: [{
                        path: 'about',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(() => ({
                                node: document.createTextNode('About'),
                                component: { kind: 'about-component' }
                            })))())
                        })
                    }], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                onOutletActivate
            });
            await router.navigate('/about');
            expect(onOutletActivate).toHaveBeenCalledTimes(1);
            expect(onOutletActivate).toHaveBeenCalledWith(outlet, jasmine.objectContaining({ kind: 'about-component' }));
        });
        it('should navigate to the home route', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/');
            await delay(50);
            expect(router.state.current?.path).toBe('/');
            expect(outlet.textContent).toBe('Home');
        });
        it('should navigate with replace option', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const replaceSpy = spyOn(window.history, 'replaceState').and.callThrough();
            router.navigate('/about', { replace: true });
            await delay(50);
            expect(replaceSpy).toHaveBeenCalled();
            expect(router.state.current?.path).toBe('/about');
        });
        it('should navigate with state', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const pushStateSpy = spyOn(window.history, 'pushState').and.callThrough();
            router.navigate('/about', { state: { from: 'test' } });
            await delay(50);
            expect(pushStateSpy).toHaveBeenCalledWith({ from: 'test' }, '', '/about');
            expect(router.state.historyState).toEqual({ from: 'test' });
            expect(router.state.current?.historyState).toEqual({ from: 'test' });
        });
        it('should update the current history state without navigating', async () => {
            router = createRouter({
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            });
            router.start();
            await router.navigate('/about', { state: { from: 'test' } });
            const replaceStateSpy = spyOn(window.history, 'replaceState').and.callThrough();
            router.updateHistoryState({ from: 'updated', step: 2 });
            expect(replaceStateSpy).toHaveBeenCalledWith({ from: 'updated', step: 2 }, '', '/about');
            expect(router.state.historyState).toEqual({ from: 'updated', step: 2 });
            expect(router.state.current?.historyState).toEqual({ from: 'updated', step: 2 });
        });
        it('should handle navigation to external URLs', async () => {
            const navigateExternal = jasmine.createSpy('navigateExternal');
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                navigateExternal
            };
            router = createRouter(config);
            router.start();
            router.navigate('https://example.com');
            await delay(10);
            expect(navigateExternal).toHaveBeenCalledWith(new URL('https://example.com/'));
        });
        it('should handle navigation with query parameters', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/?foo=bar&baz=qux');
            await delay(50);
            expect(router.state.query).toEqual({ foo: 'bar', baz: 'qux' });
        });
        it('should handle navigation with hash', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/#section');
            await delay(50);
            expect(router.state.current?.url.hash).toBe('#section');
        });
        it('should ignore an active URL without touching history when configured', async () => {
            let guardCalls = 0;
            let prepareCalls = 0;
            let componentLoads = 0;
            const pushStateSpy = spyOn(window.history, 'pushState').and.callThrough();
            router = createRouter({
                routes: [{
                        path: 'same',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => {
                                componentLoads++;
                                return Promise.resolve(createComponent('Same'));
                            })()),
                            canActivate: [() => {
                                    guardCalls++;
                                    return true;
                                }],
                            prepare: [() => {
                                prepareCalls++;
                                return {
                                    value: 'prepared'
                                };
                            }]
                        })
                    }], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                onSameUrlNavigation: 'ignore'
            });
            await router.navigate('/same');
            pushStateSpy.calls.reset();
            const navigated = await router.navigate('/same');
            expect(navigated).toBeFalse();
            expect(guardCalls).toBe(1);
            expect(prepareCalls).toBe(1);
            expect(componentLoads).toBe(1);
            expect(pushStateSpy).not.toHaveBeenCalled();
        });
        it('should reload an active URL by default', async () => {
            let componentLoads = 0;
            router = createRouter({
                routes: [{
                        path: 'same',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => {
                                componentLoads++;
                                return Promise.resolve(createComponent('Same'));
                            })())
                        })
                    }], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            });
            await router.navigate('/same');
            const navigated = await router.navigate('/same');
            expect(navigated).toBeTrue();
            expect(componentLoads).toBe(1);
        });
    });
    describe('route matching', () => {
        it('should refresh a cached route pattern when its path changes', async () => {
            const route = routeWithComponent('first', 'Route');

            router = createRouter({
                routes: [route],
                render: (_name, node) => {
                outlet.replaceChildren(node);
                },
            });

            await router.navigate('/first');

            (route as { path: string }).path = 'second';

            await router.navigate('/second');

            expect(router.state.current?.path).toBe('/second');
            expect(outlet.textContent).toBe('Route');
        });
        
        it('should match parameterized routes', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'users/:id',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('User')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/users/123');
            await delay(50);
            expect(router.state.current?.path).toBe('/users/123');
            expect(router.state.current?.params).toEqual({ id: '123' });
            expect(router.state.current?.config.path).toBe('users/:id');
            expect(router.state.params).toEqual({ id: '123' });
        });
        it('should decode URL parameters', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'users/:id',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('User')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/users/hello%20world');
            await delay(50);
            expect(router.state.current?.params).toEqual({ id: 'hello world' });
        });
        it('should match wildcard routes', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    {
                        path: '**',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('404')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/non-existent');
            await delay(50);
            expect(router.state.current?.config.path).toBe('**');
            expect(outlet.textContent).toBe('404');
        });
    });
        it('should only match complete flat route paths', async () => {
            router = createRouter({
                routes: [
                    routeWithComponent('admin/users', 'Admin Users'),
                    routeWithComponent('admin/settings', 'Admin Settings'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            });

            await router.navigate('/admin/users');

            expect(router.state.current?.config.path).toBe('admin/users');
            expect(outlet.textContent).toBe('Admin Users');
        });
        it('should not infer parent routes from path prefixes', async () => {
            router = createRouter({
                routes: [
                    routeWithComponent('admin', 'Admin'),
                    routeWithComponent('admin/users', 'Admin Users'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            });

            await router.navigate('/admin/users');

            expect(router.state.current?.config.path).toBe('admin/users');
            expect(outlet.textContent).toBe('Admin Users');
        });
    describe('guards', () => {
        it('should allow navigation when guard returns true', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'protected',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Protected')))()),
                            canActivate: [() => true]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/protected');
            await delay(50);
            expect(router.state.current?.path).toBe('/protected');
            expect(outlet.textContent).toBe('Protected');
        });
        it('should block navigation when guard returns false', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'protected',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Protected')))()),
                            canActivate: [() => false]
                        })
                    },
                    routeWithComponent('', 'Home'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/protected');
            await delay(50);
            expect(router.state.current).toBeNull();
            expect(router.state.pending).toBeFalse();
        });
        it('should resolve false when a guard blocks navigation', async () => {
            router = createRouter({
                routes: [{
                        path: 'protected',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Protected')))()),
                            canActivate: [() => false]
                        })
                    }], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            });
            const completed = await router.navigate('/protected');
            expect(completed).toBeFalse();
            expect(router.state.current).toBeNull();
        });
        it('should redirect when guard returns a redirect string', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'old',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Old')))()),
                            canActivate: [() => '/new']
                        })
                    },
                    routeWithComponent('new', 'New'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/old');
            await delay(100);
            expect(router.state.current?.path).toBe('/new');
            expect(outlet.textContent).toBe('New');
        });
        it('should redirect when guard returns a redirect object', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'old',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Old')))()),
                            canActivate: [() => ({ redirectTo: '/new', replace: true })]
                        })
                    },
                    routeWithComponent('new', 'New'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/old');
            await delay(100);
            expect(router.state.current?.path).toBe('/new');
            expect(outlet.textContent).toBe('New');
        });
        it('should support async guards', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'async',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Async')))()),
                            canActivate: [
                                async () => {
                                    await delay(10);
                                    return true;
                                },
                            ]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/async');
            await delay(50);
            expect(router.state.current?.path).toBe('/async');
            expect(outlet.textContent).toBe('Async');
        });
        it('should execute multiple guards in order', async () => {
            const order: string[] = [];
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'guarded',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Guarded')))()),
                            canActivate: [
                                () => { order.push('first'); return true; },
                                () => { order.push('second'); return true; },
                            ]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/guarded');
            await delay(50);
            expect(order).toEqual(['first', 'second']);
            expect(router.state.current?.path).toBe('/guarded');
        });
        it('should stop at the first failing guard', async () => {
            const order: string[] = [];
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'guarded',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Guarded')))()),
                            canActivate: [
                                () => { order.push('first'); return true; },
                                () => { order.push('second'); return false; },
                                () => { order.push('third'); return true; },
                            ]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/guarded');
            await delay(50);
            expect(order).toEqual(['first', 'second']);
            expect(router.state.current).toBeNull();
        });
        it('should work with guard objects', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'protected',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Protected')))()),
                            canActivate: [() => true]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/protected');
            await delay(50);
            expect(router.state.current?.path).toBe('/protected');
        });
        it('should block navigation when canDeactivate returns false', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'edit',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Edit')))()),
                            canDeactivate: [() => false]
                        })
                    },
                    routeWithComponent('other', 'Other'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/edit');
            await delay(50);
            router.navigate('/other');
            await delay(50);
            expect(router.state.current?.path).toBe('/edit');
            expect(outlet.textContent).toBe('Edit');
            expect(router.state.error).toBeNull();
        });
        it('should redirect when canDeactivate returns a redirect', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'edit',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Edit')))()),
                            canDeactivate: [() => '/confirm']
                        })
                    },
                    routeWithComponent('confirm', 'Confirm'),
                    routeWithComponent('other', 'Other'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/edit');
            await delay(50);
            router.navigate('/other');
            await delay(100);
            expect(router.state.current?.path).toBe('/confirm');
            expect(outlet.textContent).toBe('Confirm');
        });
        it('should warn when canDeactivate redirects to the pending URL', async () => {
            const warnSpy = spyOn(console, 'warn');
            router = createRouter({
                routes: [
                    {
                        path: 'edit',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Edit')))()),
                            canDeactivate: [() => ({ redirectTo: '/target', replace: true })]
                        })
                    },
                    routeWithComponent('target', 'Target'),
                ],
                outlet
            });
            await router.navigate('/edit');
            await router.navigate('/target');
            expect(warnSpy).toHaveBeenCalledWith('[Router] Ignoring canDeactivate redirect to the pending URL', '/target');
            expect(router.state.current?.path).toBe('/target');
        });
    });
    describe('prepare data', () => {
        it('should prepare data before navigation', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'user',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('User')))()),
                            prepare: [
                                () => ({ userId: 123 }),
                                () => ({ userName: 'Alice' })
                            ]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/user');
            await delay(50);
            expect(router.state.current?.data).toEqual({
                userId: 123,
                userName: 'Alice'
            });
        });
        it('should support async prepare handlers', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'async-data',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Async Data')))()),
                            prepare: [async () => {
                                    await delay(10);
                                    return { data: { id: 1, name: 'Async' } };
                                }]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/async-data');
            await delay(50);
            expect(router.state.current?.data).toEqual({
                data: { id: 1, name: 'Async' }
            });
        });
        it('should merge static data and prepared data', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'merged',
                        data: { static: 'static-value' },
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Merged')))()),
                            prepare: [() => ({ dynamic: 'dynamic-value' })]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/merged');
            await delay(50);
            expect(router.state.current?.data).toEqual({
                static: 'static-value',
                dynamic: 'dynamic-value'
            });
        });
        it('should merge multiple prepare handlers', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'user',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('User')))()),
                            prepare: [
                                () => ({ userId: 100 }),
                                () => ({ userId: 123 })
                            ]
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/user');
            await delay(50);
            expect(router.state.current?.data).toEqual({
                userId: 123
            });
        });
    });
    describe('redirects', () => {
        it('should handle static redirects', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'old',
                        redirectTo: '/new'
                    },
                    routeWithComponent('new', 'New Page'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/old');
            await delay(100);
            expect(router.state.current?.path).toBe('/new');
            expect(outlet.textContent).toBe('New Page');
        });
        it('should handle parameterized redirects', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'users/:id',
                        redirectTo: '/profiles/:id'
                    },
                    {
                        path: 'profiles/:id',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Profile')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/users/123');
            await delay(100);
            expect(router.state.current?.path).toBe('/profiles/123');
            expect(router.state.current?.params).toEqual({ id: '123' });
        });
        it('should enforce max redirect count', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'a',
                        redirectTo: '/b'
                    },
                    {
                        path: 'b',
                        redirectTo: '/a'
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                maxRedirects: 3
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/a'))
                .toBeRejectedWithError(/Maximum redirect count/);
            expect(router.state.phase).toBeNull();
            expect(router.state.error).toBeDefined();
            expect((router.state.error as Error).message).toContain('Maximum redirect count');
        });
        it('should handle cross-origin redirects', async () => {
            const navigateExternal = jasmine.createSpy('navigateExternal');
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'external',
                        redirectTo: 'https://example.com'
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                navigateExternal
            };
            router = createRouter(config);
            router.start();
            router.navigate('/external');
            await delay(50);
            expect(navigateExternal).toHaveBeenCalledWith(new URL('https://example.com/'));
        });
        it('should reject when external navigation dispatch fails', async () => {
            router = createRouter({
                routes: [],
                navigateExternal: () => {
                    throw new Error('External navigation failed');
                },
            });

            await expectAsync(router.navigate('https://example.com/'))
                .toBeRejectedWithError('External navigation failed');
            expect((router.state.error as Error).message)
                .toBe('External navigation failed');
            expect(router.state.pending).toBeFalse();
        });
    });
    describe('lazy loading', () => {
        it('should lazy load components', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'lazy',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Lazy Loaded')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/lazy');
            await delay(50);
            expect(router.state.current?.path).toBe('/lazy');
            expect(outlet.textContent).toBe('Lazy Loaded');
        });
        it('should lazy load components with default export', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'lazy-default',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve({
                                default: createComponent('Lazy Default')
                            }))())
                        })
                    },
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/lazy-default');
            await delay(50);
            expect(outlet.textContent).toBe('Lazy Default');
        });
        it('should handle lazy loading errors', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'error',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.reject(new Error('Load failed')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/error'))
                .toBeRejectedWithError('Load failed');
            expect(router.state.phase).toBeNull();
            expect(router.state.error).toBeDefined();
            expect((router.state.error as Error).message).toBe('Load failed');
        });
    });
    describe('history management', () => {
        it('should handle back navigation', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                    {
                        path: 'users/:id',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('User')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            await delay(50);
            router.navigate('/users/123');
            await delay(50);
            router.back();
            await delay(50);
            expect(router.state.current?.path).toBe('/about');
        });
        it('should handle forward navigation', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                    {
                        path: 'users/:id',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('User')))())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            await delay(50);
            router.navigate('/users/123');
            await delay(50);
            router.back();
            await delay(50);
            router.forward();
            await delay(50);
            expect(router.state.current?.path).toBe('/users/123');
        });
        it('should handle popstate events', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            await delay(50);
            // Simulate popstate
            window.history.back();
            const popstateEvent = new PopStateEvent('popstate');
            window.dispatchEvent(popstateEvent);
            await delay(50);
            expect(router.state.current?.path).toBe('/');
        });
        it('should scroll to the top after programmatic navigation when configured', async () => {
            let scrollX = 24;
            let scrollY = 160;
            spyOnProperty(window, 'scrollX', 'get').and.callFake(() => scrollX);
            spyOnProperty(window, 'scrollY', 'get').and.callFake(() => scrollY);
            const scrollToSpy = spyOn(window, 'scrollTo').and.callFake((x?: number | ScrollToOptions, y?: number) => {
                if (typeof x === 'number') {
                    scrollX = x;
                    scrollY = y ?? 0;
                }
            });
            router = createRouter({
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                scrollRestoration: 'top'
            });
            router.start();
            await router.navigate('/about');
            expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
        });
        it('should restore the saved scroll position on popstate when configured', async () => {
            let scrollX = 30;
            let scrollY = 140;
            spyOnProperty(window, 'scrollX', 'get').and.callFake(() => scrollX);
            spyOnProperty(window, 'scrollY', 'get').and.callFake(() => scrollY);
            const scrollToSpy = spyOn(window, 'scrollTo').and.callFake((x?: number | ScrollToOptions, y?: number) => {
                if (typeof x === 'number') {
                    scrollX = x;
                    scrollY = y ?? 0;
                }
            });
            router = createRouter({
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                scrollRestoration: 'restore'
            });
            router.start();
            await router.navigate('/about');
            scrollX = 320;
            scrollY = 480;
            const popstate = new Promise<void>(resolve => {
                window.addEventListener(
                    'popstate',
                    () => resolve(),
                    { once: true },
                );
            });

            window.history.back();
            await popstate;
            await delay(50);

            expect(scrollToSpy).toHaveBeenCalledWith(30, 140);
            expect(router.state.current?.path).toBe('/');
        });
        it('should restore active URL on blocked navigation', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    {
                        path: 'blocked',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Blocked')))()),
                            canActivate: [() => false]
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            // First navigate to home to have a current route
            await router.navigate('/', { state: { page: 'home' } });
            const replaceStateSpy = spyOn(window.history, 'replaceState').and.callThrough();
            await router.navigate('/blocked', { state: { page: 'blocked' } });
            expect(replaceStateSpy).toHaveBeenCalledWith({ page: 'home' }, '', '/');
            expect(router.state.current?.path).toBe('/');
            expect(router.state.historyState).toEqual({ page: 'home' });
        });
        it('should run view transitions for DOM commits when enabled', async () => {
            const transitionDocument = document as Document & {
                startViewTransition?: (callback: () => void | PromiseLike<void>) => {
                    finished: Promise<void>;
                };
            };
            const original = transitionDocument.startViewTransition;
            const startViewTransition = jasmine.createSpy('startViewTransition')
                .and.callFake((callback: () => void | PromiseLike<void>) => {
                return completeViewTransition(callback);
            });
            transitionDocument.startViewTransition = startViewTransition;
            try {
                router = createRouter({
                    routes: [
                        routeWithComponent('', 'Home'),
                        routeWithComponent('about', 'About'),
                    ],
                    viewTransitions: true
                });
                await router.navigate('/about');
                expect(startViewTransition).toHaveBeenCalled();
            }
            finally {
                transitionDocument.startViewTransition = original;
            }
        });
        it('should allow a route to opt into view transitions', async () => {
            const transitionDocument = document as Document & {
                startViewTransition?: (callback: () => void | PromiseLike<void>) => {
                    finished: Promise<void>;
                };
            };
            const original = transitionDocument.startViewTransition;
            const startViewTransition = jasmine.createSpy('startViewTransition')
                .and.callFake((callback: () => void | PromiseLike<void>) => {
                return completeViewTransition(callback);
            });
            transitionDocument.startViewTransition = startViewTransition;
            try {
                router = createRouter({
                    routes: [
                        routeWithComponent('', 'Home'),
                        {
                            path: 'about',
                            viewTransition: true,
                            load: async () => ({
                                component: unwrapTestComponent(await (() => Promise.resolve(createComponent('About')))())
                            })
                        },
                    ], render: (name, node) => {
                        outlet.replaceChildren(node);
                    },
                });
                await router.navigate('/about');
                expect(startViewTransition).toHaveBeenCalled();
            }
            finally {
                transitionDocument.startViewTransition = original;
            }
        });
        it('should allow a route to opt out of global view transitions', async () => {
            const transitionDocument = document as Document & {
                startViewTransition?: (callback: () => void | PromiseLike<void>) => {
                    finished: Promise<void>;
                };
            };
            const original = transitionDocument.startViewTransition;
            const startViewTransition = jasmine.createSpy('startViewTransition')
                .and.callFake((callback: () => void | PromiseLike<void>) => {
                return completeViewTransition(callback);
            });
            transitionDocument.startViewTransition = startViewTransition;
            try {
                router = createRouter({
                    routes: [
                        routeWithComponent('', 'Home'),
                        {
                            path: 'about',
                            viewTransition: false,
                            load: async () => ({
                                component: unwrapTestComponent(await (() => Promise.resolve(createComponent('About')))())
                            })
                        },
                    ], render: (name, node) => {
                        outlet.replaceChildren(node);
                    },
                    viewTransitions: true
                });
                await router.navigate('/about');
                expect(startViewTransition).not.toHaveBeenCalled();
            }
            finally {
                transitionDocument.startViewTransition = original;
            }
        });
        it('should evaluate the view transition predicate against navigation context', async () => {
            const transitionDocument = document as Document & {
                startViewTransition?: (callback: () => void | PromiseLike<void>) => {
                    finished: Promise<void>;
                };
            };
            const original = transitionDocument.startViewTransition;
            const startViewTransition = jasmine.createSpy('startViewTransition')
                .and.callFake((callback: () => void | PromiseLike<void>) => {
                return completeViewTransition(callback);
            });
            const predicate = jasmine.createSpy('predicate')
                .and.callFake((context: {
                from: {
                    path: string;
                } | null;
                to: {
                    path: string;
                } | null;
                phase: string;
                url: URL;
            }) => context.to?.path === '/about' && context.phase === 'success');
            transitionDocument.startViewTransition = startViewTransition;
            try {
                router = createRouter({
                    routes: [
                        routeWithComponent('', 'Home'),
                        routeWithComponent('about', 'About'),
                        routeWithComponent('settings', 'Settings'),
                    ],
                    viewTransitions: predicate
                });
                await router.navigate('/about');
                await router.navigate('/settings');
                const [firstCall] = predicate.calls.allArgs();
                const [firstContext] = firstCall as [
                    {
                        from: {
                            path: string;
                        } | null;
                        to: {
                            path: string;
                        } | null;
                        phase: string;
                        url: URL;
                    }
                ];
                expect(firstContext.from).toBeNull();
                expect(firstContext.to?.path).toBe('/about');
                expect(firstContext.phase).toBe('success');
                expect(firstContext.url.pathname).toBe('/about');
                expect(startViewTransition).toHaveBeenCalledTimes(1);
            }
            finally {
                transitionDocument.startViewTransition = original;
            }
        });
        it('should preload flat lazy routes eagerly when configured', async () => {
            const aboutLoader = jasmine.createSpy('aboutLoader')
                .and.returnValue(Promise.resolve(createComponent('About')));
            const settingsLoader = jasmine.createSpy('settingsLoader')
                .and.returnValue(Promise.resolve(createComponent('Settings')));

            router = createRouter({
                routes: [
                    {
                        path: 'about',
                        load: async () => ({
                            component: unwrapTestComponent(await aboutLoader())
                        })
                    },
                    {
                        path: 'settings',
                        load: async () => ({
                            component: unwrapTestComponent(await settingsLoader())
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
                preloading: 'eager'
            });

            router.start();
            await delay(50);

            expect(aboutLoader).toHaveBeenCalledTimes(1);
            expect(settingsLoader).toHaveBeenCalledTimes(1);
        });
        it('should clear stale error state on blocked navigation', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    {
                        path: 'broken'
                    },
                    {
                        path: 'blocked',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Blocked')))()),
                            canActivate: [() => false]
                        })
                    },
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/broken'))
                .toBeRejected();
            expect(router.state.error).toBeDefined();
            router.navigate('/');
            await delay(50);
            router.navigate('/blocked');
            await delay(50);
            expect(router.state.error).toBeNull();
            expect(router.state.current?.path).toBe('/');
        });
    });
    describe('click interception', () => {
        it('should intercept anchor clicks', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const link = document.createElement('a');
            link.href = '/about';
            link.textContent = 'About';
            document.body.appendChild(link);
            const defaultPrevented = dispatchAnchorClick(link);
            await delay(50);
            expect(defaultPrevented).toBeTrue();
            expect(router.state.current?.path).toBe('/about');
            document.body.removeChild(link);
        });
        it('should not intercept external links', () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const link = document.createElement('a');
            link.href = 'https://example.com';
            link.textContent = 'External';
            document.body.appendChild(link);
            const defaultPrevented = dispatchAnchorClick(link);
            // Router should not intercept external links
            expect(defaultPrevented).toBeFalse();
            document.body.removeChild(link);
        });
        it('should not intercept links with modifier keys', () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const link = document.createElement('a');
            link.href = '/about';
            link.textContent = 'About';
            document.body.appendChild(link);
            const defaultPrevented = dispatchAnchorClick(link, { metaKey: true });
            expect(defaultPrevented).toBeFalse();
            document.body.removeChild(link);
        });
        it('should not intercept links with download attribute', () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const link = document.createElement('a');
            link.href = '/about';
            link.download = 'file';
            document.body.appendChild(link);
            const defaultPrevented = dispatchAnchorClick(link);
            expect(defaultPrevented).toBeFalse();
            document.body.removeChild(link);
        });
        it('should not intercept links with external rel', () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const link = document.createElement('a');
            link.href = '/about';
            link.rel = 'external';
            document.body.appendChild(link);
            const defaultPrevented = dispatchAnchorClick(link);
            expect(defaultPrevented).toBeFalse();
            document.body.removeChild(link);
        });
        it('should handle hash-only links', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            // Navigate to about first
            router.navigate('/about');
            await delay(50);
            // Click on a hash link from the same page
            const link = document.createElement('a');
            link.href = '#section';
            link.textContent = 'Section';
            document.body.appendChild(link);
            const defaultPrevented = dispatchAnchorClick(link);
            // The router should NOT prevent default for hash-only links
            expect(defaultPrevented).toBeFalse();
            document.body.removeChild(link);
        });
    });
    describe('state management', () => {
        it('should expose current route state', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            await delay(50);
            expect(router.state.path).toBe('/about');
            expect(router.state.params).toEqual({});
            expect(router.state.query).toEqual({});
            expect(router.state.routeConfig).toBeDefined();
            expect(router.state.pending).toBeFalse();
            expect(router.state.phase).toBeNull();
        });
        it('should expose a base-stripped path when baseHref is configured', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/app/about');
            await delay(50);
            expect(router.state.path).toBe('/about');
            expect(router.state.current?.path).toBe('/about');
            expect(router.state.current?.url.pathname).toBe('/app/about');
        });
        it('should track navigation phase', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'async',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Async')))()),
                            prepare: [async () => {
                                    await delay(30);
                                    return { data: 'data' };
                                }]
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/async');
            // Check that phase changes
            expect(router.state.phase).toBeDefined();
            await delay(50);
            expect(router.state.phase).toBeNull();
        });
        it('should track pending state during navigation', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'async',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Async')))()),
                            prepare: [async () => {
                                    await delay(30);
                                    return { data: 'data' };
                                }]
                        })
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            expect(router.state.pending).toBeFalse();
            router.navigate('/async');
            // Should be pending during navigation
            expect(router.state.pending).toBeTrue();
            await delay(50);
            expect(router.state.pending).toBeFalse();
        });
        it('should expose error state on navigation failure', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'error',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.reject(new Error('Component failed')))())
                        })
                    },
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/error'))
                .toBeRejectedWithError('Component failed');
            expect(router.state.error).toBeDefined();
            expect((router.state.error as Error).message).toBe('Component failed');
        });
    });
    describe('lifecycle', () => {
        it('should start and stop the router', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            expect(router.state.pending).toBeFalse();
            router.stop();
            expect(router.state.current).toBeNull();
            expect(router.state.pending).toBeFalse();
        });
        it('should prevent starting a disposed router', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.dispose();
            expect(() => {
                router.start();
            }).toThrowError(/Cannot start a disposed router/);
        });
        it('should prevent navigation after disposal', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.dispose();
            expect(() => {
                router.navigate('/about');
            }).toThrowError(/Cannot navigate with a disposed router/);
        });
        it('should clean up event listeners on dispose', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            const removeEventListenerSpy = spyOn(window, 'removeEventListener').and.callThrough();
            const documentRemoveSpy = spyOn(document, 'removeEventListener').and.callThrough();
            router = createRouter(config);
            router.start();
            router.dispose();
            expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', jasmine.any(Function));
            expect(documentRemoveSpy).toHaveBeenCalledWith('click', jasmine.any(Function));
        });
        it('should stop navigation on dispose', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'slow',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Slow')))()),
                            prepare: [async () => {
                                    await delay(100);
                                    return { data: 'data' };
                                }]
                        })
                    },
                ],
            };
            router = createRouter(config);
            router.start();
            router.navigate('/slow');
            // Dispose while navigation is in progress
            router.dispose();
            // The navigation should be cancelled
            expect(router.state.phase).toBeNull();
        });
        it('should dispose the active component when navigating away', async () => {
            let disposedComponent = false;
            let abortedSignal = false;
            let attachedAtDisposal = false;
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'first',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve((_route, { destroySignal }) => {
                                destroySignal.addEventListener('abort', () => {
                                    abortedSignal = true;
                                }, { once: true });
                                const node = document.createElement('div');
                                node.textContent = 'First';
                                return {
                                    node,
                                    dispose: () => {
                                        disposedComponent = true;
                                        attachedAtDisposal = node.parentElement === outlet;
                                    }
                                };
                            }))())
                        })
                    },
                    routeWithComponent('second', 'Second'),
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            router.navigate('/first');
            await delay(50);
            router.navigate('/second');
            await delay(50);
            expect(disposedComponent).toBeTrue();
            expect(abortedSignal).toBeTrue();
            expect(attachedAtDisposal).toBeTrue();
            expect(router.state.current?.path).toBe('/second');
        });
    });
    describe('utility methods', () => {
        it('should generate href with baseHref', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            expect(router.href('/about')).toBe('/app/about');
            expect(router.href('about')).toBe('/app/about');
        });
        it('should generate href with query parameters', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            expect(router.href('/about?foo=bar')).toBe('/about?foo=bar');
        });
        it('should resolve relative hrefs from the current location inside baseHref', () => {
            window.history.replaceState(null, '', '/app/section/');
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            expect(router.href('child')).toBe('/app/section/child');
        });
        it('should resolve relative hrefs from the current location at the root baseHref', () => {
            window.history.replaceState(null, '', '/dashboard/profile');
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            expect(router.href('settings')).toBe('/dashboard/settings');
        });
        it('should create links with correct href', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            const link = router.createLink('/about', 'About', 'nav-link');
            expect(link.tagName).toBe('A');
            expect(link.textContent).toBe('About');
            expect(link.className).toBe('nav-link');
            expect(link.href).toContain('/app/about');
        });
        it('should create links without className', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            const link = router.createLink('/about', 'About');
            expect(link.tagName).toBe('A');
            expect(link.textContent).toBe('About');
            expect(link.className).toBe('');
        });
    });
    describe('error handling', () => {
        it('should handle route with no component', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'broken'
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/broken'))
                .toBeRejectedWithError(/no component/i);
            expect(router.state.phase).toBeNull();
            expect(router.state.error).toBeDefined();
            expect((router.state.error as Error).message).toContain('no component');
        });
        it('should use custom renderError on initial navigation failure', async () => {
            let errorRendered = false;
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'broken'
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                }, renderError: (outletName: string, error: unknown) => {
                    errorRendered = true;
                    outlet.textContent = 'Custom Error: ' + (error as Error).message;
                }
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/broken'))
                .toBeRejected();
            expect(errorRendered).toBeTrue();
            expect(outlet.textContent).toContain('Custom Error');
        });
        it('should reject with the original navigation error when renderError also throws', async () => {
            router = createRouter({
                routes: [{ path: 'broken' }],
                outlet,
                renderError: () => {
                    throw new Error('Error renderer failed');
                },
            });

            await expectAsync(router.navigate('/broken'))
                .toBeRejectedWithError(/no component/i);
            expect((router.state.error as Error).message).toContain('no component');
            expect(router.state.pending).toBeFalse();
            expect(router.state.phase).toBeNull();
        });
        it('should synchronize state and outlet on navigation error', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    {
                        path: 'broken'
                    },
                ], render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            // Navigate to home first
            router.navigate('/');
            await delay(50);
            expect(outlet.textContent).toBe('Home');
            // Try to navigate to broken route
            await expectAsync(router.navigate('/broken'))
                .toBeRejected();
            expect(outlet.textContent).toContain('Page failed to load');
            expect(router.state.current).toBeNull();
            expect(router.state.error).toBeDefined();
        });
        it('should treat named AbortError failures as aborted navigations', async () => {
            let markStarted!: () => void;
            const started = new Promise<void>(resolve => {
                markStarted = resolve;
            });
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    {
                        path: 'slow',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Slow')))()),
                            prepare: [async ({ signal }) => {
                                    markStarted();
                                    await new Promise<void>((_resolve, reject) => {
                                        signal.addEventListener('abort', () => {
                                            const error = new Error('aborted');
                                            error.name = 'AbortError';
                                            reject(error);
                                        }, { once: true });
                                    });
                                    return { data: 'slow' };
                                }]
                        })
                    },
                ],
            };
            router = createRouter(config);
            router.start();
            router.navigate('/slow');
            await started;
            router.navigate('/');
            await delay(50);
            expect(router.state.error).toBeNull();
            expect(router.state.current?.path).toBe('/');
        });
        it('should handle guard errors', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'error',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Error')))()),
                            canActivate: [
                                () => {
                                    throw new Error('Guard failed');
                                },
                            ]
                        })
                    },
                ],
                outlet
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/error'))
                .toBeRejectedWithError('Guard failed');
            expect(router.state.error).toBeDefined();
            expect((router.state.error as Error).message).toBe('Guard failed');
        });
        it('should handle prepare errors', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    {
                        path: 'error',
                        load: async () => ({
                            component: unwrapTestComponent(await (() => Promise.resolve(createComponent('Error')))()),
                            prepare: [() => {
                                throw new Error('Prepare failed');
                            }]
                        })
                    },
                ],
            };
            router = createRouter(config);
            router.start();
            await expectAsync(router.navigate('/error'))
                .toBeRejectedWithError('Prepare failed');
            expect(router.state.error).toBeDefined();
            expect((router.state.error as Error).message).toBe('Prepare failed');
        });
    });
    describe('tracing', () => {
        it('should log debug messages when tracing is enabled', () => {
            const debugSpy = console.debug as jasmine.Spy;
            debugSpy.calls.reset();
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                enableTracing: true, render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            router.dispose();
            expect(debugSpy).toHaveBeenCalled();
        });
        it('should not log debug messages when tracing is disabled', () => {
            const debugSpy = console.debug as jasmine.Spy;
            debugSpy.calls.reset();
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                enableTracing: false, render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            router.dispose();
            expect(debugSpy).not.toHaveBeenCalled();
        });
    });
    describe('replace method', () => {
        it('should navigate with replace option', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const replaceSpy = spyOn(window.history, 'replaceState').and.callThrough();
            router.replace('/about');
            await delay(50);
            expect(replaceSpy).toHaveBeenCalled();
            expect(router.state.current?.path).toBe('/about');
        });
        it('should navigate with replace option and state', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            const replaceSpy = spyOn(window.history, 'replaceState').and.callThrough();
            router.replace('/about', { from: 'test' });
            await delay(50);
            expect(replaceSpy).toHaveBeenCalledWith({ from: 'test' }, '', '/about');
        });
    });
    describe('baseHref handling', () => {
        it('should strip baseHref from URL for routing', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/app/about');
            await delay(50);
            expect(router.state.current?.path).toBe('/about');
            expect(router.state.current?.url.pathname).toBe('/app/about');
            expect(outlet.textContent).toBe('About');
        });
        it('should reject navigation outside baseHref', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            expect(() => {
                router.navigate('/outside');
            }).toThrowError(/outside router base/);
        });
        it('should handle baseHref with root path', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                    routeWithComponent('about', 'About'),
                ],
                baseHref: '/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/about');
            await delay(50);
            expect(router.state.current?.path).toBe('/about');
            expect(outlet.textContent).toBe('About');
        });
        it('should navigate relative URLs from the current location at the root baseHref', async () => {
            window.history.replaceState(null, '', '/dashboard/profile');
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('dashboard/profile', 'Profile'),
                    routeWithComponent('dashboard/settings', 'Settings'),
                ],
                baseHref: '/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            await delay(50);
            router.navigate('settings');
            await delay(50);
            expect(router.state.current?.path).toBe('/dashboard/settings');
            expect(router.state.current?.url.pathname).toBe('/dashboard/settings');
            expect(outlet.textContent).toBe('Settings');
        });
        it('should handle absolute URLs within baseHref', () => {
            const config: VanillaRouterConfig = {
                routes: [routeWithComponent('', 'Home')],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            // Should create href with baseHref
            expect(router.href('/app/about')).toBe('/app/about');
            expect(router.href('about')).toBe('/app/about');
        });
        it('should navigate relative URLs from the current baseHref location', async () => {
            window.history.replaceState(null, '', '/app/section/');
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('section', 'Section'),
                    routeWithComponent('section/child', 'Child'),
                ],
                baseHref: '/app/',
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('child');
            await delay(50);
            expect(router.state.current?.path).toBe('/section/child');
            expect(router.state.current?.url.pathname).toBe('/app/section/child');
            expect(outlet.textContent).toBe('Child');
        });
    });
    describe('renderNotFound', () => {
        it('should call renderNotFound when route is not found', async () => {
            let notFoundCalled = false;
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                }, renderNotFound: (outletName: string, _url: URL) => {
                    notFoundCalled = true;
                    outlet.textContent = 'Custom 404';
                }
            };
            router = createRouter(config);
            router.start();
            router.navigate('/non-existent');
            await delay(50);
            expect(notFoundCalled).toBeTrue();
            expect(outlet.textContent).toBe('Custom 404');
            expect(router.state.phase).toBeNull();
            expect(router.state.error).toBeNull();
            expect(router.state.current).toBeNull();
        });
        it('should use default renderNotFound when not provided', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/non-existent');
            await delay(50);
            expect(outlet.textContent).toBe('404 — Page Not Found');
        });
        it('should clear the current route when rendering not found', async () => {
            const config: VanillaRouterConfig = {
                routes: [
                    routeWithComponent('', 'Home'),
                ],
                render: (name, node) => {
                    outlet.replaceChildren(node);
                },
            };
            router = createRouter(config);
            router.start();
            router.navigate('/');
            await delay(50);
            expect(router.state.current?.path).toBe('/');
            router.navigate('/non-existent');
            await delay(50);
            expect(router.state.current).toBeNull();
            expect(router.state.path).toBe('');
        });
    });
    describe('grouped named outlets', () => {
        function groupedRoute(): Route {
            return {
                path: 'project/:id',
                load: async () => ({
                    component: () => document.createTextNode('Primary')
                }),
                outlets: [{
                    path: 'project/:id',
                    outlet: 'sidebar',
                    load: async () => ({
                        component: () => document.createTextNode('Sidebar')
                    })
                }]
            };
        }

        it('should prepare and commit the complete outlet group', async () => {
            const primary = document.createElement('div');
            const sidebar = document.createElement('div');
            const committed: string[][] = [];

            router = createRouter({
                routes: [groupedRoute()],
                commit: outlets => {
                    committed.push(outlets.map(current => current.name));
                    for (const current of outlets) {
                        (current.name === 'sidebar' ? sidebar : primary)
                            .replaceChildren(current.node);
                    }
                }
            });

            expect(await router.navigate('/project/42')).toBeTrue();
            expect(committed).toEqual([['', 'sidebar']]);
            expect(primary.textContent).toBe('Primary');
            expect(sidebar.textContent).toBe('Sidebar');
            expect(router.state.params).toEqual({ id: '42' });
        });

        it('should reject malformed groups before navigation starts', () => {
            expect(() => createRouter({
                routes: [{
                    path: 'project',
                    load: async () => ({ component: createComponent('Primary') }),
                    outlets: [{
                        path: 'other',
                        outlet: 'sidebar',
                        load: async () => ({ component: createComponent('Sidebar') })
                    }]
                }]
            })).toThrowError(/must use the primary path/);

            expect(() => createRouter({
                routes: [{
                    path: 'project',
                    load: async () => ({ component: createComponent('Primary') }),
                    outlets: [
                        {
                            path: 'project',
                            outlet: 'sidebar',
                            load: async () => ({ component: createComponent('One') })
                        },
                        {
                            path: 'project',
                            outlet: 'sidebar',
                            load: async () => ({ component: createComponent('Two') })
                        }
                    ]
                }]
            })).toThrowError(/Duplicate outlet/);
        });

        it('should reject URL parsers declared by a secondary outlet', async () => {
            router = createRouter({
                routes: [{
                    path: 'project/:id',
                    load: async () => ({ component: createComponent('Primary') }),
                    outlets: [{
                        path: 'project/:id',
                        outlet: 'sidebar',
                        load: async () => ({
                            component: createComponent('Sidebar'),
                            parseParams: params => params
                        })
                    }]
                }],
                commit: () => undefined
            });

            await expectAsync(router.navigate('/project/42'))
                .toBeRejectedWithError(/cannot define parseParams or parseQuery/);
            expect((router.state.error as Error).message)
                .toContain('cannot define parseParams or parseQuery');
        });

        it('should preload every member of an enabled route group', async () => {
            const primaryLoad = jasmine.createSpy('primaryLoad').and.resolveTo({
                component: createComponent('Primary')
            });
            const sidebarLoad = jasmine.createSpy('sidebarLoad').and.resolveTo({
                component: createComponent('Sidebar')
            });

            router = createRouter({
                routes: [{
                    path: 'project',
                    load: primaryLoad,
                    outlets: [{
                        path: 'project',
                        outlet: 'sidebar',
                        load: sidebarLoad
                    }]
                }]
            });

            await router.preload();
            expect(primaryLoad).toHaveBeenCalledTimes(1);
            expect(sidebarLoad).toHaveBeenCalledTimes(1);
        });

        it('should preserve the active route when a later group fails to prepare', async () => {
            const primary = document.createElement('div');
            router = createRouter({
                routes: [
                    routeWithComponent('stable', 'Stable'),
                    {
                        path: 'broken',
                        load: async () => ({ component: createComponent('Broken') }),
                        outlets: [{
                            path: 'broken',
                            outlet: 'sidebar',
                            load: async () => { throw new Error('Sidebar failed'); }
                        }]
                    }
                ],
                commit: outlets => {
                    primary.replaceChildren(outlets[0].node);
                }
            });

            expect(await router.navigate('/stable')).toBeTrue();
            expect(primary.textContent).toBe('Stable');
            await expectAsync(router.navigate('/broken'))
                .toBeRejectedWithError('Sidebar failed');
            expect(router.state.current?.path).toBe('/stable');
            expect(primary.textContent).toBe('Stable');
            expect((router.state.error as Error).message).toBe('Sidebar failed');
        });

        it('should dispose all staged views when the group commit throws', async () => {
            const destroyed: boolean[] = [];
            router = createRouter({
                routes: [{
                    path: 'project',
                    load: async () => ({
                        component: (_route, context) => {
                            context.destroySignal.addEventListener('abort', () => destroyed.push(true));
                            return document.createTextNode('Primary');
                        }
                    }),
                    outlets: [{
                        path: 'project',
                        outlet: 'sidebar',
                        load: async () => ({
                            component: (_route, context) => {
                                context.destroySignal.addEventListener('abort', () => destroyed.push(true));
                                return document.createTextNode('Sidebar');
                            }
                        })
                    }]
                }],
                commit: () => { throw new Error('Commit failed'); }
            });

            await expectAsync(router.navigate('/project'))
                .toBeRejectedWithError('Commit failed');
            expect(destroyed.length).toBe(2);
            expect((router.state.error as Error).message).toBe('Commit failed');
        });

        it('should run native view transitions for grouped named outlet commits', async () => {
            const transitionDocument = document as Document & {
                startViewTransition?: (callback: () => void | PromiseLike<void>) => {
                    finished: Promise<void>;
                };
            };
            const original = transitionDocument.startViewTransition;
            const startViewTransition = jasmine.createSpy('startViewTransition')
                .and.callFake((callback: () => void | PromiseLike<void>) => {
                return completeViewTransition(callback);
            });
            transitionDocument.startViewTransition = startViewTransition;

            try {
                router = createRouter({
                    routes: [groupedRoute()],
                    viewTransitions: true,
                    commit: outlets => {
                        for (const current of outlets) {
                            (current.name === 'sidebar' ? document.createElement('div') : outlet)
                                .replaceChildren(current.node);
                        }
                    }
                });

                expect(await router.navigate('/project/42')).toBeTrue();
                expect(startViewTransition).toHaveBeenCalled();
            }
            finally {
                transitionDocument.startViewTransition = original;
            }
        });
    });

    describe('revalidation', () => {
        it('should rerun the current navigation without changing browser history', async () => {
            let loadCount = 0;
            let prepareCount = 0;

            router = createRouter({
            routes: [{
                path: '',
                load: async () => {
                loadCount++;

                return {
                    component: route =>
                    document.createTextNode(
                        String(route.data['message']),
                    ),

                    prepare: [
                    async () => {
                        prepareCount++;

                        return {
                        message: `Home ${prepareCount}`,
                        };
                    },
                    ],
                };
                },
            }],
            onSameUrlNavigation: 'ignore',
            render: (_name, node) => {
                outlet.replaceChildren(node);
            },
            });

            expect(await router.navigate('/')).toBeTrue();
            expect(loadCount).toBe(1);
            expect(prepareCount).toBe(1);
            expect(outlet.textContent).toBe('Home 1');

            const pushState =
            spyOn(window.history, 'pushState').and.callThrough();
            const replaceState =
            spyOn(window.history, 'replaceState').and.callThrough();

            expect(await router.revalidate()).toBeTrue();

            // Lazy route configuration remains cached.
            expect(loadCount).toBe(1);

            // Navigation-dependent data is recomputed.
            expect(prepareCount).toBe(2);
            expect(outlet.textContent).toBe('Home 2');

            expect(pushState).not.toHaveBeenCalled();
            expect(replaceState).not.toHaveBeenCalled();
        });
    });
});
````

## File: tsconfig.json
````json
{
  "compileOnSave": false,
  "compilerOptions": {
    "paths": {
      "@epikodelabs/waypoint": [
        "./projects/libraries/waypoint/src/public-api.ts"
      ],
      "@epikodelabs/waypoint/client": [
        "./projects/libraries/waypoint/client/public-api.ts"
      ],
      "@epikodelabs/waypoint/server": [
        "./projects/libraries/waypoint/server/public-api.ts"
      ]
    },
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "ES2022",
    "module": "preserve",
    "types": [
      "jasmine"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true
  },
  "files": [],
  "references": [
    {
      "path": "./projects/libraries/waypoint/tsconfig.lib.json"
    },
    {
      "path": "./projects/libraries/waypoint/tsconfig.spec.json"
    },
    {
      "path": "./projects/apps/app2/client/tsconfig.app.json"
    },
    {
      "path": "./projects/apps/app1/tsconfig.app.json"
    },
    {
      "path": "./projects/apps/app2/server/tsconfig.app.json"
    },
    {
      "path": "./projects/apps/shared/tsconfig.artifacts.json"
    },
    {
      "path": "./projects/tools/builder/tsconfig.json"
    }
  ]
}
````

## File: docs/server-delivery-contract.md
````markdown
# Waypoint Server Delivery Contract v1

## Status

**Version 1.** This document defines the browser/server delivery boundary for
server-side routing in Waypoint.

The contract is intentionally smaller than the compiler's server index. It is a
public delivery protocol, not a serialization of Waypoint's semantic model or
compiler internals.

## Purpose

A browser asks the server to resolve a destination. The server owns route
matching, authorization, artifact selection, and dependency resolution. If the
destination is allowed, the browser receives only the browser modules required
to install that navigation.

```text
requested URL + principal
        ↓
server route resolution
        ↓
server authorization
        ↓
artifact dependency resolution
        ↓
ServerNavigationResolution v1
        ↓
browser module loading
        ↓
runtime contribution installation
```

## Wire shape

```ts
interface ServerNavigationResolution {
  readonly version: 1;
  readonly artifactKey: string;
  readonly artifacts: readonly ServerArtifactDelivery[];
}

interface ServerArtifactDelivery {
  readonly artifactKey: string;
  readonly moduleUrl: string;
  readonly hash: string;
}
```

### `version`

Identifies the wire contract. A client must reject versions it does not
understand.

### `artifactKey`

Identifies the artifact that contains the originally requested destination.

The artifact must be present in `artifacts`, but it is not required to be the final
entry. Internal redirects may require additional authorized artifacts that appear
later while `artifacts` remains dependency-first.

### `artifacts`

Contains the complete authorized artifact plan in dependency-first order. For an
internal redirect chain, the plan includes the artifacts required for every
authorized redirect hop and the final destination.

The browser must not discover dependencies by querying a global artifact graph.
Each artifact key appears at most once.

### `moduleUrl`

A browser-loadable URL for the authorized artifact. The transport and URL shape
are application concerns; Waypoint does not require Express, a particular API
prefix, or SSR.

### `hash`

Identifies the exact compiled artifact contents. Browser loaders should treat
`artifactKey + hash` as delivery identity so recompiling an artifact under the
same stable key cannot reuse stale loaded code.

## Server-only information

The following information must not be required by the browser delivery
protocol:

- route policies;
- roles or permissions;
- route branch IDs;
- route-set ownership metadata;
- slot indexes;
- compiler shard locations;
- source file names or exports;
- artifact dependency edges;
- the complete protected route catalog.

Those belong to server resolution and compiler output, not the public wire
contract.

## Authorization invariant

An emitted browser artifact is an atomic code-delivery boundary.

The server may deliver an artifact only when every branch contained by that
artifact belongs to its expected route set and every effective policy on those
branches allows the current principal.

For a target with dependencies, the complete dependency chain must be
authorized before any delivery plan is returned.

```text
authorized(target)
  = authorized(dependency 1)
  ∧ authorized(dependency 2)
  ∧ ...
  ∧ authorized(target artifact)
```

The browser never performs this authorization calculation.

## Hidden routes

An application should avoid making authorization a route-discovery oracle.
Unknown and unauthorized protected destinations should normally have the same
public resolution behavior. The example server uses `404` for both.

Direct artifact-module requests must be authorized independently as well. A
client knowing or guessing an old artifact URL does not grant access to it.

## Redirects across artifacts

Internal redirects are resolved by the server before the delivery plan crosses
the browser boundary. The server follows the redirect chain using compiler shard
metadata, interpolates path parameters, authorizes every redirect hop and final
destination, and returns the union of required artifacts in dependency-first
order.

If any internal redirect target is unknown or unauthorized, no partial delivery
plan is returned. This prevents an otherwise authorized redirect artifact from
becoming a route-discovery or authorization bypass. External redirects are not
followed by the server; the authorized source redirect is delivered and the
browser runtime delegates the external navigation normally.

## Browser behavior

A conforming browser integration:

1. requests resolution for the current destination;
2. rejects malformed or unsupported protocol responses;
3. loads `artifacts` in the order returned;
4. validates that loaded modules are Waypoint route contributions;
5. caches loaded artifacts by `artifactKey + hash` rather than stable key alone;
6. installs the resulting contributions into the runtime configuration;
7. revalidates the current URL.

The browser does not need the server index or manifest to perform these steps.

Waypoint provides `createServerNavigationResolver()` as the default browser
implementation of this contract. The returned function can be passed directly
to `RouterOptions.resolveRoutes`. It validates the wire response before loading
code, imports the dependency-first artifact list in order, verifies that each
module exports a `routesFor()` contribution, and caches successful imports by
`artifactKey + hash`. Failed imports are removed from the resolver cache so a
later navigation can retry, and a newly published hash supersedes the resolver's
cache reference for the previous hash of the same stable artifact key.


## Server Router API v1

Waypoint provides a framework-neutral server router around the compiler's
server index and shards:

```ts
const source = createServerRouterSnapshotSource({
  loadIndex,
  loadShard,
  revision: readPublishedRevision,
});

const serverRouter = createServerRouter({
  loadSnapshot: source.loadSnapshot,
  moduleUrlFor,
});
```

The server router owns:

- parsing and normalizing requested navigation targets;
- selecting candidate shards by segment-aware path prefix;
- exact route-pattern matching, including dynamic parameters;
- mapping a matched branch to its route-set artifact;
- following and authorizing internal redirects across route-set artifacts;
- interpolating redirect path parameters without exposing the route graph;
- resolving transitive artifact dependencies in dependency-first order;
- loading the branch provenance required to authorize those artifacts;
- authorizing the complete artifact chain;
- constructing `ServerNavigationResolution v1`;
- authorizing direct module delivery by `artifactKey + hash`.

The transport adapter owns only transport concerns such as authentication input,
HTTP status codes, response headers, and sending the already-authorized file.

```text
HTTP adapter
    ↓ target + principal
createServerRouter()
    ↓ authorized resolution / artifact
HTTP adapter
    ↓ JSON or JavaScript response
browser
```

`createServerRouter()` deliberately does not depend on Express, Angular SSR,
filesystem layout, or a particular compiler-output directory. It consumes one
immutable `loadSnapshot()` source and a `moduleUrlFor()` mapping.

### Angular AOT and host-runtime identity

Waypoint route artifacts are executable Angular application modules, not raw
TypeScript decorator source. The route compiler performs Angular **full AOT**
compilation before isolated artifact bundling. This matches Angular's application
compilation model and avoids requiring JIT compilation in the browser.

Independently bundled artifacts must not create second identities for Angular,
Waypoint, or application services/tokens that are intentionally shared across
artifacts. The compiler therefore rewrites configured host-shared imports to a
small runtime bridge. Angular package specifiers and `@epikodelabs/waypoint` are
shared by default; applications may explicitly add stable bare specifiers for
additional shared runtime modules.

The browser must register the exact module namespace objects used by the host
application before native artifact imports occur:

```ts
import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

const resolveRoutes = waypoint.createServerNavigationResolver({
  hostModules: {
    '@angular/core': angularCore,
    '@epikodelabs/waypoint': waypoint,
  },
});
```

Registering a different namespace for an already registered specifier is an
error. This prevents accidentally mixing multiple Angular/Waypoint runtime
identities in one document realm.

Host modules are an **already-delivered runtime boundary**, not a privacy
boundary. A route component, admin-only service, or other code that must remain
undiscoverable to a principal must stay inside an authorized route artifact and
must not be configured as a host module.

## Compiler-output snapshots

`createServerRouterSnapshotSource()` builds that source from compiler-output loaders. It caches
one complete index + shard generation and exposes it through `loadSnapshot()`.
The server router uses that snapshot for the entire match/authorization operation,
so an index from one compiler publication cannot be combined with shards from a
later publication.

A refresh loads every referenced shard before swapping the active snapshot. If
loading fails, the previous successful snapshot remains active. Hosts may provide
a cheap `revision()` probe to detect a new publication without reparsing JSON on
every request, or call `refresh()` / `invalidate()` explicitly.

### Module identity

Browser module URLs should identify an artifact by its stable `artifactKey` and
its exact content `hash`. Emitted filenames are compiler/storage details and are
not part of the server delivery protocol.

A module request is valid only when:

1. the artifact key exists;
2. the requested hash equals the currently published artifact hash;
3. the artifact and every dependency are authorized for the current principal.

A stale hash, unknown artifact, or unauthorized artifact should normally be
indistinguishable at the public HTTP boundary.


## Revocation and delivered-route lifecycle

A successful delivery authorizes an artifact for that request; it does not make
its route contribution permanent for the lifetime of the application.

Waypoint distinguishes downloaded module state from active navigation state:

- downloaded artifact modules may remain cached by `artifactKey + hash`;
- `routesFor()` contributions installed from those modules are revocable;
- authored routes and authored contributions are not part of server-delivery
  revocation;
- an authorization-context change should reset resolved navigation and resolve
  the current destination again.

The Angular router exposes this boundary explicitly:

```ts
await router.revalidate({
  resetResolvedRoutes: true,
});
```

Resetting resolved routes increments the resolver generation. Results from older
in-flight resolutions are ignored, preventing a slow response produced under a
previous identity or tenant from reattaching revoked navigation.

A target-scoped `ServerNavigationResolution` is not an authorized route catalog.
Therefore ordinary navigation must not replace the entire delivered contribution
set with the artifact chain for the latest target. Doing so would incorrectly
revoke unrelated routes that remain authorized. Full revocation is instead tied
to an explicit authorization-boundary change.

## Relationship to `routeSlot()` and `routesFor()`

Compiler artifacts export actual `routesFor()` contributions. They are not
flattened route arrays.

When delivered, those contributions attach to the matching `routeSlot()` in the
already installed navigation skeleton. This preserves ownership, inherited path
context, layouts, providers, and policy provenance established by the authored
navigation model.

## Failure and race invariants

Server-side routing must fail closed at authorization-boundary changes. If the
browser revokes resolved contributions and reauthorization then fails because of
a transport, import, or server error, the previously authorized contribution set
must not remain active merely because the refresh failed.

A failed resolution is also not equivalent to a negative authorization result.
Only an explicit hidden/not-found response may be cached as unresolved; transient
transport or artifact-loading failures remain retryable.

Resolved navigation is committed transactionally. A malformed contribution, an
unknown slot, a conflicting route definition, or a collision with an authored
contribution identity must reject the candidate without leaving partial resolved
state installed.

Navigation ordering spans the server-resolution phase as well as the underlying
router transition. If a newer navigation starts while an older navigation is
still waiting for server resolution, the older request must not commit afterward.
Revocation and router disposal similarly invalidate in-flight resolved navigation.

Server artifact identity must be unambiguous. Duplicate artifact keys or multiple
artifacts claiming the same route-set delivery unit are invalid compiler output
and must fail resolution rather than selecting one by iteration order.


## Principal replacement

Delivered-route revocation and principal replacement are separate operations.
Soft revocation may remove delivered contributions from the active routing
configuration while leaving previously imported JavaScript modules cached in
the current browser realm.

When the authenticated security principal or tenant changes, applications
should replace the browser realm with a full document navigation. The server
establishes the new principal, selects an authorized landing route, and the
browser navigates there as a new document before protected navigation is
installed for that principal.

`createServerRouter()` exposes `resolveLanding(candidates, principal)` for this
server-side selection. It returns the first candidate that successfully resolves
and authorizes under the same complete-chain rules as ordinary route delivery.
It never turns the delivery protocol into an authorized-route catalog.
Applications must also account for browser back/forward-cache restoration: a document created for one principal must not become interactive again after the current session identifies a different principal. Reload or replace that restored document before reusing Waypoint runtime state.

Artifact boundaries must respect authorization boundaries as well. Since an
artifact is an atomic delivery unit, a sensitive branch should live in a
separate `routesFor()` artifact rather than sharing one artifact with routes
that less-privileged principals must receive.

## Relationship to SSR

Server Delivery Contract v1 does not define server-side rendering.

The same contract can be used by a browser-only Angular application, an Angular
SSR application, or another HTTP server integration. "Server-side routing" in
Waypoint refers to server ownership of route visibility, authorization, and
route-code delivery.

## Versioning

Additive compiler metadata does not change this contract because compiler
metadata is not sent over this boundary.

A change requires a new delivery-contract version when an existing client could
no longer safely interpret a server response according to these rules.

## Browser cancellation and publication rollover

A browser integration should treat server resolution as cancellable work. When a
newer navigation supersedes a pending destination, revocation starts, or the
router is disposed, the pending resolver receives an abort signal. A module import
that has already started cannot be physically undone by JavaScript, but an aborted
resolution must not return or install its contributions.

Content-addressed module delivery can race with atomic compiler publication: a
resolution may refer to the previous hash just as the server publishes the next
generation. The default browser resolver may re-resolve once after a module-load
failure and use the new delivery identity. Deterministic protocol or module-shape
errors are not retried.
````

## File: projects/tools/builder/src/waypoint-build/index.ts
````typescript
import path from 'node:path';

import {
  createBuilder,
  type BuilderContext,
  type BuilderOutput,
} from '@angular-devkit/architect';

import {
  analyze,
  createBuildLayout,
  prepareBuild,
} from '../compiler/index.js';

interface WaypointBuildOptions extends Record<string, unknown> {
  readonly waypoint?: {
    readonly entry?: string;
    readonly routesExport?: string;
    readonly profile?: boolean;
    readonly buildManifest?: boolean;
  };
}

/**
 * Waypoint is the application's actual build builder.
 *
 * All non-`waypoint` options are ordinary @angular/build:application options
 * and are delegated directly to Angular after Waypoint injects its generated
 * host navigation/runtime inputs.
 */
async function execute(
  options: WaypointBuildOptions,
  context: BuilderContext,
): Promise<BuilderOutput> {
  try {
    if (!context.target) {
      throw new Error(
        'Waypoint build requires an Architect project target context.',
      );
    }

    const workspaceRoot = context.workspaceRoot;
    const projectMetadata =
      await context.getProjectMetadata(context.target.project);

    const projectRoot =
      typeof projectMetadata['root'] === 'string'
        ? projectMetadata['root']
        : '';

    const angularOptions = angularApplicationOptions(options);
    const outputPath = resolveOutputPath(
      workspaceRoot,
      angularOptions['outputPath'],
    );

    const layout = createBuildLayout(outputPath);
    const waypoint = options.waypoint ?? {};

    const entry = path.resolve(
      workspaceRoot,
      projectRoot,
      waypoint.entry ?? 'src/app/app.routes.ts',
    );

    const analysis = await analyze({
      entry,
      serverOutput: layout.serverRoot,
      artifactsOutput: layout.protectedRoot,
      buildManifestOutput:
        waypoint.buildManifest === false
          ? undefined
          : layout.buildManifest,
      routesExport: waypoint.routesExport,
      profile: waypoint.profile,
    });

    reportDiagnostics(
      analysis.diagnostics,
      context,
    );

    if (!analysis.success || !analysis.plan) {
      return {
        success: false,
        error: 'Waypoint analysis failed.',
      };
    }

    const build = await prepareBuild(
      analysis,
      {
        metadataRoot: layout.metadataRoot,
      },
    );

    try {
      const delegatedOptions = {
        ...angularOptions,

        fileReplacements: [
          ...normalizeReplacements(
            angularOptions['fileReplacements'],
          ),
          {
            replace: angularWorkspacePath(
              workspaceRoot,
              analysis.planned.entry,
            ),
            with: angularWorkspacePath(
              workspaceRoot,
              build.host.routesEntry,
            ),
          },
        ],

        polyfills: [
          ...normalizePolyfills(
            angularOptions['polyfills'],
          ),
          angularWorkspacePath(
            workspaceRoot,
            build.host.runtimeEntry,
          ),
        ],
      };

      /*
       * Delegate directly to Angular's builder implementation rather than
       * scheduling another project target. This avoids a synthetic build-base
       * target and avoids recursion into Waypoint's own build target.
       */
      const delegated = await context.scheduleBuilder(
        '@angular/build:application',
        delegatedOptions,
        {
          target: context.target,
        },
      );

      try {
        const angularResult = await delegated.result;

        if (!angularResult.success) {
          await build.rollback();
          return angularResult;
        }
      } finally {
        await delegated.stop();
      }

      const published = await build.publish();

      reportDiagnostics(
        published.diagnostics,
        context,
      );

      return published.success
        ? { success: true }
        : {
            success: false,
            error: 'Waypoint publication failed.',
          };
    } finally {
      await build.dispose();
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    context.logger.error(message);

    return {
      success: false,
      error: message,
    };
  }
}

function angularWorkspacePath(
  workspaceRoot: string,
  absolutePath: string,
): string {
  const relative = path.relative(
    workspaceRoot,
    absolutePath,
  );

  if (
    relative === '..'
    || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative)
  ) {
    throw new Error(
      `Waypoint generated path "${absolutePath}" is outside workspace "${workspaceRoot}".`,
    );
  }

  return relative
    .split(path.sep)
    .join('/');
}

function angularApplicationOptions(
  options: WaypointBuildOptions,
): Record<string, unknown> {
  const {
    waypoint: _waypoint,
    ...angular
  } = options;

  return angular;
}

function normalizeReplacements(
  value: unknown,
): Array<{ replace: string; with: string }> {
  if (!Array.isArray(value)) return [];

  return value.flatMap(item => {
    if (
      !item
      || typeof item !== 'object'
      || typeof (item as any).replace !== 'string'
      || typeof (item as any).with !== 'string'
    ) {
      return [];
    }

    return [{
      replace: (item as any).replace,
      with: (item as any).with,
    }];
  });
}

function normalizePolyfills(
  value: unknown,
): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === 'string',
      )
    : [];
}

function resolveOutputPath(
  workspaceRoot: string,
  value: unknown,
): string {
  if (
    typeof value === 'string'
    && value.length > 0
  ) {
    return path.resolve(
      workspaceRoot,
      value,
    );
  }

  if (
    value
    && typeof value === 'object'
    && typeof (value as any).base === 'string'
  ) {
    return path.resolve(
      workspaceRoot,
      (value as any).base,
    );
  }

  throw new Error(
    'Waypoint build requires Angular application outputPath.',
  );
}

function reportDiagnostics(
  diagnostics: readonly {
    level: string;
    code?: string;
    message: string;
  }[],
  context: BuilderContext,
): void {
  for (const diagnostic of diagnostics) {
    const text =
      diagnostic.code
        ? `${diagnostic.code}: ${diagnostic.message}`
        : diagnostic.message;

    if (diagnostic.level === 'error') {
      context.logger.error(text);
    } else if (
      diagnostic.level === 'warning'
    ) {
      context.logger.warn(text);
    } else {
      context.logger.info(text);
    }
  }
}

export default createBuilder<WaypointBuildOptions>(
  execute,
);
````

## File: package.json
````json
{
  "name": "waypoint",
  "version": "1.0.1",
  "scripts": {
    "ng": "ng",
    "start": "ng serve app1",
    "start:app2": "ng serve app2-client",
    "build": "ng build waypoint",
    "watch": "ng build waypoint --watch --configuration development",
    "test": "testify --headless --browser chrome",
    "test:watch": "testify",
    "test:node": "testify --browser node",
    "test:coverage": "testify --headless --browser chrome --coverage",
    "start:server": "ng serve app2-server",
    "build:server": "ng build app2-server",
    "verify": "npm run build && ng build app1 --configuration development && ng build app2-client --configuration development && ng build app2-server --configuration development && npm test",
    "build:app2": "ng build app2-client --configuration development",
    "watch:app2": "ng build app2-client --watch --configuration development"
  },
  "private": true,
  "type": "module",
  "packageManager": "npm@12.0.2",
  "dependencies": {
    "@angular/common": "22.1.0",
    "@angular/compiler": "22.1.0",
    "@angular/core": "22.1.0",
    "@angular/forms": "22.1.0",
    "@angular/platform-browser": "22.1.0",
    "@angular/platform-server": "22.1.0",
    "@angular/router": "22.1.0",
    "@angular/ssr": "22.1.2",
    "express": "5.1.0",
    "rxjs": "7.8.2",
    "tslib": "^2.8.1"
  },
  "devDependencies": {
    "@angular/build": "22.1.2",
    "@angular/cli": "22.1.2",
    "@angular/compiler-cli": "22.1.0",
    "@epikodelabs/testify": "^1.0.38",
    "@types/express": "5.0.3",
    "@types/jasmine": "^6.0.0",
    "@types/node": "24.3.0",
    "ng-packagr": "22.1.0",
    "prettier": "^3.9.6",
    "typescript": "^6.0.3",
    "esbuild": "^0.28.2",
    "@epikodelabs/waypoint-builder": "file:projects/tools/builder"
  }
}
````

## File: projects/libraries/waypoint/src/lib/vanilla-router.ts
````typescript
import { HistoryManager, ZERO_SCROLL, type HistoryEntry, type HistoryUpdate, type ScrollPosition } from './history';
import { dispatchRouterLocationChange } from './router-events';
import { compileRoutePath, matchRoutePath, splitRoutePath, type CompiledRoutePath } from './route-path';
import {
  isPathInsideBase,
  normalizeBaseHref,
  getRouterLocation,
  resolveRouterUrl,
  routerHref,
  stripBaseHref
} from './router-url';

type MaybePromise<T> = T | PromiseLike<T>;

type RawRouteParams = Readonly<Record<string, string>>;

export type RouteParams =
  Readonly<Record<string, unknown>>;

export type RouteQuery =
  Readonly<Record<string, unknown>>;

export type RouteData =
  Readonly<Record<string, unknown>>;

export interface ActivatedRoute<TData extends RouteData = RouteData> {
  readonly url: URL;
  readonly path: string;
  /**
   * Parsed and validated path parameters.
   * Raw matcher captures remain internal to the router.
   */
  readonly params: RouteParams;

  /**
   * Parsed and validated search values.
   * Raw URLSearchParams remain available through `url.searchParams`.
   */
  readonly query: RouteQuery;

  readonly data: TData;
  readonly historyState: unknown;
  readonly config: Route;
}

export interface NavigationContext<TData extends RouteData = RouteData> extends ActivatedRoute<TData> {
  readonly signal: AbortSignal;
}

export interface DeactivationContext<TData extends RouteData = RouteData> extends ActivatedRoute<TData> {
  readonly nextUrl: URL;
  readonly signal: AbortSignal;
}

export interface RouteRenderContext {
  readonly signal: AbortSignal;
  readonly destroySignal: AbortSignal;
}

export interface RenderedRouteNode {
  readonly node: Node;
  readonly dispose?: () => void;
  readonly component?: unknown;
}

export type GuardResult =
  | boolean
  | string
  | {
      redirectTo: string;
      replace?: boolean;
      displayTarget?: string | URL;
    };

export type CanActivateFn = (
  route: NavigationContext,
) => MaybePromise<GuardResult>;

export type CanDeactivateFn = (
  route: DeactivationContext,
) => MaybePromise<GuardResult>;

export type PrepareRouteDataResult =
  | void
  | RouteData;

export type PrepareRouteDataFn = (
  route: NavigationContext,
) => MaybePromise<PrepareRouteDataResult>;

export type RouteComponent = (
  route: ActivatedRoute,
  context: RouteRenderContext
) => MaybePromise<Node | RenderedRouteNode>;

export type ParseRouteParams = (
  params: RawRouteParams,
  url: URL,
  signal: AbortSignal,
) => MaybePromise<RouteParams>;

export type ParseRouteQuery = (
  url: URL,
  signal: AbortSignal,
) => MaybePromise<RouteQuery>;

export interface LoadedRoute {
  readonly component?: RouteComponent;
  readonly canActivate?: CanActivateFn[];
  readonly canDeactivate?: CanDeactivateFn[];
  readonly prepare?: readonly PrepareRouteDataFn[];
  readonly parseParams?: ParseRouteParams;
  readonly parseQuery?: ParseRouteQuery;
}

export interface RouteBase {
  readonly name?: string;
  readonly path: string;
  readonly sourceRoute?: unknown;
  readonly data?: Record<string, unknown>;
}

export interface RedirectRoute extends RouteBase {
  readonly kind?: 'redirect';
  readonly redirectTo: string;
  readonly outlet?: never;
  readonly outlets?: never;
  readonly load?: never;
  readonly preload?: never;
  readonly viewTransition?: never;
  readonly canActivate?: never;
  readonly canDeactivate?: never;
  readonly prepare?: never;
}

export interface RenderableRoute extends RouteBase {
  readonly kind?: 'route';
  readonly outlet?: string;
  readonly outlets?: readonly RenderableRoute[];
  readonly load?: () => MaybePromise<LoadedRoute>;
  readonly redirectTo?: never;
  readonly preload?: boolean;
  readonly viewTransition?: boolean;
  readonly canActivate?: CanActivateFn[];
  readonly canDeactivate?: CanDeactivateFn[];
  readonly prepare?: readonly PrepareRouteDataFn[];
}

export type Route = RedirectRoute | RenderableRoute;

function isRedirectRoute(route: Route): route is RedirectRoute {
  return route.kind === 'redirect' || typeof route.redirectTo === 'string';
}

export interface NavigationTransition {
  readonly from: ActivatedRoute | null;
  readonly to: ActivatedRoute;
  readonly signal: AbortSignal;
  readonly redirectCount: number;
}

export type NavigationTransitionFn = (
  transition: NavigationTransition,
) => MaybePromise<GuardResult | void>;

export interface NavigationTransitionDefinition {
  readonly from?: (
    route: ActivatedRoute | null,
  ) => boolean;
  readonly to?: (
    route: ActivatedRoute,
  ) => boolean;
  readonly beforeEnter?: readonly NavigationTransitionFn[];
  readonly prepare?: readonly NavigationTransitionFn[];
  readonly beforeLeave?: readonly NavigationTransitionFn[];
  readonly afterEnter?: readonly NavigationTransitionFn[];
}

export type NavigationPhase = 'recognizing' | 'guarding' | 'resolving' | 'loading' | null;

export interface NavigationOptions {
  replace?: boolean;
  state?: unknown;
  displayTarget?: string | URL;
}

export type ScrollRestorationMode = 'restore' | 'top' | 'preserve';
export type PreloadingStrategy = 'none' | 'eager' | 'idle';
export type ViewTransitionPhase = 'success' | 'not-found' | 'error';

export interface ViewTransitionContext {
  readonly url: URL;
  readonly from: ActivatedRoute | null;
  readonly to: ActivatedRoute | null;
  readonly phase: ViewTransitionPhase;
  readonly routeConfig: Route | null;
  readonly error?: unknown;
}

export type ViewTransitionsOption =
  | boolean
  | ((context: ViewTransitionContext) => boolean);

export interface RouterState {
  readonly current: ActivatedRoute | null;
  readonly pending: boolean;
  readonly phase: NavigationPhase;
  readonly error: unknown;
  readonly path: string;
  readonly params: RouteParams;
  readonly query: RouteQuery;
  readonly data: RouteData;
  readonly historyState: unknown;
  readonly routeConfig: Route | null;
}

export interface RouterConfiguration {
  readonly routes: readonly Route[];
  readonly transitions: readonly NavigationTransitionDefinition[];
}

export interface Router {
  readonly state: RouterState;
  readonly routeVersion: number;
  routes(): readonly Route[];
  addRoutes(routes: readonly Route[]): boolean;
  replaceConfiguration(configuration: RouterConfiguration): boolean;
  replaceRoutes(routes: readonly Route[]): boolean;
  removeRoutes(predicate: (route: Route) => boolean): boolean;
  replaceTransitions(transitions: readonly NavigationTransitionDefinition[]): boolean;
  start(): void;
  stop(): void;
  dispose(): void;
  /**
   * Resolves true after a committed navigation, false for expected negative
   * outcomes (blocked, not found, cancelled, or ignored), and rejects when
   * navigation execution itself fails.
   */
  navigate(target: string | URL, options?: NavigationOptions): Promise<boolean>;
  replace(target: string | URL, state?: unknown): Promise<boolean>;
  revalidate(): Promise<boolean>;
  updateHistoryState(state: unknown): void;
  preload(): Promise<void>;
  back(): void;
  forward(): void;
  href(target: string): string;
  createLink(to: string, text: string, className?: string): HTMLAnchorElement;
}

export interface RouterConfig {
  routes: Route[];
  transitions?: readonly NavigationTransitionDefinition[];
  /**
   * Default DOM outlet used when no custom named-outlet renderer is supplied.
   */
  outlet?: HTMLElement | null;
  baseHref?: string;
  enableTracing?: boolean;
  maxRedirects?: number;
  onSameUrlNavigation?: 'ignore';
  scrollRestoration?: ScrollRestorationMode;
  preloading?: PreloadingStrategy;
  viewTransitions?: ViewTransitionsOption;
  navigateExternal?: (url: URL) => void;
  onOutletActivate?: (outlet: HTMLElement, component: unknown) => void;
  render?: (outletName: string, node: Node, route: ActivatedRoute) => void;
  renderNotFound?: (outletName: string, url: URL, router: Router) => void;
  commit?: (outlets: readonly PreparedOutlet[]) => void;
  renderError?: (outletName: string, error: unknown, router: Router) => void;
  onStateChange?: (state: RouterState) => void;
}

const INTERNAL_HISTORY_STATE_KEY =
  '__aether_switchboard__';

interface InternalHistoryStateEnvelope {
  readonly userState: unknown;
  readonly matchHref?: string;
  readonly entryId?: number;
}

function createHistoryStateEnvelope(
  userState: unknown,
  matchHref?: string,
  entryId?: number,
): unknown {
  if (!matchHref && entryId === undefined) {
    return userState ?? null;
  }

  return {
    [INTERNAL_HISTORY_STATE_KEY]: {
      userState: userState ?? null,
      ...(matchHref ? { matchHref } : {}),
      ...(entryId !== undefined ? { entryId } : {}),
    } satisfies InternalHistoryStateEnvelope,
  };
}

function readHistoryStateEnvelope(
  state: unknown,
): InternalHistoryStateEnvelope {
  if (
    typeof state === 'object'
    && state !== null
    && INTERNAL_HISTORY_STATE_KEY in state
  ) {
    const envelope =
      (state as Record<string, unknown>)[
        INTERNAL_HISTORY_STATE_KEY
      ];

    if (
      typeof envelope === 'object'
      && envelope !== null
      && 'userState' in envelope
    ) {
      return envelope as InternalHistoryStateEnvelope;
    }
  }

  return {
    userState: state ?? null,
  };
}

interface NavigationCompletion {
  settled: boolean;
  resolve(success: boolean): void;
  reject(error: unknown): void;
}

interface NavigationRequest {
  readonly id: number;
  readonly url: URL;
  readonly matchUrl: URL;
  readonly redirectCount: number;
  readonly completion: NavigationCompletion;
  readonly historyUpdate: HistoryUpdate;
}

interface RouteMatch {
  readonly route: Route;
  readonly params: RawRouteParams;
}

type RoutePattern = CompiledRoutePath;

export interface PreparedOutlet {
  readonly name: string;
  readonly route: ActiveRoute;
  readonly node: Node;
  readonly component?: unknown;
  readonly rendered: ActiveRender;
}

interface NavigationSuccess {
  type: 'success';
  request: NavigationRequest;
  route: ActiveRoute;
  outlets: readonly PreparedOutlet[];
}

interface NavigationRedirect {
  type: 'redirect';
  request: NavigationRequest;
  redirectTo: string;
  replace: boolean;
  displayTarget?: string | URL;
}

interface NavigationBlocked {
  type: 'blocked';
  request: NavigationRequest;
}

interface NavigationNotFound {
  type: 'not-found';
  request: NavigationRequest;
}

interface NavigationFailure {
  type: 'error';
  request: NavigationRequest;
  error: unknown;
  preserveActive?: boolean;
}

type NavigationResult =
  | NavigationSuccess
  | NavigationRedirect
  | NavigationBlocked
  | NavigationNotFound
  | NavigationFailure;

class RoutePreparationError extends Error {
  constructor(
    readonly originalError: unknown,
    readonly preserveActive: boolean,
  ) {
    super(
      originalError instanceof Error
        ? originalError.message
        : String(originalError),
      { cause: originalError },
    );
    this.name = 'RoutePreparationError';
  }
}

interface ActiveRoute extends ActivatedRoute {
  readonly matchUrl: URL;
}

interface ActiveRender {
  readonly controller: AbortController;
  readonly dispose: () => void;
}

const EMPTY_PARAMS: RouteParams =
  Object.freeze({});

const EMPTY_QUERY: RouteQuery =
  Object.freeze({});

const EMPTY_DATA: RouteData =
  Object.freeze({});

function isRenderedRouteNode(value: unknown): value is RenderedRouteNode {
  return value !== null && typeof value === 'object' && 'node' in value;
}

function normalizeRenderedRouteNode(value: Node | RenderedRouteNode): RenderedRouteNode {
  return isRenderedRouteNode(value) ? value : { node: value };
}

function readRawQuery(
  url: URL,
): RouteQuery {
  const values:
    Record<string, string> = {};

  url.searchParams.forEach(
    (value, key) => {
      values[key] = value;
    },
  );

  return Object.freeze(values);
}


function executeGuard(
  guard: CanActivateFn,
  route: NavigationContext,
): MaybePromise<GuardResult> {
  return guard(route);
}

function executeDeactivationGuard(
  guard: CanDeactivateFn,
  route: DeactivationContext
): MaybePromise<GuardResult> {
  return guard(route);
}

function executePrepareRouteData(
  prepare: PrepareRouteDataFn,
  route: NavigationContext,
): MaybePromise<PrepareRouteDataResult> {
  return prepare(route);
}

function normalizePreparedRouteData(
  value: PrepareRouteDataResult,
): RouteData {
  if (value === undefined) {
    return EMPTY_DATA;
  }

  if (
    typeof value !== 'object'
    || value === null
    || Array.isArray(value)
  ) {
    throw new Error(
      'Route prepare handlers must return an object or void.',
    );
  }

  return Object.freeze({ ...value });
}

function mergeRouteData(
  entries: readonly RouteData[],
): RouteData {
  if (entries.length === 0) {
    return EMPTY_DATA;
  }

  return Object.freeze(
    Object.assign(
      {},
      ...entries,
    ),
  );
}

function executeTransition(
  transition: NavigationTransitionFn,
  context: NavigationTransition,
): MaybePromise<GuardResult | void> {
  return transition(context);
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) throw new DOMException('Navigation aborted', 'AbortError');
}

function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error
    && (error as { name?: string }).name === 'AbortError';
}

function interpolateRedirect(
  redirectTo: string,
  params: RawRouteParams,
): string {
  return redirectTo.replace(/:([A-Za-z0-9_]+)/g, (_, key: string) => {
    if (!(key in params)) {
      throw new Error(`Missing route parameter "${key}" for redirect "${redirectTo}"`);
    }
    return encodeURIComponent(params[key]);
  });
}

function readRedirect(
  result: GuardResult,
): {
  redirectTo: string;
  replace: boolean;
  displayTarget?: string | URL;
} | null {
  if (typeof result === 'string') {
    return {
      redirectTo: result,
      replace: true,
    };
  }
  if (result && typeof result === 'object' && 'redirectTo' in result) {
    return {
      redirectTo: result.redirectTo,
      replace: result.replace ?? true,
      displayTarget: result.displayTarget,
    };
  }
  return null;
}

function replaceChildNodes(
  target: Node & {
    replaceChildren?: (...nodes: Node[]) => void;
    firstChild: ChildNode | null;
    removeChild(node: ChildNode): void;
    appendChild<T extends Node>(node: T): T;
  },
  ...nodes: Node[]
): void {
  if (typeof target.replaceChildren === 'function') {
    target.replaceChildren(...nodes);
    return;
  }

  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  for (const node of nodes) {
    target.appendChild(node);
  }
}

function defaultRender(outlet: HTMLElement, node: Node): void {
  replaceChildNodes(outlet, node);
}


function validateRouteGroups(routes: readonly Route[]): void {
  const primaryPaths = new Set<string>();

  for (const primary of routes) {
    const primaryOutlet = primary.outlet?.trim() ?? '';
    if (primaryOutlet) {
      throw new Error(
        `Top-level route "${primary.path}" must target the primary outlet`,
      );
    }

    if (primaryPaths.has(primary.path)) {
      throw new Error(`Duplicate primary route path "${primary.path}"`);
    }
    primaryPaths.add(primary.path);

    const outletNames = new Set<string>();
    for (const outlet of primary.outlets ?? []) {
      const name = outlet.outlet?.trim() ?? '';
      if (!name) {
        throw new Error(
          `Secondary route for "${primary.path}" must define a named outlet`,
        );
      }
      if (outletNames.has(name)) {
        throw new Error(
          `Duplicate outlet "${name}" for route "${primary.path}"`,
        );
      }
      outletNames.add(name);

      if (outlet.path !== primary.path) {
        throw new Error(
          `Outlet "${name}" must use the primary path "${primary.path}"`,
        );
      }
      if (outlet.outlets?.length) {
        throw new Error(`Outlet "${name}" cannot contain nested outlets`);
      }
      if (isRedirectRoute(outlet as Route)) {
        throw new Error(`Outlet "${name}" cannot redirect`);
      }
      if (outlet.name) {
        throw new Error(`Outlet "${name}" cannot define a route name`);
      }
      if (outlet.preload !== undefined) {
        throw new Error(
          `Outlet "${name}" cannot define preload; the primary route owns group preloading`,
        );
      }
      if (outlet.viewTransition !== undefined) {
        throw new Error(
          `Outlet "${name}" cannot define viewTransition; the primary route owns the transition`,
        );
      }
    }

    if (isRedirectRoute(primary) && outletNames.size > 0) {
      throw new Error(
        `Redirect route "${primary.path}" cannot activate named outlets`,
      );
    }
  }
}

const routeLoads = new WeakMap<Route, Promise<LoadedRoute>>();

function loadRoute(
  route: Route,
): Promise<LoadedRoute> {
  let pending = routeLoads.get(route);

  if (!pending) {
    pending = Promise
      .resolve(
        route.load?.() ?? {},
      )
      .then(loaded => ({
        component: loaded.component,
        canActivate: loaded.canActivate,
        canDeactivate: loaded.canDeactivate,
        prepare: loaded.prepare ?? route.prepare,
        parseParams: loaded.parseParams,
        parseQuery: loaded.parseQuery,
      }))
      .catch(error => {
        routeLoads.delete(route);
        throw error;
      });

    routeLoads.set(route, pending);
  }

  return pending;
}

export function createRouter(config: RouterConfig): Router {
  validateRouteGroups(config.routes);
  let routes: readonly Route[] =
    Object.freeze([...config.routes]);
  let routeVersion = 0;
  let transitions: readonly NavigationTransitionDefinition[] =
    Object.freeze([...(config.transitions ?? [])]);
  const render = config.render;
  const renderNotFound = config.renderNotFound;
  const renderError = config.renderError;
  const commitOutlets = config.commit;
  const browserWindow = typeof window === 'undefined' ? null : window;
  const browserDocument = typeof document === 'undefined' ? null : document;
  const routerLocation = () =>
    browserWindow?.location ?? getRouterLocation(browserDocument);
  const navigateExternal = config.navigateExternal ?? ((url: URL) => {
    browserWindow?.location.assign(url.href);
  });
  const baseHref = normalizeBaseHref(config.baseHref ?? '/');
  const maxRedirects = config.maxRedirects ?? 10;
  const scrollRestoration = config.scrollRestoration ?? 'preserve';
  const preloading = config.preloading ?? 'none';
  const viewTransitions = config.viewTransitions ?? false;
  const history = new HistoryManager(
    browserWindow,
    {
      get pathname() { return routerLocation().pathname; },
      get search() { return routerLocation().search; },
      get hash() { return routerLocation().hash; },
    },
    state => state,
    state => readHistoryStateEnvelope(state).entryId ?? null,
  );
  const routePatterns = new WeakMap<Route, RoutePattern>();

  let currentState: ActiveRoute | null = null;
  let requestState: NavigationRequest | null = null;
  let navigationPhase: NavigationPhase = null;
  let errorState: unknown = null;

  let started = false;
  let disposed = false;
  let navigationId = 0;
  let latestRequestId = 0;
  let activeController: AbortController | null = null;
  const activeRenders = new Map<string, ActiveRender>();
  const activeRouteStates = new Map<string, ActiveRoute>();
  let startRequestQueued = false;
  let preloadTask: Promise<void> | null = null;
  let preloadQueued = false;
  let preloadIdleId: number | null = null;
  let preloadTimeoutId: number | null = null;

  function trace(message: string, ...values: unknown[]): void {
    if (config.enableTracing) console.debug(`[Router] ${message}`, ...values);
  }

  function warn(message: string, ...values: unknown[]): void {
    console.warn(`[Router] ${message}`, ...values);
  }

  function resolveOutlet(): HTMLElement | null {
    return config.outlet ?? browserDocument?.getElementById('app') ?? null;
  }

  function matchesTransitionDefinition(
    definition: NavigationTransitionDefinition,
    from: ActivatedRoute | null,
    to: ActivatedRoute,
  ): boolean {
    return (definition.from?.(from) ?? true)
      && (definition.to?.(to) ?? true);
  }

  function collectTransitionPhase(
    phase: keyof Pick<
      NavigationTransitionDefinition,
      'beforeEnter' | 'prepare' | 'beforeLeave' | 'afterEnter'
    >,
    from: ActivatedRoute | null,
    to: ActivatedRoute,
  ): readonly NavigationTransitionFn[] {
    const handlers: NavigationTransitionFn[] = [];

    for (const definition of transitions) {
      if (!matchesTransitionDefinition(definition, from, to)) {
        continue;
      }

      handlers.push(...(definition[phase] ?? []));
    }

    return handlers;
  }

  async function runTransitionPhase(
    phase: keyof Pick<
      NavigationTransitionDefinition,
      'beforeEnter' | 'prepare' | 'beforeLeave'
    >,
    from: ActivatedRoute | null,
    to: ActivatedRoute,
    signal: AbortSignal,
    redirectCount = 0,
  ): Promise<GuardResult> {
    const handlers = collectTransitionPhase(phase, from, to);

    for (const handler of handlers) {
      const result = await executeTransition(handler, {
        from,
        to,
        signal,
        redirectCount,
      });
      throwIfAborted(signal);

      if (result === undefined || result === true) {
        continue;
      }

      return result;
    }

    return true;
  }

  async function runAfterEnterTransitions(
    from: ActivatedRoute | null,
    to: ActivatedRoute,
  ): Promise<void> {
    const handlers = collectTransitionPhase('afterEnter', from, to);

    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await executeTransition(handler, {
            from,
            to,
            signal: new AbortController().signal,
            redirectCount: 0,
          });
        } catch (error) {
          trace('afterEnter transition failed', error);
        }
      }),
    );
  }

  function createStatusRoute(url: URL): ActivatedRoute {
    return currentState ?? {
      url,
      path: stripBaseHref(url.pathname, baseHref),
      params: EMPTY_PARAMS,
      query: readRawQuery(url),
      data: EMPTY_DATA,
      historyState:
        readUserHistoryState(),
      config: routes[0] ?? { kind: 'route', path: '**' },
    };
  }

  function renderPrimaryNode(node: Node, route: ActivatedRoute): HTMLElement | null {
    if (render) {
      render('', node, route);
      return node.parentElement ?? resolveOutlet();
    }

    const outlet = resolveOutlet();
    if (outlet) {
      defaultRender(outlet, node);
    }
    return outlet;
  }

  function disposeRender(renderInstance: ActiveRender | null): void {
    if (!renderInstance) return;
    renderInstance.dispose();
  }

  function replaceActiveRender(
    outletName: string,
    renderInstance: ActiveRender | null,
  ): void {
    const previousRender =
      activeRenders.get(outletName) ?? null;

    if (renderInstance) {
      activeRenders.set(
        outletName,
        renderInstance,
      );
    } else {
      activeRenders.delete(
        outletName,
      );
    }

    disposeRender(previousRender);
  }

  function disposeAllRenders(): void {
    for (const renderInstance of activeRenders.values()) {
      disposeRender(renderInstance);
    }

    activeRenders.clear();
    activeRouteStates.clear();
  }  

  function clearOutlet(): void {
    const outlet = resolveOutlet();
    if (outlet) replaceChildNodes(outlet);
  }

  function currentHref(): string {
    const location = routerLocation();
    return location.pathname + location.search + location.hash;
  }

  function readScroll(): ScrollPosition {
    return {
      x: browserWindow?.scrollX ?? 0,
      y: browserWindow?.scrollY ?? 0,
    }
  }

  function scrollToPosition(position: ScrollPosition): void {
    browserWindow?.scrollTo(position.x, position.y);
  }

  function restoreScroll(update: HistoryUpdate): void {
    if (scrollRestoration === 'preserve') {
      return;
    }

    if (scrollRestoration === 'restore' && update.type === 'popstate') {
      scrollToPosition(update.nextEntry?.scroll ?? ZERO_SCROLL);
      return;
    }

    scrollToPosition(ZERO_SCROLL);
  }

  function restorePreviousScroll(update: HistoryUpdate): void {
    if (scrollRestoration === 'preserve') {
      return;
    }

    scrollToPosition(update.previousScroll);
  }

  function isInsideBase(pathname: string): boolean {
    return isPathInsideBase(pathname, baseHref);
  }

  function resolveAppUrl(target: string | URL, mode: 'navigate' | 'href'): URL {
    return resolveRouterUrl(target, baseHref, routerLocation(), mode);
  }

  function readBrowserHistoryState(): unknown {
    return browserWindow?.history.state ?? null;
  }

  function readUserHistoryState(
    state: unknown = readBrowserHistoryState(),
  ): unknown {
    return readHistoryStateEnvelope(state).userState;
  }

  function readHistoryMatchHref(
    state: unknown = readBrowserHistoryState(),
  ): string | null {
    return readHistoryStateEnvelope(state).matchHref ?? null;
  }

  function resolveNavigationMatchUrl(
    displayUrl: URL,
    historyState: unknown,
  ): URL {
    const matchHref =
      readHistoryMatchHref(
        historyState,
      );

    return matchHref
      ? resolveAppUrl(
          matchHref,
          'navigate',
        )
      : displayUrl;
  }

  function activeHref(): string | null {
    const url = currentState?.url;
    return url ? url.pathname + url.search + url.hash : null;
  }

  function activeMatchHref():
    string | null {
    const url =
      currentState?.matchUrl;

    return url
      ? url.pathname +
          url.search +
          url.hash
      : null;
  }

  function restoreActiveUrl(): void {
    const active = activeHref();
    const fallback = history.createDefaultUpdate().previousEntry?.href ?? currentHref();
    const href =
      active ?? fallback;

    browserWindow?.history.replaceState(
        createHistoryStateEnvelope(
          currentState
            ? currentState.historyState
            : readUserHistoryState(
                history.createDefaultUpdate().previousEntry?.state,
              ),
          activeMatchHref() !== null
            && activeMatchHref() !== activeHref()
            ? activeMatchHref() ?? undefined
            : undefined,
        ),
        '',
        href,
      );

    dispatchRouterLocationChange();
  }

  function applyHistoryStateToRoute(
    route: ActiveRoute,
    historyState: unknown,
  ): ActiveRoute {
    return { ...route, historyState };
  }

  function updateHistoryState(state: unknown): void {
    if (disposed) {
      throw new Error('Cannot update history state on a disposed router');
    }

    const entry = history.createDefaultUpdate().previousEntry ?? {
      id: 0,
      href: currentHref(),
      scroll: readScroll(),
      state: readBrowserHistoryState(),
    };
    const nextEntry: HistoryEntry = {
      id: entry.id,
      href: entry.href,
      scroll: readScroll(),
      state: createHistoryStateEnvelope(
        state,
        activeMatchHref() !== null
          && activeMatchHref() !== activeHref()
          ? activeMatchHref() ?? undefined
          : undefined,
      ),
    };

    browserWindow?.history.replaceState(
        nextEntry.state,
        '',
        nextEntry.href,
      );
    history.commitUpdate({ ...history.createDefaultUpdate(), nextEntry }, nextEntry.href);
    dispatchRouterLocationChange();

    if (currentState) {
      currentState = applyHistoryStateToRoute(
        currentState,
        readUserHistoryState(
          nextEntry.state,
        ),
      );
      notifyStateChange();
    }
  }

  function shouldUseViewTransition(
    context: ViewTransitionContext,
  ): boolean {
    const routeOverride = context.routeConfig?.viewTransition;
    if (routeOverride !== undefined) return routeOverride;

    return typeof viewTransitions === 'function'
      ? viewTransitions(context)
      : viewTransitions;
  }

  async function runWithViewTransition(
    context: ViewTransitionContext,
    action: () => void,
  ): Promise<void> {
    if (!shouldUseViewTransition(context)) {
      action();
      return;
    }

    if (!browserDocument) {
      action();
      return;
    }

    const transitionDocument = browserDocument as Document & {
      startViewTransition?: (
        callback: () => void | PromiseLike<void>,
      ) => { finished: PromiseLike<unknown> };
    };
    const startViewTransition = transitionDocument.startViewTransition;

    if (typeof startViewTransition !== 'function') {
      action();
      return;
    }

    try {
      await Promise.resolve(
        startViewTransition.call(transitionDocument, () => action()).finished,
      );
    } catch (error) {
      trace('View transition failed', error);
      action();
    }
  }

  function notifyOutletActivate(outlet: HTMLElement, component: unknown): void {
    config.onOutletActivate?.(outlet, component);
  }

  function createCompletion(): { completion: NavigationCompletion; promise: Promise<boolean> } {
    let resolve!: (success: boolean) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<boolean>((completion, failure) => {
      resolve = completion;
      reject = failure;
    });
    return { completion: { settled: false, resolve, reject }, promise };
  }

  function settleRequest(request: NavigationRequest, success: boolean): void {
    if (request.completion.settled) return;
    request.completion.settled = true;
    request.completion.resolve(success);
  }

  function failRequest(request: NavigationRequest, error: unknown): void {
    if (request.completion.settled) return;
    request.completion.settled = true;
    request.completion.reject(error);
  }

  function cancelActiveNavigation(): void {
    activeController?.abort();
    activeController = null;
    if (requestState) settleRequest(requestState, false);
  }

  async function createRequest(
    url: URL,
    matchUrl: URL,
    redirectCount: number,
    completion: NavigationCompletion | undefined,
    historyUpdate: HistoryUpdate,
    run: (request: NavigationRequest, signal: AbortSignal) => Promise<void>,
  ): Promise<boolean> {
    const pending = completion ? null : createCompletion();
    const request: NavigationRequest = {
      id: ++navigationId,
      url,
      matchUrl,
      redirectCount,
      completion: completion ?? pending!.completion,
      historyUpdate,
    };
    if (!completion) cancelActiveNavigation();
    latestRequestId = request.id;
    requestState = request;
    errorState = null;
    notifyStateChange();

    const controller = new AbortController();
    activeController = controller;
    await run(request, controller.signal);
    return await (pending?.promise ?? Promise.resolve(false));
  }

  function requestNavigation(
    url: URL,
    matchUrl: URL = url,
    redirectCount = 0,
    completion?: NavigationCompletion,
    historyUpdate: HistoryUpdate = history.createDefaultUpdate(),
  ): Promise<boolean> {
    return createRequest(
      url,
      matchUrl,
      redirectCount,
      completion,
      historyUpdate,
      runNavigation,
    );
  }

  function requestExternalNavigation(
    url: URL,
    completion?: NavigationCompletion,
    historyUpdate: HistoryUpdate = history.createDefaultUpdate(),
  ): Promise<boolean> {
    return createRequest(
      url,
      url,
      0,
      completion,
      historyUpdate,
      runExternalNavigation,
    );
  }

  function notifyStateChange(): void {
    config.onStateChange?.(publicState);
  }

  function setPhase(
    request: NavigationRequest,
    phase: NavigationPhase,
  ): void {
    if (request.id !== latestRequestId) {
      return;
    }

    navigationPhase = phase;
    notifyStateChange();
  }

  function getRoutePattern(route: Route): RoutePattern {
    const cached = routePatterns.get(route);
    if (cached && cached.source === route.path) {
      return cached;
    }

    const pattern = compileRoutePath(route.path);
    routePatterns.set(route, pattern);
    return pattern;
  }

  function recognize(path: string): RouteMatch | null {
    const segments = splitRoutePath(path);
    let fallback: Route | undefined;

    for (const route of routes) {
      if (route.path === '**' || route.path === '*') {
        fallback = route;
        continue;
      }

      const pattern = getRoutePattern(route);
      if (pattern.segments.length !== segments.length) {
        continue;
      }

      const params = matchRoutePath(pattern, segments);
      if (params) {
        return {
          route,
          params,
        };
      }
    }

    return fallback
      ? { route: fallback, params: Object.freeze({}) }
      : null;
  }

  async function runPreloading(): Promise<void> {
    if (disposed) {
      return;
    }

    for (const route of routes) {
      if (route.preload === false) {
        continue;
      }

      const group = [route, ...(route.outlets ?? [])];
      for (const member of group) {
        try {
          const loaded = await loadRoute(member);
          if (member !== route && (loaded.parseParams || loaded.parseQuery)) {
            throw new Error(
              `Outlet "${member.outlet}" cannot define parseParams or parseQuery`,
            );
          }
        } catch (error) {
          trace('Route preload failed', member.path, member.outlet ?? '', error);
        }
      }
    }
  }

  function preload(): Promise<void> {
    preloadQueued = false;
    preloadTask ??= runPreloading().finally(() => {
      preloadTask = null;
    });
    return preloadTask;
  }

  function cancelScheduledPreloading(): void {
    if (preloadIdleId !== null) {
      const cancelIdle = (browserWindow as (Window & {
        cancelIdleCallback?: (id: number) => void;
      }) | null)?.cancelIdleCallback;

      cancelIdle?.(preloadIdleId);
      preloadIdleId = null;
    }

    if (preloadTimeoutId !== null) {
      browserWindow?.clearTimeout(preloadTimeoutId);
      preloadTimeoutId = null;
    }

    preloadQueued = false;
  }

  function schedulePreloading(): void {
    if (
      disposed ||
      preloading === 'none' ||
      preloadTask ||
      preloadQueued
    ) {
      return;
    }

    preloadQueued = true;

    const run = async (): Promise<void> => {
      preloadIdleId = null;
      preloadTimeoutId = null;

      if (disposed || !started) {
        preloadQueued = false;
        return;
      }

      try {
        await preload();
      } catch (error) {
        trace('Preloading failed', error);
      }
    };

    if (preloading === 'eager') {
      queueMicrotask(async () => {
        await run();
      });
      return;
    }

    const requestIdle = (browserWindow as (Window & {
      requestIdleCallback?: (callback: () => void) => number;
    }) | null)?.requestIdleCallback;

    if (typeof requestIdle === 'function') {
      preloadIdleId = requestIdle(async () => {
        await run();
      });
      return;
    }

    preloadTimeoutId = browserWindow?.setTimeout(async () => {
      await run();
    }, 0) ?? null;
  }

  async function runCanDeactivateGuards(
    nextUrl: URL,
    signal: AbortSignal,
  ): Promise<GuardResult> {
    const routes = activeRouteStates.size > 0
      ? [...activeRouteStates.values()]
      : currentState
        ? [currentState]
        : [];

    for (const activeRoute of routes) {
      const context: DeactivationContext = {
        ...activeRoute,
        nextUrl,
        signal,
      };
      const loaded = await loadRoute(activeRoute.config);
      throwIfAborted(signal);

      for (const guard of loaded.canDeactivate ?? []) {
        const result = await executeDeactivationGuard(guard, context);
        throwIfAborted(signal);
        const redirect = readRedirect(result);
        if (redirect) {
          const redirectUrl = resolveAppUrl(redirect.redirectTo, 'href');
          if (redirectUrl.href === nextUrl.href) {
            warn('Ignoring canDeactivate redirect to the pending URL', redirect.redirectTo);
            continue;
          }
          return redirect;
        }
        if (result === false) return false;
      }
    }

    return true;
  }

  async function renderMatchedRoute(
    routeState: ActivatedRoute,
    loaded: LoadedRoute,
    signal: AbortSignal,
  ): Promise<{ node: Node; component?: unknown; rendered: ActiveRender }> {
    const destroyController = new AbortController();
    let output: RenderedRouteNode | undefined;

    const abortPreparedRender = () => {
      destroyController.abort();
    };

    throwIfAborted(signal);
    if (!loaded.component) {
      throw new Error(`Matched route "${routeState.config.path}" has no component`);
    }

    signal.addEventListener(
      'abort',
      abortPreparedRender,
      { once: true },
    );

    try {
      output = normalizeRenderedRouteNode(
        await loaded.component(routeState, {
          signal,
          destroySignal: destroyController.signal,
        }),
      );
      throwIfAborted(signal);

      signal.removeEventListener(
        'abort',
        abortPreparedRender,
      );

      let disposed = false;
      return {
        node: output.node,
        component: output.component,
        rendered: {
          controller: destroyController,
          dispose: () => {
            if (disposed) return;
            disposed = true;
            destroyController.abort();
            output?.dispose?.();
          },
        },
      };
    } catch (error) {
      signal.removeEventListener(
        'abort',
        abortPreparedRender,
      );
      destroyController.abort();
      output?.dispose?.();
      throw error;
    }
  }

  async function performNavigation(
    request: NavigationRequest,
    signal: AbortSignal,
  ): Promise<NavigationResult> {
    trace('Navigation started', request.matchUrl.href);
    setPhase(request, 'recognizing');

    if (!isInsideBase(request.matchUrl.pathname)) {
      throw new Error(
        `URL "${request.matchUrl.pathname}" is outside router base "${baseHref}"`,
      );
    }

    const path =
      stripBaseHref(
        request.matchUrl.pathname,
        baseHref,
      );
    const match = recognize(path);
    throwIfAborted(signal);

    if (!match) {
      setPhase(request, 'guarding');
      const deactivationResult = await runCanDeactivateGuards(request.url, signal);
      if (deactivationResult === false) {
        return { type: 'blocked', request };
      }

      const deactivationRedirect = deactivationResult
        ? readRedirect(deactivationResult)
        : null;
      if (deactivationRedirect) {
        return { type: 'redirect', request, ...deactivationRedirect };
      }

      return { type: 'not-found', request };
    }

    const primaryRoute = match.route;

    if (isRedirectRoute(primaryRoute)) {
      return {
        type: 'redirect',
        request,
        redirectTo: interpolateRedirect(primaryRoute.redirectTo, match.params),
        replace: true,
      };
    }

    const routes: readonly RenderableRoute[] = [
      primaryRoute,
      ...(primaryRoute.outlets ?? []),
    ];
    const historyState =
      readUserHistoryState(
        request.historyUpdate.nextEntry?.state,
      );

    let loadedRoutes: LoadedRoute[];
    try {
      loadedRoutes = await Promise.all(routes.map(loadRoute));
    } catch (error) {
      throw new RoutePreparationError(
        error,
        currentState !== null && routes.length > 1,
      );
    }
    throwIfAborted(signal);

    for (let index = 1; index < loadedRoutes.length; index++) {
      if (loadedRoutes[index].parseParams || loadedRoutes[index].parseQuery) {
        throw new Error(
          `Outlet "${routes[index].outlet}" cannot define parseParams or parseQuery`,
        );
      }
    }

    // The primary route owns URL parsing. Secondary outlets share the same
    // validated params and query because they are not independently navigable.
    const primaryLoaded = loadedRoutes[0];
    const [parsedParams, parsedQuery] = await Promise.all([
      primaryLoaded.parseParams
        ? primaryLoaded.parseParams(
            match.params,
            request.matchUrl,
            signal,
          )
        : Promise.resolve(
            Object.freeze({ ...match.params }) as RouteParams,
          ),
      primaryLoaded.parseQuery
        ? primaryLoaded.parseQuery(
            request.matchUrl,
            signal,
          )
        : Promise.resolve(
            readRawQuery(
              request.matchUrl,
            ),
          ),
    ]);
    throwIfAborted(signal);

    const sharedParams = Object.freeze({ ...parsedParams });
    const sharedQuery = Object.freeze({ ...parsedQuery });

    const baseRoutes = routes.map<ActivatedRoute>(route => ({
      url: request.url,
      path,
      params: sharedParams,
      query: sharedQuery,
      data: Object.freeze(route.data ?? {}),
      historyState,
      config: route,
    }));

    setPhase(request, 'guarding');

    const beforeLeaveResult = await runTransitionPhase(
      'beforeLeave',
      currentState,
      baseRoutes[0],
      signal,
      request.redirectCount,
    );
    if (beforeLeaveResult === false) {
      return { type: 'blocked', request };
    }

    const beforeLeaveRedirect = readRedirect(beforeLeaveResult);
    if (beforeLeaveRedirect) {
      return { type: 'redirect', request, ...beforeLeaveRedirect };
    }

    const deactivationResult = await runCanDeactivateGuards(request.url, signal);
    if (deactivationResult === false) {
      return { type: 'blocked', request };
    }

    const deactivationRedirect = deactivationResult
      ? readRedirect(deactivationResult)
      : null;
    if (deactivationRedirect) {
      return { type: 'redirect', request, ...deactivationRedirect };
    }

    const beforeEnterResult = await runTransitionPhase(
      'beforeEnter',
      currentState,
      baseRoutes[0],
      signal,
      request.redirectCount,
    );
    if (beforeEnterResult === false) {
      return { type: 'blocked', request };
    }

    const beforeEnterRedirect = readRedirect(beforeEnterResult);
    if (beforeEnterRedirect) {
      return { type: 'redirect', request, ...beforeEnterRedirect };
    }

    for (let index = 0; index < loadedRoutes.length; index++) {
      const context: NavigationContext = {
        ...baseRoutes[index],
        signal,
      };

      for (const guard of loadedRoutes[index].canActivate ?? []) {
        const result = await executeGuard(guard, context);
        throwIfAborted(signal);
        const redirect = readRedirect(result);
        if (redirect) {
          return { type: 'redirect', request, ...redirect };
        }
        if (result === false) {
          return { type: 'blocked', request };
        }
      }
    }

    const prepareResult = await runTransitionPhase(
      'prepare',
      currentState,
      baseRoutes[0],
      signal,
      request.redirectCount,
    );
    if (prepareResult === false) {
      return { type: 'blocked', request };
    }

    const prepareRedirect = readRedirect(prepareResult);
    if (prepareRedirect) {
      return { type: 'redirect', request, ...prepareRedirect };
    }

    setPhase(request, 'resolving');
    const preparedRouteData =
      new WeakMap<
        PrepareRouteDataFn,
        Promise<RouteData>
      >();

    const activatedRoutes = await Promise.all(
      baseRoutes.map(async (baseRoute, index): Promise<ActiveRoute> => {
        const context: NavigationContext = {
          ...baseRoute,
          signal,
        };

        const preparedData = mergeRouteData(
          await Promise.all(
            (loadedRoutes[index].prepare ?? []).map(
              prepare => {
                let pending =
                  preparedRouteData.get(
                    prepare,
                  );

                if (!pending) {
                  pending = Promise.resolve(
                    executePrepareRouteData(
                      prepare,
                      context,
                    ),
                  ).then(result =>
                    normalizePreparedRouteData(
                      result,
                    ),
                  );

                  preparedRouteData.set(
                    prepare,
                    pending,
                  );
                }

                return pending;
              },
            ),
          ),
        );
        throwIfAborted(signal);

        return {
          ...baseRoute,
          matchUrl:
            request.matchUrl,
          data: mergeRouteData([
            baseRoute.data,
            preparedData,
          ]),
        };
      }),
    );

    setPhase(request, 'loading');

    const prepared: PreparedOutlet[] = [];
    try {
      for (let index = 0; index < activatedRoutes.length; index++) {
        const route = activatedRoutes[index];
        const rendered = await renderMatchedRoute(
          route,
          loadedRoutes[index],
          signal,
        );
        prepared.push({
          name: route.config.outlet?.trim() ?? '',
          route,
          ...rendered,
        });
      }
    } catch (error) {
      for (let index = prepared.length - 1; index >= 0; index--) {
        try {
          prepared[index].rendered.dispose();
        } catch {}
      }

      throw new RoutePreparationError(
        error,
        currentState !== null && routes.length > 1,
      );
    }

    return {
      type: 'success',
      request,
      route: activatedRoutes[0],
      outlets: Object.freeze(prepared),
    };
  }

  async function runNavigation(request: NavigationRequest, signal: AbortSignal): Promise<void> {
    if (disposed) return;

    try {
      const result = await performNavigation(request, signal);
      if (disposed || result.request.id !== latestRequestId) {
        if (result.type === 'success') {
          for (const outlet of result.outlets) {
            outlet.rendered.dispose();
          }
        }
        return;
      }
      await commit(result);
    } catch (error) {
      if (signal.aborted || isAbortError(error)) return;
      const preparationError =
        error instanceof RoutePreparationError
          ? error
          : null;
      const failure: NavigationFailure = {
        type: 'error',
        request,
        error: preparationError?.originalError ?? error,
        preserveActive: preparationError?.preserveActive ?? false,
      };
      if (failure.request.id !== latestRequestId) return;
      try {
        await commit(failure);
      } catch (reportingError) {
        // Error-state commitment must never strand the navigation promise.
        // Preserve the original actionable failure for the caller.
        trace('Failed to commit navigation error state', reportingError);
        requestState = null;
        navigationPhase = null;
        errorState = failure.error;
        failRequest(request, failure.error);
        notifyStateChange();
      }
    } finally {
      if (activeController?.signal === signal) {
        activeController = null;
      }
    }
  }

  async function runExternalNavigation(
    request: NavigationRequest,
    signal: AbortSignal,
  ): Promise<void> {
    if (disposed) {
      settleRequest(request, false);
      return;
    }

    try {
      setPhase(request, 'guarding');

      const deactivationResult =
        await runCanDeactivateGuards(
          request.url,
          signal,
        );

      throwIfAborted(signal);

      if (request.id !== latestRequestId) {
        return;
      }

      const redirect =
        deactivationResult
          ? readRedirect(
              deactivationResult,
            )
          : null;

      if (redirect) {
        const redirectUrl =
          resolveAppUrl(
            redirect.redirectTo,
            'href',
          );

        if (
          redirectUrl.origin !==
          routerLocation().origin
        ) {
          requestState = null;
          navigationPhase = null;
          errorState = null;
          navigateExternal(
            redirectUrl,
          );
          settleRequest(
            request,
            true,
          );
          notifyStateChange();
          return;
        }

        const displayUrl =
          redirect.displayTarget
            ? resolveAppUrl(
                redirect.displayTarget,
                'href',
              )
            : redirectUrl;
        const href =
          displayUrl.pathname +
          displayUrl.search +
          displayUrl.hash;

        const historyState =
          createHistoryStateEnvelope(
            readUserHistoryState(),
            redirectUrl.href !== href
              ? redirectUrl.pathname +
                  redirectUrl.search +
                  redirectUrl.hash
              : undefined,
          );

        const historyUpdate =
          history.createUpdate(
            href,
            redirect.replace,
            historyState,
          );

        browserWindow?.history[
            redirect.replace
              ? 'replaceState'
              : 'pushState'
          ](
            historyUpdate.nextEntry?.state ?? historyState,
            '',
            href,
          );

        dispatchRouterLocationChange();

        await requestNavigation(
          new URL(
            href,
            routerLocation().origin,
          ),
          redirectUrl,
          0,
          request.completion,
          historyUpdate,
        );

        return;
      }

      if (
        deactivationResult === false
      ) {
        await commit({
          type: 'blocked',
          request,
        });
        return;
      }

      requestState = null;
      navigationPhase = null;
      errorState = null;

      navigateExternal(
        request.url,
      );
      settleRequest(
        request,
        true,
      );

      notifyStateChange();
    } catch (error) {
      if (
        signal.aborted ||
        isAbortError(error)
      ) {
        return;
      }

      if (
        request.id !==
        latestRequestId
      ) {
        return;
      }

      try {
        await commit({
          type: 'error',
          request,
          error,
        });
      } catch (reportingError) {
        trace('Failed to commit navigation error state', reportingError);
        requestState = null;
        navigationPhase = null;
        errorState = error;
        failRequest(request, error);
        notifyStateChange();
      }
    } finally {
      if (
        activeController?.signal ===
        signal
      ) {
        activeController = null;
      }
    }
  }

  async function commit(result: NavigationResult): Promise<void> {
    if (disposed || result.request.id !== latestRequestId) return;

    switch (result.type) {
      case 'success': {
        const previousRoute = currentState;
        await runWithViewTransition({
          url: result.request.url,
          from: currentState,
          to: result.route,
          phase: 'success',
          routeConfig: result.route.config,
        }, () => {
          const nextNames = new Set(result.outlets.map(outlet => outlet.name));

          // A custom group commit remains atomic: old renders stay active until
          // the complete group has committed successfully. The built-in/per-outlet
          // renderer disposes old views first so their disposal hooks still observe
          // the view attached to its outlet.
          if (!commitOutlets) {
            for (const renderInstance of activeRenders.values()) {
              disposeRender(renderInstance);
            }
            activeRenders.clear();
            activeRouteStates.clear();
          }

          try {
            if (commitOutlets) {
              commitOutlets(result.outlets);
            } else {
              for (const outlet of result.outlets) {
                if (outlet.name === '') {
                  renderPrimaryNode(outlet.node, outlet.route);
                } else if (render) {
                  render(outlet.name, outlet.node, outlet.route);
                } else {
                  throw new Error(
                    `No renderer is configured for outlet "${outlet.name}"`,
                  );
                }
              }
            }
          } catch (error) {
            for (const outlet of result.outlets) {
              outlet.rendered.dispose();
            }
            throw error;
          }

          if (commitOutlets) {
            for (const [name] of activeRenders.entries()) {
              if (!nextNames.has(name)) {
                replaceActiveRender(name, null);
                activeRouteStates.delete(name);
              }
            }
          }

          for (const outlet of result.outlets) {
            if (commitOutlets) {
              replaceActiveRender(outlet.name, outlet.rendered);
            } else {
              activeRenders.set(outlet.name, outlet.rendered);
            }
            activeRouteStates.set(outlet.name, outlet.route);

            // The router only knows the concrete DOM target for its default
            // primary outlet. Custom named-outlet renderers own activation hooks.
            if (!commitOutlets && outlet.name === '') {
              const target = outlet.node.parentElement ?? resolveOutlet();
              if (target) {
                notifyOutletActivate(target, outlet.component);
              }
            }
          }
        });
        history.commitUpdate(
          result.request.historyUpdate,
          result.request.url.pathname + result.request.url.search + result.request.url.hash,
        );
        currentState = result.route;
        requestState = null;
        navigationPhase = null;
        errorState = null;
        browserWindow?.dispatchEvent(new CustomEvent('routechange', { detail: result.route }));
        trace('Navigation completed', result.route.path);
        restoreScroll(result.request.historyUpdate);
        settleRequest(result.request, true);
        notifyStateChange();
        await runAfterEnterTransitions(previousRoute, result.route);
        return;
      }
      case 'redirect': {
        if (result.request.redirectCount >= maxRedirects) {
          await commit({
            type: 'error',
            request: result.request,
            error: new Error(`Maximum redirect count of ${maxRedirects} exceeded`),
          });
          return;
        }

        const url = resolveAppUrl(result.redirectTo, 'href');
        if (
          url.origin !==
          routerLocation().origin
        ) {
          await requestExternalNavigation(
            url,
            result.request.completion,
            result.request.historyUpdate,
          );
          return;
        }

        const displayUrl =
          result.displayTarget
            ? resolveAppUrl(
                result.displayTarget,
                'href',
              )
            : url;
        const href =
          displayUrl.pathname +
          displayUrl.search +
          displayUrl.hash;
        const historyState =
          createHistoryStateEnvelope(
            readUserHistoryState(),
            url.href !== displayUrl.href
              ? url.pathname +
                  url.search +
                  url.hash
              : undefined,
          );
        const historyUpdate = history.createUpdate(href, result.replace, historyState);
        browserWindow?.history[result.replace ? 'replaceState' : 'pushState'](historyUpdate.nextEntry?.state ?? historyState, '', href);
        dispatchRouterLocationChange();
        await requestNavigation(
          displayUrl,
          url,
          result.request.redirectCount + 1,
          result.request.completion,
          historyUpdate,
        );
        return;
      }
      case 'blocked': {
        restoreActiveUrl();
        history.rollbackUpdate(result.request.historyUpdate);
        requestState = null;
        navigationPhase = null;
        errorState = null;
        trace('Navigation blocked');
        restorePreviousScroll(result.request.historyUpdate);
        settleRequest(result.request, false);
        notifyStateChange();
        return;
      }
      case 'not-found': {
        await runWithViewTransition({
          url: result.request.url,
          from: currentState,
          to: null,
          phase: 'not-found',
          routeConfig: null,
        }, () => {          
          if (renderNotFound) {
            renderNotFound('', result.request.url, publicRouter);
          } else {
            const heading = browserDocument?.createElement('h1');
            if (!heading) return;
            heading.textContent = '404 — Page Not Found';
            renderPrimaryNode(
              heading,
              createStatusRoute(result.request.url),
            );
          }

          disposeAllRenders();
        });
        history.commitUpdate(
          result.request.historyUpdate,
          result.request.url.pathname + result.request.url.search + result.request.url.hash,
        );
        currentState = null;
        requestState = null;
        navigationPhase = null;
        errorState = null;
        trace('Route not found', result.request.url.pathname);
        restoreScroll(result.request.historyUpdate);
        settleRequest(result.request, false);
        notifyStateChange();
        return;
      }
      case 'error': {
        restoreActiveUrl();

        if (!result.preserveActive) {
          try {
            await runWithViewTransition({
              url: result.request.url,
              from: currentState,
              to: null,
              phase: 'error',
              routeConfig: null,
              error: result.error,
            }, () => {
              try {
                if (renderError) {
                  renderError('', result.error, publicRouter);
                } else {
                  const heading = browserDocument?.createElement('h1');
                  if (!heading) return;
                  heading.textContent = 'Page failed to load';
                  renderPrimaryNode(
                    heading,
                    createStatusRoute(result.request.url),
                  );
                }
              } finally {
                disposeAllRenders();
              }
            });
          } catch (reportingError) {
            // Error presentation is best-effort. Never replace the actionable
            // navigation failure or leave its promise unsettled because an
            // error renderer failed while reporting it.
            trace('Navigation error renderer failed', reportingError);
          }
        }

        history.rollbackUpdate(result.request.historyUpdate);
        if (!result.preserveActive) {
          currentState = null;
        }
        requestState = null;
        navigationPhase = null;
        errorState = result.error;
        trace('Navigation failed', result.error);
        restorePreviousScroll(result.request.historyUpdate);
        failRequest(result.request, result.error);
        notifyStateChange();
        return;
      }
    }
  }

  async function handlePopState(): Promise<void> {
    const historyUpdate = history.createPopStateUpdate(currentHref());
    const resolvedHref = historyUpdate.nextEntry?.href ?? currentHref();
    const displayUrl = new URL(resolvedHref, routerLocation().origin);

    try {
      await requestNavigation(
        displayUrl,
        resolveNavigationMatchUrl(
          displayUrl,
          readBrowserHistoryState(),
        ),
        0,
        undefined,
        historyUpdate,
      );
    } catch (error) {
      trace('Popstate navigation failed', error);
    }
  }

  async function handleClick(event: MouseEvent): Promise<void> {
    if (disposed || !started) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download') || anchor.rel.split(/\s+/).includes('external')) return;

    const location = routerLocation();
    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin || !isInsideBase(url.pathname)) {
      return;
    }

    if (url.pathname === location.pathname && url.search === location.search && url.hash) {
      return;
    }

    event.preventDefault();

    try {
      await navigate(url);
    } catch (error) {
      trace('Intercepted navigation failed', error);
    }
  }

  function navigate(target: string | URL, options: NavigationOptions = {}): Promise<boolean> {
    if (disposed) throw new Error('Cannot navigate with a disposed router');
    const matchUrl = resolveAppUrl(target, 'navigate');

    if (
      matchUrl.origin !==
      routerLocation().origin
    ) {
      return requestExternalNavigation(
        matchUrl,
        undefined,
        history.createDefaultUpdate(),
      );
    }

    if (!isInsideBase(matchUrl.pathname)) {
      throw new Error(`URL "${matchUrl.pathname}" is outside router base "${baseHref}"`);
    }

    const displayUrl =
      options.displayTarget
        ? resolveAppUrl(
            options.displayTarget,
            'href',
          )
        : matchUrl;

    if (
      config.onSameUrlNavigation === 'ignore'
      && currentState?.url.href === displayUrl.href
      && currentState?.matchUrl.href === matchUrl.href
    ) {
      return Promise.resolve(false);
    }

    const href =
      displayUrl.pathname +
      displayUrl.search +
      displayUrl.hash;
    const historyState =
      createHistoryStateEnvelope(
        options.state,
        matchUrl.href !==
          displayUrl.href
          ? matchUrl.pathname +
              matchUrl.search +
              matchUrl.hash
          : undefined,
      );
    const historyUpdate = history.createUpdate(href, options.replace ?? false, historyState);
    browserWindow?.history[options.replace ? 'replaceState' : 'pushState'](historyUpdate.nextEntry?.state ?? historyState, '', href);
    dispatchRouterLocationChange();
    return requestNavigation(
      displayUrl,
      matchUrl,
      0,
      undefined,
      historyUpdate,
    );
  }

  function replace(target: string | URL, state?: unknown): Promise<boolean> {
    return navigate(target, { replace: true, state });
  }

  function revalidate(): Promise<boolean> {
    if (disposed) {
      throw new Error('Cannot revalidate with a disposed router');
    }

    const location = routerLocation();
    const displayUrl = new URL(location.href);
    const matchUrl = currentState?.matchUrl ?? displayUrl;

    if (displayUrl.origin !== location.origin) {
      return requestExternalNavigation(
        displayUrl,
        undefined,
        history.createDefaultUpdate(),
      );
    }

    if (!isInsideBase(displayUrl.pathname)) {
      throw new Error(
        `URL "${displayUrl.pathname}" is outside router base "${baseHref}"`,
      );
    }

    // Keep both the visible address and Switchboard's internal match address,
    // while bypassing same-URL suppression and avoiding a history mutation.
    return requestNavigation(
      displayUrl,
      matchUrl,
      0,
      undefined,
      history.createDefaultUpdate(),
    );
  }

  function sameRouteReferences(
    nextRoutes: readonly Route[],
  ): boolean {
    return routes.length === nextRoutes.length
      && routes.every(
        (route, index) => route === nextRoutes[index],
      );
  }

  function sameTransitionReferences(
    nextTransitions: readonly NavigationTransitionDefinition[],
  ): boolean {
    return transitions.length === nextTransitions.length
      && transitions.every(
        (transition, index) =>
          transition === nextTransitions[index],
      );
  }

  function applyConfiguration(
    nextRoutes: readonly Route[],
    nextTransitions: readonly NavigationTransitionDefinition[],
  ): boolean {
    const routesChanged =
      !sameRouteReferences(nextRoutes);
    const transitionsChanged =
      !sameTransitionReferences(nextTransitions);

    if (!routesChanged && !transitionsChanged) {
      return false;
    }

    if (routesChanged) {
      // Validate before cancelling the current request. A rejected update must
      // leave the active navigation and frame graph untouched.
      validateRouteGroups([...nextRoutes]);
    }

    cancelActiveNavigation();

    if (routesChanged) {
      routes = Object.freeze([...nextRoutes]);
      routeVersion++;
      cancelScheduledPreloading();
    }

    if (transitionsChanged) {
      transitions = Object.freeze([...nextTransitions]);
    }

    if (routesChanged) {
      schedulePreloading();
    }

    return true;
  }

  function addRoutes(
    nextRoutes: readonly Route[],
  ): boolean {
    if (disposed) {
      throw new Error(
        'Cannot add routes to a disposed router',
      );
    }

    if (nextRoutes.length === 0) return false;
    return applyConfiguration(
      [...routes, ...nextRoutes],
      transitions,
    );
  }

  function replaceConfiguration(
    configuration: RouterConfiguration,
  ): boolean {
    if (disposed) {
      throw new Error(
        'Cannot replace configuration on a disposed router',
      );
    }

    return applyConfiguration(
      configuration.routes,
      configuration.transitions,
    );
  }

  function replaceRoutes(
    nextRoutes: readonly Route[],
  ): boolean {
    if (disposed) {
      throw new Error(
        'Cannot replace routes on a disposed router',
      );
    }

    return applyConfiguration(
      nextRoutes,
      transitions,
    );
  }

  function removeRoutes(
    predicate: (route: Route) => boolean,
  ): boolean {
    if (disposed) {
      throw new Error(
        'Cannot remove routes from a disposed router',
      );
    }

    const nextRoutes = routes.filter(
      route => !predicate(route),
    );

    return applyConfiguration(
      nextRoutes,
      transitions,
    );
  }

  function replaceTransitions(
    nextTransitions: readonly NavigationTransitionDefinition[],
  ): boolean {
    if (disposed) {
      throw new Error(
        'Cannot replace transitions on a disposed router',
      );
    }

    return applyConfiguration(
      routes,
      nextTransitions,
    );
  }

  function startRouter(): void {
    if (disposed) {
      throw new Error(
        'Cannot start a disposed router',
      );
    }

    if (started) {
      return;
    }

    started = true;
    browserWindow?.addEventListener(
        'popstate',
        handlePopState,
      );
    browserDocument?.addEventListener(
        'click',
        handleClick,
      );
    schedulePreloading();

    // Starting the router must be synchronous from the caller's point of
    // view. Queue initial URL recognition so `state.pending` remains false
    // immediately after start(), and let an explicit navigate() win.
    if (startRequestQueued) {
      return;
    }

    startRequestQueued = true;

    queueMicrotask(async () => {
      startRequestQueued = false;

      if (
        !started ||
        disposed ||
        currentState !== null ||
        requestState !== null
      ) {
        return;
      }

      try {
        await requestNavigation(
          new URL(routerLocation().href),
          resolveNavigationMatchUrl(
            new URL(routerLocation().href),
            readBrowserHistoryState(),
          ),
          0,
          undefined,
          history.createDefaultUpdate(),
        );
      } catch (error) {
        trace('Initial navigation failed', error);
      }
    });
  }

  function stopRouter(): void {
    cancelScheduledPreloading();

    if (!started) {
      cancelActiveNavigation();
      return;
    }

    browserWindow?.removeEventListener('popstate', handlePopState);
    browserDocument?.removeEventListener('click', handleClick);
    cancelActiveNavigation();
    disposeAllRenders();
    clearOutlet();
    started = false;
    startRequestQueued = false;
    requestState = null;
    navigationPhase = null;
    errorState = null;
    currentState = null;
    notifyStateChange();
  }

  function href(target: string): string {
    const url = resolveAppUrl(target, 'href');
    return routerHref(url);
  }

  function createLink(to: string, text: string, className = ''): HTMLAnchorElement {
    if (!browserDocument) {
      throw new Error('Cannot create a router link without a document.');
    }

    const link = browserDocument.createElement('a');
    link.href = href(to);
    link.textContent = text;
    if (className) link.className = className;
    return link;
  }

  let publicRouter: Router;

  const publicState: RouterState = {
    get current() {
      if (disposed) return null;
      return currentState;
    },
    get pending() {
      if (disposed) return false;
      return requestState !== null;
    },
    get phase() {
      if (disposed) return null;
      return navigationPhase;
    },
    get error() {
      if (disposed) return null;
      return errorState;
    },
    get path() {
      if (disposed) return '';
      return currentState?.path ?? '';
    },
    get params() {
      if (disposed) return EMPTY_PARAMS;
      return currentState?.params ?? EMPTY_PARAMS;
    },
    get query() {
      if (disposed) return EMPTY_QUERY;
      return currentState?.query ?? EMPTY_QUERY;
    },
    get data() {
      if (disposed) return EMPTY_DATA;
      return currentState?.data ?? EMPTY_DATA;
    },
    get historyState() {
      if (disposed) return null;
      return currentState?.historyState
        ?? readUserHistoryState(
          history.createDefaultUpdate().previousEntry?.state,
        );
    },
    get routeConfig() {
      if (disposed) return null;
      return currentState?.config ?? null;
    },
  };

  publicRouter = {
    state: publicState,
    get routeVersion() {
      return routeVersion;
    },
    routes: () => Object.freeze([...routes]),
    addRoutes: nextRoutes => addRoutes(nextRoutes),
    replaceConfiguration: configuration =>
      replaceConfiguration(configuration),
    replaceRoutes: nextRoutes =>
      replaceRoutes(nextRoutes),
    removeRoutes: predicate =>
      removeRoutes(predicate),
    replaceTransitions: nextTransitions =>
      replaceTransitions(nextTransitions),
    start: () => startRouter(),
    stop: () => stopRouter(),
    dispose: () => {
      if (disposed) return;
      stopRouter();
      disposed = true;
    },
    navigate: (target, options) => navigate(target, options),
    replace: (target, state) => replace(target, state),
    revalidate: () => revalidate(),
    updateHistoryState: (state) => updateHistoryState(state),
    preload: () => preload(),
    back: () => browserWindow?.history.back(),
    forward: () => browserWindow?.history.forward(),
    href: (target) => href(target),
    createLink: (to, text, className) => createLink(to, text, className),
  };

  return publicRouter;
}

export type VanillaRouterInstance = ReturnType<typeof createRouter>;
````

## File: angular.json
````json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "npm"
  },
  "newProjectRoot": "projects",
  "projects": {
    "waypoint": {
      "projectType": "library",
      "root": "projects/libraries/waypoint",
      "sourceRoot": "projects/libraries/waypoint/src",
      "prefix": "lib",
      "architect": {
        "build": {
          "builder": "@angular/build:ng-packagr",
          "options": {
            "project": "projects/libraries/waypoint/ng-package.json"
          },
          "configurations": {
            "production": {
              "tsConfig": "projects/libraries/waypoint/tsconfig.lib.prod.json"
            },
            "development": {
              "tsConfig": "projects/libraries/waypoint/tsconfig.lib.json"
            }
          },
          "defaultConfiguration": "production"
        },
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "tsConfig": "projects/libraries/waypoint/tsconfig.spec.json"
          }
        }
      }
    },
    "app1": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:class": {
          "skipTests": true
        },
        "@schematics/angular:component": {
          "skipTests": true
        },
        "@schematics/angular:directive": {
          "skipTests": true
        },
        "@schematics/angular:guard": {
          "skipTests": true
        },
        "@schematics/angular:interceptor": {
          "skipTests": true
        },
        "@schematics/angular:pipe": {
          "skipTests": true
        },
        "@schematics/angular:resolver": {
          "skipTests": true
        },
        "@schematics/angular:service": {
          "skipTests": true
        }
      },
      "root": "projects/apps/app1",
      "sourceRoot": "projects/apps/app1/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/app1",
            "browser": "projects/apps/app1/src/main.ts",
            "tsConfig": "projects/apps/app1/tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/apps/app1/public"
              }
            ],
            "styles": [
              "projects/apps/app1/src/styles.css"
            ]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": {
                "scripts": true,
                "styles": true,
                "vendor": false
              }
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "app1:build:production"
            },
            "development": {
              "buildTarget": "app1:build:development"
            }
          },
          "defaultConfiguration": "development",
          "options": {
            "port": 4200
          }
        }
      }
    },
    "app2-client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:class": {
          "skipTests": true
        },
        "@schematics/angular:component": {
          "skipTests": true
        },
        "@schematics/angular:directive": {
          "skipTests": true
        },
        "@schematics/angular:guard": {
          "skipTests": true
        },
        "@schematics/angular:interceptor": {
          "skipTests": true
        },
        "@schematics/angular:pipe": {
          "skipTests": true
        },
        "@schematics/angular:resolver": {
          "skipTests": true
        },
        "@schematics/angular:service": {
          "skipTests": true
        }
      },
      "root": "projects/apps/app2/client",
      "sourceRoot": "projects/apps/app2/client/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@epikodelabs/waypoint-builder:waypoint-build",
          "options": {
            "outputPath": "dist/app2-client",
            "browser": "projects/apps/app2/client/src/main.ts",
            "tsConfig": "projects/apps/app2/client/tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/apps/app2/client/public"
              }
            ],
            "styles": [
              "projects/apps/app2/client/src/styles.css"
            ]
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "app2-client:build:production"
            },
            "development": {
              "buildTarget": "app2-client:build:development"
            }
          },
          "defaultConfiguration": "development",
          "options": {
            "port": 4200,
            "proxyConfig": "projects/apps/app2/client/proxy.conf.json"
          }
        }
      }
    },
    "app2-server": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:class": {
          "skipTests": true
        },
        "@schematics/angular:component": {
          "skipTests": true
        },
        "@schematics/angular:directive": {
          "skipTests": true
        },
        "@schematics/angular:guard": {
          "skipTests": true
        },
        "@schematics/angular:interceptor": {
          "skipTests": true
        },
        "@schematics/angular:pipe": {
          "skipTests": true
        },
        "@schematics/angular:resolver": {
          "skipTests": true
        },
        "@schematics/angular:service": {
          "skipTests": true
        }
      },
      "root": "projects/apps/app2/server",
      "sourceRoot": "projects/apps/app2/server/src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "./builders:with-prerequisites",
          "options": {
            "delegateTarget": ":application",
            "prerequisiteTargets": [
              "app2-client:build"
            ]
          },
          "configurations": {
            "development": {
              "targetConfiguration": "development"
            },
            "production": {
              "targetConfiguration": "production"
            }
          },
          "defaultConfiguration": "production"
        },
        "application": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/app2-server",
            "browser": "projects/apps/app2/server/src/main.ts",
            "tsConfig": "projects/apps/app2/server/tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "projects/apps/app2/server/public"
              }
            ],
            "styles": [
              "projects/apps/app2/server/src/styles.css"
            ],
            "server": "projects/apps/app2/server/src/main.server.ts",
            "outputMode": "server",
            "security": {
              "allowedHosts": [
                "localhost",
                "127.0.0.1"
              ]
            },
            "ssr": {
              "entry": "projects/apps/app2/server/src/server.ts"
            }
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "4kB",
                  "maximumError": "8kB"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "./builders:with-prerequisites",
          "options": {
            "delegateTarget": ":dev-server",
            "prerequisiteTargets": [
              "app2-client:build"
            ]
          },
          "configurations": {
            "development": {
              "targetConfiguration": "development"
            },
            "production": {
              "targetConfiguration": "production"
            }
          },
          "defaultConfiguration": "development"
        },
        "dev-server": {
          "builder": "@angular/build:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "app2-server:application:production"
            },
            "development": {
              "buildTarget": "app2-server:application:development",
              "prebundle": false
            }
          },
          "defaultConfiguration": "development",
          "options": {
            "port": 4300
          }
        }
      }
    }
  }
}
````

## File: projects/libraries/waypoint/src/tests/router-facade.spec.ts
````typescript
import { ensureAngularTestEnvironment } from './angular-testbed.init';

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  frame,
  layout,
  lazyLayout,
  lazyRoute,
  provideRouter,
  redirectRoute,
  RouterOutlet,
  route,
  RouterReloadError,
  routeSlot,
  routesFor,
  type RouterOptions,
  Router,
  type NavigationTree,
} from '@epikodelabs/waypoint';

ensureAngularTestEnvironment();

@Component({ standalone: true, template: '<h1>Home</h1>' })
class HomeComponent {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<h2>Parent</h2><router-outlet />',
  host: { 'parent-cmp': '' },
})
class ParentComponent {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<h2>Shell</h2><router-outlet />',
  host: { 'shell-cmp': '' },
})
class ShellComponent {}

@Component({
  standalone: true,
  imports: [RouterOutlet],
  template: '<h2>Shell</h2><router-outlet name="sidebar" /><router-outlet />',
  host: { 'shell-sidebar-cmp': '' },
})
class ShellWithSidebarComponent {}

@Component({
  standalone: true,
  template: '<h3>Child</h3>',
  host: { 'child-cmp': '' },
})
class ChildComponent {}

@Component({
  standalone: true,
  template: '<h3>Settings</h3>',
  host: { 'settings-cmp': '' },
})
class SettingsComponent {}

describe('Router: flat routes and layouts', () => {
  let outlet: HTMLElement;
  let router: Router;

  function bootstrap(routes: NavigationTree, options: RouterOptions = {}): void {
    TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        ParentComponent,
        ShellComponent,
        ShellWithSidebarComponent,
        ChildComponent,
        SettingsComponent,
      ],
      providers: [...provideRouter(routes, options)],
    });

    outlet = document.createElement('div');
    router = TestBed.inject(Router);
    router.connect('', outlet);
  }

  function getOutletContent(): string {
    return outlet.innerHTML;
  }

  async function navigate(path: string): Promise<void> {
    await router.navigate({ path });
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    spyOn(window.history, 'pushState').and.callThrough();
    spyOn(window.history, 'replaceState').and.callThrough();
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    router?.dispose();
    outlet?.remove();
  });

  it('renders a leaf route without a layout', async () => {
    const routes = [route('/', HomeComponent)] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/');

    expect(getOutletContent()).toContain('<h1>Home</h1>');
  });

  it('supports a layout index route', async () => {
    const routes = [
      layout('/admin', ParentComponent, [route('', HomeComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h1>Home</h1>');
  });

  it('renders an eager layout around an eager leaf route', async () => {
    const routes = [
      layout('/admin', ParentComponent, [route('/child', ChildComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('inherits the layout path prefix', async () => {
    const routes = [
      layout('/admin', ParentComponent, [route('/settings', SettingsComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/settings');

    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.state.path).toBe('/admin/settings');
  });

  it('renders an eager layout around a lazy leaf route', async () => {
    const routes = [
      layout('/admin', ParentComponent, [lazyRoute('/lazy-child', async () => ChildComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/lazy-child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('renders a lazy layout around an eager leaf route', async () => {
    const routes = [
      lazyLayout('/admin', async () => ParentComponent, [route('/child', ChildComponent)]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('renders a lazy layout around a lazy leaf route', async () => {
    const routes = [
      lazyLayout('/admin', async () => ParentComponent, [
        lazyRoute('/lazy-child', async () => ChildComponent),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/admin/lazy-child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('composes multiple layouts without creating a route hierarchy', async () => {
    const routes = [
      layout('/app', ShellComponent, [
        layout('/admin', ParentComponent, [route('/child', ChildComponent)]),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/app/admin/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Shell</h2>');
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Child</h3>');
  });

  it('supports multiple leaf routes inside one prefixed layout', async () => {
    const routes = [
      layout('/admin', ParentComponent, [
        route('/child', ChildComponent),
        route('/settings', SettingsComponent),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);

    await navigate('/admin/child');
    expect(getOutletContent()).toContain('<h3>Child</h3>');

    await navigate('/admin/settings');
    const content = getOutletContent();
    expect(content).toContain('<h2>Parent</h2>');
    expect(content).toContain('<h3>Settings</h3>');
    expect(content).not.toContain('<h3>Child</h3>');
  });

  it('supports named outlets', async () => {
    const routes = [
      layout('/', ParentComponent, [
        route('', HomeComponent),
        route('', SettingsComponent, { outlet: 'sidebar' }),
      ]),
    ] as const satisfies NavigationTree;

    const sidebarOutlet = document.createElement('div');
    sidebarOutlet.id = 'sidebar-outlet';

    bootstrap(routes);
    router.connect('sidebar', sidebarOutlet);

    await navigate('/');
    const content = getOutletContent();
    expect(content).toContain('<h1>Home</h1>');
    expect(sidebarOutlet.innerHTML).toContain('<h3>Settings</h3>');

    router.disconnect('sidebar', sidebarOutlet);
  });

  it('connects named outlets declared inside a layout component', async () => {
    const routes = [
      layout('/app', ShellWithSidebarComponent, [
        route('/child', ChildComponent),
        route('/child', SettingsComponent, { outlet: 'sidebar' }),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/app/child');

    const content = getOutletContent();
    expect(content).toContain('<h2>Shell</h2>');
    expect(content).toContain('<h3>Child</h3>');
    expect(content).toContain('<h3>Settings</h3>');
  });

  it('keeps named outlet navigation working across layout re-renders', async () => {
    const routes = [
      layout('/app', ShellWithSidebarComponent, [
        route('/child', ChildComponent),
        route('/child', SettingsComponent, { outlet: 'sidebar' }),
        route('/settings', SettingsComponent),
        route('/settings', HomeComponent, { outlet: 'sidebar' }),
      ]),
    ] as const satisfies NavigationTree;

    bootstrap(routes);

    await navigate('/app/child');
    expect(getOutletContent()).toContain('<h3>Child</h3>');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');

    await navigate('/app/settings');

    const content = getOutletContent();
    expect(content).toContain('<h3>Settings</h3>');
    expect(content).toContain('<h1>Home</h1>');
    expect(router.state.path).toBe('/app/settings');
    expect(router.displayUrl).toBe('/app/settings');
  });


  it('resolves a protected direct deep link during initial bootstrap', async () => {
    const deepRoutes = routesFor(
      'application',
      'deep-link-routes',
      [route('/app/deep', SettingsComponent, { name: 'deep' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) =>
      url.pathname === '/app/deep' ? { contributions: [deepRoutes] } : null,
    );

    window.history.replaceState(null, '', '/app/deep');
    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(resolveRoutes).toHaveBeenCalled();
    expect(router.state.path).toBe('/app/deep');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('composes a missing route branch before named navigation', async () => {
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/app/settings') {
        return null;
      }

      return [
        layout('/app', ParentComponent, [
          route('/settings', SettingsComponent, {
            name: 'settings',
          }),
        ]),
      ] as const satisfies NavigationTree;
    });

    bootstrap([route('/', HomeComponent)] as const satisfies NavigationTree, {
      namedRoutes: [
        {
          name: 'settings',
          path: '/app/settings',
        },
      ],
      resolveRoutes,
    });

    expect(
      router.href({
        name: 'settings',
      }),
    ).toBe('/app/settings');

    await router.navigate({
      name: 'settings',
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(resolveRoutes).toHaveBeenCalled();
    expect(getOutletContent()).toContain('<h2>Parent</h2>');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.state.path).toBe('/app/settings');
    expect(router.displayUrl).toBe('/app/settings');
  });

  it('follows a server-delivered redirect whose target is delivered in the same resolution', async () => {
    const legacyRoutes = routesFor(
      'legacy',
      'legacy-core',
      [redirectRoute('/legacy', '/target')],
    );
    const targetRoutes = routesFor(
      'target',
      'target-core',
      [route('/target', SettingsComponent)],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) =>
      url.pathname === '/legacy'
        ? { contributions: [legacyRoutes, targetRoutes] }
        : null,
    );

    bootstrap(
      [routeSlot('legacy'), routeSlot('target')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    resolveRoutes.calls.reset();

    await navigate('/legacy');

    expect(resolveRoutes).toHaveBeenCalledTimes(1);
    expect(router.state.path).toBe('/target');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('attaches server-resolved route contributions to existing route slots', async () => {
    const applicationRoutes = routesFor(
      'application',
      'application-core',
      [
        layout('/app', ParentComponent, [
          route('/settings', SettingsComponent),
        ]),
      ] as const satisfies NavigationTree,
    );

    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.resolveTo({
      contributions: [applicationRoutes],
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/app/settings');

    expect(resolveRoutes).toHaveBeenCalled();
    expect(getOutletContent()).toContain('<h2>Parent</h2>');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.state.path).toBe('/app/settings');
  });


  it('revokes resolved contributions at an explicit authorization boundary', async () => {
    let allowed = true;
    const protectedRoutes = routesFor(
      'application',
      'protected',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin' || !allowed) return null;
      return { contributions: [protectedRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/admin');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(router.href({ name: 'admin' })).toBe('/admin');

    allowed = false;
    await router.revalidate({ resetResolvedRoutes: true });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'admin' })).toBeNull();
    expect(getOutletContent()).not.toContain('<h3>Settings</h3>');
    expect(resolveRoutes.calls.count()).toBeGreaterThan(1);
  });

  it('restores a revoked contribution when the current destination becomes authorized again', async () => {
    let allowed = true;
    const protectedRoutes = routesFor(
      'application',
      'protected',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin' || !allowed) return null;
      return { contributions: [protectedRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/admin');
    allowed = false;
    await router.revalidate({ resetResolvedRoutes: true });

    allowed = true;
    await router.revalidate({ resetResolvedRoutes: true });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'admin' })).toBe('/admin');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('reloads through the default Waypoint server endpoint and replaces the document', async () => {
    bootstrap([route('/', HomeComponent)] as const satisfies NavigationTree);

    const fetchSpy = spyOn(globalThis, 'fetch').and.resolveTo({
      ok: true,
      status: 200,
      async json() {
        return {
          version: 1,
          location: '/app/settings?section=access',
        };
      },
    } as Response);
    const replaceSpy = spyOn(window.location, 'replace').and.stub();

    const pending = router.reload({
      target: '/app/settings?section=access',
    });
    await Promise.resolve();

    expect(fetchSpy).toHaveBeenCalledWith('/api/navigation/reload', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'reset',
        target: '/app/settings?section=access',
      }),
    });
    expect(replaceSpy).toHaveBeenCalledWith('/app/settings?section=access');
    expect(await Promise.race([
      pending.then(() => 'resolved'),
      Promise.resolve('pending'),
    ])).toBe('pending');
  });

  it('rejects reload when the server does not authorize a replacement document', async () => {
    bootstrap([route('/', HomeComponent)] as const satisfies NavigationTree);

    spyOn(globalThis, 'fetch').and.resolveTo({
      ok: false,
      status: 503,
      async json() {
        return {
          error: 'Navigation artifact unavailable.',
        };
      },
    } as Response);

    await expectAsync(router.reload()).toBeRejectedWithError(
      RouterReloadError,
      /503/,
    );
  });

  it('discards stale resolver results that complete after revocation starts', async () => {
    let release!: (value: ReturnType<typeof routesFor>) => void;
    const stale = new Promise<ReturnType<typeof routesFor>>(resolve => {
      release = resolve;
    });
    const staleContribution = routesFor(
      'application',
      'stale',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    let first = true;
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin') return null;
      if (first) {
        first = false;
        return { contributions: [await stale] };
      }
      return null;
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    const navigation = router.navigate({ path: '/admin' });
    await Promise.resolve();

    const revocation = router.revalidate({ resetResolvedRoutes: true });
    release(staleContribution);

    await navigation;
    await revocation;
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'admin' })).toBeNull();
    expect(getOutletContent()).not.toContain('<h3>Settings</h3>');
  });

  it('fails closed when reauthorization fails after resolved routes are revoked', async () => {
    let fail = false;
    const protectedRoutes = routesFor(
      'application',
      'protected-fail-closed',
      [route('/admin', SettingsComponent, { name: 'admin' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/admin') return null;
      if (fail) throw new Error('authorization service unavailable');
      return { contributions: [protectedRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await navigate('/admin');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');

    fail = true;
    await expectAsync(
      router.revalidate({ resetResolvedRoutes: true }),
    ).toBeRejectedWithError(/authorization service unavailable/);

    expect((router.state.error as Error).message)
      .toContain('authorization service unavailable');
    expect(router.href({ name: 'admin' })).toBeNull();
    expect(getOutletContent()).not.toContain('<h3>Settings</h3>');
  });

  it('retries transient route-resolution failures instead of negative-caching them', async () => {
    let attempts = 0;
    const retryRoutes = routesFor(
      'application',
      'retry-routes',
      [route('/retry', SettingsComponent, { name: 'retry' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/retry') return null;
      attempts++;
      if (attempts === 1) throw new Error('temporary network failure');
      return { contributions: [retryRoutes] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await expectAsync(
      router.navigate({ path: '/retry' }),
    ).toBeRejectedWithError(/temporary network failure/);

    expect(await router.navigate({ path: '/retry' })).toBeTrue();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(attempts).toBe(2);
    expect(router.state.path).toBe('/retry');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('does not let an older slow server resolution navigate after a newer request', async () => {
    let releaseSlow!: () => void;
    const slowGate = new Promise<void>(resolve => {
      releaseSlow = resolve;
    });
    const slowRoutes = routesFor(
      'application',
      'slow-routes',
      [route('/slow', ChildComponent, { name: 'slow' })],
    );
    const fastRoutes = routesFor(
      'application',
      'fast-routes',
      [route('/fast', SettingsComponent, { name: 'fast' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname === '/slow') {
        await slowGate;
        return { contributions: [slowRoutes] };
      }
      if (url.pathname === '/fast') {
        return { contributions: [fastRoutes] };
      }
      return null;
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    const slowNavigation = router.navigate({ path: '/slow' });
    await Promise.resolve();
    const fastNavigation = router.navigate({ path: '/fast' });

    expect(await fastNavigation).toBeTrue();
    releaseSlow();
    expect(await slowNavigation).toBeFalse();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.state.path).toBe('/fast');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
    expect(getOutletContent()).not.toContain('<h3>Child</h3>');
  });

  it('keeps resolved state transactional when a malformed contribution is rejected', async () => {
    let attempt = 0;
    const malformed = routesFor(
      'missing-slot',
      'malformed',
      [route('/dynamic', ChildComponent)],
    );
    const valid = routesFor(
      'application',
      'valid-dynamic',
      [route('/dynamic', SettingsComponent, { name: 'dynamic' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (url: URL) => {
      if (url.pathname !== '/dynamic') return null;
      attempt++;
      return attempt === 1
        ? { contributions: [malformed] }
        : { contributions: [valid] };
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    await expectAsync(
      router.navigate({ path: '/dynamic' }),
    ).toBeRejectedWithError(/unknown route slot/i);

    expect(await router.navigate({ path: '/dynamic' })).toBeTrue();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(router.href({ name: 'dynamic' })).toBe('/dynamic');
    expect(getOutletContent()).toContain('<h3>Settings</h3>');
  });

  it('rejects resolved contributions that collide with authored contribution identity', async () => {
    const authored = routesFor(
      'application',
      'authored-core',
      [route('/static', ChildComponent, { name: 'static' })],
    );
    const conflicting = routesFor(
      'application',
      'authored-core',
      [route('/dynamic', SettingsComponent, { name: 'dynamic' })],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.resolveTo({
      contributions: [conflicting],
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes, contributions: [authored] },
    );

    await expectAsync(
      router.navigate({ path: '/dynamic' }),
    ).toBeRejectedWithError(/conflicts with an authored contribution/i);

    expect(router.href({ name: 'static' })).toBe('/static');
    expect(router.href({ name: 'dynamic' })).toBeNull();
  });


  it('aborts superseded server route resolution work', async () => {
    let slowSignal: AbortSignal | undefined;
    let releaseSlow!: () => void;
    const slowGate = new Promise<void>(resolve => {
      releaseSlow = resolve;
    });
    const slowRoutes = routesFor(
      'application',
      'abort-slow-routes',
      [route('/abort-slow', ChildComponent)],
    );
    const fastRoutes = routesFor(
      'application',
      'abort-fast-routes',
      [route('/abort-fast', SettingsComponent)],
    );
    const resolveRoutes = jasmine.createSpy('resolveRoutes').and.callFake(async (
      url: URL,
      context: { signal: AbortSignal },
    ) => {
      if (url.pathname === '/abort-slow') {
        slowSignal = context.signal;
        await slowGate;
        return { contributions: [slowRoutes] };
      }
      if (url.pathname === '/abort-fast') {
        return { contributions: [fastRoutes] };
      }
      return null;
    });

    bootstrap(
      [route('/', HomeComponent), routeSlot('application')] as const satisfies NavigationTree,
      { resolveRoutes },
    );

    const slowNavigation = router.navigate({ path: '/abort-slow' });
    await Promise.resolve();
    const fastNavigation = router.navigate({ path: '/abort-fast' });

    expect(slowSignal?.aborted).toBeTrue();
    expect(await fastNavigation).toBeTrue();
    releaseSlow();
    expect(await slowNavigation).toBeFalse();
  });

  it('uses frame hooks as the route lifecycle API', async () => {
    const events: string[] = [];

    const routes = [
      route(
        '/home',
        frame(HomeComponent, {
          beforeEnter: [() => {
            events.push('beforeEnter');
            return true;
          }],
          prepare: [() => {
            events.push('prepare');
            return { prepared: true };
          }],
          afterEnter: [() => {
            events.push('afterEnter');
          }],
          beforeLeave: [() => {
            events.push('beforeLeave');
            return true;
          }],
        }),
      ),
      route('/settings', SettingsComponent),
    ] as const satisfies NavigationTree;

    bootstrap(routes);

    await navigate('/home');
    expect(events).toEqual([
      'beforeEnter',
      'prepare',
      'afterEnter',
    ]);

    await navigate('/settings');
    expect(events).toEqual([
      'beforeEnter',
      'prepare',
      'afterEnter',
      'beforeLeave',
    ]);
  });

  it('blocks navigation when a frame beforeEnter hook returns false', async () => {
    const routes = [
      route(
        '/protected',
        frame(HomeComponent, {
          beforeEnter: [() => false],
        }),
      ),
    ] as const satisfies NavigationTree;

    bootstrap(routes);
    await navigate('/protected');

    expect(getOutletContent()).not.toContain('<h1>Home</h1>');
    expect(router.state.path).toBe('');
  });

});
````

## File: README.md
````markdown
# Waypoint tool layout

The Angular builder now lives beside the existing compiler:

```text
projects/tools/
  builder/
  compiler/
```

`builder` is intentionally thin. It owns Angular Architect/workspace orchestration; `compiler` remains responsible for navigation semantics and artifact planning.

The next change should expose the compiler pipeline as a programmatic API and replace the builder's CLI subprocess with a direct call.
````

## File: projects/libraries/waypoint/src/lib/index.ts
````typescript
export * from './navigation-targets';
export { RouterOutlet } from './router-outlet';
export * from './query-schema';
export * from './route-adapter';
export * from './route-builders';
export * from './route-slots';
export { RouterLink } from './router-link';
export * from './navigation-definitions';
export {
  ROUTE,
  ROUTE_CONTEXT,
  Router,
  RouterReloadError,
  type RouterReloadOptions,
  type RouterReloadReason,
  type RouterRevalidationOptions,
} from './router-contract';
export * from './router-events';
export * from './router-url';
export * from './typed-navigation';
export {
  createRouter,
  type ActivatedRoute,
  type DeactivationContext,
  type NavigationContext,
  type NavigationOptions,
  type NavigationPhase,
  type NavigationTransition,
  type NavigationTransitionDefinition,
  type NavigationTransitionFn,
  type PreparedOutlet,
  type PreloadingStrategy,
  type RenderedRouteNode,
  type Route,
  type RouteComponent,
  type RouteData,
  type RouteParams,
  type RouteQuery,
  type RouteRenderContext,
  type Router as VanillaRouter,
  type RouterConfig as VanillaRouterConfig,
  type RouterState,
  type ScrollRestorationMode,
  type VanillaRouterInstance,
  type ViewTransitionContext,
  type ViewTransitionPhase,
  type ViewTransitionsOption,
} from './vanilla-router';
export type {
  NamedRouteDefinition,
  ResolvedNavigationConfiguration,
  RouteResolution,
  RouteResolutionContext,
  RouterOptions,
} from './router';
export {
  provideRouter,
  provideRouter as provideClientRouter,
  provideServerRouter,
} from './router';
````

## File: projects/libraries/waypoint/README.md
````markdown
# Waypoint

> **Server-side routing for Angular.**

Waypoint is an Angular routing library where the server controls which routes
and route artifacts are delivered to the browser.

Traditional client-side routers usually ship the application's route graph and
use guards to decide whether a navigation may continue. Waypoint can keep
protected navigation outside the initial client application: authored routes
are compiled into server metadata and independently deliverable browser
artifacts, authorized on the server, and delivered only when the current client
is allowed to receive them.

Server-side routing in Waypoint is not the same thing as server-side rendering
(SSR). Angular may still render in the browser or use SSR. The term describes
**where route visibility and route-code delivery are controlled**.

---

# Why Waypoint?

Most client routers answer:

> "Can this client activate this route?"

Waypoint can answer an earlier question on the server:

> "Should this client receive this route at all?"

That distinction matters when the route map itself reveals application
structure or when protected route code should not be part of the browser's
initially available application artifacts.

Waypoint is particularly suited to applications with:

- role- or permission-based route delivery
- multi-tenant navigation
- feature licensing
- protected administration areas
- independently owned route branches
- server-controlled application composition

---

# How it works

Author navigation once in TypeScript.

```text
TypeScript navigation
        ↓
Waypoint compiler
        ↓
Semantic navigation model
        ↓
Server authorization metadata + isolated browser artifacts
        ↓
Server authorization
        ↓
Allowed route artifacts
        ↓
Browser runtime
```

The server can resolve the requested URL against generated navigation metadata,
evaluate the route policy, and expose only the artifact required for the
allowed navigation. The browser installs delivered navigation atomically and
revalidates the current URL against its updated configuration.

---

# Highlights

- Server-side route authorization and delivery
- Compiler-generated isolated browser artifacts
- Typed params and query strings
- Function-based navigation lifecycle
- Layout composition
- Route ownership with `routeSlot()` and `routesFor()`
- Named outlets
- Lazy loading
- Standalone Angular
- Atomic runtime configuration
- Explicit revalidation

---

# Installation

```bash
npm install @epikodelabs/waypoint
```

---

# Route authoring

Waypoint keeps the declaration of a destination together:

```ts
const routes = [
  layout('/app', AppShellComponent, [
    route(
      '/projects/:projectId',
      frame(ProjectPage, {
        prepare: [
          context => ({
            project: inject(ProjectStore)
              .load(context.params.projectId),
          }),
        ],
      }),
      {
        paramsSchema: {
          projectId: s.number(),
        },
      },
    ),
  ]),
];
```

A destination can describe its URL, typed schemas, rendering, lifecycle,
identity, policy, and providers without spreading routing behavior across guard
and resolver classes.

---

# Route ownership

Large applications can declare extension boundaries without duplicating one
large route tree.

```ts
export const routes = [
  layout('/app', AppShellComponent, [
    routeSlot('administration'),
  ]),
];
```

A separately owned route set targets that slot:

```ts
export const administrationRoutes = routesFor(
  'administration',
  [
    route('/users', UsersPage, {
      policy: {
        roles: ['admin'],
      },
    }),
  ],
);
```

The compiler preserves ownership and inherited path, layout, provider, and
policy context while deriving server metadata and browser artifacts from the
same authored navigation model.

---

# Core concepts

## `route()`

Defines a navigable destination, including path, params, query, identity,
policy, providers, and rendering metadata.

## `frame()`

Connects a view with navigation lifecycle behavior:

- `beforeLeave`
- `beforeEnter`
- `prepare`
- `afterEnter`

## `layout()`

Adds inherited path, rendering, provider, policy, and lifecycle context for
descendant navigation.

## `routeSlot()` and `routesFor()`

Define stable ownership boundaries for separately authored route branches.
They are navigation-composition concepts and are distinct from named rendering
outlets.

---

# Navigation failure semantics

Navigation promises distinguish expected routing outcomes from execution failures:

- committed navigation resolves `true`;
- blocked, not-found, cancelled/superseded, and ignored same-URL navigation resolve `false`;
- route loading, parsing, preparation, rendering/commit, external-dispatch, and server-delivery failures reject.

A rejection is also reflected in `router.state.error`. Error rendering is best-effort: a failing custom `renderError` cannot replace the original navigation error or leave the navigation promise unsettled. Server-resolution failures remain errors rather than being collapsed into hidden/not-found results, so applications cannot accidentally treat an unavailable authorization service as an authorization denial.

---

# Runtime configuration

Delivered navigation is installed as runtime configuration.

```ts
const changed = router.replaceConfiguration({
  routes,
  transitions,
});

if (changed) {
  await router.revalidate();
}
```

`replaceConfiguration()` replaces the active navigation model atomically.

`revalidate()` explicitly rematches the current URL when permissions, server
state, feature availability, or delivered route configuration changes.

Keeping installation and revalidation separate lets applications coordinate
navigation changes with other application state instead of implicitly forcing a
transition on every configuration update.

---

# Compiler

The Waypoint compiler turns authored TypeScript navigation into a validated,
AST-free semantic model and derives delivery artifacts from it.

The current compiler pipeline includes:

```text
TypeScript source
→ semantic resolution
→ Navigation IR
→ expansion and validation
→ artifact planning
→ isolated browser bundles
→ server index and shards
→ delivery manifest
```

Protected route sets can become independently deliverable browser artifacts.
Generated server metadata retains the path, policy, ownership, dependency, and
artifact information needed to authorize and resolve delivery without shipping
the complete protected route catalog to the client.

---

# Server Delivery Contract v1

The browser/server boundary is a small, versioned Waypoint protocol. A server
resolution returns the artifact containing the requested destination and the
dependency-first list of authorized browser modules needed to complete that
navigation, including internal redirect targets when necessary.

```ts
interface ServerNavigationResolution {
  readonly version: 1;
  readonly artifactKey: string;
  readonly artifacts: readonly {
    readonly artifactKey: string;
    readonly moduleUrl: string;
    readonly hash: string;
  }[];
}
```

Server-only route metadata does not cross this boundary: policies, branch IDs,
route-set ownership, source files, compiler shards, and artifact dependencies
remain on the server. The browser validates the protocol version and shape,
loads the already-authorized artifact plan in order, installs the resulting
`routesFor()` contributions, and revalidates the current URL.

This contract is independent of Express and SSR. Applications can implement the
HTTP transport differently while reusing Waypoint's framework-neutral server
router:

```ts
const source = createServerRouterSnapshotSource({
  loadIndex,
  loadShard,
  revision: readPublishedRevision,
});

const serverRouter = createServerRouter({
  loadSnapshot: source.loadSnapshot,
  moduleUrlFor: artifact =>
    `/api/navigation/modules/${artifact.artifactKey}/${artifact.hash}`,
});

const resolution = await serverRouter.resolve(requestedPath, principal);
```

`createServerRouter()` owns path matching, shard selection, route-set lookup,
internal redirect-chain resolution, dependency ordering, complete-chain
authorization, and construction of the browser delivery plan. Internal redirects
that cross artifact boundaries are followed on the server; every hop and the final
destination must be authorized before any plan is returned.

Waypoint also provides a transport-neutral HTTP layer and an Express adapter:

```ts
const navigation = createExpressServerRouterHandlers({
  router: serverRouter,
  principalFrom: request => request.principal,
  artifactPathFor: artifact => resolveOutputPath(artifact.file),
});

app.get('/api/navigation/resolve', navigation.resolve);
app.get('/api/navigation/modules/:artifactKey/:hash', navigation.module);
```

`createServerRouterHttpHandler()` owns Waypoint's HTTP semantics: malformed
resolution requests, private non-cacheable responses, indistinguishable
unknown/unauthorized routes, module security headers, and safe masking of stale
or unauthorized artifact requests. `createExpressServerRouterHandlers()` only
translates those transport-neutral results to Express request/response objects
and sends an already-authorized file.

The Express adapter has no runtime dependency on Express inside the Waypoint
package. It targets the small structural request/response surface it needs, so
applications keep control over Express versions, authentication middleware,
filesystem layout, and server composition.

Artifact module requests are resolved by `artifactKey + hash`, not emitted
filenames. The server authorizes the complete dependency chain again before it
returns the artifact file to the transport adapter.

### Browser delivery resolver

`createServerNavigationResolver()` is the browser counterpart to the server
router. Independently delivered Angular artifacts are fully AOT-compiled, but
they must still share the exact Angular and Waypoint runtime identities already
running in the host application. Register those module namespaces when the
resolver is created:

```ts
import * as angularCore from '@angular/core';
import * as waypoint from '@epikodelabs/waypoint';

const resolveRoutes = waypoint.createServerNavigationResolver({
  hostModules: {
    '@angular/core': angularCore,
    '@epikodelabs/waypoint': waypoint,
  },
});

provideRouter(routes, {
  resolveRoutes,
});
```

The compiler rewrites host-shared imports in protected artifacts to a small
runtime bridge. This prevents a second Angular runtime, duplicate Waypoint DI
tokens, or duplicate identity-sensitive application services from being bundled
into independently delivered route artifacts. Native artifact imports therefore
require `hostModules`; custom importers may provide their own module-loading
strategy instead.

Application modules whose identity or state must be shared across multiple route
artifacts can use the same mechanism. Give the module a stable bare specifier,
configure that specifier as a compiler host module, include it in the initial host
bundle, and register the exact namespace with the browser resolver. Do **not**
mark protected route/page modules as host modules: host modules are part of the
already-available client runtime and therefore are not protected delivery
boundaries.

The resolver requests one server-authorized delivery plan, validates the wire
contract, loads artifacts in dependency-first order, validates each module as a
`routesFor()` contribution, and returns the contributions for atomic runtime
installation. Artifact imports are deduplicated by `artifactKey + hash`; when a
new hash is published for a stable artifact key, Waypoint drops its own cache
reference to the older delivery identity. Failed imports are evicted so a later
navigation can retry. Superseded route resolutions receive an `AbortSignal`;
Waypoint stops obsolete fetch/import pipelines from returning route contributions
after a newer navigation, revocation, or router disposal. If an artifact URL goes
stale during an atomic compiler publication, the resolver re-resolves the
destination once so it can pick up the newly published content hash.

Applications can override the resolution endpoint, fetch implementation, or
module importer without changing the routing runtime:

```ts
const resolveRoutes = createServerNavigationResolver({
  endpoint: '/internal/navigation/resolve',
  fetch: customFetch,
  importModule: loadModule,
});
```

### Compiler-output snapshots

Production servers should not reread and reparse the server index and shards for
every navigation. `createServerRouterSnapshotSource()` turns compiler output into
one immutable routing generation:

```ts
const source = createServerRouterSnapshotSource({
  loadIndex,
  loadShard,
  revision: readPublishedRevision,
});

const serverRouter = createServerRouter({
  loadSnapshot: source.loadSnapshot,
  moduleUrlFor,
});
```

A snapshot eagerly loads all shards referenced by its index before publication.
Refresh is atomic: a failed or changing generation never replaces the last good
snapshot. With an optional cheap `revision()` function, normal requests reuse the
cached parsed generation and refresh automatically only after compiler output
changes. `refresh()` and `invalidate()` are also available for explicit host
lifecycle integration.

The normative protocol details are documented in
`docs/server-delivery-contract.md`.


## Route revocation

Server-delivered route contributions are active runtime configuration, not permanent
membership in the application route graph. When identity, tenant, licensing, or
permissions change, applications can explicitly cross an authorization boundary:

```ts
await router.revalidate({
  resetResolvedRoutes: true,
});
```

Waypoint then:

1. removes routes and `routesFor()` contributions previously installed through
   `resolveRoutes`;
2. preserves authored routes and authored contributions;
3. clears cached unresolved-route decisions;
4. resolves the current URL against the server again;
5. installs the resulting registry atomically; and
6. revalidates the active destination.

Downloaded JavaScript is not treated as revocable. The browser delivery resolver
may retain content-addressed module caches, while the route contributions exported
by those modules can leave and later re-enter the active navigation model.

This distinction keeps the security boundary precise:

```text
artifact delivery  → whether code may enter the browser
route revocation   → whether delivered code participates in navigation now
```

Ordinary navigation remains additive. A target-scoped server resolution does not
represent the user's complete authorized route catalog, so Waypoint does not
revoke unrelated contributions on every navigation. Revocation happens only when
the application explicitly declares that authorization context has changed.

## Principal replacement

A change of security principal or tenant is a stronger boundary than an ordinary
permission refresh. Waypoint's recommended model is to establish the new principal
on the server, select an authorized landing destination with `resolveLanding()`,
and perform a full document navigation. The new document starts from the public
route-slot skeleton and receives only artifacts authorized for the new principal.

```text
same principal + permissions changed
    → revoke + revalidate

principal / tenant changed
    → server session switch
    → authorized landing
    → full document replace
    → fresh JavaScript realm
```

Downloaded code is not claimed to be erasable from browser caches, but it does not
remain installed in the new application's JavaScript realm. Authorization
boundaries should therefore align with independently deliverable `routesFor()`
artifact boundaries.

---

# Example applications

## Client

Exercises the standalone Waypoint browser runtime, including layouts, lifecycle,
lazy loading, named outlets, and typed navigation.

## Server

Exercises Waypoint's server-side routing model. The browser starts with the
public shell, while protected navigation is resolved against generated server
metadata and loaded from authorized compiler artifacts.

---

# Philosophy

Waypoint keeps application route authoring declarative and moves delivery
complexity into the compiler and server integration.

Applications describe navigation once. The compiler derives the representations
needed by the browser and server without changing the navigation language's
meaning.

---

# Roadmap

- richer compiler diagnostics
- plugin navigation
- artifact visualization
- devtools support
- Routty integration
- Switchboard integration

---

# License

MIT
````

## File: projects/libraries/waypoint/src/lib/router.ts
````typescript
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';

import {
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  InjectionToken,
  inject,
  runInInjectionContext,
  type Provider,
  type Type,
} from '@angular/core';

import { runWithInjector, unwrapDefault } from './adapter-utils';

import type { NamedNavigationTarget, NavigationTarget } from './navigation-targets';

import {
  CompiledRoute,
  CompiledRouteGroup,
  createRouteRegistry,
  type RouteRegistryRecord,
} from './route-compiler';

import {
  composeAngularLeafRouteView,
  composeAngularRouteView,
  type ResolvedRouteView,
} from './route-renderer';

import type {
  FramePrepareFn,
  FrameAfterEnterFn,
  FrameBeforeLeaveFn,
  MaybePromise,
  FrameView,
  LayoutDefinition,
  LayoutOptions,
  RenderableRoute,
  RedirectRouteDefinition,
  RouteDefinition,
  RouteOptions,
  NavigationTree,
  RouteContributionDefinition,
} from './navigation-definitions';

import type { TypedHref, TypedNavigate } from './typed-navigation';
import type { RouteRuntime } from './route-runtime';

import {
  ROUTE,
  ROUTE_CONTEXT,
  Router as RouterContract,
  RouterReloadError,
  type RouterReloadOptions,
  type RouterRevalidationOptions,
} from './router-contract';

import { OUTLET_ACTIVATE_EVENT, dispatchOutletLifecycleEvent } from './router-events';

import { getRouterLocation, isPathInsideBase, resolveRouterUrl, routerHref, stripBaseHref } from './router-url';

import {
  parseParamsRecord,
  parseQueryRecord,
  serializeParams,
  serializeQuery,
  type InferParamType,
  type ParamSchemaRecord,
  type QuerySchemaRecord,
} from './query-schema';

import {
  type CanActivateFn,
  type CanDeactivateFn,
  createRouter,
  type ActivatedRoute,
  type NavigationTransitionFn,
  type NavigationContext,
  type NavigationOptions,
  type NavigationTransitionDefinition,
  type PrepareRouteDataFn,
  type PreloadingStrategy,
  type Route,
  type RedirectRoute as RuntimeRedirectRoute,
  type RenderableRoute as RuntimeRenderableRoute,
  type RouteRenderContext,
  type Router as VanillaRouter,
  type RouterState,
  type ScrollRestorationMode,
  type ViewTransitionsOption,
} from './vanilla-router';

export interface ResolvedNavigationConfiguration {
  readonly routes?: NavigationTree;
  readonly contributions?: readonly RouteContributionDefinition[];
}

export type RouteResolution =
  | NavigationTree
  | ResolvedNavigationConfiguration
  | null
  | undefined;

function isNavigationTreeResolution(
  value: Exclude<RouteResolution, null | undefined>,
): value is NavigationTree {
  return Array.isArray(value);
}

export interface RouteResolutionContext {
  readonly signal: AbortSignal;
}

export interface RouterOptions {
  readonly baseHref?: string;
  readonly enableTracing?: boolean;
  readonly maxRedirects?: number;
  readonly onSameUrlNavigation?: 'ignore';
  readonly scrollRestoration?: ScrollRestorationMode;
  readonly preloading?: PreloadingStrategy;
  readonly viewTransitions?: ViewTransitionsOption;
  readonly namedRoutes?: readonly NamedRouteDefinition[];
  readonly resolveRoutes?: (url: URL, context: RouteResolutionContext) => Promise<RouteResolution>;
  readonly contributions?: readonly RouteContributionDefinition[];
}

export interface NamedRouteDefinition {
  readonly name: string;
  readonly path: string;
  readonly paramsSchema?: ParamSchemaRecord;
  readonly querySchema?: QuerySchemaRecord;
}

interface RouterConfiguration<
  TRoutes extends NavigationTree = NavigationTree,
> extends RouterOptions {
  routes: TRoutes;
}

const ROUTER_CONFIGURATION = new InjectionToken<RouterConfiguration>('ROUTER_CONFIGURATION');

const EMPTY_ROUTER_STATE: RouterState = Object.freeze({
  current: null,
  pending: false,
  phase: null,
  error: null,
  path: '',
  params: Object.freeze({}),
  query: Object.freeze({}),
  data: Object.freeze({}),
  historyState: null,
  routeConfig: null,
});

const lazyComponents = new WeakMap<object, Promise<Type<unknown>>>();

function loadComponent(owner: LayoutDefinition | RenderableRoute): Promise<Type<unknown>> {
  if (owner.component) {
    return Promise.resolve(owner.component);
  }

  if (!owner.loadComponent) {
    return Promise.reject(new Error('A route view must define component or loadComponent.'));
  }

  let pending = lazyComponents.get(owner);

  if (!pending) {
    pending = Promise.resolve(owner.loadComponent())
      .then((value) =>
        unwrapDefault<Type<unknown>>(value as Type<unknown> | { readonly default: Type<unknown> }),
      )
      .then((component) => {
        if (!component) {
          throw new Error('Lazy component loader returned no component.');
        }

        return component;
      })
      .catch((error) => {
        lazyComponents.delete(owner);

        throw error;
      });

    lazyComponents.set(owner, pending);
  }

  return pending;
}

function snapshotRouterState(state: RouterState): RouterState {
  return Object.freeze({
    current: state.current ?? null,
    pending: state.pending ?? false,
    phase: state.phase ?? null,
    error: state.error ?? null,
    path: state.path ?? '',
    params: state.params ? Object.freeze({ ...state.params }) : Object.freeze({}),
    query: state.query ? Object.freeze({ ...state.query }) : Object.freeze({}),
    data: state.data ? Object.freeze({ ...state.data }) : Object.freeze({}),
    historyState: state.historyState ?? null,
    routeConfig: state.routeConfig ?? null,
  });
}

function readReloadLocation(payload: unknown): string {
  if (
    !payload
    || typeof payload !== 'object'
    || (payload as { version?: unknown }).version !== 1
    || typeof (payload as { location?: unknown }).location !== 'string'
  ) {
    throw new Error('Server returned an invalid Waypoint reload response.');
  }

  const location = (payload as { location: string }).location;
  if (!location.startsWith('/') || location.startsWith('//')) {
    throw new Error('Server returned an unsafe Waypoint reload location.');
  }

  return location;
}

function execute<TContext, TResult>(
  injector: EnvironmentInjector,
  handler: (context: TContext) => MaybePromise<TResult>,
  context: TContext,
): Promise<TResult> {
  return runWithInjector(injector, handler, context);
}

function adaptFrameBeforeEnter(
  handler: CanActivateFn,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) =>
    execute(injector, handler, {
      ...transition.to,
      signal: transition.signal,
    });
}

function adaptFrameBeforeLeave(
  handler: FrameBeforeLeaveFn<any>,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) => {
    if (!transition.from) {
      return true;
    }

    return execute(injector, handler, {
      ...transition.from,
      nextUrl: transition.to.url,
      signal: transition.signal,
    });
  };
}

function adaptFramePrepare(
  handler: FramePrepareFn,
  injector: EnvironmentInjector,
): PrepareRouteDataFn {
  return (route) => execute(injector, handler, route);
}

function adaptFrameAfterEnter(
  handler: FrameAfterEnterFn<any>,
  injector: EnvironmentInjector,
): NavigationTransitionFn {
  return (transition) => execute(injector, handler, transition.to);
}

function collectEnterFrames(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): readonly FrameView<any>[] {
  return Object.freeze([
    ...layouts.map((layout) => layout.frame).filter((frame): frame is FrameView<any> => !!frame),
    ...(route.frame ? [route.frame] : []),
  ]);
}

function collectLeaveFrames(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): readonly FrameView<any>[] {
  const routeFrames = route.frame ? [route.frame] : [];
  const layoutFrames = layouts
    .map((layout) => layout.frame)
    .filter((frame): frame is FrameView<any> => !!frame)
    .reverse();

  return Object.freeze([...routeFrames, ...layoutFrames]);
}

function adaptFramePreparers(
  frames: readonly FrameView<any>[],
  injector: EnvironmentInjector,
): readonly PrepareRouteDataFn[] | undefined {
  const handlers = frames.flatMap(
    (frame) => frame.prepare?.map((handler) => adaptFramePrepare(handler, injector)) ?? [],
  );

  return handlers.length > 0 ? Object.freeze(handlers) : undefined;
}

function adaptFrameTransitions(
  groups: readonly CompiledRouteGroup[],
  injector: EnvironmentInjector,
): readonly NavigationTransitionDefinition[] {
  const transitions: NavigationTransitionDefinition[] = [];

  for (const group of groups) {
    const primaryRoute = group.primary.route;

    if (primaryRoute.kind === 'redirect') {
      continue;
    }

    const renderableRoute = primaryRoute;
    const enterFrames = collectEnterFrames(group.layouts, renderableRoute);
    const leaveFrames = collectLeaveFrames(group.layouts, renderableRoute);

    for (const current of enterFrames) {
      if (!current.beforeEnter?.length && !current.afterEnter?.length) {
        continue;
      }

      transitions.push({
        to: (route) => route?.config.sourceRoute === primaryRoute,
        beforeEnter: current.beforeEnter?.map((handler) =>
          adaptFrameBeforeEnter(handler, injector),
        ),
        afterEnter: current.afterEnter?.map((handler) => adaptFrameAfterEnter(handler, injector)),
      });
    }

    for (const current of leaveFrames) {
      if (!current.beforeLeave?.length) {
        continue;
      }

      transitions.push({
        from: (route) => route?.config.sourceRoute === primaryRoute,
        beforeLeave: current.beforeLeave.map((handler) => adaptFrameBeforeLeave(handler, injector)),
      });
    }
  }

  return transitions;
}

function adaptParamsParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): RouteRuntime['parseParams'] {
  const schema = route.paramsSchema;
  if (!schema) return undefined;

  return (params, _url, _signal) =>
    runInInjectionContext(injector, () => Promise.resolve(parseParamsRecord(schema, params)));
}

function adaptQueryParser(
  route: RenderableRoute,
  injector: EnvironmentInjector,
): RouteRuntime['parseQuery'] {
  const schema = route.querySchema;
  if (!schema) return undefined;

  return (url, _signal) =>
    runInInjectionContext(injector, () => Promise.resolve(parseQueryRecord(schema, url)));
}

async function resolveViews(
  layouts: readonly LayoutDefinition[],
  route: RenderableRoute,
): Promise<readonly ResolvedRouteView[]> {
  const resolvedLayouts = await Promise.all(
    layouts.map(async (layout, index) => ({
      component: await loadComponent(layout),
      providers: (layout.providers ?? []).flat().filter((p) => p),
      label: `LayoutDefinition(${layout.path || index})`,
    })),
  );

  const page = await loadComponent(route);

  return Object.freeze([
    ...resolvedLayouts,
    {
      component: page,
      providers: (route.providers ?? []).flat().filter((p) => p),
      label: `RouteDefinition(${route.path})`,
    },
  ]);
}

function adaptRoute(
  route: RedirectRouteDefinition,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): RuntimeRedirectRoute;
function adaptRoute(
  route: RenderableRoute,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): RuntimeRenderableRoute;
function adaptRoute(
  route: RouteDefinition,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route;
function adaptRoute(
  route: RouteDefinition,
  path: string,
  redirectTo: string | undefined,
  layouts: readonly LayoutDefinition[],
  sharedPreparers: readonly PrepareRouteDataFn[] | undefined,
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route {
  if (route.kind === 'redirect') {
    if (!redirectTo) {
      throw new Error(`Compiled redirect route "${path}" has no redirect target.`);
    }

    const runtimeRedirect: RuntimeRedirectRoute = {
      kind: 'redirect',
      name: route.name,
      path,
      sourceRoute: route,
      redirectTo,
      data: route.data ? { ...route.data } : undefined,
    };

    return runtimeRedirect;
  }

  const tokens = {
    routeToken: ROUTE,
    contextToken: ROUTE_CONTEXT,
  } as const;

  const runtimeRoute: RuntimeRenderableRoute = {
    kind: 'route',
    name: route.name,
    path,
    outlet: route.outlet,
    sourceRoute: route,
    data: route.data ? { ...route.data } : undefined,
    preload: route.preload,
    viewTransition: route.viewTransition,

    load: async () => {
      const views = await resolveViews(layouts, route);

      return {
        component: route.outlet
          ? composeAngularLeafRouteView(appRef, documentRef, injector, tokens, views)
          : composeAngularRouteView(appRef, documentRef, injector, tokens, views),
        prepare: [
          ...(sharedPreparers ?? []),
          ...(adaptFramePreparers(
            route.frame ? [route.frame] : [],
            injector,
          ) ?? []),
        ],
        parseParams: adaptParamsParser(route, injector),
        parseQuery: adaptQueryParser(route, injector),
      };
    },
  };

  return runtimeRoute;
}

function adaptRoutes(
  groups: readonly CompiledRouteGroup[],
  appRef: ApplicationRef,
  documentRef: Document,
  injector: EnvironmentInjector,
): Route[] {
  return groups.map((group): Route => {
    const sharedPreparers = adaptFramePreparers(
      group.layouts
        .map(layout => layout.frame)
        .filter((frame): frame is FrameView<any> => !!frame),
      injector,
    );

    const authoredPrimary =
      group.primary.route;

    if (authoredPrimary.kind === 'redirect') {
      if (group.outlets.length > 0) {
        throw new Error(
          `A redirect route cannot have named outlets. Path: "${group.path}"`,
        );
      }

      return adaptRoute(
        authoredPrimary,
        group.path,
        group.primary.redirectTo,
        group.layouts,
        sharedPreparers,
        appRef,
        documentRef,
        injector,
      );
    }

    const primary = adaptRoute(
      authoredPrimary,
      group.path,
      group.primary.redirectTo,
      group.layouts,
      sharedPreparers,
      appRef,
      documentRef,
      injector,
    );

    const outlets = group.outlets.map(
      (compiled): RuntimeRenderableRoute => {
        const authoredOutlet =
          compiled.route;

        if (authoredOutlet.kind === 'redirect') {
          throw new Error(
            `Named outlet routes cannot be redirects. Path: "${group.path}"`,
          );
        }

        return adaptRoute(
          authoredOutlet,
          group.path,
          compiled.redirectTo,
          group.layouts,
          sharedPreparers,
          appRef,
          documentRef,
          injector,
        );
      },
    );

    return outlets.length === 0
      ? primary
      : {
          ...primary,
          outlets: Object.freeze(outlets),
        };
  });
}

function replaceChildNodes(
  target: Node & {
    replaceChildren?: (...nodes: Node[]) => void;
    firstChild: ChildNode | null;
    removeChild(node: ChildNode): void;
    appendChild<T extends Node>(node: T): T;
  },
  ...nodes: Node[]
): void {
  if (typeof target.replaceChildren === 'function') {
    target.replaceChildren(...nodes);
    return;
  }

  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }

  for (const node of nodes) {
    target.appendChild(node);
  }
}

function interpolateNamedPath(
  template: string,
  params: Readonly<Record<string, unknown>>,
  schema: ParamSchemaRecord | undefined,
): string | null {
  const serialized = schema
    ? serializeParams(schema, params as unknown as InferParamType<ParamSchemaRecord>)
    : Object.fromEntries(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)]),
      );

  const missing = new Set<string>();

  const path = template.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_match, key: string) => {
    const value = serialized[key];

    if (value === undefined) {
      missing.add(key);
      return `:${key}`;
    }

    return encodeURIComponent(value);
  });

  if (missing.size > 0) {
    return null;
  }

  return path;
}

export class ServerRouter<TRoutes extends NavigationTree = any>
  extends RouterContract<TRoutes> {
  private readonly appRef: ApplicationRef;
  private readonly injector: EnvironmentInjector;
  private readonly destroyRef: DestroyRef;
  private readonly document: Document;
  private readonly appBaseHref: string;
  private registry: ReturnType<typeof createRouteRegistry>;
  private readonly namedRouteCatalog = new Map<string, NamedRouteDefinition>();
  private readonly resolvingRouteKeys = new Map<string, Promise<boolean>>();
  private readonly resolvingRouteControllers = new Map<string, AbortController>();
  private readonly preResolvedNavigationKeys = new Set<string>();
  private preResolvingNavigationCount = 0;
  private readonly unresolvedRouteKeys = new Set<string>();
  private resolvedRoutes: NavigationTree = Object.freeze([]);
  private readonly resolvedContributionsById = new Map<string, RouteContributionDefinition>();
  private resolutionGeneration = 0;
  private navigationRequestId = 0;
  private engine: VanillaRouter | null = null;
  private engineStartupTask: Promise<void> | null = null;
  private currentState: RouterState = EMPTY_ROUTER_STATE;
  private readonly outlets = new Map<string, HTMLElement[]>();
  private readonly notFoundRecoveryTasks = new Map<string, Promise<void>>();
  private tickQueued = false;

  public readonly navigateTo: TypedNavigate<TRoutes>;
  public readonly hrefTo: TypedHref<TRoutes>;

  constructor(private configuration: RouterConfiguration<TRoutes>) {
    super();
    this.appRef = inject(ApplicationRef);
    this.injector = inject(EnvironmentInjector);
    this.destroyRef = inject(DestroyRef);
    this.document = inject(DOCUMENT);
    this.appBaseHref =
      inject(APP_BASE_HREF, {
        optional: true,
      }) ?? '/';

    this.registry = createRouteRegistry(
      this.configuration.routes,
      this.configuration.contributions,
    );
    for (const route of this.configuration.namedRoutes ?? []) {
      this.namedRouteCatalog.set(route.name, route);
    }
    this.navigateTo = this.createNavigateProxy();

    this.hrefTo = this.createHrefProxy();

    this.destroyRef.onDestroy(() => this.dispose());
  }

  get active(): boolean {
    return this.engine !== null;
  }

  get state(): RouterState {
    return this.currentState;
  }

  get displayUrl(): string {
    const location = getRouterLocation(this.document);

    return `${location.pathname}${location.search}${location.hash}`;
  }

  connect(name: string, outlet: HTMLElement): void {
    const outletName = name.trim();

    const registered = this.outlets.get(outletName) ?? [];

    if (registered.includes(outlet)) {
      return;
    }

    registered.push(outlet);

    this.outlets.set(outletName, registered);

    if (this.engine || this.engineStartupTask) {
      return;
    }

    this.startEngine();
    return;

    const engine = createRouter({
      routes: adaptRoutes(this.registry.groups, this.appRef, this.document, this.injector),

      baseHref: this.baseHref,

      enableTracing: this.configuration.enableTracing,

      maxRedirects: this.configuration.maxRedirects,

      onSameUrlNavigation: this.configuration.onSameUrlNavigation,

      scrollRestoration: this.configuration.scrollRestoration,

      preloading: this.configuration.preloading,

      transitions: [...adaptFrameTransitions(this.registry.groups, this.injector)],

      viewTransitions: this.configuration.viewTransitions,

      render: (targetName, node) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          throw new Error(`Router outlet "${targetName}" is not connected.`);
        }

        replaceChildNodes(target, node);
      },

      commit: (outlets) => {
        // First phase: validate all outlets exist before any DOM mutation.
        for (const outlet of outlets) {
          if (!this.outlets.has(outlet.name)) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }
        }

        // Second phase: perform synchronous DOM mutations.
        for (const outlet of outlets) {
          const target = this.getOutlet(outlet.name);

          if (!target) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }

          replaceChildNodes(target, outlet.node);
          dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, outlet.component);
        }
      },

      renderNotFound: (targetName, url, _router) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          return;
        }

        const heading = this.document.createElement('h1');

        heading.textContent = '404 — Page Not Found';

        replaceChildNodes(target, heading);

        if (this.shouldResolveNotFoundUrl(url)) {
          this.scheduleNotFoundRecovery(url);
        }
      },

      renderError: (targetName, _error, _router) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          return;
        }

        const heading = this.document.createElement('h1');

        heading.textContent = 'Page failed to load';

        replaceChildNodes(target, heading);
      },

      onStateChange: (state) => {
        this.currentState = snapshotRouterState(state);
        this.requestTick();
      },

      onOutletActivate: (target, component) => {
        dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, component);
      },
    });

    try {
      engine.start();
    } catch (error) {
      this.outlets.delete(outletName);
      engine.dispose();
      throw error;
    }

    this.engine = engine;

    this.currentState = snapshotRouterState(engine.state);
    this.requestTick();
  }

  disconnect(name: string, outlet: HTMLElement): void {
    const outletName = name.trim();

    const registered = this.outlets.get(outletName);

    if (!registered) {
      return;
    }

    const index = registered.lastIndexOf(outlet);

    if (index < 0) {
      return;
    }

    registered.splice(index, 1);

    if (registered.length === 0) {
      this.outlets.delete(outletName);
    }

    if (this.outlets.size === 0) {
      this.dispose();
    }
  }

  navigate(target: NavigationTarget, options?: NavigationOptions): Promise<boolean> {
    return this.navigateResolved(target, options);
  }

  href(target: NavigationTarget | null | undefined): string | null {
    if (target === null || target === undefined) {
      return null;
    }

    if (typeof target === 'string' || target instanceof URL) {
      return this.resolveHref(target);
    }

    if ('path' in target) {
      return this.resolveHref(target.path);
    }

    if ('name' in target) {
      return this.generateNamedHref(target);
    }

    return null;
  }

  async revalidate(options: RouterRevalidationOptions = {}): Promise<boolean> {
    if (!options.resetResolvedRoutes) {
      try {
        return await this.requireEngine().revalidate();
      } catch (error) {
        this.recordNavigationError(error);
        throw error;
      }
    }

    this.resolutionGeneration++;
    this.navigationRequestId++;
    this.resolvedRoutes = Object.freeze([]);
    this.resolvedContributionsById.clear();
    this.unresolvedRouteKeys.clear();
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
    this.rebuildResolvedRegistry();

    const location = getRouterLocation(this.document);
    const url = resolveRouterUrl(
      `${location.pathname}${location.search}${location.hash}`,
      this.baseHref,
      location,
      'navigate',
    );

    try {
      if (
        this.configuration.resolveRoutes
        && url.origin === location.origin
        && isPathInsideBase(url.pathname, this.baseHref)
      ) {
        await this.resolveRoutesForUrl(url, { force: true, install: false });
      }

      return await this.installCurrentRegistry();
    } catch (error) {
      // Revocation is the fail-closed half of an authorization-boundary change.
      // Even when reauthorization cannot be completed, the engine must stop
      // using the previously delivered protected configuration.
      try {
        await this.installCurrentRegistry();
      } catch {
        // Preserve the first failure as the actionable error. The engine
        // configuration was already replaced before its revalidation started.
      }
      this.recordNavigationError(error);
      throw error;
    }
  }

  async reload(options: RouterReloadOptions = {}): Promise<never> {
    const response = await fetch('/api/navigation/reload', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: options.reason ?? 'reset',
        target: options.target ?? this.displayUrl,
      }),
    });

    if (!response.ok) {
      throw new RouterReloadError(response.status);
    }

    const payload: unknown = await response.json();
    window.location.replace(readReloadLocation(payload));

    return new Promise<never>(() => {});
  }

  updateHistoryState(state: unknown): void {
    this.requireEngine().updateHistoryState(state);
  }

  preload(): Promise<void> {
    return this.requireEngine().preload();
  }

  dispose(): void {
    const engine = this.engine;

    this.resolutionGeneration++;
    this.navigationRequestId++;
    this.abortResolvedRouteRequests();
    this.resolvingRouteKeys.clear();
    this.engineStartupTask = null;
    this.notFoundRecoveryTasks.clear();
    this.engine = null;
    this.outlets.clear();

    engine?.dispose();

    this.currentState = EMPTY_ROUTER_STATE;
    this.requestTick();
  }

  private get baseHref(): string {
    return this.configuration.baseHref ?? this.appBaseHref;
  }

  private recordNavigationError(error: unknown): void {
    const state = this.engine
      ? snapshotRouterState(this.engine.state)
      : this.currentState;

    this.currentState = Object.freeze({
      ...state,
      error,
    });
    this.requestTick();
  }

  private requireEngine(): VanillaRouter {
    if (!this.engine) {
      throw new Error('Router has no active outlet.');
    }

    return this.engine;
  }

  private resolveHref(target: string | URL): string {
    return routerHref(resolveRouterUrl(target, this.baseHref, getRouterLocation(this.document), 'href'));
  }

  private generateNamedHref(target: NamedNavigationTarget): string | null {
    const record = this.readNamedRouteRecord(target.name);

    if (!record) {
      return null;
    }

    if ('kind' in record.route && record.route.kind === 'redirect') {
      return null;
    }

    const path = interpolateNamedPath(
      record.fullPath,
      target.params ?? {},
      record.route.paramsSchema,
    );

    if (!path) {
      return null;
    }

    const query =
      record.route.querySchema && target.query
        ? serializeQuery(record.route.querySchema, target.query)
        : '';

    return this.resolveHref(`${path}${query}`);
  }

  private async navigateResolved(
    target: NavigationTarget,
    options?: NavigationOptions,
  ): Promise<boolean> {
    this.preResolvingNavigationCount++;
    try {
      const requestId = ++this.navigationRequestId;
      const resolutionGeneration = this.resolutionGeneration;
      const href = this.href(target);

      if (href === null) {
        return false;
      }

      const location = getRouterLocation(this.document);
      const url = resolveRouterUrl(href, this.baseHref, location, 'navigate');
      const key = stripBaseHref(url.pathname, this.baseHref);

      if (url.origin === location.origin && isPathInsideBase(url.pathname, this.baseHref)) {
        this.abortResolvedRouteRequests(key);
        const resolved = await this.resolveRoutesForUrl(url, { install: false });
        if (resolved) {
          await this.installCurrentRegistry({ revalidate: false });
          this.preResolvedNavigationKeys.add(key);
        }
      }

      if (
        requestId !== this.navigationRequestId
        || resolutionGeneration !== this.resolutionGeneration
      ) {
        return false;
      }

      try {
        return await this.requireEngine().navigate(href, options);
      } finally {
        this.preResolvedNavigationKeys.delete(key);
      }
    } catch (error) {
      this.recordNavigationError(error);
      throw error;
    } finally {
      this.preResolvingNavigationCount--;
    }
  }

  private readNamedRouteRecord(name: string):
    | RouteRegistryRecord
    | {
        readonly route: Pick<RenderableRoute, 'paramsSchema' | 'querySchema'>;
        readonly fullPath: string;
      }
    | undefined {
    const existing = this.registry.namedRoutes.get(name);

    if (existing) {
      return existing;
    }

    const deferred = this.namedRouteCatalog.get(name);

    if (!deferred) {
      return undefined;
    }

    return {
      fullPath: deferred.path,
      route: {
        paramsSchema: deferred.paramsSchema,
        querySchema: deferred.querySchema,
      },
    };
  }

  private matchesRegisteredRoute(url: URL): boolean {
    const path = stripBaseHref(url.pathname, this.baseHref);

    return this.registry.groups.some((group) => matchesCompiledPath(group.path, path));
  }

  private async resolveRoutesForUrl(
    url: URL,
    options: Readonly<{ force?: boolean; install?: boolean }> = {},
  ): Promise<boolean> {
    if (!this.configuration.resolveRoutes) {
      return false;
    }

    if (!options.force && this.matchesRegisteredRoute(url)) {
      return false;
    }

    const key = stripBaseHref(url.pathname, this.baseHref);

    if (!options.force && this.unresolvedRouteKeys.has(key)) {
      return false;
    }

    const pending = this.resolvingRouteKeys.get(key);

    if (pending && !options.force) {
      return pending;
    }

    if (options.force) {
      this.resolvingRouteControllers.get(key)?.abort();
    }

    const controller = new AbortController();
    this.resolvingRouteControllers.set(key, controller);
    const generation = this.resolutionGeneration;
    let resolution!: Promise<boolean>;
    resolution = Promise.resolve(this.configuration.resolveRoutes(url, {
      signal: controller.signal,
    }))
      .then(async (resolved) => {
        if (generation !== this.resolutionGeneration) {
          return false;
        }

        if (!resolved || !this.mergeResolvedNavigation(resolved)) {
          this.unresolvedRouteKeys.add(key);
          return false;
        }

        this.unresolvedRouteKeys.delete(key);
        if (options.install !== false) {
          await this.installCurrentRegistry();
        }
        return true;
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return false;
        }
        // A transport/import failure is not evidence that the route does not
        // exist. Do not poison the negative-resolution cache; a later
        // navigation should be allowed to retry without an authorization reset.
        throw error;
      })
      .finally(() => {
        if (this.resolvingRouteKeys.get(key) === resolution) {
          this.resolvingRouteKeys.delete(key);
        }
        if (this.resolvingRouteControllers.get(key) === controller) {
          this.resolvingRouteControllers.delete(key);
        }
      });

    this.resolvingRouteKeys.set(key, resolution);

    return resolution;
  }


  private abortResolvedRouteRequests(exceptKey?: string): void {
    for (const [key, controller] of this.resolvingRouteControllers) {
      if (key === exceptKey) continue;
      controller.abort();
      this.resolvingRouteControllers.delete(key);
    }
  }

  private mergeResolvedNavigation(resolved: Exclude<RouteResolution, null | undefined>): boolean {
    const routes = isNavigationTreeResolution(resolved)
      ? resolved
      : resolved.routes ?? Object.freeze([]);
    const incomingContributions = isNavigationTreeResolution(resolved)
      ? Object.freeze([] as RouteContributionDefinition[])
      : resolved.contributions ?? Object.freeze([]);

    if (routes.length === 0 && incomingContributions.length === 0) {
      return false;
    }

    const nextRoutes = routes.length > 0
      ? Object.freeze([
          ...this.resolvedRoutes,
          ...routes,
        ]) as NavigationTree
      : this.resolvedRoutes;
    const nextContributions = new Map(this.resolvedContributionsById);
    const authoredContributionIds = new Set(
      (this.configuration.contributions ?? []).map(contribution => contribution.id),
    );

    for (const contribution of incomingContributions) {
      if (authoredContributionIds.has(contribution.id)) {
        throw new Error(
          `Resolved route contribution "${contribution.id}" conflicts with an authored contribution.`,
        );
      }
      nextContributions.set(contribution.id, contribution);
    }

    // Build and validate the complete candidate registry before mutating any
    // resolved state. Malformed or conflicting artifacts therefore cannot leave
    // a half-installed dynamic configuration behind.
    const nextRegistry = this.createResolvedRegistry(
      nextRoutes,
      nextContributions,
    );

    this.resolvedRoutes = nextRoutes;
    this.resolvedContributionsById.clear();
    for (const [id, contribution] of nextContributions) {
      this.resolvedContributionsById.set(id, contribution);
    }
    this.registry = nextRegistry;
    return true;
  }

  private rebuildResolvedRegistry(): void {
    this.registry = this.createResolvedRegistry(
      this.resolvedRoutes,
      this.resolvedContributionsById,
    );
  }

  private createResolvedRegistry(
    resolvedRoutes: NavigationTree,
    resolvedContributions: ReadonlyMap<string, RouteContributionDefinition>,
  ): ReturnType<typeof createRouteRegistry> {
    const routes = Object.freeze([
      ...this.configuration.routes,
      ...resolvedRoutes,
    ]) as TRoutes;
    const contributionsById = new Map(
      (this.configuration.contributions ?? []).map(contribution => [
        contribution.id,
        contribution,
      ] as const),
    );

    for (const [id, contribution] of resolvedContributions) {
      contributionsById.set(id, contribution);
    }

    return createRouteRegistry(
      routes,
      Object.freeze([...contributionsById.values()]),
    );
  }

  private async installCurrentRegistry(
    options: Readonly<{ revalidate?: boolean }> = {},
  ): Promise<boolean> {
    const engine = this.engine;

    if (!engine) {
      return false;
    }

    engine.replaceConfiguration({
      routes: adaptRoutes(
        this.registry.groups,
        this.appRef,
        this.document,
        this.injector,
      ),
      transitions: adaptFrameTransitions(
        this.registry.groups,
        this.injector,
      ),
    });

    if (options.revalidate === false) {
      return true;
    }

    return engine.revalidate();
  }

  private scheduleNotFoundRecovery(url: URL): void {
    const key = url.href;

    if (this.notFoundRecoveryTasks.has(key)) {
      return;
    }

    let task!: Promise<void>;
    task = Promise.resolve()
      .then(async () => {
        const resolved = await this.resolveRoutesForUrl(url, { install: false });

        if (!resolved) {
          return;
        }

        await this.installCurrentRegistry();
      })
      .catch((error) => {
        this.recordNavigationError(error);
      })
      .finally(() => {
        if (this.notFoundRecoveryTasks.get(key) === task) {
          this.notFoundRecoveryTasks.delete(key);
        }
      });

    this.notFoundRecoveryTasks.set(key, task);
  }

  private startEngine(): void {
    let task!: Promise<void>;
    task = Promise.resolve()
      .then(async () => {
        const location = getRouterLocation(this.document);
        const url = new URL(location.href);

        if (
          this.configuration.resolveRoutes
          && url.origin === location.origin
          && isPathInsideBase(url.pathname, this.baseHref)
        ) {
          await this.resolveRoutesForUrl(url, { install: false });
        }

        if (
          this.engineStartupTask !== task
          || this.engine
          || this.outlets.size === 0
        ) {
          return;
        }

        const engine = this.createEngine();

        try {
          engine.start();
        } catch (error) {
          engine.dispose();
          throw error;
        }

        if (this.engineStartupTask !== task) {
          engine.dispose();
          return;
        }

        this.engine = engine;
        this.currentState = snapshotRouterState(engine.state);
        this.requestTick();
      })
      .catch((error) => {
        if (this.engineStartupTask === task) {
          this.recordNavigationError(error);
        }
      })
      .finally(() => {
        if (this.engineStartupTask === task) {
          this.engineStartupTask = null;
        }
      });

    this.engineStartupTask = task;
  }

  private createEngine(): VanillaRouter {
    return createRouter({
      routes: adaptRoutes(this.registry.groups, this.appRef, this.document, this.injector),

      baseHref: this.baseHref,

      enableTracing: this.configuration.enableTracing,

      maxRedirects: this.configuration.maxRedirects,

      onSameUrlNavigation: this.configuration.onSameUrlNavigation,

      scrollRestoration: this.configuration.scrollRestoration,

      preloading: this.configuration.preloading,

      transitions: [...adaptFrameTransitions(this.registry.groups, this.injector)],

      viewTransitions: this.configuration.viewTransitions,

      render: (targetName, node) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          throw new Error(`Router outlet "${targetName}" is not connected.`);
        }

        replaceChildNodes(target, node);
      },

      commit: (outlets) => {
        for (const outlet of outlets) {
          if (!this.outlets.has(outlet.name)) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }
        }

        for (const outlet of outlets) {
          const target = this.getOutlet(outlet.name);

          if (!target) {
            throw new Error(`Router outlet "${outlet.name}" is not connected.`);
          }

          replaceChildNodes(target, outlet.node);
          dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, outlet.component);
        }
      },

      renderNotFound: (targetName, url, _router) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          return;
        }

        const heading = this.document.createElement('h1');

        heading.textContent = '404 — Page Not Found';

        replaceChildNodes(target, heading);

        if (this.shouldResolveNotFoundUrl(url)) {
          this.scheduleNotFoundRecovery(url);
        }
      },

      renderError: (targetName, _error, _router) => {
        const target = this.getOutlet(targetName);

        if (!target) {
          return;
        }

        const heading = this.document.createElement('h1');

        heading.textContent = 'Page failed to load';

        replaceChildNodes(target, heading);
      },

      onStateChange: (state) => {
        this.currentState = snapshotRouterState(state);
        this.requestTick();
      },

      onOutletActivate: (target, component) => {
        dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, component);
      },
    });
  }

  private createNavigateProxy(): TypedNavigate<TRoutes> {
    return new Proxy(Object.create(null), {
      get: (_target, property) => {
        if (typeof property !== 'string' || property === 'then') {
          return undefined;
        }

        return (options: Record<string, unknown> = {}) =>
          this.navigate({
            name: property,
            ...options,
          } as NamedNavigationTarget);
      },
    }) as TypedNavigate<TRoutes>;
  }

  private createHrefProxy(): TypedHref<TRoutes> {
    return new Proxy(Object.create(null), {
      get: (_target, property) => {
        if (typeof property !== 'string' || property === 'then') {
          return undefined;
        }

        return (options: Record<string, unknown> = {}) =>
          this.href({
            name: property,
            ...options,
          } as NamedNavigationTarget);
      },
    }) as TypedHref<TRoutes>;
  }

  private getOutlet(name: string): HTMLElement | null {
    const registered = this.outlets.get(name.trim());

    return registered?.[registered.length - 1] ?? null;
  }

  private requestTick(): void {
    if (this.tickQueued) {
      return;
    }

    this.tickQueued = true;

    queueMicrotask(() => {
      this.tickQueued = false;

      if (!this.engine) {
        return;
      }

      this.appRef.tick();
    });
  }

  private shouldResolveNotFoundUrl(url: URL): boolean {
    if (this.preResolvingNavigationCount > 0) {
      return false;
    }
    if (this.preResolvedNavigationKeys.size > 0) {
      return false;
    }
    const path = stripBaseHref(url.pathname, this.baseHref);
    return this.navigationRequestId > 0
      || path !== '/'
      || url.search.length > 0
      || url.hash.length > 0;
  }
}

function matchesCompiledPath(pattern: string, pathname: string): boolean {
  const regex = new RegExp(
    `^${pattern
      .split('/')
      .map((segment) => {
        if (!segment) {
          return '';
        }

        return segment.startsWith(':') ? '[^/]+' : segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      })
      .join('/')}$`,
  );

  return regex.test(pathname);
}

export function provideRouter<const TRoutes extends NavigationTree>(
  routes: TRoutes,
  options: RouterOptions = {},
): Provider[] {
  const config: RouterConfiguration<TRoutes> = {
    ...options,
    routes,
  };

  return [
    {
      provide: ROUTER_CONFIGURATION,
      useValue: config,
    },
    {
      provide: ServerRouter,
      useFactory: (configuration: RouterConfiguration<TRoutes>) =>
        new ServerRouter<TRoutes>(configuration),
      deps: [ROUTER_CONFIGURATION],
    },
    {
      provide: RouterContract,
      useExisting: ServerRouter,
    },
  ];
}

export const provideServerRouter = provideRouter;

export { type LayoutOptions, type RouteOptions };

export { layout, lazyLayout, lazyRoute, redirectRoute, route } from './route-builders';
````
