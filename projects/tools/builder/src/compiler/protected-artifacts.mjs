import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import * as angularCompilerCli from '@angular/compiler-cli';
import { build, } from 'esbuild';
import ts from 'typescript';
import { collectHostModuleExports, createHostRuntimePlugin, } from './host-runtime-plugin.mjs';
const { formatDiagnostics, performCompilation, readConfiguration, } = angularCompilerCli;
/**
 * Full-AOT compiles the route project once, then independently bundles every
 * discovered routesFor() contribution. No protected contribution is reachable
 * from the public Angular host graph.
 */
export async function buildProtectedRouteArtifacts(analysis) {
    if (!analysis.plan) {
        throw new Error('Cannot build protected artifacts without a route plan.');
    }
    const workspaceRoot = path.resolve(process.cwd());
    const projectRoot = analysis.planned.projectRoot;
    const artifactTsConfig = await existingArtifactTsConfig(projectRoot);
    const aotRoot = path.join(path.dirname(analysis.planned.serverOutput), `.aot-${process.pid}-${randomUUID()}`);
    await fs.rm(aotRoot, { recursive: true, force: true });
    await fs.mkdir(aotRoot, { recursive: true });
    try {
        await compileFullAot(workspaceRoot, artifactTsConfig, aotRoot);
        const hostExports = await collectHostModuleExports(aotRoot);
        const entriesRoot = path.join(aotRoot, '.entries');
        await fs.mkdir(entriesRoot, { recursive: true });
        const prepared = [];
        for (const artifact of analysis.plan.artifacts) {
            const entryPoint = await writeArtifactEntry(workspaceRoot, aotRoot, entriesRoot, artifact);
            prepared.push(await bundleArtifact(analysis.planned.artifactsOutput, artifact, entryPoint, hostExports));
        }
        return Object.freeze(prepared);
    }
    finally {
        await fs.rm(aotRoot, { recursive: true, force: true });
    }
}
/**
 * Makes the new content-addressed files visible without removing files used by
 * the currently published server index. The server index is swapped afterward;
 * stale files are removed only after that succeeds.
 */
