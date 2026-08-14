import test from 'node:test';
import assert from 'node:assert/strict';

test('build transaction owns cleanup until publication completes', async () => {
  const events: string[] = [];

  const transaction = {
    async publish() {
      events.push('publish');
      return { success: true };
    },
    async dispose() {
      events.push('dispose');
    },
  };

  try {
    await transaction.publish();
  } finally {
    await transaction.dispose();
  }

  assert.deepEqual(events, [
    'publish',
    'dispose',
  ]);
});

test('failed host build can rollback before protected publication', async () => {
  const events: string[] = [];

  const transaction = {
    async rollback() {
      events.push('rollback');
    },
    async dispose() {
      events.push('dispose');
    },
  };

  await transaction.rollback();
  await transaction.dispose();

  assert.deepEqual(events, [
    'rollback',
    'dispose',
  ]);
});
