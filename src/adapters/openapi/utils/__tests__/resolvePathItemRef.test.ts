import { describe, expect, it } from 'vitest';

import type { OpenAPIPath } from '../../../../types/openapi.js';

import { resolvePathItemRef } from '../resolvePathItemRef.js';

function docWithPathItems(
  pathItems: Record<string, OpenAPIPath>,
  openapi = '3.1.0',
): Record<string, unknown> {
  return {
    openapi,
    info: { title: 't', version: '1' },
    paths: {},
    components: { pathItems },
  };
}

describe('resolvePathItemRef', () => {
  describe('non-reference path items', () => {
    it('returns the same object when there is no $ref', () => {
      const item: OpenAPIPath = {
        post: { responses: { '200': { description: 'ok' } } },
      };
      const doc = docWithPathItems({});
      expect(resolvePathItemRef(doc, item, '3.1.0')).toBe(item);
    });

    it('returns undefined for null or undefined input', () => {
      const doc = docWithPathItems({});
      expect(resolvePathItemRef(doc, undefined, '3.1.0')).toBeUndefined();
      expect(resolvePathItemRef(doc, null, '3.1.0')).toBeUndefined();
    });
  });

  describe('Reference Object ($ref)', () => {
    it('resolves #/components/pathItems/... to the referenced path item', () => {
      const doc = docWithPathItems({
        base: {
          post: { summary: 'Op', responses: { '200': { description: 'ok' } } },
        },
      });

      const raw: OpenAPIPath = { $ref: '#/components/pathItems/base' };
      const resolved = resolvePathItemRef(doc, raw, '3.1.0');
      expect(resolved?.post?.summary).toBe('Op');
    });

    it('chains nested $ref path items until the concrete path item', () => {
      const doc = docWithPathItems({
        leaf: {
          put: { responses: { '200': { description: 'ok' } } },
        },
        mid: { $ref: '#/components/pathItems/leaf' },
      });

      const raw: OpenAPIPath = { $ref: '#/components/pathItems/mid' };
      const resolved = resolvePathItemRef(doc, raw, '3.1.0');
      expect(resolved?.put).toBeDefined();
    });

    it('throws when the pointer target is missing', () => {
      const doc = docWithPathItems({});
      const raw: OpenAPIPath = { $ref: '#/components/pathItems/missing' };
      expect(() => resolvePathItemRef(doc, raw, '3.1.0')).toThrow('Failed to resolve');
    });

    it('marks a circular $ref chain with x-circular-ref', () => {
      const doc = docWithPathItems({
        loop: { $ref: '#/components/pathItems/loop' },
      });

      const raw: OpenAPIPath = { $ref: '#/components/pathItems/loop' };
      const resolved = resolvePathItemRef(doc, raw, '3.1.0') as Record<string, unknown>;
      expect(resolved['x-circular-ref']).toBe(true);
    });
  });

  describe('OpenAPI 3.1 sibling fields next to $ref', () => {
    it('overlays summary and description onto the resolved path item', () => {
      const doc = docWithPathItems({
        base: {
          post: {
            summary: 'From component',
            responses: { '200': { description: 'ok' } },
          },
        },
      });

      const raw: OpenAPIPath = {
        $ref: '#/components/pathItems/base',
        summary: 'Overriding summary',
        description: 'Overriding description',
      };

      const resolved = resolvePathItemRef(doc, raw, '3.1.0');
      expect(resolved?.summary).toBe('Overriding summary');
      expect(resolved?.description).toBe('Overriding description');
      expect(resolved?.post?.summary).toBe('From component');
    });

    it('overlays outer siblings when the chain has an intermediate $ref', () => {
      const doc = docWithPathItems({
        leaf: {
          put: { responses: { '200': { description: 'ok' } } },
        },
        mid: { $ref: '#/components/pathItems/leaf' },
      });

      const raw: OpenAPIPath = {
        $ref: '#/components/pathItems/mid',
        description: 'Outer path',
      };

      const resolved = resolvePathItemRef(doc, raw, '3.1.0');
      expect(resolved?.description).toBe('Outer path');
      expect(resolved?.put).toBeDefined();
    });
  });

  describe('OpenAPI 3.0', () => {
    it('resolves $ref but does not apply sibling fields from the reference object', () => {
      const doc = docWithPathItems(
        {
          base: {
            post: { responses: { '200': { description: 'ok' } } },
          },
        },
        '3.0.3',
      );

      const raw: OpenAPIPath = {
        $ref: '#/components/pathItems/base',
        summary: 'Should not win',
      };

      const resolved = resolvePathItemRef(doc, raw, '3.0.3');
      expect(resolved?.summary).toBeUndefined();
      expect(resolved?.post).toBeDefined();
    });
  });
});
