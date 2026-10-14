import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  Reflect.deleteProperty(crypto, 'randomUUID');
});

it('backs crypto.randomUUID on non-secure origins once the ESM entry is imported', async () => {
  Object.defineProperty(crypto, 'randomUUID', {
    value: undefined,
    configurable: true,
    writable: true,
  });
  vi.resetModules();

  await import('../index.js');

  expect(crypto.randomUUID()).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
});
