import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// `styled.<tag>` targets forward every prop to the DOM unless it is transient (`$`-prefixed).
// The standalone renders without a `shouldForwardProp` filter, so a CSS-only prop reaches the
// element and React warns. See brain/styled-dom-props.md.
const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DECLARATION =
  /styled\.(?<tag>[a-z][a-z0-9]*)(?:\.(?:attrs|withConfig)\((?:[^()]|\([^()]*\))*\))*(?:<(?:[^<>]|<[^<>]*>)*>)?\s*`/g;

function templateBody(source: string, start: number): string {
  let depth = 0;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (char === '\\') {
      i++;
    } else if (source.startsWith('${', i)) {
      depth++;
      i++;
    } else if (char === '}' && depth > 0) {
      depth--;
    } else if (char === '`' && depth === 0) {
      return source.slice(start, i);
    }
  }
  return source.slice(start);
}

function forwardedCssProps(template: string): string[] {
  const names = new Set<string>();
  for (const [, group] of template.matchAll(/\(\s*\{([^}]*)\}\s*\)\s*=>/g)) {
    for (const entry of group.split(',')) {
      const name = entry.trim().split(/[:=]/)[0].trim();
      if (name) names.add(name);
    }
  }
  for (const [, name] of template.matchAll(/\bprops\.([A-Za-z_$][\w$]*)/g)) names.add(name);
  return [...names].filter((name) => name !== 'theme' && !name.startsWith('$'));
}

describe('styled DOM targets', () => {
  it('only read transient ($) props in their CSS', () => {
    const offenders: string[] = [];
    const files = readdirSync(SRC, { recursive: true, encoding: 'utf-8' }).filter(
      (file) => /\.tsx?$/.test(file) && !file.includes('__tests__'),
    );
    for (const file of files) {
      const source = readFileSync(resolve(SRC, file), 'utf-8');
      for (const match of source.matchAll(DECLARATION)) {
        const props = forwardedCssProps(templateBody(source, match.index + match[0].length));
        if (props.length === 0) continue;
        const line = source.slice(0, match.index).split('\n').length;
        offenders.push(`${file}:${line} styled.${match.groups?.tag} → ${props.join(', ')}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
