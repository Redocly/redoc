import type { ReactElement } from 'react';

import { Markdown } from '../common/Markdown.js';
import { isMarkdocAst } from '../../adapters/utils/markdoc.js';
import { Description } from './styled.js';

export type SchemaDescriptionProps = {
  value: unknown;
};

export function SchemaDescription({ value }: SchemaDescriptionProps): ReactElement | null {
  if (!value) return null;

  // A raw string description — parsed lazily here by the host adapter (standalone) — or a scalar
  // (numeric/boolean) coerced to text. Schema descriptions are intentionally NOT parsed at build,
  // so only the ones actually rendered get parsed.
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return (
      <Description>
        <Markdown key={String(value)} source={String(value)} />
      </Description>
    );
  }

  // An already-parsed AST / renderable tree (an embedder that pre-parses descriptions upstream).
  if (isMarkdocAst(value)) {
    return (
      <Description>
        <Markdown key={astKey(value)} source={value} />
      </Description>
    );
  }

  return null;
}

const astKeys = new WeakMap<object, number>();
let nextAstKey = 0;

function astKey(ast: object): number {
  let key = astKeys.get(ast);
  if (key === undefined) {
    key = nextAstKey++;
    astKeys.set(ast, key);
  }
  return key;
}
