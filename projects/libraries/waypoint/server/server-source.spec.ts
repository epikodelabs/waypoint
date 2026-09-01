import {
  type ServerRoutableBranch,
  type ServerRouterIndex,
  type ServerRouterShard,
} from './server-router';
import { createServerRouterSnapshotSource as createSource } from './server-source';
import type { ServerArtifactRecord } from './server-routing';

interface Artifact extends ServerArtifactRecord {
  readonly hash: string;
}

interface Branch extends ServerRoutableBranch {
  readonly kind: 'route';
}

function artifact(hash: string): Artifact {
  return {
    artifactKey: 'feature',
    routeSetId: 'feature',
    dependencies: [],
    branchIds: ['feature-home'],
    hash,
  };
}

function index(hash: string, files = ['feature.json']): ServerRouterIndex<Artifact> {
  return {
    shards: files.map(file => ({ prefix: '/', file })),
    artifacts: [artifact(hash)],
  };
}

function shard(path = '/feature'): ServerRouterShard<Branch> {
  return {
    branches: [{
      id: 'feature-home',
      kind: 'route',
      path,
      routeSetId: 'feature',
      policies: [],
    }],
  };
}

describe('server router snapshot source', () => {
  it('loads one immutable generation once and serves shards from memory', async () => {
    let indexLoads = 0;
    let shardLoads = 0;
    const source = createSource<Artifact, Branch>({
      async loadIndex() { indexLoads++; return index('A'); },
      async loadShard() { shardLoads++; return shard(); },
    });

    const first = await source.loadSnapshot();
    const second = await source.loadSnapshot();

    expect(second).toBe(first);
    expect(indexLoads).toBe(1);
    expect(shardLoads).toBe(1);
    expect(await first.loadShard('feature.json')).toBe(await first.loadShard('feature.json'));
    expect(shardLoads).toBe(1);
  });

  it('deduplicates shard files while preparing a generation', async () => {
    let shardLoads = 0;
    const source = createSource<Artifact, Branch>({
      async loadIndex() { return index('A', ['feature.json', 'feature.json']); },
      async loadShard() { shardLoads++; return shard(); },
    });

    await source.loadSnapshot();
    expect(shardLoads).toBe(1);
  });

  it('publishes a refresh only after every shard in the new generation loads', async () => {
    let generation = 'A';
    let fail = false;
    const source = createSource<Artifact, Branch>({
      async loadIndex() { return index(generation); },
      async loadShard() {
        if (fail) throw new Error('publication incomplete');
        return shard(`/feature/${generation}`);
      },
    });

    const stable = await source.loadSnapshot();
    generation = 'B';
    fail = true;
    await expectAsync(source.refresh()).toBeRejectedWithError(/publication incomplete/);

    expect(await source.loadSnapshot()).toBe(stable);
    expect(stable.index.artifacts[0]?.hash).toBe('A');

    fail = false;
    const refreshed = await source.refresh();
    expect(refreshed).not.toBe(stable);
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
  });

  it('shares concurrent publication attempts', async () => {
    let indexLoads = 0;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const source = createSource<Artifact, Branch>({
      async loadIndex() { indexLoads++; await gate; return index('A'); },
      async loadShard() { return shard(); },
    });

    const first = source.loadSnapshot();
    const second = source.refresh();
    release();

    expect(await second).toBe(await first);
    expect(indexLoads).toBe(1);
  });


  it('refreshes automatically when the cheap publication revision changes', async () => {
    let generation = 'A';
    let indexLoads = 0;
    const source = createSource<Artifact, Branch>({
      async revision() { return generation; },
      async loadIndex() { indexLoads++; return index(generation); },
      async loadShard() { return shard(`/feature/${generation}`); },
    });

    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('A');
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('A');
    expect(indexLoads).toBe(1);

    generation = 'B';
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
    expect(indexLoads).toBe(2);
  });

  it('does not let callers after invalidation join an older in-flight publication', async () => {
    let generation = 'A';
    let releaseFirst!: () => void;
    let indexLoads = 0;
    const firstGate = new Promise<void>(resolve => { releaseFirst = resolve; });
    const source = createSource<Artifact, Branch>({
      async loadIndex() {
        indexLoads++;
        const captured = generation;
        if (indexLoads === 1) await firstGate;
        return index(captured);
      },
      async loadShard() { return shard(); },
    });

    const stale = source.loadSnapshot();
    generation = 'B';
    source.invalidate();
    const fresh = source.loadSnapshot();
    releaseFirst();

    expect((await fresh).index.artifacts[0]?.hash).toBe('B');
    expect((await stale).index.artifacts[0]?.hash).toBe('A');
    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
    expect(indexLoads).toBe(2);
  });

  it('invalidates the cached generation explicitly', async () => {
    let generation = 'A';
    const source = createSource<Artifact, Branch>({
      async loadIndex() { return index(generation); },
      async loadShard() { return shard(); },
    });

    await source.loadSnapshot();
    generation = 'B';
    source.invalidate();

    expect((await source.loadSnapshot()).index.artifacts[0]?.hash).toBe('B');
  });
});