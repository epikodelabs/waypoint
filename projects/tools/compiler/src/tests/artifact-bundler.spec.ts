import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { bundleArtifacts } from '../lib/emitters/bundle-artifacts.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactPlan,
} from '../lib/compiler/contracts.js';

const plannedOutputs = (cwd: string, dryRun = false): PlannedCompilerOutputs => ({
  entry: path.join(cwd, 'routes.ts'),
  serverOutput: path.join(cwd, 'out/server.json'),
  entriesOutput: path.join(cwd, 'out/entries'),
  manifestOutput: path.join(cwd, 'out/manifest.json'),
  artifactsOutput: path.join(cwd, 'out/artifacts'),
  dryRun,
  routesExport: 'routes',
});

async function createPlan(cwd: string): Promise<RouteArtifactPlan> {
  const entriesOutput = path.join(cwd, 'out/entries');
  const artifactsOutput = path.join(cwd, 'out/artifacts');
  await fs.mkdir(entriesOutput, { recursive: true });
  await fs.writeFile(path.join(cwd, 'feature.ts'), [
    'export const alphaRoutes = [{ path: "/alpha", secret: "alpha-only" }];',
    'export const betaRoutes = [{ path: "/beta", secret: "beta-only" }];',
  ].join('\n'));

  const artifacts = ['alpha', 'beta'].map(name => {
    const outputPath = path.join(entriesOutput, `route-set-${name}.ts`);
    const contents = `export { ${name}Routes as default } from '../../feature.js';\n`;
    return {
      artifactKey: `${name}-set`,
      routeSetId: `${name}-set`,
      slotId: name,
      dependencies: [],
      source: {
        file: path.join(cwd, 'feature.ts'),
        exportName: `${name}Routes`,
      },
      entry: {
        outputPath,
        importPath: '../../feature',
        contents,
      },
      bundle: {
        outputDirectory: artifactsOutput,
        fileNameTemplate: `${name}-set-[hash].js`,
        format: 'esm' as const,
        platform: 'browser' as const,
        isolated: true as const,
      },
      branchIds: [`${name}-route`],
    };
  });

  for (const artifact of artifacts) {
    await fs.writeFile(artifact.entry.outputPath, artifact.entry.contents);
  }

  return {
    version: 1,
    generatedAt: '2026-08-05T00:00:00.000Z',
    entry: path.join(cwd, 'routes.ts'),
    artifacts,
    browserEntries: artifacts.map(artifact => ({
      artifactKey: artifact.artifactKey,
      routeSetId: artifact.routeSetId,
      dependencies: artifact.dependencies,
      outputPath: artifact.entry.outputPath,
      sourceFile: artifact.source.file,
      sourceExport: artifact.source.exportName,
      contents: artifact.entry.contents,
    })),
    serverShards: [],
    serverIndex: {
      version: 1,
      artifactPlanVersion: 1,
      entry: path.join(cwd, 'routes.ts'),
      generatedAt: '2026-08-05T00:00:00.000Z',
      shards: [],
      artifacts: [],
      slots: [],
      routeSets: [],
    },
    manifest: {
      version: 1,
      artifactPlanVersion: 1,
      generatedAt: '2026-08-05T00:00:00.000Z',
      slots: [],
      routeSets: [],
      artifacts: [],
      routes: [],
    },
  };
}

test('bundles route-set artifacts independently with content hashes', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-bundler-'));
  try {
    const plan = await createPlan(cwd);
    const result = await bundleArtifacts(plannedOutputs(cwd), plan);

    assert.equal(result.diagnostics.some(item => item.level === 'error'), false);
    assert.equal(result.artifacts.length, 2);
    assert.equal(result.emitted.length, 2);

    const alpha = result.artifacts.find(item => item.artifactKey === 'alpha-set')!;
    const beta = result.artifacts.find(item => item.artifactKey === 'beta-set')!;
    assert.match(alpha.fileName, /^alpha-set-[A-Z0-9]+\.js$/i);
    assert.match(beta.fileName, /^beta-set-[A-Z0-9]+\.js$/i);
    assert.notEqual(alpha.hash, beta.hash);

    const alphaCode = await fs.readFile(alpha.outputPath, 'utf8');
    const betaCode = await fs.readFile(beta.outputPath, 'utf8');
    assert.match(alphaCode, /alpha-only/);
    assert.doesNotMatch(alphaCode, /beta-only/);
    assert.match(betaCode, /beta-only/);
    assert.doesNotMatch(betaCode, /alpha-only/);
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});

test('does not invoke esbuild or write artifacts during dry run', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-bundler-dry-'));
  try {
    const plan = await createPlan(cwd);
    await fs.rm(path.join(cwd, 'out/entries'), { recursive: true, force: true });

    const result = await bundleArtifacts(plannedOutputs(cwd, true), plan);
    assert.deepEqual(result.artifacts, []);
    assert.deepEqual(result.emitted, []);
    await assert.rejects(fs.access(path.join(cwd, 'out/artifacts')));
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});

test('does not publish any bundle when one planned entry fails', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-bundler-fail-'));
  try {
    const plan = await createPlan(cwd);
    await fs.rm(plan.artifacts[1]!.entry.outputPath);

    const result = await bundleArtifacts(plannedOutputs(cwd), plan);
    assert.equal(result.diagnostics.some(item => item.code === 'WPT4001'), true);
    assert.deepEqual(result.artifacts, []);
    assert.deepEqual(result.emitted, []);
    await assert.rejects(fs.access(path.join(cwd, 'out/artifacts')));
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});


test('removes stale hashed artifacts when publishing a successful build', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-bundler-stale-'));
  try {
    const plan = await createPlan(cwd);
    const output = path.join(cwd, 'out/artifacts');
    await fs.mkdir(output, { recursive: true });
    const stale = path.join(output, 'alpha-set-STALE.js');
    await fs.writeFile(stale, 'stale');

    const result = await bundleArtifacts(plannedOutputs(cwd), plan);

    assert.equal(result.diagnostics.some(item => item.level === 'error'), false);
    assert.deepEqual(result.removed, [stale]);
    await assert.rejects(fs.access(stale));
    assert.equal(result.emitted.length, 2);
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});

test('preserves the previous successful artifact set when a later build fails', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-bundler-preserve-'));
  try {
    const plan = await createPlan(cwd);
    const first = await bundleArtifacts(plannedOutputs(cwd), plan);
    assert.equal(first.diagnostics.some(item => item.level === 'error'), false);
    const previous = new Map<string, string>();
    for (const file of first.emitted) previous.set(file, await fs.readFile(file, 'utf8'));

    await fs.rm(plan.artifacts[1]!.entry.outputPath);
    const failed = await bundleArtifacts(plannedOutputs(cwd), plan);

    assert.equal(failed.diagnostics.some(item => item.code === 'WPT4001'), true);
    for (const [file, contents] of previous) {
      assert.equal(await fs.readFile(file, 'utf8'), contents);
    }
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});
