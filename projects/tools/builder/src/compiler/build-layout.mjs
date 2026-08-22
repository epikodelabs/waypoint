import path from 'node:path';
export function createBuildLayout(outputPath) {
    const root = path.resolve(outputPath);
    const metadataRoot = path.join(root, '.waypoint');
    return Object.freeze({
        root,
        publicRoot: path.join(root, 'browser'),
        protectedRoot: path.join(root, 'protected'),
        metadataRoot,
        manifest: path.join(metadataRoot, 'manifest.json'),
        serverRoot: path.join(metadataRoot, 'server'),
    });
}
