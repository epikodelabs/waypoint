import type { SourceReference } from '../ir/model.js';
import {
  NO_IR_REF,
  readIrString,
  type IrSourceRef,
  type NavigationIr,
} from '../ir/navigation-ir.js';

export function decodeIrSource(
  ir: NavigationIr,
  ref: IrSourceRef,
): SourceReference | undefined {
  if (ref === NO_IR_REF) return undefined;
  const source = ir.sources[ref];
  if (!source) return undefined;
  const filePath = readIrString(ir, source.filePath);
  if (!filePath) return undefined;
  return {
    filePath,
    exportName: readIrString(ir, source.exportName),
    localName: readIrString(ir, source.localName),
    start: source.start,
    length: source.length,
  };
}
