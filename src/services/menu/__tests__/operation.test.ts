import { getOperationsItems } from '../operation.js';

vi.mock('../../../utils/index.js', () => ({
  encodeBackSlashes: vi.fn((str) => str.toLowerCase()),
  getOperationId: vi.fn(
    (operation, parent) => `${parent?.id || 'root'}-${operation.httpVerb}-${operation.pathName}`,
  ),
  getOperationName: vi.fn(
    (operation) => operation.summary || `${operation.httpVerb.toUpperCase()} ${operation.pathName}`,
  ),
}));

describe('getOperationsItems sorting logic', () => {
  const mockParent = {
    id: 'test-tag',
    name: 'Test Tag',
    type: 'tag' as const,
    items: [],
    depth: 1,
    level: 1,
    href: '/test-tag',
  };

  const createMockOperation = (overrides = {}) => ({
    httpVerb: 'get',
    pathName: '/test',
    summary: 'Test operation',
    deprecated: false,
    isAdditionalOperation: false,
    isWebhook: false,
    operationId: 'test-operation',
    'x-badges': [],
    ...overrides,
  });

  const createMockTag = (operations) => ({
    name: 'test-tag',
    operations,
  });

  test('should sort non-deprecated operations before deprecated ones', () => {
    const operations = [
      createMockOperation({ httpVerb: 'post', summary: 'Deprecated POST', deprecated: true }),
      createMockOperation({ httpVerb: 'get', summary: 'Active GET', deprecated: false }),
      createMockOperation({ httpVerb: 'put', summary: 'Deprecated PUT', deprecated: true }),
      createMockOperation({ httpVerb: 'delete', summary: 'Active DELETE', deprecated: false }),
    ];

    const tag = createMockTag(operations);
    const result = getOperationsItems(mockParent, tag, 1);

    expect(result).toHaveLength(4);
    expect(result[0].httpVerb).toBe('get');
    expect(result[0].deprecated).toBe(false);
    expect(result[1].httpVerb).toBe('delete');
    expect(result[1].deprecated).toBe(false);
    expect(result[2].httpVerb).toBe('post');
    expect(result[2].deprecated).toBe(true);
    expect(result[3].httpVerb).toBe('put');
    expect(result[3].deprecated).toBe(true);
  });

  test('should apply combined sorting: non-deprecated regular, non-deprecated additional, deprecated regular, deprecated additional', () => {
    const operations = [
      createMockOperation({
        httpVerb: 'deprecated-additional',
        summary: 'Deprecated additional operation',
        isAdditionalOperation: true,
        deprecated: true,
      }),
      createMockOperation({
        httpVerb: 'active-regular',
        summary: 'Active regular operation',
        isAdditionalOperation: false,
        deprecated: false,
      }),
      createMockOperation({
        httpVerb: 'deprecated-regular',
        summary: 'Deprecated regular operation',
        isAdditionalOperation: false,
        deprecated: true,
      }),
      createMockOperation({
        httpVerb: 'active-additional',
        summary: 'Active additional operation',
        isAdditionalOperation: true,
        deprecated: false,
      }),
    ];

    const tag = createMockTag(operations);
    const result = getOperationsItems(mockParent, tag, 1);

    expect(result).toHaveLength(4);

    expect(result[0].httpVerb).toBe('active-regular');
    expect(result[0].deprecated).toBe(false);
    expect(result[0].isAdditionalOperation).toBe(false);

    expect(result[1].httpVerb).toBe('active-additional');
    expect(result[1].deprecated).toBe(false);
    expect(result[1].isAdditionalOperation).toBe(true);

    expect(result[2].httpVerb).toBe('deprecated-regular');
    expect(result[2].deprecated).toBe(true);
    expect(result[2].isAdditionalOperation).toBe(false);

    expect(result[3].httpVerb).toBe('deprecated-additional');
    expect(result[3].deprecated).toBe(true);
    expect(result[3].isAdditionalOperation).toBe(true);
  });
});
