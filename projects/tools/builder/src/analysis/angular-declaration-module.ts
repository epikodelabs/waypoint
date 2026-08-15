import fs from 'node:fs/promises';

export interface AngularDeclarationScan {
  readonly moduleId: string;
  readonly declarations: readonly string[];
}

/**
 * Lightweight post-AOT scan.
 *
 * Angular compiled declarations are recognizable through static fields such as:
 *   ɵcmp
 *   ɵdir
 *   ɵpipe
 *   ɵmod
 *
 * We only need to know whether a module contains identity-sensitive Angular
 * declarations, not to reconstruct Angular metadata.
 */
export async function scanAngularDeclarationModule(
  moduleId: string,
): Promise<AngularDeclarationScan> {
  const source = await fs.readFile(moduleId, 'utf8');

  const declarations = new Set<string>();

  for (const match of source.matchAll(
    /(?:class|const|let|var)\s+([A-Za-z_$][\w$]*)[\s\S]{0,400}?\.(?:ɵcmp|ɵdir|ɵpipe|ɵmod)\s*=/g,
  )) {
    declarations.add(match[1]!);
  }

  if (declarations.size === 0) {
    for (const match of source.matchAll(
      /([A-Za-z_$][\w$]*)\.(?:ɵcmp|ɵdir|ɵpipe|ɵmod)\s*=/g,
    )) {
      declarations.add(match[1]!);
    }
  }

  return Object.freeze({
    moduleId,
    declarations: Object.freeze([...declarations].sort()),
  });
}
