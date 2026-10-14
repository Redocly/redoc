import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const EXAMPLES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../examples');
const GENERATED = new Set([
  'node_modules',
  'dist',
  'target',
  '.next',
  '.angular',
  '__pycache__',
  'bin',
  'obj',
]);

const CDN_BUNDLE =
  /https:\/\/cdn\.jsdelivr\.net\/npm\/redoc@([^/]+)\/bundles\/redoc\.standalone\.js/g;
const CDN_TAG = 'latest';
const CAFE_SPEC =
  'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';
const ANY_CAFE_SPEC = /https:\/\/cdn\.jsdelivr\.net\/gh\/Redocly\/redoc@[^\s"')]+/g;

function exampleFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (GENERATED.has(entry.name)) return [];
    const path = join(dir, entry.name);
    return entry.isDirectory() ? exampleFiles(path) : [path];
  });
}

describe('the examples', () => {
  const files = exampleFiles(EXAMPLES_DIR).map((path) => ({
    path,
    text: readFileSync(path, 'utf8'),
  }));

  it(`load the standalone bundle from the ${CDN_TAG} CDN dist-tag only`, () => {
    const pins = new Map<string, string[]>();
    for (const file of files) {
      for (const [, version] of file.text.matchAll(CDN_BUNDLE)) {
        pins.set(version, [...(pins.get(version) ?? []), file.path]);
      }
    }
    const found = [...pins].map(([version, paths]) => `${version}: ${paths.join(', ')}`);
    expect(found).toHaveLength(1);
    expect([...pins.keys()][0]).toBe(CDN_TAG);
  });

  it('render only the pinned Cafe spec', () => {
    const other = files.flatMap((file) =>
      [...file.text.matchAll(ANY_CAFE_SPEC)]
        .map(([url]) => url)
        .filter((url) => url !== CAFE_SPEC)
        .map((url) => `${url} (${file.path})`),
    );
    expect(other).toEqual([]);
  });
});
