import * as yaml from 'js-yaml';

import type { SnapshotSerializer } from 'vitest';

function joinTextSegments(segments: string[]): string {
  if (segments.length === 0) {
    return '';
  }

  let combined = segments[0] ?? '';

  for (let index = 1; index < segments.length; index++) {
    const segment = segments[index] ?? '';
    if (!segment) {
      continue;
    }

    const previousChar = combined.at(-1) ?? '';
    const nextChar = segment[0] ?? '';
    const shouldInsertSpace =
      !!previousChar &&
      !!nextChar &&
      !/\s/.test(previousChar) &&
      !/\s/.test(nextChar) &&
      /[A-Za-z0-9.!?]/.test(previousChar) &&
      /[A-Za-z0-9]/.test(nextChar);

    combined += shouldInsertSpace ? ` ${segment}` : segment;
  }

  return combined;
}

export function simplifyMarkdocAST(node: unknown): unknown {
  if (!node || typeof node !== 'object') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((item) => simplifyMarkdocAST(item));
  }

  const obj = node as Record<string, unknown>;

  if (obj.$$mdtype === 'Node') {
    if (obj.type === 'text' && obj.attributes && typeof obj.attributes === 'object') {
      const attrs = obj.attributes as Record<string, unknown>;
      return attrs.content;
    }

    if (obj.type === 'tag') {
      const result: Record<string, unknown> = {};
      if (typeof obj.tag === 'string') {
        result.tag = obj.tag;
      }
      if (obj.attributes && typeof obj.attributes === 'object') {
        result.attributes = obj.attributes;
      }
      if (obj.children && Array.isArray(obj.children)) {
        const simplifiedChildren = obj.children
          .map((child) => simplifyMarkdocAST(child))
          .filter((item) => !(typeof item === 'string' && item === ''));
        if (simplifiedChildren.length > 0) {
          result.children =
            simplifiedChildren.length === 1 ? simplifiedChildren[0] : simplifiedChildren;
        }
      }

      return result;
    }

    if (obj.children && Array.isArray(obj.children)) {
      const simplified = obj.children.map((child) => simplifyMarkdocAST(child));
      if (simplified.every((item) => typeof item === 'string')) {
        return joinTextSegments(simplified);
      }
      return simplified;
    }

    return null;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = simplifyMarkdocAST(value);
  }
  return result;
}

const yamlSnapshotSerializer: SnapshotSerializer = {
  serialize(val): string {
    const simplified = simplifyMarkdocAST(val);
    return yaml.dump(simplified, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
  },
  test(val): boolean {
    const stack = new Error().stack || '';
    const isInAdaptersFolder = stack.includes('src/adapters/__tests__/');

    if (!isInAdaptersFolder) {
      return false;
    }

    if (!Array.isArray(val) || val.length === 0) {
      return false;
    }
    const firstItem = val[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      return false;
    }

    const apiItemKeys = ['content', 'id', 'label', 'type'];
    return apiItemKeys.some((key) => key in firstItem);
  },
};

export default yamlSnapshotSerializer;
