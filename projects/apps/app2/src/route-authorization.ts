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
