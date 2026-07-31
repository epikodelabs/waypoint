import { APP_BASE_HREF, } from '@angular/common';
import { ApplicationRef, DestroyRef, EnvironmentInjector, InjectionToken, inject, runInInjectionContext, } from '@angular/core';
import { runWithInjector, unwrapDefault, } from './adapter-utils';
import { compileRoutes, createRouteRegistry, groupRoutes, } from './route-compiler';
import { composeAngularRouteView, } from './route-renderer';
import { OUTLET_ACTIVATE_EVENT, dispatchOutletLifecycleEvent, } from './router-events';
import { resolveRouterUrl, routerHref, } from './router-url';
import { parseParamsRecord, parseQueryRecord, serializeParams, serializeQuery } from './query-schema';
import { createRouter, } from './vanilla-router';
export const STREAMIX_ROUTE = new InjectionToken('STREAMIX_ROUTE');
export const STREAMIX_ROUTE_CONTEXT = new InjectionToken('STREAMIX_ROUTE_CONTEXT');
const ROUTER_CONFIGURATION = new InjectionToken('STREAMIX_ROUTER_CONFIGURATION');
const EMPTY_ROUTER_STATE = Object.freeze({
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
const lazyComponents = new WeakMap();
function loadComponent(owner) {
    if (owner.component) {
        return Promise.resolve(owner.component);
    }
    if (!owner.loadComponent) {
        return Promise.reject(new Error('A route view must define component or loadComponent.'));
    }
    let pending = lazyComponents.get(owner);
    if (!pending) {
        pending =
            Promise.resolve(owner.loadComponent())
                .then(value => unwrapDefault(value))
                .then(component => {
                if (!component) {
                    throw new Error('Lazy component loader returned no component.');
                }
                return component;
            })
                .catch(error => {
                lazyComponents.delete(owner);
                throw error;
            });
        lazyComponents.set(owner, pending);
    }
    return pending;
}
function snapshotRouterState(state) {
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
function execute(injector, handler, context) {
    return runWithInjector(injector, handler, context);
}
function adaptBeforeEnter(handlers, injector) {
    return handlers?.map(handler => async (context) => {
        const value = await execute(injector, handler, context);
        if (value instanceof URL) {
            return value.href;
        }
        if (value &&
            typeof value ===
                'object' &&
            'redirectTo' in value) {
            return {
                ...value,
                redirectTo: value.redirectTo
                    instanceof URL
                    ? value.redirectTo
                        .href
                    : value.redirectTo,
            };
        }
        return value;
    });
}
function adaptBeforeLeave(handlers, injector) {
    return handlers?.map(handler => async (context) => {
        const value = await execute(injector, handler, context);
        if (value instanceof URL) {
            return value.href;
        }
        if (value &&
            typeof value ===
                'object' &&
            'redirectTo' in value) {
            return {
                ...value,
                redirectTo: value.redirectTo
                    instanceof URL
                    ? value.redirectTo
                        .href
                    : value.redirectTo,
            };
        }
        return value;
    });
}
function adaptLoaders(route, injector) {
    const { resolve, } = route;
    if (!resolve) {
        return undefined;
    }
    return Object.fromEntries(Object.entries(resolve)
        .map(([key, loader]) => [
        key,
        (context) => execute(injector, loader, context),
    ]));
}
function adaptParamsParser(route, injector) {
    const schema = route.paramsSchema;
    if (!schema)
        return undefined;
    return (params, _url, _signal) => runInInjectionContext(injector, () => Promise.resolve(parseParamsRecord(schema, params)));
}
function adaptQueryParser(route, injector) {
    const schema = route.querySchema;
    if (!schema)
        return undefined;
    return (url, _signal) => runInInjectionContext(injector, () => Promise.resolve(parseQueryRecord(schema, url)));
}
async function resolveViews(layouts, route) {
    const resolvedLayouts = await Promise.all(layouts.map(async (layout, index) => ({
        component: await loadComponent(layout),
        providers: (layout.providers ?? []).flat().filter(p => p),
        label: `StreamixLayout(${layout.path || index})`,
    })));
    const page = await loadComponent(route);
    return Object.freeze([
        ...resolvedLayouts,
        {
            component: page,
            providers: (route.providers ?? []).flat().filter(p => p),
            label: `StreamixRoute(${route.path})`,
        },
    ]);
}
function adaptRoute(route, path, redirectTo, layouts, appRef, injector) {
    return {
        name: route.name,
        path,
        outlet: route.outlet,
        redirectTo,
        data: route.data,
        preload: route.preload,
        viewTransition: route.viewTransition,
        load: async () => {
            if (redirectTo) {
                return {};
            }
            const views = await resolveViews(layouts, route);
            return {
                component: composeAngularRouteView(appRef, injector, {
                    routeToken: STREAMIX_ROUTE,
                    contextToken: STREAMIX_ROUTE_CONTEXT,
                }, views),
                canActivate: adaptBeforeEnter(route.beforeEnter, injector),
                canDeactivate: adaptBeforeLeave(route.beforeLeave, injector),
                resolve: adaptLoaders(route, injector),
                parseParams: adaptParamsParser(route, injector),
                parseQuery: adaptQueryParser(route, injector),
            };
        },
    };
}
function adaptRoutes(entries, appRef, injector) {
    const compiled = compileRoutes(entries);
    const groups = groupRoutes(compiled);
    // validateRouteGroups(groups); // This is now done inside createRouteRegistry
    return groups.map((group) => {
        const primary = adaptRoute(group.primary.route, group.path, group.primary.redirectTo, group.layouts, appRef, injector);
        const outlets = group.outlets.map((compiled) => adaptRoute(compiled.route, group.path, compiled.redirectTo, group.layouts, appRef, injector));
        return outlets.length > 0
            ? { ...primary, outlets: Object.freeze(outlets) }
            : primary;
    });
}
function interpolateNamedPath(template, params, schema) {
    const serialized = schema
        ? serializeParams(schema, params)
        : Object.fromEntries(Object.entries(params)
            .filter(([, value]) => value !==
            undefined &&
            value !== null)
            .map(([key, value]) => [
            key,
            String(value),
        ]));
    const missing = new Set();
    const path = template.replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_match, key) => {
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
export class StreamixRouter {
    configuration;
    appRef;
    injector;
    destroyRef;
    appBaseHref;
    registry;
    engine = null;
    currentState = EMPTY_ROUTER_STATE;
    outlets = new Map();
    navigateTo;
    hrefTo;
    constructor(configuration) {
        this.configuration = configuration;
        this.appRef = inject(ApplicationRef);
        this.injector = inject(EnvironmentInjector);
        this.destroyRef = inject(DestroyRef);
        this.appBaseHref =
            inject(APP_BASE_HREF, {
                optional: true,
            }) ?? '/';
        this.registry = createRouteRegistry(this.configuration.routes);
        this.navigateTo =
            this.createNavigateProxy();
        this.hrefTo =
            this.createHrefProxy();
        this.destroyRef.onDestroy(() => this.dispose());
    }
    get active() {
        return this.engine !== null;
    }
    get state() {
        return this.currentState;
    }
    get url() {
        const current = this.currentState.current;
        return current
            ? current.url.pathname +
                current.url.search +
                current.url.hash
            : '';
    }
    connect(name, outlet) {
        const outletName = name.trim();
        const existing = this.outlets.get(outletName);
        if (existing === outlet) {
            return;
        }
        if (existing) {
            throw new Error(`StreamixRouter outlet "${outletName}" is already connected.`);
        }
        this.outlets.set(outletName, outlet);
        if (this.engine) {
            return;
        }
        const engine = createRouter({
            routes: adaptRoutes(this.configuration.routes, this.appRef, this.injector),
            baseHref: this.baseHref,
            enableTracing: this.configuration
                .enableTracing,
            maxRedirects: this.configuration
                .maxRedirects,
            onSameUrlNavigation: this.configuration
                .onSameUrlNavigation,
            scrollRestoration: this.configuration
                .scrollRestoration,
            preloading: this.configuration
                .preloading,
            viewTransitions: this.configuration
                .viewTransitions,
            render: (targetName, node) => {
                const target = this.outlets.get(targetName);
                if (!target) {
                    throw new Error(`StreamixRouter outlet "${targetName}" is not connected.`);
                }
                target.replaceChildren(node);
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
                    const target = this.outlets.get(outlet.name);
                    target.replaceChildren(outlet.node);
                    dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, outlet.component);
                }
            },
            renderNotFound: (targetName, _url, _router) => {
                const target = this.outlets.get(targetName);
                if (!target) {
                    return;
                }
                const heading = document.createElement('h1');
                heading.textContent =
                    '404 — Page Not Found';
                target.replaceChildren(heading);
            },
            renderError: (targetName, _error, _router) => {
                const target = this.outlets.get(targetName);
                if (!target) {
                    return;
                }
                const heading = document.createElement('h1');
                heading.textContent =
                    'Page failed to load';
                target.replaceChildren(heading);
            },
            onStateChange: state => {
                this.currentState =
                    snapshotRouterState(state);
            },
            onOutletActivate: (target, component) => {
                dispatchOutletLifecycleEvent(target, OUTLET_ACTIVATE_EVENT, component);
            },
        });
        try {
            engine.start();
        }
        catch (error) {
            this.outlets.delete(outletName);
            engine.dispose();
            throw error;
        }
        this.engine = engine;
        this.currentState =
            snapshotRouterState(engine.state);
    }
    disconnect(name, outlet) {
        const outletName = name.trim();
        if (this.outlets.get(outletName) !== outlet) {
            return;
        }
        this.outlets.delete(outletName);
        if (this.outlets.size === 0) {
            this.dispose();
        }
    }
    navigate(target, options) {
        const href = this.href(target);
        if (href === null) {
            return Promise.resolve(false);
        }
        return this
            .requireEngine()
            .navigate(href, options);
    }
    href(target) {
        if (target === null ||
            target === undefined) {
            return null;
        }
        if (typeof target ===
            'string' ||
            target instanceof URL) {
            return this.resolveHref(target);
        }
        if ('path' in target) {
            return this.resolveHref(target.path);
        }
        if ('name' in target) {
            return this
                .generateNamedHref(target);
        }
        return null;
    }
    updateHistoryState(state) {
        this.requireEngine()
            .updateHistoryState(state);
    }
    preload() {
        return this
            .requireEngine()
            .preload();
    }
    dispose() {
        const engine = this.engine;
        this.engine = null;
        this.outlets.clear();
        engine?.dispose();
        this.currentState =
            EMPTY_ROUTER_STATE;
    }
    get baseHref() {
        return (this.configuration
            .baseHref ??
            this.appBaseHref);
    }
    requireEngine() {
        if (!this.engine) {
            throw new Error('StreamixRouter has no active outlet.');
        }
        return this.engine;
    }
    resolveHref(target) {
        return routerHref(resolveRouterUrl(target, this.baseHref, window.location, 'href'));
    }
    generateNamedHref(target) {
        const record = this.registry.namedRoutes
            .get(target.name);
        if (!record) {
            return null;
        }
        const path = interpolateNamedPath(record.fullPath, target.params ?? {}, record.route
            .paramsSchema);
        if (!path) {
            return null;
        }
        const query = record.route.querySchema &&
            target.query
            ? serializeQuery(record.route
                .querySchema, target.query)
            : '';
        return this.resolveHref(`${path}${query}`);
    }
    createNavigateProxy() {
        return new Proxy(Object.create(null), {
            get: (_target, property) => {
                if (typeof property !==
                    'string' ||
                    property === 'then') {
                    return undefined;
                }
                return (options = {}) => this.navigate({
                    name: property,
                    ...options,
                });
            },
        });
    }
    createHrefProxy() {
        return new Proxy(Object.create(null), {
            get: (_target, property) => {
                if (typeof property !==
                    'string' ||
                    property === 'then') {
                    return undefined;
                }
                return (options = {}) => this.href({
                    name: property,
                    ...options,
                });
            },
        });
    }
}
export function provideStreamixRouter(routes, options = {}) {
    const config = {
        ...options,
        routes,
    };
    return [
        {
            provide: ROUTER_CONFIGURATION,
            useValue: config,
        },
        {
            provide: StreamixRouter,
            useFactory: (configuration) => new StreamixRouter(configuration),
            deps: [
                ROUTER_CONFIGURATION,
            ],
        },
    ];
}
export { layout, lazyLayout, lazyRoute, redirectRoute, route } from './route-builders';
