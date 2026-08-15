import type {
  BuilderOutput,
} from '@angular-devkit/architect';
import type {
  Observable,
} from 'rxjs';

export async function* builderResults(
  output: Observable<BuilderOutput>,
): AsyncGenerator<BuilderOutput> {
  const queue: BuilderOutput[] = [];
  let done = false;
  let failure: unknown;
  let wake: (() => void) | undefined;

  const subscription = output.subscribe({
    next(value) {
      queue.push(value);
      wake?.();
      wake = undefined;
    },

    error(error) {
      failure = error;
      done = true;
      wake?.();
      wake = undefined;
    },

    complete() {
      done = true;
      wake?.();
      wake = undefined;
    },
  });

  try {
    while (!done || queue.length > 0) {
      if (queue.length === 0) {
        await new Promise<void>(
          resolve => {
            wake = resolve;
          },
        );
        continue;
      }

      yield queue.shift()!;
    }

    if (failure) {
      throw failure;
    }
  } finally {
    subscription.unsubscribe();
  }
}
