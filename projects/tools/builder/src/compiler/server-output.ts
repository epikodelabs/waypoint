import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  commonStaticPrefix,
  type ServerRoutePlan,
} from './server-plan.js';

export interface PublishedServerOutput {
  readonly indexPath: string;
}

export async function publishServerRouteOutput(
  plan: ServerRoutePlan,
  serverRoot: string,
): Promise<PublishedServerOutput> {
  const absoluteRoot =
    path.resolve(serverRoot);

  const temporaryRoot =
    `${absoluteRoot}.tmp-${process.pid}-${Date.now()}`;

  await fs.rm(
    temporaryRoot,
    {
      recursive: true,
      force: true,
    },
  );

  await fs.mkdir(
    path.join(
      temporaryRoot,
      'shards',
    ),
    {
      recursive: true,
    },
  );

  const shardDescriptors: Array<{
    prefix: string;
    file: string;
  }> = [];

  for (const artifact of plan.artifacts) {
    const branches =
      plan.branches.filter(
        branch =>
          branch.routeSetId
            === artifact.routeSetId,
      );

    const shardFile =
      `shards/${safeFileName(artifact.routeSetId)}.json`;

    await fs.writeFile(
      path.join(
        temporaryRoot,
        shardFile,
      ),
      JSON.stringify(
        {
          version: 1,
          branches,
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );

    shardDescriptors.push({
      prefix:
        commonStaticPrefix(branches),
      file:
        shardFile,
    });
  }

  const artifacts =
    plan.artifacts.map(
      artifact => ({
        kind: artifact.kind,
        artifactKey:
          artifact.artifactKey,
        routeSetId:
          artifact.routeSetId,
        dependencies:
          artifact.dependencies,
        branchIds:
          artifact.branchIds,

        /*
         * Browser artifact publication is a later builder phase. Keep file/hash
         * absent until that phase supplies a real physical artifact. The server
         * can still match and authorize routes from this metadata, and it will
         * refuse module delivery until a physical artifact is published.
         */
      }),
    );

  const index = {
    version: 1,
    generatedAt:
      new Date().toISOString(),
    shards:
      shardDescriptors.sort(
        (left, right) =>
          right.prefix.length
          - left.prefix.length,
      ),
    artifacts,
    generationHash:
      crypto
        .createHash('sha256')
        .update(
          JSON.stringify({
            shards:
              shardDescriptors,
            artifacts,
          }),
        )
        .digest('hex')
        .slice(0, 16),
  };

  await fs.writeFile(
    path.join(
      temporaryRoot,
      'server-index.json',
    ),
    JSON.stringify(
      index,
      null,
      2,
    ) + '\n',
    'utf8',
  );

  await fs.rm(
    absoluteRoot,
    {
      recursive: true,
      force: true,
    },
  );

  await fs.rename(
    temporaryRoot,
    absoluteRoot,
  );

  return Object.freeze({
    indexPath:
      path.join(
        absoluteRoot,
        'server-index.json',
      ),
  });
}

function safeFileName(
  value: string,
): string {
  const normalized =
    value.replace(
      /[^A-Za-z0-9._-]+/g,
      '-',
    );

  return normalized || 'routes';
}
