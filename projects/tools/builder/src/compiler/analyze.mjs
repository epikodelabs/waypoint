import fs from 'node:fs';
import path from 'node:path';
import { loadNavigationSnapshot, } from './navigation-snapshot.mjs';
import { createServerRoutePlan, } from './server-plan.mjs';
export async function analyze(options) {
    const entry = path.resolve(options.entry);
    const diagnostics = [];
    const projectRoot = findProjectRoot(entry);
    const planned = Object.freeze({
        entry,
        projectRoot,
        serverOutput: path.resolve(options.serverOutput),
        artifactsOutput: path.resolve(options.artifactsOutput),
        buildManifestOutput: options.buildManifestOutput
            ? path.resolve(options.buildManifestOutput)
            : undefined,
    });
    if (!fs.existsSync(entry)) {
        diagnostics.push({
            level: 'error',
            code: 'WPT1001',
            message: `Waypoint navigation entry does not exist: ${entry}`,
        });
        return Object.freeze({
            success: false,
            diagnostics: Object.freeze(diagnostics),
            planned,
        });
    }
    try {
        const metadataRoot = path.dirname(planned.serverOutput);
        const snapshot = await loadNavigationSnapshot(projectRoot, entry, metadataRoot);
        const plan = createServerRoutePlan(snapshot);
        if (plan.artifacts.length === 0) {
            diagnostics.push({
                level: 'warning',
                code: 'WPT2001',
                message: 'No routesFor() contributions were discovered.',
            });
        }
        return Object.freeze({
            success: true,
            diagnostics: Object.freeze(diagnostics),
            planned,
            snapshot,
            plan,
        });
    }
    catch (error) {
        diagnostics.push({
            level: 'error',
            code: 'WPT1002',
            message: error instanceof Error
                ? error.message
                : String(error),
        });
        return Object.freeze({
            success: false,
            diagnostics: Object.freeze(diagnostics),
            planned,
        });
    }
}
function findProjectRoot(entry) {
    let current = path.dirname(entry);
    while (true) {
        if (fs.existsSync(path.join(current, 'tsconfig.app.json'))) {
            return current;
        }
        const parent = path.dirname(current);
        if (parent === current) {
            throw new Error(`Could not locate Angular project root for "${entry}".`);
        }
        current = parent;
    }
}
