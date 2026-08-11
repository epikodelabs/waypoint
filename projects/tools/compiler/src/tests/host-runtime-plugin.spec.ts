import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  collectHostModuleExports,
  createHostModulePredicate,
  hostModuleSource,
  isDefaultHostModule,
} from '../lib/emitters/host-runtime-plugin.js';

test('collects named and Angular AOT namespace imports for host modules', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-imports-'));
  try {
    await fs.writeFile(path.join(root, 'artifact.js'), `
      import * as i0 from '@angular/core';
      import { route as makeRoute, routesFor } from '@epikodelabs/waypoint';
      class Page {}
      Page.ɵcmp = i0.ɵɵdefineComponent({ type: Page });
      i0.ɵɵsetClassMetadata(Page, [], null, null);
      export const feature = routesFor('feature', 'feature-core', [makeRoute('/feature', Page)]);
    `);

    const index = await collectHostModuleExports(root);
    assert.deepEqual(
      [...(index.get('@angular/core') ?? [])].sort(),
      ['ɵɵdefineComponent', 'ɵɵsetClassMetadata'],
    );
    assert.deepEqual(
      [...(index.get('@epikodelabs/waypoint') ?? [])].sort(),
      ['route', 'routesFor'],
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('collects CommonJS require aliases emitted by Angular AOT', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-host-require-'));
  try {
    await fs.writeFile(path.join(root, 'artifact.js'), `
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      const core_1 = require('@angular/core');
      const waypoint_1 = require('@epikodelabs/waypoint');
      class Page {}
      Page.ɵcmp = core_1.ɵɵdefineComponent({ type: Page });
      exports.feature = (0, waypoint_1.routesFor)('feature', 'feature-core', [
        (0, waypoint_1.route)('/feature', Page),
      ]);
    `);

    const index = await collectHostModuleExports(root);
    assert.deepEqual(
      [...(index.get('@angular/core') ?? [])].sort(),
      ['ɵɵdefineComponent'],
    );
    assert.deepEqual(
      [...(index.get('@epikodelabs/waypoint') ?? [])].sort(),
      ['route', 'routesFor'],
    );
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test('shares Angular package identities and Waypoint by default', () => {
  assert.equal(isDefaultHostModule('@angular/core'), true);
  assert.equal(isDefaultHostModule('@angular/forms'), true);
  assert.equal(isDefaultHostModule('@epikodelabs/waypoint'), true);
  assert.equal(isDefaultHostModule('rxjs'), false);
});

test('generates a bridge module with only required static exports', () => {
  const source = hostModuleSource(
    '@angular/core',
    new Set(['Component', 'ɵɵdefineComponent']),
  );

  assert.match(source, /Symbol\.for/);
  assert.match(source, /export const Component/);
  assert.match(source, /export const ɵɵdefineComponent/);
  assert.doesNotMatch(source, /RouterLink/);
});


test('adds configured application runtime modules without broadening package sharing', () => {
  const isHostModule = createHostModulePredicate(['@waypoint-demo/runtime']);
  assert.equal(isHostModule('@angular/core'), true);
  assert.equal(isHostModule('@epikodelabs/waypoint'), true);
  assert.equal(isHostModule('@waypoint-demo/runtime'), true);
  assert.equal(isHostModule('@waypoint-demo/admin'), false);
});

test('generated bridge exports preserve the registered host identity', async () => {
  const key = Symbol.for('@epikodelabs/waypoint/server-navigation-host-runtime/v1');
  const token = Object.freeze({ identity: 'host' });
  const runtime = Object.freeze({
    version: 1,
    modules: new Map([['@test/runtime', Object.freeze({ token })]]),
  });
  const global = globalThis as typeof globalThis & { [key: symbol]: unknown };
  const previous = global[key];
  global[key] = runtime;

  try {
    const source = hostModuleSource('@test/runtime', new Set(['token']));
    const url = `data:text/javascript,${encodeURIComponent(source)}`;
    const loaded = await import(url) as { token: unknown };
    assert.equal(loaded.token, token);
  } finally {
    if (previous === undefined) delete global[key];
    else global[key] = previous;
  }
});
