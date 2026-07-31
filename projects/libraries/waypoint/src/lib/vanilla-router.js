import { HistoryManager, ZERO_SCROLL } from './history';
import { dispatchRouterLocationChange } from './router-events';
import { isPathInsideBase, normalizeBaseHref, resolveRouterUrl, routerHref, stripBaseHref } from './router-url';
class RoutePreparationError extends Error {
    originalError;
    preserveActive;
    constructor(originalError, preserveActive) {
        super(originalError instanceof Error
            ? originalError.message
            : String(originalError), { cause: originalError });
        this.originalError = originalError;
        this.preserveActive = preserveActive;
        this.name = 'RoutePreparationError';
    }
}
const EMPTY_PARAMS = Object.freeze({});
const EMPTY_QUERY = Object.freeze({});
const EMPTY_DATA = Object.freeze({});
function splitPath(path) {
    return path
        .split('/')
        .filter(Boolean);
}
function decodeSegment(value) {
    try {
        return decodeURIComponent(value);
    }
    catch {
        return value;
    }
}
function isRenderedRouteNode(value) {
    return value !== null && typeof value === 'object' && 'node' in value;
}
function normalizeRenderedRouteNode(value) {
    return isRenderedRouteNode(value) ? value : { node: value };
}
function readRawQuery(url) {
    const values = {};
    url.searchParams.forEach((value, key) => {
        values[key] = value;
    });
    return Object.freeze(values);
}
function executeGuard(guard, route) {
    return typeof guard === 'function' ? guard(route) : guard.canActivate(route);
}
function executeDeactivationGuard(guard, route) {
    return typeof guard === 'function' ? guard(route) : guard.canDeactivate(route);
}
function executeResolver(resolver, route) {
    return typeof resolver === 'function' ? resolver(route) : resolver.resolve(route);
}
function throwIfAborted(signal) {
    if (signal.aborted)
        throw new DOMException('Navigation aborted', 'AbortError');
}
function isAbortError(error) {
    return typeof error === 'object' && error !== null && 'name' in error
        && error.name === 'AbortError';
}
function interpolateRedirect(redirectTo, params) {
    return redirectTo.replace(/:([A-Za-z0-9_]+)/g, (_, key) => {
        if (!(key in params)) {
            throw new Error(`Missing route parameter "${key}" for redirect "${redirectTo}"`);
        }
        return encodeURIComponent(params[key]);
    });
}
function readRedirect(result) {
    if (typeof result === 'string')
        return { redirectTo: result, replace: true };
    if (result && typeof result === 'object' && 'redirectTo' in result) {
        return { redirectTo: result.redirectTo, replace: result.replace ?? true };
    }
    return null;
}
function defaultRender(outlet, node) {
    outlet.replaceChildren(node);
}
function validateRouteGroups(routes) {
    const primaryPaths = new Set();
    for (const primary of routes) {
        const primaryOutlet = primary.outlet?.trim() ?? '';
        if (primaryOutlet) {
            throw new Error(`Top-level route "${primary.path}" must target the primary outlet`);
        }
        if (primaryPaths.has(primary.path)) {
            throw new Error(`Duplicate primary route path "${primary.path}"`);
        }
        primaryPaths.add(primary.path);
        const outletNames = new Set();
        for (const outlet of primary.outlets ?? []) {
            const name = outlet.outlet?.trim() ?? '';
            if (!name) {
                throw new Error(`Secondary route for "${primary.path}" must define a named outlet`);
            }
            if (outletNames.has(name)) {
                throw new Error(`Duplicate outlet "${name}" for route "${primary.path}"`);
            }
            outletNames.add(name);
            if (outlet.path !== primary.path) {
                throw new Error(`Outlet "${name}" must use the primary path "${primary.path}"`);
            }
            if (outlet.outlets?.length) {
                throw new Error(`Outlet "${name}" cannot contain nested outlets`);
            }
            if (outlet.redirectTo) {
                throw new Error(`Outlet "${name}" cannot redirect`);
            }
            if (outlet.name) {
                throw new Error(`Outlet "${name}" cannot define a route name`);
            }
            if (outlet.preload !== undefined) {
                throw new Error(`Outlet "${name}" cannot define preload; the primary route owns group preloading`);
            }
            if (outlet.viewTransition !== undefined) {
                throw new Error(`Outlet "${name}" cannot define viewTransition; the primary route owns the transition`);
            }
        }
        if (primary.redirectTo && outletNames.size > 0) {
            throw new Error(`Redirect route "${primary.path}" cannot activate named outlets`);
        }
    }
}
const routeLoads = new WeakMap();
function loadRoute(route) {
    let pending = routeLoads.get(route);
    if (!pending) {
        pending = Promise
            .resolve(route.load?.() ?? {})
            .then(loaded => ({
            component: loaded.component,
            canActivate: loaded.canActivate,
            canDeactivate: loaded.canDeactivate,
            resolve: loaded.resolve,
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
export function createRouter(config) {
    validateRouteGroups(config.routes);
    const render = config.render;
    const renderNotFound = config.renderNotFound;
    const renderError = config.renderError;
    const commitOutlets = config.commit;
    const navigateExternal = config.navigateExternal ?? ((url) => window.location.assign(url.href));
    const baseHref = normalizeBaseHref(config.baseHref ?? '/');
    const maxRedirects = config.maxRedirects ?? 10;
    const scrollRestoration = config.scrollRestoration ?? 'preserve';
    const preloading = config.preloading ?? 'none';
    const viewTransitions = config.viewTransitions ?? false;
    const history = new HistoryManager();
    const routePatterns = new WeakMap();
    let currentState = null;
    let requestState = null;
    let navigationPhase = null;
    let errorState = null;
    let started = false;
    let disposed = false;
    let navigationId = 0;
    let latestRequestId = 0;
    let activeController = null;
    const activeRenders = new Map();
    const activeRouteStates = new Map();
    let startRequestQueued = false;
    let preloadTask = null;
    let preloadQueued = false;
    let preloadIdleId = null;
    let preloadTimeoutId = null;
    function trace(message, ...values) {
        if (config.enableTracing)
            console.debug(`[Router] ${message}`, ...values);
    }
    function warn(message, ...values) {
        console.warn(`[Router] ${message}`, ...values);
    }
    function resolveOutlet() {
        return config.outlet ?? document.getElementById('app');
    }
    function createStatusRoute(url) {
        return currentState ?? {
            url,
            path: stripBaseHref(url.pathname, baseHref),
            params: EMPTY_PARAMS,
            query: readRawQuery(url),
            data: EMPTY_DATA,
            historyState: window.history.state,
            config: config.routes[0] ?? { path: '**' },
        };
    }
    function renderPrimaryNode(node, route) {
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
    function disposeRender(renderInstance) {
        if (!renderInstance)
            return;
        renderInstance.dispose();
    }
    function replaceActiveRender(outletName, renderInstance) {
        const previousRender = activeRenders.get(outletName) ?? null;
        if (renderInstance) {
            activeRenders.set(outletName, renderInstance);
        }
        else {
            activeRenders.delete(outletName);
        }
        disposeRender(previousRender);
    }
    function disposeAllRenders() {
        for (const renderInstance of activeRenders.values()) {
            disposeRender(renderInstance);
        }
        activeRenders.clear();
        activeRouteStates.clear();
    }
    function clearOutlet() {
        const outlet = resolveOutlet();
        if (outlet)
            outlet.replaceChildren();
    }
    function currentHref() {
        return window.location.pathname + window.location.search + window.location.hash;
    }
    function readScroll() {
        return {
            x: window.scrollX,
            y: window.scrollY,
        };
    }
    function scrollToPosition(position) {
        window.scrollTo(position.x, position.y);
    }
    function restoreScroll(update) {
        if (scrollRestoration === 'preserve') {
            return;
        }
        if (scrollRestoration === 'restore' && update.type === 'popstate') {
            scrollToPosition(update.nextEntry?.scroll ?? ZERO_SCROLL);
            return;
        }
        scrollToPosition(ZERO_SCROLL);
    }
    function restorePreviousScroll(update) {
        if (scrollRestoration === 'preserve') {
            return;
        }
        scrollToPosition(update.previousScroll);
    }
    function isInsideBase(pathname) {
        return isPathInsideBase(pathname, baseHref);
    }
    function resolveAppUrl(target, mode) {
        return resolveRouterUrl(target, baseHref, window.location, mode);
    }
    function activeHref() {
        const url = currentState?.url;
        return url ? url.pathname + url.search + url.hash : null;
    }
    function restoreActiveUrl() {
        const active = activeHref();
        const fallback = history.createDefaultUpdate().previousEntry?.href ?? currentHref();
        const href = active ?? fallback;
        window.history.replaceState(currentState?.historyState ??
            history.createDefaultUpdate().previousEntry?.state ?? null, '', href);
        dispatchRouterLocationChange();
    }
    function applyHistoryStateToRoute(route, historyState) {
        return { ...route, historyState };
    }
    function updateHistoryState(state) {
        if (disposed) {
            throw new Error('Cannot update history state on a disposed router');
        }
        const entry = history.createDefaultUpdate().previousEntry ?? {
            href: currentHref(),
            scroll: readScroll(),
            state: null,
        };
        const nextEntry = {
            href: entry.href,
            scroll: readScroll(),
            state: state ?? null,
        };
        window.history.replaceState(nextEntry.state, '', nextEntry.href);
        history.commitUpdate({ ...history.createDefaultUpdate(), nextEntry }, nextEntry.href);
        dispatchRouterLocationChange();
        if (currentState) {
            currentState = applyHistoryStateToRoute(currentState, nextEntry.state);
            notifyStateChange();
        }
    }
    function shouldUseViewTransition(context) {
        const routeOverride = context.routeConfig?.viewTransition;
        if (routeOverride !== undefined)
            return routeOverride;
        return typeof viewTransitions === 'function'
            ? viewTransitions(context)
            : viewTransitions;
    }
    function runWithViewTransition(context, action) {
        if (!shouldUseViewTransition(context)) {
            action();
            return;
        }
        const transitionDocument = document;
        const startViewTransition = transitionDocument.startViewTransition;
        if (typeof startViewTransition !== 'function') {
            action();
            return;
        }
        try {
            void Promise.resolve(startViewTransition.call(transitionDocument, () => action()).finished).catch(error => trace('View transition failed', error));
        }
        catch (error) {
            trace('View transition setup failed', error);
            action();
        }
    }
    function notifyOutletActivate(outlet, component) {
        config.onOutletActivate?.(outlet, component);
    }
    function createCompletion() {
        let resolve;
        const promise = new Promise(completion => {
            resolve = completion;
        });
        return { completion: { settled: false, resolve }, promise };
    }
    function settleRequest(request, success) {
        if (request.completion.settled)
            return;
        request.completion.settled = true;
        request.completion.resolve(success);
    }
    function cancelActiveNavigation() {
        activeController?.abort();
        activeController = null;
        if (requestState)
            settleRequest(requestState, false);
    }
    function createRequest(url, redirectCount, completion, historyUpdate, run) {
        const pending = completion ? null : createCompletion();
        const request = {
            id: ++navigationId,
            url,
            redirectCount,
            completion: completion ?? pending.completion,
            historyUpdate,
        };
        if (!completion)
            cancelActiveNavigation();
        latestRequestId = request.id;
        requestState = request;
        errorState = null;
        notifyStateChange();
        const controller = new AbortController();
        activeController = controller;
        void run(request, controller.signal);
        return pending?.promise ?? Promise.resolve(false);
    }
    function requestNavigation(url, redirectCount = 0, completion, historyUpdate = history.createDefaultUpdate()) {
        return createRequest(url, redirectCount, completion, historyUpdate, runNavigation);
    }
    function requestExternalNavigation(url, completion, historyUpdate = history.createDefaultUpdate()) {
        return createRequest(url, 0, completion, historyUpdate, runExternalNavigation);
    }
    function notifyStateChange() {
        config.onStateChange?.(publicState);
    }
    function setPhase(request, phase) {
        if (request.id !== latestRequestId) {
            return;
        }
        navigationPhase = phase;
        notifyStateChange();
    }
    function getRoutePattern(route) {
        const cached = routePatterns.get(route);
        if (cached && cached.path === route.path) {
            return cached;
        }
        const segments = splitPath(route.path);
        const pattern = {
            path: route.path,
            segments,
            parameterNames: segments.map(segment => segment.startsWith(':')
                ? segment.slice(1)
                : null),
        };
        routePatterns.set(route, pattern);
        return pattern;
    }
    function matchPattern(pattern, segments, params) {
        for (let index = 0; index < pattern.segments.length; index++) {
            const expected = pattern.segments[index];
            const actual = segments[index];
            if (actual === undefined) {
                return false;
            }
            const parameterName = pattern.parameterNames[index];
            if (parameterName) {
                params[parameterName] = decodeSegment(actual);
                continue;
            }
            if (expected !== actual) {
                return false;
            }
        }
        return true;
    }
    function recognize(path) {
        const segments = splitPath(path);
        let fallback;
        for (const route of config.routes) {
            if (route.path === '**' || route.path === '*') {
                fallback = route;
                continue;
            }
            const pattern = getRoutePattern(route);
            if (pattern.segments.length !== segments.length) {
                continue;
            }
            const params = {};
            if (matchPattern(pattern, segments, params)) {
                return {
                    route,
                    params: Object.freeze(params),
                };
            }
        }
        return fallback
            ? { route: fallback, params: Object.freeze({}) }
            : null;
    }
    async function runPreloading() {
        if (disposed) {
            return;
        }
        for (const route of config.routes) {
            if (route.preload === false) {
                continue;
            }
            const group = [route, ...(route.outlets ?? [])];
            for (const member of group) {
                try {
                    const loaded = await loadRoute(member);
                    if (member !== route && (loaded.parseParams || loaded.parseQuery)) {
                        throw new Error(`Outlet "${member.outlet}" cannot define parseParams or parseQuery`);
                    }
                }
                catch (error) {
                    trace('Route preload failed', member.path, member.outlet ?? '', error);
                }
            }
        }
    }
    function preload() {
        preloadQueued = false;
        preloadTask ??= runPreloading().finally(() => {
            preloadTask = null;
        });
        return preloadTask;
    }
    function cancelScheduledPreloading() {
        if (preloadIdleId !== null) {
            const cancelIdle = window.cancelIdleCallback;
            cancelIdle?.(preloadIdleId);
            preloadIdleId = null;
        }
        if (preloadTimeoutId !== null) {
            window.clearTimeout(preloadTimeoutId);
            preloadTimeoutId = null;
        }
        preloadQueued = false;
    }
    function schedulePreloading() {
        if (disposed ||
            preloading === 'none' ||
            preloadTask ||
            preloadQueued) {
            return;
        }
        preloadQueued = true;
        const run = () => {
            preloadIdleId = null;
            preloadTimeoutId = null;
            if (disposed || !started) {
                preloadQueued = false;
                return;
            }
            void preload();
        };
        if (preloading === 'eager') {
            queueMicrotask(run);
            return;
        }
        const requestIdle = window.requestIdleCallback;
        if (typeof requestIdle === 'function') {
            preloadIdleId = requestIdle(run);
            return;
        }
        preloadTimeoutId = window.setTimeout(run, 0);
    }
    async function runCanDeactivateGuards(nextUrl, signal) {
        const routes = activeRouteStates.size > 0
            ? [...activeRouteStates.values()]
            : currentState
                ? [currentState]
                : [];
        for (const activeRoute of routes) {
            const context = {
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
                if (result === false)
                    return false;
            }
        }
        return true;
    }
    async function renderMatchedRoute(routeState, loaded, signal) {
        const destroyController = new AbortController();
        throwIfAborted(signal);
        if (!loaded.component) {
            throw new Error(`Matched route "${routeState.config.path}" has no component`);
        }
        const output = normalizeRenderedRouteNode(await loaded.component(routeState, {
            signal,
            destroySignal: destroyController.signal,
        }));
        throwIfAborted(signal);
        return {
            node: output.node,
            component: output.component,
            rendered: {
                controller: destroyController,
                dispose: () => {
                    destroyController.abort();
                    output.dispose?.();
                },
            },
        };
    }
    async function performNavigation(request, signal) {
        trace('Navigation started', request.url.href);
        setPhase(request, 'recognizing');
        if (!isInsideBase(request.url.pathname)) {
            throw new Error(`URL "${request.url.pathname}" is outside router base "${baseHref}"`);
        }
        const path = stripBaseHref(request.url.pathname, baseHref);
        const match = recognize(path);
        throwIfAborted(signal);
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
        if (!match) {
            return { type: 'not-found', request };
        }
        const primaryRoute = match.route;
        const routes = [primaryRoute, ...(primaryRoute.outlets ?? [])];
        const historyState = request.historyUpdate.nextEntry?.state ?? null;
        if (primaryRoute.redirectTo) {
            return {
                type: 'redirect',
                request,
                redirectTo: interpolateRedirect(primaryRoute.redirectTo, match.params),
                replace: true,
            };
        }
        let loadedRoutes;
        try {
            loadedRoutes = await Promise.all(routes.map(loadRoute));
        }
        catch (error) {
            throw new RoutePreparationError(error, currentState !== null && routes.length > 1);
        }
        throwIfAborted(signal);
        for (let index = 1; index < loadedRoutes.length; index++) {
            if (loadedRoutes[index].parseParams || loadedRoutes[index].parseQuery) {
                throw new Error(`Outlet "${routes[index].outlet}" cannot define parseParams or parseQuery`);
            }
        }
        // The primary route owns URL parsing. Secondary outlets share the same
        // validated params and query because they are not independently navigable.
        const primaryLoaded = loadedRoutes[0];
        const [parsedParams, parsedQuery] = await Promise.all([
            primaryLoaded.parseParams
                ? primaryLoaded.parseParams(match.params, request.url, signal)
                : Promise.resolve(Object.freeze({ ...match.params })),
            primaryLoaded.parseQuery
                ? primaryLoaded.parseQuery(request.url, signal)
                : Promise.resolve(readRawQuery(request.url)),
        ]);
        throwIfAborted(signal);
        const sharedParams = Object.freeze({ ...parsedParams });
        const sharedQuery = Object.freeze({ ...parsedQuery });
        const baseRoutes = routes.map(route => ({
            url: request.url,
            path,
            params: sharedParams,
            query: sharedQuery,
            data: Object.freeze(route.data ?? {}),
            historyState,
            config: route,
        }));
        for (let index = 0; index < loadedRoutes.length; index++) {
            const context = {
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
        setPhase(request, 'resolving');
        const activatedRoutes = await Promise.all(baseRoutes.map(async (baseRoute, index) => {
            const entries = await Promise.all(Object.entries(loadedRoutes[index].resolve ?? {}).map(async ([key, resolver]) => [
                key,
                await executeResolver(resolver, { ...baseRoute, signal }),
            ]));
            throwIfAborted(signal);
            return {
                ...baseRoute,
                data: Object.freeze({
                    ...baseRoute.data,
                    ...Object.fromEntries(entries),
                }),
            };
        }));
        setPhase(request, 'loading');
        const prepared = [];
        try {
            for (let index = 0; index < activatedRoutes.length; index++) {
                const route = activatedRoutes[index];
                const rendered = await renderMatchedRoute(route, loadedRoutes[index], signal);
                prepared.push({
                    name: route.config.outlet?.trim() ?? '',
                    route,
                    ...rendered,
                });
            }
        }
        catch (error) {
            for (let index = prepared.length - 1; index >= 0; index--) {
                try {
                    prepared[index].rendered.dispose();
                }
                catch { }
            }
            throw new RoutePreparationError(error, currentState !== null && routes.length > 1);
        }
        return {
            type: 'success',
            request,
            route: activatedRoutes[0],
            outlets: Object.freeze(prepared),
        };
    }
    async function runNavigation(request, signal) {
        if (disposed)
            return;
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
            commit(result);
        }
        catch (error) {
            if (signal.aborted || isAbortError(error))
                return;
            const preparationError = error instanceof RoutePreparationError
                ? error
                : null;
            const failure = {
                type: 'error',
                request,
                error: preparationError?.originalError ?? error,
                preserveActive: preparationError?.preserveActive ?? false,
            };
            if (failure.request.id !== latestRequestId)
                return;
            commit(failure);
        }
        finally {
            if (activeController?.signal === signal) {
                activeController = null;
            }
        }
    }
    async function runExternalNavigation(request, signal) {
        if (disposed) {
            settleRequest(request, false);
            return;
        }
        try {
            setPhase(request, 'guarding');
            const deactivationResult = await runCanDeactivateGuards(request.url, signal);
            throwIfAborted(signal);
            if (request.id !== latestRequestId) {
                return;
            }
            const redirect = deactivationResult
                ? readRedirect(deactivationResult)
                : null;
            if (redirect) {
                const redirectUrl = resolveAppUrl(redirect.redirectTo, 'href');
                if (redirectUrl.origin !==
                    window.location.origin) {
                    requestState = null;
                    navigationPhase = null;
                    errorState = null;
                    settleRequest(request, true);
                    notifyStateChange();
                    navigateExternal(redirectUrl);
                    return;
                }
                const href = redirectUrl.pathname +
                    redirectUrl.search +
                    redirectUrl.hash;
                const historyState = window.history.state;
                const historyUpdate = history.createUpdate(href, redirect.replace, historyState);
                window.history[redirect.replace
                    ? 'replaceState'
                    : 'pushState'](historyState, '', href);
                dispatchRouterLocationChange();
                void requestNavigation(redirectUrl, 0, request.completion, historyUpdate);
                return;
            }
            if (deactivationResult === false) {
                commit({
                    type: 'blocked',
                    request,
                });
                return;
            }
            requestState = null;
            navigationPhase = null;
            errorState = null;
            settleRequest(request, true);
            notifyStateChange();
            navigateExternal(request.url);
        }
        catch (error) {
            if (signal.aborted ||
                isAbortError(error)) {
                return;
            }
            if (request.id !==
                latestRequestId) {
                return;
            }
            commit({
                type: 'error',
                request,
                error,
            });
        }
        finally {
            if (activeController?.signal ===
                signal) {
                activeController = null;
            }
        }
    }
    function commit(result) {
        if (disposed || result.request.id !== latestRequestId)
            return;
        switch (result.type) {
            case 'success': {
                runWithViewTransition({
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
                        }
                        else {
                            for (const outlet of result.outlets) {
                                if (outlet.name === '') {
                                    renderPrimaryNode(outlet.node, outlet.route);
                                }
                                else if (render) {
                                    render(outlet.name, outlet.node, outlet.route);
                                }
                                else {
                                    throw new Error(`No renderer is configured for outlet "${outlet.name}"`);
                                }
                            }
                        }
                    }
                    catch (error) {
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
                        }
                        else {
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
                history.commitUpdate(result.request.historyUpdate, result.request.url.pathname + result.request.url.search + result.request.url.hash);
                currentState = result.route;
                requestState = null;
                navigationPhase = null;
                errorState = null;
                window.dispatchEvent(new CustomEvent('routechange', { detail: result.route }));
                trace('Navigation completed', result.route.path);
                restoreScroll(result.request.historyUpdate);
                settleRequest(result.request, true);
                notifyStateChange();
                return;
            }
            case 'redirect': {
                if (result.request.redirectCount >= maxRedirects) {
                    commit({
                        type: 'error',
                        request: result.request,
                        error: new Error(`Maximum redirect count of ${maxRedirects} exceeded`),
                    });
                    return;
                }
                const url = resolveAppUrl(result.redirectTo, 'href');
                if (url.origin !==
                    window.location.origin) {
                    void requestExternalNavigation(url, result.request.completion, result.request.historyUpdate);
                    return;
                }
                const href = url.pathname + url.search + url.hash;
                const historyState = window.history.state;
                const historyUpdate = history.createUpdate(href, result.replace, historyState);
                window.history[result.replace ? 'replaceState' : 'pushState'](historyState, '', href);
                dispatchRouterLocationChange();
                void requestNavigation(url, result.request.redirectCount + 1, result.request.completion, historyUpdate);
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
                runWithViewTransition({
                    url: result.request.url,
                    from: currentState,
                    to: null,
                    phase: 'not-found',
                    routeConfig: null,
                }, () => {
                    if (renderNotFound) {
                        renderNotFound('', result.request.url, publicRouter);
                    }
                    else {
                        const heading = document.createElement('h1');
                        heading.textContent = '404 — Page Not Found';
                        renderPrimaryNode(heading, createStatusRoute(result.request.url));
                    }
                    disposeAllRenders();
                });
                history.commitUpdate(result.request.historyUpdate, result.request.url.pathname + result.request.url.search + result.request.url.hash);
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
                    runWithViewTransition({
                        url: result.request.url,
                        from: currentState,
                        to: null,
                        phase: 'error',
                        routeConfig: null,
                        error: result.error,
                    }, () => {
                        if (renderError) {
                            renderError('', result.error, publicRouter);
                        }
                        else {
                            const heading = document.createElement('h1');
                            heading.textContent = 'Page failed to load';
                            renderPrimaryNode(heading, createStatusRoute(result.request.url));
                        }
                        disposeAllRenders();
                    });
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
                settleRequest(result.request, false);
                notifyStateChange();
                return;
            }
        }
    }
    function handlePopState() {
        requestNavigation(new URL(window.location.href), 0, undefined, history.createPopStateUpdate(currentHref()));
    }
    function handleClick(event) {
        if (disposed || !started)
            return;
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }
        const target = event.target;
        if (!(target instanceof Element))
            return;
        const anchor = target.closest('a[href]');
        if (!(anchor instanceof HTMLAnchorElement))
            return;
        if (anchor.target && anchor.target !== '_self')
            return;
        if (anchor.hasAttribute('download') || anchor.rel.split(/\s+/).includes('external'))
            return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin || !isInsideBase(url.pathname)) {
            return;
        }
        if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
            return;
        }
        event.preventDefault();
        navigate(url);
    }
    function navigate(target, options = {}) {
        if (disposed)
            throw new Error('Cannot navigate with a disposed router');
        const url = resolveAppUrl(target, 'navigate');
        if (url.origin !==
            window.location.origin) {
            return requestExternalNavigation(url, undefined, history.createDefaultUpdate());
        }
        if (!isInsideBase(url.pathname)) {
            throw new Error(`URL "${url.pathname}" is outside router base "${baseHref}"`);
        }
        if (config.onSameUrlNavigation === 'ignore' && currentState?.url.href === url.href) {
            return Promise.resolve(false);
        }
        const href = url.pathname + url.search + url.hash;
        const historyState = options.state ?? null;
        const historyUpdate = history.createUpdate(href, options.replace ?? false, historyState);
        window.history[options.replace ? 'replaceState' : 'pushState'](historyState, '', href);
        dispatchRouterLocationChange();
        return requestNavigation(url, 0, undefined, historyUpdate);
    }
    function replace(target, state) {
        return navigate(target, { replace: true, state });
    }
    function startRouter() {
        if (disposed) {
            throw new Error('Cannot start a disposed router');
        }
        if (started) {
            return;
        }
        started = true;
        window.addEventListener('popstate', handlePopState);
        document.addEventListener('click', handleClick);
        schedulePreloading();
        // Starting the router must be synchronous from the caller's point of
        // view. Queue initial URL recognition so `state.pending` remains false
        // immediately after start(), and let an explicit navigate() win.
        if (startRequestQueued) {
            return;
        }
        startRequestQueued = true;
        queueMicrotask(() => {
            startRequestQueued = false;
            if (!started ||
                disposed ||
                currentState !== null ||
                requestState !== null) {
                return;
            }
            void requestNavigation(new URL(window.location.href), 0, undefined, history.createDefaultUpdate());
        });
    }
    function stopRouter() {
        cancelScheduledPreloading();
        if (!started) {
            cancelActiveNavigation();
            return;
        }
        window.removeEventListener('popstate', handlePopState);
        document.removeEventListener('click', handleClick);
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
    function href(target) {
        const url = resolveAppUrl(target, 'href');
        return routerHref(url);
    }
    function createLink(to, text, className = '') {
        const link = document.createElement('a');
        link.href = href(to);
        link.textContent = text;
        if (className)
            link.className = className;
        return link;
    }
    let publicRouter;
    const publicState = {
        get current() {
            if (disposed)
                return null;
            return currentState;
        },
        get pending() {
            if (disposed)
                return false;
            return requestState !== null;
        },
        get phase() {
            if (disposed)
                return null;
            return navigationPhase;
        },
        get error() {
            if (disposed)
                return null;
            return errorState;
        },
        get path() {
            if (disposed)
                return '';
            return currentState?.path ?? '';
        },
        get params() {
            if (disposed)
                return EMPTY_PARAMS;
            return currentState?.params ?? EMPTY_PARAMS;
        },
        get query() {
            if (disposed)
                return EMPTY_QUERY;
            return currentState?.query ?? EMPTY_QUERY;
        },
        get data() {
            if (disposed)
                return EMPTY_DATA;
            return currentState?.data ?? EMPTY_DATA;
        },
        get historyState() {
            if (disposed)
                return null;
            return currentState?.historyState ?? history.createDefaultUpdate().previousEntry?.state ?? null;
        },
        get routeConfig() {
            if (disposed)
                return null;
            return currentState?.config ?? null;
        },
    };
    publicRouter = {
        state: publicState,
        start: () => startRouter(),
        stop: () => stopRouter(),
        dispose: () => {
            if (disposed)
                return;
            stopRouter();
            disposed = true;
        },
        navigate: (target, options) => navigate(target, options),
        replace: (target, state) => replace(target, state),
        updateHistoryState: (state) => updateHistoryState(state),
        preload: () => preload(),
        back: () => window.history.back(),
        forward: () => window.history.forward(),
        href: (target) => href(target),
        createLink: (to, text, className) => createLink(to, text, className),
    };
    return publicRouter;
}
