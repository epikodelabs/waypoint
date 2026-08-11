import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { compile } from '../lib/compiler/compile.js';

test('discovers routeSlot and exported routesFor declarations end to end', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-compiler-'));
  const waypoint = path.join(cwd, 'node_modules/@epikodelabs/waypoint');
  await fs.mkdir(waypoint, { recursive: true });
  await fs.writeFile(path.join(waypoint, 'package.json'), JSON.stringify({
    name: '@epikodelabs/waypoint',
    version: '0.0.0',
    types: 'index.d.ts',
  }));
  await fs.writeFile(path.join(waypoint, 'index.d.ts'), [
    'export declare function route(path: string, component: unknown, options?: unknown): unknown;',
    'export declare function layout(path: string, component: unknown, entries: readonly unknown[]): unknown;',
    'export declare function routeSlot(id: string): unknown;',
    'export declare function routesFor(slotId: string, routeSetId: string, entries: readonly unknown[]): unknown;',
    'export declare const s: any;',
  ].join('\n'));
  await fs.writeFile(path.join(cwd, 'routes.ts'), `
    import { layout, route, routeSlot, routesFor, s } from '@epikodelabs/waypoint';
    class AppLayout {}
    class ProjectPage {}
    export const projectRoutes = routesFor('workspace', 'project-routes', [
      route('/projects/:projectId', ProjectPage, {
        name: 'project',
        paramsSchema: { projectId: s.number({ min: 1 }) },
      }),
    ]);
    export const routes = [
      layout('/app', AppLayout, [routeSlot('workspace')]),
    ];
  `);
  await fs.writeFile(path.join(cwd, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      target: 'ES2022',
      strict: true,
      skipLibCheck: true,
    },
    include: ['routes.ts'],
  }));

  try {
    const result = await compile({
      cwd,
      entry: 'routes.ts',
      artifactTsConfig: 'tsconfig.json',
      serverOutput: 'out/server.json',
      entriesOutput: 'out/entries',
      manifestOutput: 'out/manifest.json',
    });
    assert.equal(result.diagnostics.filter(item => item.level === 'error').length, 0);
    const manifest = JSON.parse(await fs.readFile(path.join(cwd, 'out/manifest.json'), 'utf8'));
    assert.equal(manifest.slots[0].id, 'workspace');
    assert.equal(manifest.routes[0].path, '/app/projects/:projectId');
    assert.equal(manifest.routeSets[0].id, 'project-routes');
    assert.equal(manifest.routes[0].routeSetId, manifest.routeSets[0].id);
    assert.equal(result.emitted.some(file => file.includes('route-set-project-routes')), true);
    assert.match(manifest.artifacts[0].file, /^artifacts\/project-routes-[A-Z0-9]+\.js$/i);
    assert.equal(typeof manifest.artifacts[0].hash, 'string');
    assert.equal(manifest.artifacts[0].bytes > 0, true);
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});
test('resolves routes through public-api export-star barrels', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-public-api-'));
  const waypoint = path.join(cwd, 'node_modules/@epikodelabs/waypoint');
  await fs.mkdir(waypoint, { recursive: true });
  await fs.writeFile(path.join(waypoint, 'package.json'), JSON.stringify({
    name: '@epikodelabs/waypoint',
    version: '0.0.0',
    types: 'index.d.ts',
  }));
  await fs.writeFile(path.join(waypoint, 'index.d.ts'), [
    'export declare function route(path: string, component: unknown, options?: unknown): unknown;',
    'export declare function routeSlot(id: string): unknown;',
    'export declare function routesFor(slotId: string, routeSetId: string, entries: readonly unknown[]): unknown;',
  ].join('\n'));
  await fs.mkdir(path.join(cwd, 'lib/routes'), { recursive: true });
  await fs.writeFile(path.join(cwd, 'public-api.ts'), `export * from './lib/index.js';`);
  await fs.writeFile(path.join(cwd, 'lib/index.ts'), `export * from './routes/index.js';`);
  await fs.writeFile(path.join(cwd, 'lib/routes/index.ts'), [
    `export * from './routes.authored.js';`,
    `export * from './feature.routes.js';`,
  ].join('\n'));
  await fs.writeFile(path.join(cwd, 'lib/routes/routes.authored.ts'), `
    import { routeSlot } from '@epikodelabs/waypoint';
    export const routes = [routeSlot('feature')];
  `);
  await fs.writeFile(path.join(cwd, 'lib/routes/feature.routes.ts'), `
    import { route, routesFor } from '@epikodelabs/waypoint';
    class FeaturePage {}
    export const featureRoutes = routesFor('feature', 'feature-core', [
      route('/feature', FeaturePage),
    ]);
  `);
  await fs.writeFile(path.join(cwd, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      target: 'ES2022',
      strict: true,
      skipLibCheck: true,
    },
    include: ['**/*.ts'],
  }));

  try {
    const result = await compile({
      cwd,
      entry: 'public-api.ts',
      artifactTsConfig: 'tsconfig.json',
      serverOutput: 'out/server.json',
      entriesOutput: 'out/entries',
      manifestOutput: 'out/manifest.json',
    });

    assert.equal(result.success, true);
    const manifest = JSON.parse(
      await fs.readFile(path.join(cwd, 'out/manifest.json'), 'utf8'),
    );
    assert.equal(manifest.routeSets[0].id, 'feature-core');
    assert.equal(manifest.routes[0].path, '/feature');
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});

test('restores the previous entry directory when artifact bundling fails', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-entry-rollback-'));
  const waypoint = path.join(cwd, 'node_modules/@epikodelabs/waypoint');
  await fs.mkdir(waypoint, { recursive: true });
  await fs.writeFile(path.join(waypoint, 'package.json'), JSON.stringify({
    name: '@epikodelabs/waypoint',
    version: '0.0.0',
    types: 'index.d.ts',
  }));
  await fs.writeFile(path.join(waypoint, 'index.d.ts'), [
    'export declare function route(path: string, component: unknown): unknown;',
    'export declare function routeSlot(id: string): unknown;',
    'export declare function routesFor(slotId: string, routeSetId: string, entries: readonly unknown[]): unknown;',
  ].join('\n'));
  await fs.writeFile(path.join(cwd, 'routes.ts'), `
    import { route, routeSlot, routesFor } from '@epikodelabs/waypoint';
    import { MissingPage } from './missing.js';
    export const brokenRoutes = routesFor('feature', 'broken-core', [
      route('/broken', MissingPage),
    ]);
    export const routes = [routeSlot('feature')];
  `);
  await fs.writeFile(path.join(cwd, 'tsconfig.json'), JSON.stringify({
    compilerOptions: {
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      target: 'ES2022',
      strict: true,
      skipLibCheck: true,
    },
    include: ['routes.ts'],
  }));
  const entries = path.join(cwd, 'out/entries');
  await fs.mkdir(entries, { recursive: true });
  const previous = path.join(entries, 'previous.ts');
  await fs.writeFile(previous, 'previous');

  try {
    const result = await compile({
      cwd,
      entry: 'routes.ts',
      artifactTsConfig: 'tsconfig.json',
      serverOutput: 'out/server.json',
      entriesOutput: 'out/entries',
      manifestOutput: 'out/manifest.json',
    });

    assert.equal(result.success, false);
    assert.equal(await fs.readFile(previous, 'utf8'), 'previous');
    assert.deepEqual(await fs.readdir(entries), ['previous.ts']);
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});