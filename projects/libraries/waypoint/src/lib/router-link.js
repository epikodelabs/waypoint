import { __decorate } from "tslib";
import { DestroyRef, Directive, ElementRef, HostBinding, HostListener, Input, inject, } from '@angular/core';
import { watchRouterLocation, } from './adapter-utils';
import { StreamixRouter } from './streamix-router';
function buildPathFromCommands(commands) {
    if (commands.length === 0) {
        return '';
    }
    let path = '';
    for (const command of commands) {
        if (command === null || command === undefined) {
            continue;
        }
        const segment = String(command).trim();
        if (!segment) {
            continue;
        }
        if (!path) {
            path = segment;
            continue;
        }
        path =
            `${path.replace(/\/+$/, '')}/${segment.replace(/^\/+/, '')}`;
    }
    return path;
}
function appendQueryParams(url, queryParams) {
    url.search = '';
    for (const [key, value] of Object.entries(queryParams)) {
        if (value === null || value === undefined) {
            continue;
        }
        if (Array.isArray(value)) {
            for (const entry of value) {
                if (entry === null || entry === undefined) {
                    continue;
                }
                url.searchParams.append(key, String(entry));
            }
            continue;
        }
        url.searchParams.set(key, String(value));
    }
}
let StreamixRouterLink = class StreamixRouterLink {
    router = inject(StreamixRouter);
    destroyRef = inject(DestroyRef);
    element = inject((ElementRef)).nativeElement;
    routerLink;
    queryParams;
    fragment;
    state;
    replaceUrl = false;
    href = null;
    constructor() {
        watchRouterLocation(this.destroyRef, () => this.refreshHref());
    }
    ngOnChanges() {
        this.refreshHref();
    }
    handleClick(event) {
        if (!(event instanceof MouseEvent)) {
            return;
        }
        if (!this.href) {
            return;
        }
        if (event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey) {
            return;
        }
        if (this.element.target &&
            this.element.target !== '_self') {
            return;
        }
        if (this.element.hasAttribute('download') ||
            this.element.rel
                .split(/\s+/)
                .includes('external')) {
            return;
        }
        event.preventDefault();
        void this.router.navigate(this.href, {
            replace: this.replaceUrl,
            state: this.state,
        });
    }
    refreshHref() {
        const target = this.resolveTarget();
        if (!target) {
            this.href = null;
            return;
        }
        const href = this.router.href(target);
        if (!href) {
            this.href = null;
            return;
        }
        if (!this.queryParams &&
            this.fragment === undefined) {
            this.href = href;
            return;
        }
        const url = new URL(href, window.location.origin);
        if (this.queryParams) {
            appendQueryParams(url, this.queryParams);
        }
        if (this.fragment !== undefined) {
            url.hash = this.fragment
                ? `#${this.fragment.replace(/^#/, '')}`
                : '';
        }
        this.href =
            `${url.pathname}${url.search}${url.hash}`;
    }
    resolveTarget() {
        const link = this.routerLink;
        if (link === null || link === undefined) {
            return null;
        }
        if (Array.isArray(link)) {
            return this.withQueryParams({
                path: buildPathFromCommands(link),
            });
        }
        if (typeof link === 'string' ||
            link instanceof URL) {
            return this.withQueryParams(link);
        }
        if ('name' in link) {
            return {
                ...link,
                query: this.queryParams
                    ? {
                        ...(link.query ?? {}),
                        ...this.queryParams,
                    }
                    : link.query,
            };
        }
        return this.withQueryParams(link);
    }
    withQueryParams(target) {
        if (!this.queryParams) {
            return target;
        }
        const href = typeof target === 'string'
            ? target
            : target instanceof URL
                ? target.href
                : target.path;
        const url = new URL(href, window.location.href);
        appendQueryParams(url, this.queryParams);
        if (this.fragment !== undefined) {
            url.hash = this.fragment
                ? `#${this.fragment.replace(/^#/, '')}`
                : '';
        }
        return {
            path: `${url.pathname}${url.search}${url.hash}`,
        };
    }
};
__decorate([
    Input()
], StreamixRouterLink.prototype, "routerLink", void 0);
__decorate([
    Input()
], StreamixRouterLink.prototype, "queryParams", void 0);
__decorate([
    Input()
], StreamixRouterLink.prototype, "fragment", void 0);
__decorate([
    Input()
], StreamixRouterLink.prototype, "state", void 0);
__decorate([
    Input()
], StreamixRouterLink.prototype, "replaceUrl", void 0);
__decorate([
    HostBinding('attr.href')
], StreamixRouterLink.prototype, "href", void 0);
__decorate([
    HostListener('click', ['$event'])
], StreamixRouterLink.prototype, "handleClick", null);
StreamixRouterLink = __decorate([
    Directive({
        selector: 'a[routerLink],area[routerLink]',
        standalone: true,
    })
], StreamixRouterLink);
export { StreamixRouterLink };
export { StreamixRouterLink as RouterLink };
