import fs from 'node:fs/promises';
import path from 'node:path';

import type {
  BundledArtifact,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
} from '../compiler/contracts.js';

export interface BundleIsolationInput {
  readonly plan: RouteArtifactPlan;
  readonly bundles: readonly BundledArtifact[];
  readonly publicRoot: string;
  readonly protectedRoot: string;
}

/**
 * Validates physical bundle ownership after bundling.
 *
 * Artifact Plan dependencies are directional: an artifact may depend on its
 * declared parents, but implementation owned by a child route-set must never
 * appear in a parent artifact or in the public host.
 */
export async function validateBundleIsolation(
  input: BundleIsolationInput,
): Promise<readonly RouteCompilerDiagnostic[]> {
  const diagnostics: RouteCompilerDiagnostic[] = [];
  const byKey = new Map(input.bundles.map(bundle => [bundle.artifactKey, bundle]));

  for (const artifact of input.plan.artifacts) {
    const bundle = byKey.get(artifact.artifactKey);
    if (!bundle) continue;

    for (const imported of bundle.imports) {
      const owner = ownerOfOutput(input.bundles, imported);
      if (!owner || owner.artifactKey === bundle.artifactKey) continue;

      if (!artifact.dependencies.includes(owner.artifactKey)) {
        diagnostics.push({
          code: 'WPT4101',
          level: 'error',
          message:
            `Artifact "${artifact.artifactKey}" imports protected output owned by ` +
            `"${owner.artifactKey}" without declaring it as a dependency.`,
        });
      }
    }
  }

  const publicFiles = await collectFiles(input.publicRoot);
  const protectedFiles = await collectFiles(input.protectedRoot);
  const publicSet = new Set(publicFiles.map(file => path.resolve(file)));

  for (const bundle of input.bundles) {
    const output = path.resolve(bundle.outputPath);
    if (publicSet.has(output) || isWithin(input.publicRoot, output)) {
      diagnostics.push({
        code: 'WPT4102',
        level: 'error',
        message:
          `Protected artifact "${bundle.artifactKey}" was emitted inside public host output: ${output}.`,
      });
    }
    if (!isWithin(input.protectedRoot, output)) {
      diagnostics.push({
        code: 'WPT4103',
        level: 'error',
        message:
          `Protected artifact "${bundle.artifactKey}" was emitted outside the protected root: ${output}.`,
      });
    }
  }

  // Ensure the scan actually saw the physical protected build.
  if (input.bundles.length > 0 && protectedFiles.length === 0) {
    diagnostics.push({
      code: 'WPT4104',
      level: 'error',
      message: 'Artifact Plan contains protected artifacts but protected output is empty.',
    });
  }

  return Object.freeze(diagnostics);
}

function ownerOfOutput(
  bundles: readonly BundledArtifact[],
  imported: string,
): BundledArtifact | undefined {
  const absolute = path.resolve(imported);
  return bundles.find(bundle => path.resolve(bundle.outputPath) === absolute);
}

function isWithin(root: string, candidate: string): boolean {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function collectFiles(root: string): Promise<string[]> {
  try {
    const result: string[] = [];
    async function visit(directory: string): Promise<void> {
      for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) await visit(file);
        else result.push(file);
      }
    }
    await visit(root);
    return result;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}
