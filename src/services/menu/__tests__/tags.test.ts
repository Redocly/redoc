import { processOperation } from '../tags.js';
import type { OpenAPIParser } from '../../OpenAPIParser.js';

describe('processOperation', () => {
  let parser: OpenAPIParser;
  let tagsMap: any;

  beforeEach(() => {
    parser = {
      definition: {},
      deref: vi.fn().mockReturnValue({ resolved: {} }),
    } as unknown as OpenAPIParser;

    tagsMap = {};
  });

  it('adds operation to existing tag', () => {
    const operationInfo = { summary: 'Test op', tags: ['tag1'] };
    tagsMap['tag1'] = { name: 'tag1', operations: [] };

    processOperation(parser, 'get', operationInfo, '/path', {}, tagsMap);

    expect(tagsMap['tag1'].operations).toHaveLength(1);
    expect(tagsMap['tag1'].operations[0].summary).toBe('Test op');
  });

  it('creates tag if it does not exist', () => {
    const operationInfo = { summary: 'New op', tags: ['newTag'] };

    processOperation(parser, 'post', operationInfo, '/path', {}, tagsMap);

    expect(tagsMap['newTag']).toBeDefined();
    expect(tagsMap['newTag'].operations[0].summary).toBe('New op');
  });

  it('assigns empty tag if operation has no tags', () => {
    const operationInfo = { summary: 'No tag op' };

    processOperation(parser, 'put', operationInfo, '/path', {}, tagsMap);

    expect(tagsMap['']).toBeDefined();
    expect(tagsMap[''].operations[0].httpVerb).toBe('put');
  });

  it('assigns default webhook tag if isWebhook is true and no tags', () => {
    const operationInfo = { summary: 'Webhook op' };

    processOperation(parser, 'post', operationInfo, '/webhook', {}, tagsMap, true);

    expect(tagsMap['webhooks']).toBeDefined();
    expect(tagsMap['webhooks'].operations[0].isWebhook).toBe(true);
  });

  it('skips operations with x-traitTag', () => {
    const operationInfo = { summary: 'Trait op', tags: ['traitTag'] };
    tagsMap['traitTag'] = { name: 'traitTag', operations: [], 'x-traitTag': true };

    processOperation(parser, 'get', operationInfo, '/path', {}, tagsMap);

    expect(tagsMap['traitTag'].operations).toHaveLength(0);
  });

  it('processes additionalOperations correctly', () => {
    const path = {
      additionalOperations: {
        test: { summary: 'Additional op', tags: ['tag2'] },
      },
    };
    tagsMap['tag2'] = { name: 'tag2', operations: [] };

    processOperation(
      parser,
      'test',
      path.additionalOperations.test,
      '/path',
      path,
      tagsMap,
      false,
      true,
    );

    expect(tagsMap['tag2'].operations).toHaveLength(1);
    expect(tagsMap['tag2'].operations[0].isAdditionalOperation).toBe(true);
  });
});
