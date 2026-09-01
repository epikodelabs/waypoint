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