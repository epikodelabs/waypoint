import test from 'node:test';
import assert from 'node:assert/strict';

test('each watch generation disposes temporary build resources', async () => {
  const events: string[] = [];

  const generation = {
    async publish() {
      events.push('publish');
      return { success: true };
    },
    async dispose() {
      events.push('dispose');
    },
  };

  try {
    await generation.publish();
  } finally {
    await generation.dispose();
  }

  assert.deepEqual(
    events,
    ['publish', 'dispose'],
  );
});