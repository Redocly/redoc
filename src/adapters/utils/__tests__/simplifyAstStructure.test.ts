import markdoc from '@markdoc/markdoc';
import { describe, it, expect } from 'vitest';

import type { Node } from '@markdoc/markdoc';

import { simplifyAstStructure } from '../simplifyAstStructure.js';

// Simplified nodes are plain objects — traverse manually (markdoc's walk() is a Node method).
function allNodes(ast: Node | Node[]): Array<Record<string, unknown>> {
  const collected: Array<Record<string, unknown>> = [];
  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!node || typeof node !== 'object') return;
    const obj = node as Record<string, unknown>;
    collected.push(obj);
    visit(obj.children);
    if (obj.slots) visit(Object.values(obj.slots));
  };
  visit(ast);
  return collected;
}

describe('simplifyAstStructure', () => {
  it('removes redundant properties from AST', () => {
    const simplified = simplifyAstStructure(markdoc.parse('- item **bold**\n- another'));

    for (const node of allNodes(simplified)) {
      expect(node.location).toBeUndefined();
      expect('tag' in node && node.tag === undefined).toBe(false);
    }
  });

  it('strips serialization-only bookkeeping fields from every node', () => {
    const simplified = simplifyAstStructure(
      markdoc.parse('Intro **bold** and a [link](https://x.com).\n\n# Heading\n\n- a\n- b'),
    );

    for (const node of allNodes(simplified)) {
      expect(node.errors).toBeUndefined();
      expect(node.lines).toBeUndefined();
      expect(node.annotations).toBeUndefined();
      expect(node.slots).toBeUndefined();
      // `inline` is dropped when false (constructor default) and kept only when true — so it is
      // never present as `false`. Asserted unconditionally: undefined or true both pass.
      expect(node.inline).not.toBe(false);
    }
  });

  it('keeps structural containers so raw (non-revived) consumers can walk them', () => {
    // Search indexing (portal to-markdown) walks the stored AST WITHOUT markdoc revival, doing
    // `for (const child of node.children)` and `node.children.map(...)`. Every node must keep an
    // iterable `children` array and an `attributes` object even when empty.
    const simplified = simplifyAstStructure(
      markdoc.parse('Text with `code`, an ![img](i.png), and a soft\nbreak.\n\n---\n'),
    );

    for (const node of allNodes(simplified)) {
      expect(Array.isArray(node.children)).toBe(true);
      expect(typeof node.attributes).toBe('object');
      expect(node.attributes).not.toBeNull();
    }
  });

  it('keeps meaningful fields intact', () => {
    const simplified = simplifyAstStructure(markdoc.parse('# Title\n\nSome *emphasis* text.'));
    const nodes = allNodes(simplified);

    const heading = nodes.find((n) => n.type === 'heading');
    expect((heading?.attributes as Record<string, unknown> | undefined)?.level).toBe(1);
    const text = nodes.find((n) => n.type === 'text');
    expect((text?.attributes as Record<string, unknown> | undefined)?.content).toBeDefined();
    // Inline-level nodes keep their `inline: true` flag (only the false default is dropped).
    expect(text?.inline).toBe(true);
  });

  it('round-trips through JSON revival to the same transformed output', () => {
    const source = 'Intro **bold**, `code`, [link](https://x.com).\n\n# Heading\n\n- a\n- b';
    const original = markdoc.parse(source);
    const simplified = simplifyAstStructure(markdoc.parse(source));

    const revived = markdoc.Ast.fromJSON(JSON.stringify(simplified)) as Node | Node[];
    const transform = (ast: Node | Node[]) =>
      JSON.stringify(
        Array.isArray(ast) ? ast.map((n) => markdoc.transform(n)) : markdoc.transform(ast),
      );

    expect(transform(revived)).toBe(transform(original.children));
  });
});
