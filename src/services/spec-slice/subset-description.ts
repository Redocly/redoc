import { isRecord } from '../../adapters/helpers.js';
import { describeSliceSubset } from './assistant-links.js';

import type { SpecSliceScope } from './types.js';

/** `leftOutDepth`: the `$ref` hop limit, when the slice left out components past it. */
export function describeSubsetInInfo(
  draft: Record<string, unknown>,
  scope: SpecSliceScope,
  leftOutDepth?: number,
): void {
  const { info } = draft;
  if (!isRecord(info)) return;
  const leftOut =
    leftOutDepth === undefined
      ? ''
      : ` Components more than ${leftOutDepth} \`$ref\` hops away are not included.`;
  draft.info = { ...info, description: `${describeSliceSubset(scope)}${leftOut}` };
}
