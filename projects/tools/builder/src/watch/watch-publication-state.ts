export interface PublishedGenerationState {
  readonly generation: number;
}

export class WatchPublicationState {
  #current: PublishedGenerationState | undefined;

  current(): PublishedGenerationState | undefined {
    return this.#current;
  }

  commit(generation: number): void {
    this.#current = Object.freeze({
      generation,
    });
  }
}
