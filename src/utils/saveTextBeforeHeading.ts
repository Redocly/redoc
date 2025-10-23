import markdoc from '@markdoc/markdoc';

import type { Node } from '@markdoc/markdoc';

import { isString } from '@redocly/theme/core/openapi';

interface DescriptionObject {
  result: string | Node | Node[];
  raw: string;
}

export function saveTextBeforeHeading(
  description: string | DescriptionObject,
): string | DescriptionObject {
  if (!description) {
    return '';
  }

  if (!isString(description)) {
    if (!description?.result) {
      return description;
    }

    return {
      result: modifyNodeByHeading(markdoc.Ast.fromJSON(JSON.stringify(description.result))) || '',
      raw: saveTextBeforeHeading(description.raw) as string,
    };
  }

  const headingRegex = new RegExp(`^#{1,6}?\\s+`, 'm');
  const firstHeadingLinePos = description.search(headingRegex);

  return firstHeadingLinePos > -1 ? description.substring(0, firstHeadingLinePos) : description;
}

function modifyNodeByHeading(ast: Node | Node[]): Node | Node[] | undefined {
  if (Array.isArray(ast)) {
    const headingIndex = ast.findIndex((node) => node.type === 'heading');
    return headingIndex === -1 ? ast : ast.slice(0, headingIndex);
  }

  if (!ast.children || !Array.isArray(ast.children)) {
    return;
  }

  const headingIndex = ast.children.findIndex((node) => node.type === 'heading');
  if (headingIndex === -1) {
    return ast;
  }

  ast.children = ast.children.slice(0, headingIndex);
  return ast;
}
