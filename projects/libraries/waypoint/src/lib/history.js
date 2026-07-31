export const ZERO_SCROLL = Object.freeze({ x: 0, y: 0 });
export class HistoryManager {
    entries = [];
    index = -1;
    get currentHref() {
        return window.location.pathname + window.location.search + window.location.hash;
    }
    readScroll() {
        return {
            x: window.scrollX,
            y: window.scrollY,
        };
    }
    readHistoryState() {
        return window.history.state ?? null;
    }
    ensureHistoryEntry() {
        if (this.entries.length > 0) {
            return;
        }
        this.entries = [{
                href: this.currentHref,
                scroll: this.readScroll(),
                state: this.readHistoryState(),
            }];
        this.index = 0;
    }
    saveCurrentScroll() {
        const scroll = this.readScroll();
        if (this.index >= 0) {
            const entry = this.entries[this.index];
            if (entry) {
                this.entries[this.index] = {
                    href: entry.href,
                    scroll,
                    state: entry.state,
                };
            }
        }
        return scroll;
    }
    createDefaultUpdate() {
        this.ensureHistoryEntry();
        return {
            type: 'none',
            previousIndex: this.index,
            nextIndex: this.index,
            previousScroll: this.readScroll(),
            previousEntry: this.entries[this.index],
        };
    }
    createUpdate(href, replace, state) {
        this.ensureHistoryEntry();
        const previousScroll = this.saveCurrentScroll();
        const previousIndex = this.index;
        const nextEntry = {
            href,
            scroll: replace ? previousScroll : ZERO_SCROLL,
            state: state ?? null,
        };
        if (replace) {
            const previousEntry = this.entries[this.index];
            this.entries[this.index] = nextEntry;
            return {
                type: 'replace',
                previousIndex,
                nextIndex: this.index,
                previousEntry,
                previousScroll,
                nextEntry,
            };
        }
        this.entries = this.entries.slice(0, this.index + 1);
        this.entries.push(nextEntry);
        return {
            type: 'push',
            previousIndex,
            nextIndex: this.index + 1,
            previousScroll,
            previousEntry: this.entries[previousIndex],
            nextEntry,
        };
    }
    createPopStateUpdate(href) {
        this.ensureHistoryEntry();
        const previousScroll = this.saveCurrentScroll();
        const previousIndex = this.index;
        const resolvedIndex = this.findHistoryIndexByHref(href);
        const nextIndex = resolvedIndex >= 0 ? resolvedIndex : previousIndex;
        const nextEntry = this.entries[nextIndex]
            ? {
                ...this.entries[nextIndex],
                href,
                state: this.readHistoryState(),
            }
            : {
                href,
                scroll: ZERO_SCROLL,
                state: this.readHistoryState(),
            };
        return {
            type: 'popstate',
            previousIndex,
            nextIndex,
            previousScroll,
            previousEntry: this.entries[previousIndex],
            nextEntry,
        };
    }
    findHistoryIndexByHref(href) {
        if (this.entries.length === 0) {
            return -1;
        }
        const previous = this.entries[this.index - 1];
        if (previous?.href === href) {
            return this.index - 1;
        }
        const next = this.entries[this.index + 1];
        if (next?.href === href) {
            return this.index + 1;
        }
        let bestIndex = -1;
        let bestDistance = Number.POSITIVE_INFINITY;
        for (let index = 0; index < this.entries.length; index++) {
            if (this.entries[index]?.href !== href || index === this.index) {
                continue;
            }
            const distance = Math.abs(index - this.index);
            if (distance < bestDistance) {
                bestIndex = index;
                bestDistance = distance;
            }
        }
        return bestIndex;
    }
    rollbackUpdate(update) {
        switch (update.type) {
            case 'push':
                this.entries = this.entries.slice(0, update.previousIndex + 1);
                this.index = update.previousIndex;
                return;
            case 'replace':
                if (update.previousEntry && update.previousIndex >= 0) {
                    this.entries[update.previousIndex] = update.previousEntry;
                }
                this.index = update.previousIndex;
                return;
            case 'popstate':
            case 'none':
                this.index = update.previousIndex;
                return;
        }
    }
    commitUpdate(update, href) {
        this.index = update.nextIndex;
        this.entries[this.index] = update.nextEntry ?? {
            href,
            scroll: update.type === 'replace' ? update.previousScroll : ZERO_SCROLL,
            state: null,
        };
    }
}
