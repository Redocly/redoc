import type { AsyncApiDefinition, AsyncApiServerVariables } from '../../../types/asyncapi.js';

import { resolveInDoc } from './resolveInDoc.js';

/** The server's variables with `$ref` entries resolved; unresolvable entries are kept as-is. */
export function resolveServerVariables(
  document: AsyncApiDefinition,
  variables: AsyncApiServerVariables | undefined,
): AsyncApiServerVariables | undefined {
  if (!variables) return variables;
  return Object.fromEntries(
    Object.entries(variables).map(([name, variable]) => [
      name,
      resolveInDoc<AsyncApiServerVariables[string]>(document, variable) ?? variable,
    ]),
  );
}
