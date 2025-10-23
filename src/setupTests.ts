import '@testing-library/jest-dom';
import 'jest-styled-components';
import { randomUUID } from 'node:crypto';

window.crypto.randomUUID = randomUUID;
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));
// Mock fetch globally for all tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
  } as Response),
);
