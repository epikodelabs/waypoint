import path from 'node:path';
import type { AuthorizationDomain } from './authorization-domain.js';

export interface FinalizedArtifactDescriptorV2 {
  readonly kind: 'route' | 'shared';
  readonly artifactKey: string;
  readonly authorization: AuthorizationDomain;
  readonly dependencies: readonly string[];
  readonly file: string;
  readonly hash: string;
  readonly bytes: number;
  readonly imports: readonly string[];
  readonly inputs?: readonly string[];
  readonly routeSetId?: string;
  readonly slotId?: string;
  readonly branchIds?: readonly string[];
  readonly consumers?: readonly string[];
}

export function finalizeArtifactDescriptor(input: {
  readonly manifestDirectory: string;
  readonly planned: Omit<FinalizedArtifactDescriptorV2, 'file' | 'hash' | 'bytes' | 'imports' | 'inputs'>;
  readonly bundled: {
    readonly outputPath: string;
    readonly hash: string;
    readonly bytes: number;
    readonly imports: readonly string[];
    readonly inputs?: readonly string[];
  };
}): FinalizedArtifactDescriptorV2 {
  return Object.freeze({
    ...input.planned,
    file: path.relative(input.manifestDirectory, input.bundled.outputPath).replace(/\\/g, '/'),
    hash: input.bundled.hash,
    bytes: input.bundled.bytes,
    imports: input.bundled.imports,
    inputs: input.bundled.inputs,
  });
}
