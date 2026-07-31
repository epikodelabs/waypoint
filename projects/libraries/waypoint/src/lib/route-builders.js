export function route(path, component, options = {}) {
    return {
        kind: 'route',
        path,
        component,
        ...options,
    };
}
export function lazyRoute(path, loadComponent, options = {}) {
    return {
        kind: 'route',
        path,
        loadComponent,
        ...options,
    };
}
export function redirectRoute(path, redirectTo, options = {}) {
    return {
        kind: 'route',
        path,
        redirectTo,
        ...options,
    };
}
export function layout(path, component, entries, options = {}) {
    return {
        kind: 'layout',
        path,
        component,
        entries,
        ...options,
    };
}
export function lazyLayout(path, loadComponent, entries, options = {}) {
    return {
        kind: 'layout',
        path,
        loadComponent,
        entries,
        ...options,
    };
}
