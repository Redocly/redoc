import * as matchers from '@testing-library/jest-dom/matchers';
import { randomUUID } from 'node:crypto';
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { vi, expect } from 'vitest';

import yamlSnapshotSerializer from './src/adapters/__tests__/snapshot-serializer.js';

expect.extend(matchers);
expect.addSnapshotSerializer(styleSheetSerializer);
expect.addSnapshotSerializer(yamlSnapshotSerializer);

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

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

window.crypto.randomUUID = randomUUID as () => `${string}-${string}-${string}-${string}-${string}`;
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
