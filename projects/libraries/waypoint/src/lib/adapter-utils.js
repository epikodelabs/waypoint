import { runInInjectionContext, } from '@angular/core';
import { ROUTER_LOCATION_CHANGE_EVENT } from './router-events';
export class ModuleRegistry {
    refs = [];
    add(ref) {
        this.refs.push(ref);
    }
    dispose(onError = console.error) {
        for (let index = this.refs.length - 1; index >= 0; index--) {
            try {
                this.refs[index].destroy();
            }
            catch (error) {
                onError(error);
            }
        }
        this.refs.length = 0;
    }
}
export function unwrapDefault(value) {
    return value !== null && typeof value === 'object' && 'default' in value
        ? value.default
        : value;
}
/**
 * Invokes a handler inside Angular's synchronous injection context.
 *
 * The handler may call inject() during its initial synchronous execution.
 * Dependencies needed after an await boundary must be captured before the
 * handler yields, because Angular does not preserve injection context across
 * arbitrary asynchronous continuations.
 */
export function runWithInjector(injector, handler, context) {
    return runInInjectionContext(injector, () => Promise.resolve(handler(context)));
}
export function watchRouterLocation(destroyRef, refresh) {
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
