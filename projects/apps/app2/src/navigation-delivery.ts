export interface ResolveNavigationResponse {
  readonly artifactKey: string;
  readonly dependencies: readonly string[];
  readonly moduleUrl: string;
  readonly hash: string;
}

export interface RoutePolicy {
  readonly allowAnonymous?: boolean;
  readonly roles?: readonly string[];
  readonly permissions?: readonly string[];
}

export interface Principal {
  readonly subject: string;
  readonly roles: ReadonlySet<string>;
  readonly permissions: ReadonlySet<string>;
}
