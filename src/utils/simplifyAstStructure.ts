import type { Node } from '@markdoc/markdoc';

export const simplifyAstStructure = (ast: Node): Node | Node[] => {
  clearRedundantProperties(ast);

  for (const node of ast.walk()) {
    clearRedundantProperties(node);

    if (node?.children?.length) {
      simplifyAstStructure(node);
    }
  }

  function clearRedundantProperties(node: Node) {
    // location no needs in runtime we need it only for validation
    if (node?.location) {
      delete node.location;
    }

    // tag is optional in AST, no need to keep undefined values
    if (node.tag === undefined) {
      delete node.tag;
    }
  }

  // we slice extra document level in ast
  return ast.type === 'document' && ast?.children?.length ? ast?.children : ast;
};
