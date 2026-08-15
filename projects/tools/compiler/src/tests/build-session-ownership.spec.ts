import test from 'node:test';
import assert from 'node:assert/strict';

test('build session and publication transaction have independent lifetimes', async () => {
  const events: string[] = [];

  const session = {
    async dispose() {
      events.push('session.dispose');
    },
  };

  const publication = {
    async rollback() {
      events.push('publication.rollback');
    },
    async dispose() {
      events.push('publication.dispose');
    },
  };

  await publication.rollback();
  await publication.dispose();

  assert.deepEqual(events, [
    'publication.rollback',
    'publication.dispose',
  ]);

  await session.dispose();

  assert.deepEqual(events, [
    'publication.rollback',
    'publication.dispose',
    'session.dispose',
  ]);
});
