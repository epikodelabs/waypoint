import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { emitServerArtifacts } from '../lib/emitters/emit-server-artifacts.js';
import type { PlannedCompilerOutputs, RouteArtifactPlan } from '../lib/compiler/contracts.js';

function outputs(cwd: string): PlannedCompilerOutputs {
  return {
    cwd,
    artifactTsConfig: path.join(cwd, 'tsconfig.json'),
    entry: path.join(cwd, 'routes.ts'),
    serverOutput: path.join(cwd, 'out/server.json'),
    entriesOutput: path.join(cwd, 'out/entries'),
    manifestOutput: path.join(cwd, 'out/manifest.json'),
    artifactsOutput: path.join(cwd, 'out/artifacts'),
    dryRun: false,
    routesExport: 'routes',
  };
}

function plan(cwd: string): RouteArtifactPlan {
  const serverOutput = path.join(cwd, 'out/server.json');
  const shardDirectory = path.join(cwd, 'out/server.shards');
  return {
    version: 1,
    generatedAt: '2026-08-05T00:00:00.000Z',
    entry: path.join(cwd, 'routes.ts'),
    artifacts: [],
    browserEntries: [],
    serverShards: [{
      prefix: '/next',
      outputPath: path.join(shardDirectory, 'next.json'),
      document: {
        version: 1,
        artifactPlanVersion: 1,
        prefix: '/next',
        branches: [],
      },
    }],
    serverIndex: {
      version: 1,
      artifactPlanVersion: 1,
      entry: path.join(cwd, 'routes.ts'),
      generatedAt: '2026-08-05T00:00:00.000Z',
      shards: [{ prefix: '/next', file: 'server.shards/next.json', branchCount: 0 }],
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

test('publishes server documents together and removes stale shards', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-server-publish-'));
  try {
    const planned = outputs(cwd);
    const currentPlan = plan(cwd);
    const shardDirectory = path.join(cwd, 'out/server.shards');
    const stale = path.join(shardDirectory, 'stale.json');
    await fs.mkdir(shardDirectory, { recursive: true });
    await fs.writeFile(stale, '{}');
    await fs.writeFile(planned.serverOutput, '{"old":true}');
    await fs.writeFile(planned.manifestOutput, '{"old":true}');

    const result = await emitServerArtifacts(planned, currentPlan);

    assert.equal(result.diagnostics.some(item => item.level === 'error'), false);
    assert.deepEqual(result.removed, [stale]);
    await assert.rejects(fs.access(stale));
    assert.deepEqual(JSON.parse(await fs.readFile(planned.serverOutput, 'utf8')), currentPlan.serverIndex);
    assert.deepEqual(JSON.parse(await fs.readFile(planned.manifestOutput, 'utf8')), currentPlan.manifest);
    assert.deepEqual(
      JSON.parse(await fs.readFile(currentPlan.serverShards[0]!.outputPath, 'utf8')),
      currentPlan.serverShards[0]!.document,
    );
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});