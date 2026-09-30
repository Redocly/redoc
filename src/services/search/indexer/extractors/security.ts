import { hasRbacScope } from '../../../../adapters/rbac.js';

import type { SecurityNode } from '../../../../types/content.js';
import type { ExtractContext } from './context.js';

import { makeParam } from '../param.js';
import { SECURITY_PLACE } from '../places.js';
import { addRow } from './context.js';

/** One row per security scheme the operation accepts: name plus the short type line and scopes. */
export function extractSecurityRows(node: SecurityNode, ctx: ExtractContext): void {
  for (const requirement of node.requirements) {
    for (const scheme of requirement.schemes) {
      if (hasRbacScope(scheme)) continue;
      addRow(
        ctx,
        makeParam({
          name: scheme.name,
          description: [
            scheme.type,
            scheme.scheme,
            scheme.bearerFormat,
            scheme.in ? `in ${scheme.in}` : '',
            scheme.paramName,
            scheme.scopes?.length ? `scopes: ${scheme.scopes.join(', ')}` : '',
          ]
            .filter(Boolean)
            .join(' '),
          place: SECURITY_PLACE,
          type: 'unknown',
        }),
      );
    }
  }
}
