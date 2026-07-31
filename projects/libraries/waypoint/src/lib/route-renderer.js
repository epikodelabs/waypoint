import { Injector, createComponent, createEnvironmentInjector, } from '@angular/core';
import { bindRouteInputs, } from './route-adapter';
import { OUTLET_ACTIVATE_EVENT, OUTLET_DEACTIVATE_EVENT, dispatchOutletLifecycleEvent, findContainingOutlet, findOutlet, } from './router-events';
function createScopedInjector(providers, parent, label) {
    if (!providers?.length) {
        return undefined;
    }
    try {
        return createEnvironmentInjector(Array.from(providers), parent, label);
    }
    catch (error) {
        throw new Error(`Failed to create route injector for "${label}": ` +
            (error instanceof Error ? error.message : String(error)), { cause: error });
    }
}
function createAngularComponent(appRef, tokens, component, environmentInjector, route, context) {
    const host = document.createElement('streamix-view');
    const elementInjector = Injector.create({
        parent: environmentInjector,
        providers: [
            {
                provide: tokens.routeToken,
                useValue: route,
            },
            {
                provide: tokens.contextToken,
                useValue: context,
            },
        ],
    });
    const ref = createComponent(component, {
        hostElement: host,
        elementInjector,
        environmentInjector,
    });
    let attached = false;
    let disposed = false;
    let containingOutlet = null;
    try {
        try {
            bindRouteInputs(ref, component, route);
        }
        catch (error) {
            throw new Error(`Failed to bind route inputs for "${component.name || 'anonymous component'}": ` +
                (error instanceof Error ? error.message : String(error)), { cause: error });
        }
        appRef.attachView(ref.hostView);
        attached = true;
        ref.changeDetectorRef
            .detectChanges();
    }
    catch (error) {
        if (attached) {
            try {
                appRef.detachView(ref.hostView);
            }
            catch { }
        }
        ref.destroy();
        throw error;
    }
    return {
        node: host,
        component: ref.instance,
        dispose() {
            if (disposed) {
                return;
            }
            disposed = true;
            containingOutlet ??=
                host.__streamixOutlet ?? null;
            const outlet = containingOutlet ??
                findContainingOutlet(host);
            if (outlet) {
                dispatchOutletLifecycleEvent(outlet, OUTLET_DEACTIVATE_EVENT, ref.instance);
            }
            try {
                if (attached) {
                    appRef.detachView(ref.hostView);
                    attached = false;
                }
            }
            finally {
                ref.destroy();
                host.remove();
            }
        },
    };
}
function disposeLayers(layers) {
    const errors = [];
    for (let index = layers.length - 1; index >= 0; index--) {
        const layer = layers[index];
        try {
            layer.rendered
                .dispose?.();
        }
        catch (error) {
            errors.push(error);
        }
        try {
            layer.injector
                ?.destroy();
        }
        catch (error) {
            errors.push(error);
        }
    }
    if (errors.length === 1) {
        throw errors[0];
    }
    if (errors.length > 1) {
        throw new AggregateError(errors, 'Multiple errors occurred while disposing a route view.');
    }
}
export function composeAngularRouteView(appRef, rootInjector, tokens, views) {
    return async (route, context) => {
        const layers = [];
        let parentInjector = rootInjector;
        try {
            for (let index = 0; index < views.length; index++) {
                const view = views[index];
                const scopedInjector = createScopedInjector(view.providers, parentInjector, view.label);
                const activeInjector = scopedInjector ??
                    parentInjector;
                const rendered = createAngularComponent(appRef, tokens, view.component, activeInjector, route, context);
                const parent = layers[layers.length - 1];
                if (parent) {
                    // The route outlet selects the application-level render target.
                    // Layout layers always compose through their primary child outlet.
                    const outletName = '';
                    const outlet = findOutlet(parent.rendered.node, outletName);
                    if (!outlet) {
                        throw new Error(`Cannot render "${view.label}": ` +
                            `the parent layout has no router outlet` +
                            (outletName ? ` named "${outletName}"` : ` (primary)`));
                    }
                    outlet.replaceChildren(rendered.node);
                    // Capture the outlet while the node is attached. Parent-layer
                    // disposal may detach this host before its own dispose() runs.
                    const renderedNode = rendered.node;
                    renderedNode.__streamixOutlet = outlet;
                    if (rendered.component !==
                        undefined) {
                        dispatchOutletLifecycleEvent(outlet, OUTLET_ACTIVATE_EVENT, rendered.component);
                    }
                }
                layers.push({
                    rendered,
                    injector: scopedInjector,
                });
                parentInjector =
                    activeInjector;
            }
            const first = layers[0];
            const last = layers[layers.length - 1];
            if (!first || !last) {
                throw new Error('A route view requires at least one component.');
            }
            return {
                node: first.rendered.node,
                component: last.rendered.component,
                dispose() {
                    disposeLayers(layers);
                },
            };
        }
        catch (error) {
            disposeLayers(layers);
            throw error;
        }
    };
}
