import { renderHook } from '@testing-library/react';

import {
  normalizeOptions,
  OpenAPIParser,
  type ExtendedOpenAPIOperation,
} from '../../../services/index.js';
import { getOperation } from '../../../models/index.js';
import testDefinition from '../../MediaTypeSwitch/__tests__/fixtures/test-definition.json';
import { useExampleKey } from '../../Samples/use-example-key.js';
import type { OpenAPIDefinition } from '../../../types/index.js';

describe('useExampleKey method', () => {
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(
    testDefinition as unknown as OpenAPIDefinition,
    undefined,
    options,
  );

  test('should take firstKey as exampleKey if activeExampleName and defaultExampleName are missing', () => {
    const operation = getOperation(
      parser,
      {
        pointer: '#/paths/~1test/get',
        pathName: '/test',
        httpVerb: 'GET',
        pathParameters: [],
        pathServers: [],
        isWebhook: false,
        operationId: 'getPet',
        ...testDefinition.paths['/test'].get,
      } as unknown as ExtendedOpenAPIOperation,
      undefined,
      options,
      '',
    );

    const { result } = renderHook(() => useExampleKey(operation, { key: 'test' }));
    expect(result.current.exampleKey).toBe('key');
  });

  test('should not brake if no operation passed and should take firstKey as exampleKey', () => {
    const { result } = renderHook(() => useExampleKey(undefined, { key: 'test' }));
    expect(result.current.exampleKey).toBe('key');
  });
});
