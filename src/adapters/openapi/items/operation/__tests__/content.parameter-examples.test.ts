import { describe, expect, it } from 'vitest';

import type { ApiDocsOptions } from '../../../../../types/options.js';
import type {
  OpenApiBuildContext as BuildContext,
  OperationInfo,
  OpenAPIDefinition,
} from '../../../../../types/openapi.js';

import { buildItemContent } from '../content.js';
import { createStoreContext } from '../../../../helpers.js';
import { openApiContext } from '../../../buildContext.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

type ExamplesMap = Record<string, { description?: unknown }>;

const document = {
  openapi: '3.1.0',
  info: { title: 'Test', version: '1.0' },
} as OpenAPIDefinition;

function findExamplesMap(root: unknown, key: string): ExamplesMap | undefined {
  if (!root || typeof root !== 'object') return undefined;
  const { examples } = root as { examples?: ExamplesMap };
  if (examples && typeof examples === 'object' && key in examples) return examples;
  for (const child of Object.values(root)) {
    const found = findExamplesMap(child, key);
    if (found) return found;
  }
  return undefined;
}

describe('parameter example descriptions', () => {
  it('keeps a parsed (AST) example description, not only a string one', () => {
    const ast = markdocParser('Use `manual-review` first.');
    const operationInfo = {
      pointer: '/paths/~1test/get',
      pathName: '/test',
      httpVerb: 'get',
      tags: ['Test'],
      parameters: [
        {
          name: 'mode',
          in: 'query',
          schema: { type: 'string' },
          examples: {
            parsed: { description: ast, value: 'a' },
            plain: { description: 'Plain text', value: 'b' },
          },
        },
      ],
      responses: { '200': { description: 'OK' } },
    } as unknown as OperationInfo;
    const context: BuildContext = {
      storeCtx: createStoreContext(document),
      document,
      options: { markdownParser: markdocParser } as ApiDocsOptions,
      basePath: '/',
      downloadUrls: [],
      languages: [],
      tagsMap: new Map(),
      collectedTagOrder: [],
      badgeTags: [],
    };

    const content = openApiContext.run(context, () => buildItemContent(operationInfo, '/test/op'));

    const examples = findExamplesMap(content, 'parsed');
    expect(examples?.parsed.description).toBe(ast);
    expect(examples?.plain.description).toBe('Plain text');
  });
});
