import { Node } from '@markdoc/markdoc';

import { simplifyAstStructure } from '../simplifyAstStructure';

describe('simplifyAstStructure', () => {
  it('should remove location from AST nodes', () => {
    const mockAst = new Node('document', {}, [
      new Node('paragraph', {}, [new Node('text', { content: 'Hello world' })]),
    ]);

    const result = simplifyAstStructure(mockAst) as Node;

    expect(result.location).toBeUndefined();
    expect(result[0].location).toBeUndefined();
    expect(result[0].children[0].location).toBeUndefined();

    expect(result).toMatchSnapshot();
  });

  it('should handle empty AST', () => {
    const mockAst = new Node('document', {}, []);

    const result = simplifyAstStructure(mockAst) as Node;

    expect(result.location).toBeUndefined();
    expect(result).toMatchSnapshot();
  });

  it('should return full AST when not a document node type', () => {
    const mockAst = new Node('text', { content: 'Some text' });
    const openapiNode = { title: 'API Documentation' };

    const result = simplifyAstStructure(mockAst as any, openapiNode);

    expect(result).toMatchSnapshot();
  });
});
