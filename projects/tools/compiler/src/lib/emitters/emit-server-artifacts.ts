import fs from 'node:fs/promises';
import path from 'node:path';
import { diagnostic } from '../compiler/diagnostics.js';
import type {
  PlannedCompilerOutputs,
  RouteArtifactManifestDocument,
  RouteArtifactPlan,
  RouteCompilerDiagnostic,
  ServerRouteIndexDocument,
} from '../compiler/contracts.js';

export interface EmitServerResult {
  readonly diagnostics: readonly RouteCompilerDiagnostic[];
  readonly emitted: readonly string[];
}

export interface ServerDeliveryDocuments {
  readonly serverIndex: ServerRouteIndexDocument;
  readonly manifest: RouteArtifactManifestDocument;
}

export async function emitServerArtifacts(
  planned: PlannedCompilerOutputs,
  plan: RouteArtifactPlan,
  delivery: ServerDeliveryDocuments = {
    serverIndex: plan.serverIndex,
    manifest: plan.manifest,
  },
): Promise<EmitServerResult> {
  const emitted: string[] = [];

  if (!planned.dryRun) {
    for (const shard of plan.serverShards) {
      await fs.mkdir(path.dirname(shard.outputPath), { recursive: true });
      await writeJson(shard.outputPath, shard.document);
      emitted.push(shard.outputPath);
    }

    await fs.mkdir(path.dirname(planned.serverOutput), { recursive: true });
    await fs.mkdir(path.dirname(planned.manifestOutput), { recursive: true });
    await writeJson(planned.serverOutput, delivery.serverIndex);
    await writeJson(planned.manifestOutput, delivery.manifest);
    emitted.push(planned.serverOutput, planned.manifestOutput);
  }

  return {
    diagnostics: [diagnostic(
      'WPT3100',
      'info',
      `${planned.dryRun ? 'Planned' : 'Emitted'} ${delivery.manifest.routes.length} route branches, ${delivery.manifest.slots.length} slots, and ${delivery.manifest.routeSets.length} route sets into ${plan.serverShards.length} shard(s).`,
    )],
    emitted,
  };
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