export async function publishProtectedRouteArtifacts(outputRoot, prepared) {
    const absoluteRoot = path.resolve(outputRoot);
    await fs.mkdir(absoluteRoot, { recursive: true });
    for (const item of prepared) {
        const finalPath = item.descriptor.outputPath;
        requireInside(absoluteRoot, finalPath);
        const temporary = `${finalPath}.tmp-${process.pid}-${randomUUID()}`;
        await fs.writeFile(temporary, item.outputFile.contents);
        try {
            await fs.rename(temporary, finalPath);
        }
        catch (error) {
            await fs.rm(temporary, { force: true }).catch(() => undefined);
            // A concurrent identical build may already have published this hash.
            try {
                const current = await fs.readFile(finalPath);
                if (crypto
                    .createHash('sha256')
                    .update(current)
                    .digest('hex')
                    === crypto
                        .createHash('sha256')
                        .update(item.outputFile.contents)
                        .digest('hex')) {
                    continue;
                }
            }
            catch {
                // Report the original atomic publication failure.
            }
            throw error;
        }
    }
    return Object.freeze(prepared.map(item => item.descriptor));
}
export async function removeStaleProtectedRouteArtifacts(outputRoot, active) {
    const root = path.resolve(outputRoot);
    const keep = new Set(active.map(item => path.resolve(item.outputPath)));
    let entries;
    try {
        entries =
            await fs.readdir(root, { withFileTypes: true });
    }
    catch {
        return;
    }
    await Promise.all(entries.map(async (entry) => {
        if (!entry.isFile()
            || !/\.m?js$/i.test(entry.name)) {
            return;
        }
        const file = path.resolve(root, entry.name);
        if (!keep.has(file)) {
            await fs.rm(file, { force: true });
        }
    }));
}
async function compileFullAot(workspaceRoot, project, outputRoot) {
    const config = readConfiguration(project, {
        rootDir: workspaceRoot,
        outDir: outputRoot,
        declaration: false,
        declarationMap: false,
        emitDeclarationOnly: false,
        sourceMap: false,
        inlineSourceMap: false,
        inlineSources: false,
        noEmit: false,
        noEmitOnError: true,
        compilationMode: 'full',
    });
    requireNoAngularErrors(config.errors, project);
    const result = performCompilation({
        rootNames: config.rootNames,
        options: config.options,
        emitFlags: config.emitFlags,
    });
    requireNoAngularErrors(result.diagnostics, project);
}
async function writeArtifactEntry(workspaceRoot, aotRoot, entriesRoot, artifact) {
    const relative = path.relative(workspaceRoot, artifact.sourceFile);
    requireRelativeInside(relative, artifact.sourceFile, workspaceRoot);
    const emittedSource = path.join(aotRoot, relative.replace(/\.(?:[cm]?ts|tsx)$/i, '.js'));
    await requireFile(emittedSource, artifact);
    const entryPath = path.join(entriesRoot, `${safeStem(artifact.artifactKey)}.mjs`);
    let importPath = path.relative(path.dirname(entryPath), emittedSource).replace(/\\/g, '/');
    if (!importPath.startsWith('.')) {
        importPath = `./${importPath}`;
    }
    await fs.writeFile(entryPath, `export { ${artifact.exportName} as default } from ${JSON.stringify(importPath)};\n`, 'utf8');
    return entryPath;
}
async function bundleArtifact(outputRoot, artifact, entryPoint, hostExports) {
    const stem = safeStem(artifact.artifactKey);
    const result = await build({
        entryPoints: [entryPoint],
        absWorkingDir: path.dirname(entryPoint),
        outdir: path.resolve(outputRoot),
        entryNames: `${stem}-[hash]`,
        bundle: true,
        format: 'esm',
        platform: 'browser',
        splitting: false,
        packages: 'bundle',
        plugins: [
            createHostRuntimePlugin(hostExports),
        ],
        metafile: true,
        write: false,
        logLevel: 'silent',
        legalComments: 'none',
        charset: 'utf8',
        target: 'es2022',
    });
    const output = requireJavaScriptOutput(result.outputFiles ?? [], artifact);
    const meta = requireJavaScriptMetadata(result.metafile, artifact);
    const external = meta.imports.filter(item => item.external);
    if (external.length > 0) {
        throw new Error(`Protected artifact "${artifact.artifactKey}" retained external imports: `
            + external
                .map(item => item.path)
                .join(', '));
    }
    const outputPath = path.resolve(output.path);
    requireInside(path.resolve(outputRoot), outputPath);
    const fileName = path.basename(outputPath);
    const hash = contentHash(output.contents);
    // Use our cryptographic content hash as the public identity and filename.
    const finalFileName = `${stem}-${hash}.js`;
    const finalPath = path.join(path.resolve(outputRoot), finalFileName);
    return Object.freeze({
        outputFile: {
            ...output,
            path: finalPath,
        },
        descriptor: Object.freeze({
            artifactKey: artifact.artifactKey,
            routeSetId: artifact.routeSetId,
            outputPath: finalPath,
            fileName: finalFileName,
            hash,
            bytes: output.contents.byteLength,
            imports: Object.freeze([...new Set(meta.imports.map(item => item.path))].sort()),
            inputs: Object.freeze(Object.keys(meta.inputs)
                .sort()),
        }),
    });
}
function contentHash(contents) {
    return crypto
        .createHash('sha256')
        .update(contents)
        .digest('hex')
        .slice(0, 20);
}
async function existingArtifactTsConfig(projectRoot) {
    const artifact = path.join(projectRoot, 'tsconfig.artifacts.json');
    try {
        await fs.access(artifact);
        return artifact;
    }
    catch {
        return path.join(projectRoot, 'tsconfig.app.json');
    }
}
function requireNoAngularErrors(diagnostics, project) {
    const errors = diagnostics.filter(item => item.category
        === ts.DiagnosticCategory.Error);
    if (errors.length === 0)
        return;
    throw new Error(`Angular full-AOT compilation failed for ${JSON.stringify(project)}:\n${formatDiagnostics(errors)}`);
}
async function requireFile(file, artifact) {
    try {
        if ((await fs.stat(file)).isFile()) {
            return;
        }
    }
    catch {
        // Artifact-specific error below.
    }
    throw new Error(`Angular AOT did not emit ${JSON.stringify(artifact.sourceFile)} for protected artifact ${JSON.stringify(artifact.artifactKey)}. Expected ${JSON.stringify(file)}.`);
}
function requireJavaScriptOutput(outputs, artifact) {
    const candidates = outputs.filter(file => /\.(?:m?js)$/i.test(file.path));
    if (candidates.length !== 1) {
        throw new Error(`Expected one JavaScript output for protected artifact "${artifact.artifactKey}" `
            + `but received ${candidates.length}.`);
    }
    return candidates[0];
}
function requireJavaScriptMetadata(metafile, artifact) {
    if (!metafile) {
        throw new Error(`esbuild did not return metadata for protected artifact "${artifact.artifactKey}".`);
    }
    const candidates = Object.entries(metafile.outputs).filter(([file]) => /\.(?:m?js)$/i.test(file));
    if (candidates.length !== 1) {
        throw new Error(`Expected one JavaScript metadata output for protected artifact "${artifact.artifactKey}" `
            + `but received ${candidates.length}.`);
    }
    return candidates[0][1];
}
function safeStem(value) {
    return value
        .replace(/[^A-Za-z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()
        || 'routes';
}
function requireRelativeInside(relative, target, root) {
    if (relative === '..'
        || relative.startsWith(`..${path.sep}`)
        || path.isAbsolute(relative)) {
        throw new Error(`Protected source ${JSON.stringify(target)} is outside workspace ${JSON.stringify(root)}.`);
    }
}
function requireInside(root, file) {
    const relation = path.relative(path.resolve(root), path.resolve(file));
    if (relation === '..'
        || relation.startsWith(`..${path.sep}`)
        || path.isAbsolute(relation)) {
        throw new Error(`Protected artifact path "${file}" escapes "${root}".`);
    }
}
