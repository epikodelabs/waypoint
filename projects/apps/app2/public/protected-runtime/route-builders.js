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
