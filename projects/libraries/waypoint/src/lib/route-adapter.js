import { reflectComponentType, } from '@angular/core';
const componentInputs = new WeakMap();
export function adaptRouteComponent(component, context, routeProviders) {
    return context.render(component, context.injector, routeProviders);
}
export function bindRouteInputs(target, component, route) {
    let inputs = componentInputs.get(component);
    if (!inputs) {
        inputs =
            reflectComponentType(component)
                ?.inputs ?? [];
        componentInputs.set(component, inputs);
    }
    const data = route.data ?? {};
    // Parsed route inputs stay grouped by their source so component bindings are
    // explicit and collision-free.
    const values = {
        url: route.url,
        path: route.path,
        params: {
            ...route.params,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(data?.__params ?? {}),
        },
        query: {
            ...route.query,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(data?.__query ?? {}),
        },
        data: Object.fromEntries(Object.entries(data).filter(([key]) => key !== '__params' &&
            key !== '__query')),
        historyState: route.historyState,
        config: route.config,
    };
    for (const input of inputs) {
        const value = values[input.templateName] ??
            values[input.propName];
        if (value !== undefined) {
            target.setInput(input.templateName, value);
        }
    }
}
