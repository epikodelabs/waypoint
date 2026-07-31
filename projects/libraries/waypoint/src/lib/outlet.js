import { __decorate } from "tslib";
import { DestroyRef, Directive, ElementRef, Input, inject, } from '@angular/core';
import { StreamixRouter } from './streamix-router';
let RouterOutlet = class RouterOutlet {
    router = inject(StreamixRouter);
    element = inject((ElementRef)).nativeElement;
    destroyRef = inject(DestroyRef);
    shouldConnect = this.element.closest('streamix-view') === null;
    name = '';
    ngOnInit() {
        if (!this.shouldConnect) {
            return;
        }
        this.router.connect(this.name, this.element);
    }
    constructor() {
        this.destroyRef.onDestroy(() => {
            if (!this.shouldConnect) {
                return;
            }
            this.router.disconnect(this.name, this.element);
        });
    }
};
__decorate([
    Input()
], RouterOutlet.prototype, "name", void 0);
RouterOutlet = __decorate([
    Directive({ selector: 'router-outlet', standalone: true })
], RouterOutlet);
export { RouterOutlet };
