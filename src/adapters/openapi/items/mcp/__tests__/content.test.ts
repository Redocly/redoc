import { describe, it, expect } from 'vitest';

import type { ContainerNode } from '../../../../../types/content.js';

import { buildMcpItemContent } from '../content.js';
import { contentType, nodeTypes } from '../../../../../types/common.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

const options = { ...normalizeOptions({}), markdownParser: markdocParser };

function getContainers(children: unknown[]): ContainerNode[] {
  return children.filter(
    (c): c is ContainerNode =>
      typeof c === 'object' && c !== null && 'nodeType' in c && c.nodeType === nodeTypes.CONTAINER,
  );
}

describe('buildMcpItemContent', () => {
  it('produces a header container and a markdoc node', () => {
    const result = buildMcpItemContent('tool', 'add', 'tools/add', 'add', options);

    expect(result.contentType).toBe(contentType.ITEM);
    expect(result.children).toHaveLength(2);

    const containers = getContainers(result.children);
    expect(containers).toHaveLength(1);
    expect(containers[0].panels).toEqual([]);

    expect(result.children[1]).toMatchObject({ nodeType: nodeTypes.MARKDOC });
  });

  it('sets showPageActions on the header node', () => {
    const result = buildMcpItemContent('tool', 'add', 'tools/add', 'add', options);
    const containers = getContainers(result.children);
    const headerNode = containers[0].children[0];

    expect(headerNode.nodeType).toBe(nodeTypes.HEADER);
    expect(headerNode.nodeType === nodeTypes.HEADER && headerNode.showPageActions).toBe(true);
  });

  it('does not include panels (sampling is handled on the frontend)', () => {
    const result = buildMcpItemContent('tool', 'add', 'tools/add', 'add', options);
    const containers = getContainers(result.children);

    expect(containers[0].panels).toEqual([]);
  });

  it('escapes special characters in name and id for markdoc', () => {
    const result = buildMcpItemContent('tool', 'my "tool"', 'tools/my "tool"', 'My Tool', options);

    expect(result.children[1]).toMatchObject({ nodeType: nodeTypes.MARKDOC });
  });

  it('uses correct markdoc tag per type', () => {
    const tool = buildMcpItemContent('tool', 'a', 'a', 'A', options);
    const resource = buildMcpItemContent('rsrc', 'b', 'b', 'B', options);
    const prompt = buildMcpItemContent('prompt', 'c', 'c', 'C', options);

    expect(tool.seo?.title).toBe('A');
    expect(resource.seo?.title).toBe('B');
    expect(prompt.seo?.title).toBe('C');
  });
});
