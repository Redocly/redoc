import { describe, expect, it } from 'vitest';
import * as legacy from 'node:url';

import * as compat from '../url-compat.js';

const INPUTS = [
  'https://api.example.com/v1',
  'http://user:pw@h:8080/p?q=1#f',
  '/v1',
  '/v1?x=1#frag',
  '//api.example.com/v1',
  'api.example.com/v1',
  'other.yaml#/definitions/Pet',
  '#/definitions/Pet',
  'a.yaml?x=1#y',
  './x/y.yaml',
];

describe('url-compat', () => {
  it.each(['http://', 'http://a b/x'])(
    'parse(%s) falls back to the relative shape for a malformed absolute URL',
    (input) => {
      const url = compat.parse(input);
      expect(url.protocol).toBeNull();
      expect(url.format()).toBe(input);
    },
  );

  it.each(INPUTS)('parse(%s) matches the legacy url fields swagger2openapi reads', (input) => {
    const expected = legacy.parse(input);
    const actual = compat.parse(input);
    for (const key of [
      'protocol',
      'host',
      'hostname',
      'port',
      'pathname',
      'search',
      'hash',
      'auth',
    ] as const) {
      expect({ [key]: actual[key] ?? null }).toEqual({ [key]: expected[key] ?? null });
    }
  });

  // swagger2openapi assigns `schemes` entries ('http') as the protocol, without the colon
  it.each(
    INPUTS.flatMap((input) => [
      [input, 'https:'],
      [input, 'http'],
    ]),
  )('parse(%s) formats like legacy after protocol := %s', (input, protocol) => {
    const expected = legacy.parse(input);
    const actual = compat.parse(input);
    expected.protocol = protocol;
    actual.protocol = protocol;
    expect(actual.format()).toBe(expected.format());
  });

  it.each([
    ['https://api.example.com', 'https://api.example.com'],
    ['HTTPS://API.Example.com', 'https://api.example.com'],
    ['https://user:pw@api.example.com', 'https://user:pw@api.example.com'],
    ['https://api.example.com?version=1', 'https://api.example.com?version=1'],
    ['https://api.example.com#section', 'https://api.example.com#section'],
    ['https://user:pw@api.example.com?version=1', 'https://user:pw@api.example.com?version=1'],
    ['https://user:pw@api.example.com#section', 'https://user:pw@api.example.com#section'],
    ['https://api.example.com/', 'https://api.example.com/'],
  ])('preserves whether an absolute URL has an explicit path', (input, expected) => {
    expect(compat.format(compat.parse(input))).toBe(expected);
  });

  it.each([
    ['https://a.com/x/y.json', '../z.json'],
    ['https://a.com/x/', 'z.json'],
    ['', 'foo'],
    ['base/', 'p.json'],
    ['base/y.json', 'https://b.com/z.json'],
    ['base/x/y.json', '../z.json'],
    ['base/y.json', '/z.json'],
    ['base/y.json', '//b.com/z.json'],
    ['//cdn.example.com/specs/openapi.yaml', '/shared.yaml'],
    ['//cdn.example.com/specs/openapi.yaml', 'x.yaml'],
    ['//cdn.example.com/specs/openapi.yaml', '../../x.yaml'],
    ['//cdn.example.com/specs/openapi.yaml', '//other.com/z.yaml'],
    ['//cdn.example.com/specs/openapi.yaml', 'https://b.com/z.json'],
    ['//cdn.example.com/specs/openapi.yaml?q=1#old', '#/new'],
    ['/root/a.yaml', '../b.yaml'],
    ['/root/a.yaml', '../../b.yaml'],
    ['base/', '../../z'],
    ['a/b.yaml', 'c.yaml#/d'],
    ['a/b.yaml', './c.yaml?x=1'],
    ['a/b.yaml#/old', '#/new'],
    ['a/b.yaml?q=1#old', '#/new'],
    ['a/b.yaml?q=1#old', '?x=2'],
    ['a/b.yaml#old', '?x'],
    ['a/b.yaml?q=1#old', ''],
    ['', '#/a'],
    ['', 'other.yaml#/x'],
  ])('resolve(%s, %s) matches legacy', (from, to) => {
    expect(compat.resolve(from, to)).toBe(legacy.resolve(from, to));
  });
});
