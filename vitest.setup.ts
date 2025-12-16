import '@testing-library/jest-dom';
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { vi, expect } from 'vitest';
import { randomUUID } from 'node:crypto';

const sortedStyleSheetSerializer: Parameters<typeof expect.addSnapshotSerializer>[0] = {
  test: styleSheetSerializer.test,
  serialize(val, config, indentation, depth, refs, printer): string {
    const result = styleSheetSerializer.serialize(val, config, indentation, depth, refs, printer);
    if (typeof result !== 'string') return result;

    const cssEndIndex = result.lastIndexOf('\n\n<');
    if (cssEndIndex === -1) return result;

    const cssBlock = result.slice(0, cssEndIndex);
    const htmlBlock = result.slice(cssEndIndex);
    const sortedCss = cssBlock
      .split(/(?=\.c\d+)/g)
      .filter(Boolean)
      .sort((a, b) => {
        const aMatch = a.match(/^\.c(\d+)/);
        const bMatch = b.match(/^\.c(\d+)/);
        if (aMatch && bMatch) {
          return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 10);
        }
        return a.localeCompare(b);
      })
      .join('');

    return sortedCss + htmlBlock;
  },
};

expect.addSnapshotSerializer(sortedStyleSheetSerializer);

// Simple fetch mock using vi.fn()
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  } as Response),
);

window.scrollTo = vi.fn();

window.crypto.randomUUID = randomUUID as () => `${string}-${string}-${string}-${string}-${string}`;
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Ensure window is defined for React 19 state updates
if (typeof window !== 'undefined' && !window.document) {
  Object.defineProperty(window, 'document', {
    value: global.document,
    writable: true,
  });
}
