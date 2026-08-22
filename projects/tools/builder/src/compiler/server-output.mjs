import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { commonStaticPrefix, } from './server-plan.mjs';
export async function publishServerRouteOutput(plan, serverRoot, publishedArtifacts) {
    const absoluteRoot = path.resolve(serverRoot);
    const temporaryRoot = `${absoluteRoot}.tmp-${process.pid}-${Date.now()}`;
    await fs.rm(temporaryRoot, {
        recursive: true,
        force: true,
    });
    await fs.mkdir(path.join(temporaryRoot, 'shards'), {
        recursive: true,
    });
    const shardDescriptors = [];
    for (const artifact of plan.artifacts) {
        const branches = plan.branches.filter(branch => branch.routeSetId
            === artifact.routeSetId);
        const shardFile = `shards/${safeFileName(artifact.routeSetId)}.json`;
        await fs.writeFile(path.join(temporaryRoot, shardFile), JSON.stringify({
            version: 1,
            branches,
        }, null, 2) + '\n', 'utf8');
        shardDescriptors.push({
            prefix: commonStaticPrefix(branches),
            file: shardFile,
        });
    }
    const physicalByKey = new Map(publishedArtifacts.map(artifact => [
        artifact.artifactKey,
        artifact,
    ]));
    const artifacts = plan.artifacts.map(artifact => {
        const physical = physicalByKey.get(artifact.artifactKey);
        if (!physical) {
            throw new Error(`Protected artifact "${artifact.artifactKey}" was not published.`);
        }
        return {
            kind: artifact.kind,
            artifactKey: artifact.artifactKey,
            routeSetId: artifact.routeSetId,
            dependencies: artifact.dependencies,
            branchIds: artifact.branchIds,
            file: portableRelative(absoluteRoot, physical.outputPath),
            hash: physical.hash,
            bytes: physical.bytes,
        };
    });
    const index = {
        version: 1,
        generatedAt: new Date().toISOString(),
        shards: shardDescriptors.sort((left, right) => right.prefix.length
            - left.prefix.length),
        artifacts,
        generationHash: crypto
            .createHash('sha256')
            .update(JSON.stringify({
            shards: shardDescriptors,
            artifacts,
        }))
            .digest('hex')
            .slice(0, 16),
    };
    await fs.writeFile(path.join(temporaryRoot, 'server-index.json'), JSON.stringify(index, null, 2) + '\n', 'utf8');
    await fs.rm(absoluteRoot, {
        recursive: true,
        force: true,
    });
    await fs.rename(temporaryRoot, absoluteRoot);
    return Object.freeze({
        indexPath: path.join(absoluteRoot, 'server-index.json'),
    });
}
function portableRelative(from, to) {
    let relative = path.relative(from, to)
        .split(path.sep)
        .join('/');
    if (!relative.startsWith('.')) {
        relative = `./${relative}`;
    }
    return relative;
}
function safeFileName(value) {
    const normalized = value.replace(/[^A-Za-z0-9._-]+/g, '-');
    return normalized || 'routes';
}
