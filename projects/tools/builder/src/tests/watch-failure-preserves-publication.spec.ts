import test from 'node:test';
import assert from 'node:assert/strict';

test('a failed generation leaves previous publication untouched', async () => {
  let published = 1;

  async function runGeneration(
    generation: number,
    succeeds: boolean,
  ) {
    if (!succeeds) {
      return false;
    }

    published = generation;
    return true;
  }

  assert.equal(
    await runGeneration(2, false),
    false,
  );
  assert.equal(
    published,
    1,
  );

  assert.equal(
    await runGeneration(3, true),
    true,
  );
  assert.equal(
    published,
    3,
  );
});
