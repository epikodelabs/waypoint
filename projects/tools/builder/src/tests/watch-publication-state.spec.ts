import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WatchPublicationState,
} from '../watch/watch-publication-state.js';

test('failed rebuild does not replace last good generation', () => {
  const state = new WatchPublicationState();

  state.commit(1);
  assert.equal(
    state.current()?.generation,
    1,
  );

  // generation 2 fails -> no commit
  assert.equal(
    state.current()?.generation,
    1,
  );

  state.commit(3);
  assert.equal(
    state.current()?.generation,
    3,
  );
});
