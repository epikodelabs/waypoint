import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { emitBrowserEntries } from '../lib/emitters/emit-browser-entries.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactPlan,
} from '../lib/compiler/contracts.js';

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
  const outputPath = path.join(cwd, 'out/entries/route-set-current.ts');
  return {
    version: 1,
    generatedAt: '2026-08-06T00:00:00.000Z',
    entry: path.join(cwd, 'routes.ts'),
    artifacts: [],
    browserEntries: [{
      artifactKey: 'current',
      routeSetId: 'current',
      dependencies: [],
      outputPath,
      sourceFile: path.join(cwd, 'current.ts'),
      sourceExport: 'currentRoutes',
      contents: 'export { currentRoutes as default } from "../../current.js";\n',
    }],
    serverShards: [],
    serverIndex: {
      version: 1,
      artifactPlanVersion: 1,
      entry: path.join(cwd, 'routes.ts'),
      generatedAt: '2026-08-06T00:00:00.000Z',
      shards: [],
      artifacts: [],
      slots: [],
      routeSets: [],
    },
    manifest: {
      version: 1,
      artifactPlanVersion: 1,
      generatedAt: '2026-08-06T00:00:00.000Z',
      slots: [],
      routeSets: [],
      artifacts: [],
      routes: [],
    },
  };
}

test('publishes browser entries atomically and removes stale files', async () => {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'waypoint-entry-publish-'));
  try {
    const planned = outputs(cwd);
    const stale = path.join(planned.entriesOutput, 'route-set-stale.ts');
    await fs.mkdir(planned.entriesOutput, { recursive: true });
    await fs.writeFile(stale, 'stale');

    const result = await emitBrowserEntries(planned, plan(cwd));

    assert.equal(result.diagnostics.some(item => item.level === 'error'), false);
    assert.deepEqual(result.removed, [stale]);
    await assert.rejects(fs.access(stale));
    assert.equal(
      await fs.readFile(path.join(planned.entriesOutput, 'route-set-current.ts'), 'utf8'),
      'export { currentRoutes as default } from "../../current.js";\n',
    );
  } finally {
    await fs.rm(cwd, { recursive: true, force: true });
  }
});