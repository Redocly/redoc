import type { Node } from '@markdoc/markdoc';

export const simplifyAstStructure = (ast: Node): Node | Node[] => {
  // we slice extra document level in ast
  if (ast.type === 'document' && ast.children?.length) {
    return ast.children.map(simplifyNode) as unknown as Node[];
  }
  return simplifyNode(ast) as unknown as Node;
};

function simplifyNode(node: Node): Record<string, unknown> {
  const out: Record<string, unknown> = { $$mdtype: 'Node', type: node.type };

  if (node.tag !== undefined) {
    out.tag = node.tag;
  }
  if (node.inline) {
    out.inline = true;
  }
  if (node.errors && node.errors.length > 0) {
    out.errors = node.errors;
  }
  if (node.slots && Object.keys(node.slots).length > 0) {
    out.slots = Object.fromEntries(
      Object.entries(node.slots).map(([name, slot]) => [name, simplifyNode(slot)]),
    );
  }
  // Always kept — raw (non-revived) walkers iterate these unconditionally. Attribute values are
  // kept by reference; nested $$mdtype values (Function/Variable) carry their own revival markers.
  out.attributes = node.attributes ?? {};
  out.children = node.children ? node.children.map(simplifyNode) : [];

  return out;
}
