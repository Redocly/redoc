import { describe, it, expect } from 'vitest';
import { serializeParameterValue } from '../serialize-parameter.js';

describe('serializeParameterValue', () => {
  describe('path parameters', () => {
    it('handles simple style (default)', () => {
      expect(serializeParameterValue({ name: 'id', in: 'path', style: 'simple' }, 'abc')).toBe(
        'abc',
      );
    });

    it('handles simple style with array', () => {
      expect(serializeParameterValue({ name: 'id', in: 'path', style: 'simple' }, [1, 2, 3])).toBe(
        '1,2,3',
      );
    });

    it('handles label style', () => {
      expect(serializeParameterValue({ name: 'id', in: 'path', style: 'label' }, 'abc')).toBe(
        '.abc',
      );
    });

    it('handles label style with array', () => {
      expect(serializeParameterValue({ name: 'id', in: 'path', style: 'label' }, [1, 2])).toBe(
        '.1.2',
      );
    });

    it('handles matrix style', () => {
      expect(serializeParameterValue({ name: 'id', in: 'path', style: 'matrix' }, 'abc')).toBe(
        ';id=abc',
      );
    });
  });

  describe('query parameters', () => {
    it('handles form style (default) for scalar', () => {
      expect(serializeParameterValue({ name: 'limit', in: 'query', style: 'form' }, 10)).toBe(
        'limit=10',
      );
    });

    it('handles form style explode=true for array', () => {
      expect(
        serializeParameterValue({ name: 'color', in: 'query', style: 'form', explode: true }, [
          'red',
          'blue',
        ]),
      ).toBe('color=red&color=blue');
    });

    it('handles form style explode=false for array', () => {
      expect(
        serializeParameterValue({ name: 'color', in: 'query', style: 'form', explode: false }, [
          'red',
          'blue',
        ]),
      ).toBe('color=red,blue');
    });

    it('handles deepObject style', () => {
      expect(
        serializeParameterValue(
          { name: 'filter', in: 'query', style: 'deepObject', explode: true },
          { status: 'active', type: 'admin' },
        ),
      ).toBe('filter[status]=active&filter[type]=admin');
    });

    it('handles pipeDelimited style', () => {
      expect(
        serializeParameterValue({ name: 'ids', in: 'query', style: 'pipeDelimited' }, [1, 2, 3]),
      ).toBe('ids=1|2|3');
    });

    it('handles spaceDelimited style', () => {
      expect(
        serializeParameterValue({ name: 'ids', in: 'query', style: 'spaceDelimited' }, [1, 2]),
      ).toBe('ids=1%202');
    });
  });

  describe('delimited query objects', () => {
    it('joins object properties and values with the style delimiter', () => {
      const color = { R: 100, G: 200 };
      expect(
        serializeParameterValue({ name: 'color', in: 'query', style: 'pipeDelimited' }, color),
      ).toBe('color=R|100|G|200');
      expect(
        serializeParameterValue({ name: 'color', in: 'query', style: 'spaceDelimited' }, color),
      ).toBe('color=R%20100%20G%20200');
      expect(serializeParameterValue({ name: 'color', in: 'query', explode: false }, color)).toBe(
        'color=R,100,G,200',
      );
    });
  });

  describe('header parameters', () => {
    it('handles simple style for scalar', () => {
      expect(
        serializeParameterValue({ name: 'X-Token', in: 'header', style: 'simple' }, 'abc'),
      ).toBe('abc');
    });

    it('handles simple style for array', () => {
      expect(
        serializeParameterValue({ name: 'X-Values', in: 'header', style: 'simple' }, ['a', 'b']),
      ).toBe('a,b');
    });
  });

  describe('cookie parameters', () => {
    it('handles form style for scalar', () => {
      expect(
        serializeParameterValue({ name: 'session', in: 'cookie', style: 'form' }, 'abc123'),
      ).toBe('session=abc123');
    });

    it('handles form style explode=false for array', () => {
      expect(
        serializeParameterValue({ name: 'prefs', in: 'cookie', style: 'form', explode: false }, [
          'a',
          'b',
        ]),
      ).toBe('prefs=a,b');
    });
  });

  describe('default style inference', () => {
    it('uses simple for path when no style specified', () => {
      expect(serializeParameterValue({ name: 'id', in: 'path' }, 'abc')).toBe('abc');
    });

    it('uses form for query when no style specified', () => {
      expect(serializeParameterValue({ name: 'limit', in: 'query' }, 10)).toBe('limit=10');
    });
  });

  describe('edge cases', () => {
    it('returns empty string for null/undefined', () => {
      expect(serializeParameterValue({ name: 'x', in: 'query' }, null)).toBe('');
      expect(serializeParameterValue({ name: 'x', in: 'query' }, undefined)).toBe('');
    });

    it('handles unknown location', () => {
      expect(serializeParameterValue({ name: 'x' }, 'val')).toBe('val');
    });
  });

  describe('structured items', () => {
    const point = { x: 1, y: 2 };
    const pointJson = JSON.stringify(point);

    it('renders object items of an exploded query array as JSON', () => {
      expect(serializeParameterValue({ name: 'points', in: 'query' }, [point])).toBe(
        `points=${encodeURIComponent(pointJson)}`,
      );
    });

    it('renders object items of a delimited query array as JSON', () => {
      expect(
        serializeParameterValue({ name: 'points', in: 'query', style: 'pipeDelimited' }, [
          point,
          point,
        ]),
      ).toBe(`points=${encodeURIComponent(pointJson)}|${encodeURIComponent(pointJson)}`);
    });

    it('renders nested values of a deepObject query parameter as JSON', () => {
      expect(
        serializeParameterValue(
          { name: 'filter', in: 'query', style: 'deepObject' },
          { at: point },
        ),
      ).toBe(`filter[at]=${encodeURIComponent(pointJson)}`);
    });

    it('renders object items in path, header and cookie parameters as JSON', () => {
      expect(serializeParameterValue({ name: 'p', in: 'path' }, [point])).toBe(pointJson);
      expect(serializeParameterValue({ name: 'h', in: 'header' }, { at: point })).toBe(
        `at,${pointJson}`,
      );
      expect(serializeParameterValue({ name: 'c', in: 'cookie' }, [point])).toBe(`c=${pointJson}`);
    });

    it('renders an object for an unknown location as JSON', () => {
      expect(serializeParameterValue({ name: 'x' }, point)).toBe(pointJson);
    });
  });
});
