import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addImplicitRootSlots,
} from './implicit-root-slots.js';

test('synthesizes missing contribution targets at root', () => {
  const rootContext = Object.freeze({ path: '' });

  const program = {
    rootContext,
    slots: [],
    contributions: [
      { slotId: 'public' },
      { slotId: 'application' },
    ],
  } as any;

  const result = addImplicitRootSlots(program);

  assert.deepEqual(
    result.implicitSlotIds,
    ['application', 'public'],
  );

  assert.deepEqual(
    result.program.slots.map((slot: any) => slot.id).sort(),
    ['application', 'public'],
  );

  assert.ok(
    result.program.slots.every(
      (slot: any) =>
        slot.context === rootContext,
    ),
  );
});

test('does not replace an explicit contextual slot', () => {
  const rootContext = Object.freeze({ path: '' });
  const appContext = Object.freeze({ path: '/app' });

  const explicit = {
    id: 'administration',
    context: appContext,
    source: { kind: 'authored' },
  };

  const program = {
    rootContext,
    slots: [explicit],
    contributions: [
      { slotId: 'administration' },
    ],
  } as any;

  const result = addImplicitRootSlots(program);

  assert.equal(
    result.implicitSlotIds.length,
    0,
  );

  assert.equal(
    result.program.slots[0],
    explicit,
  );
});

test('does not invent empty extension points', () => {
  const program = {
    rootContext: {},
    slots: [],
    contributions: [],
  } as any;

  const result = addImplicitRootSlots(program);

  assert.deepEqual(
    result.program.slots,
    [],
  );
});
