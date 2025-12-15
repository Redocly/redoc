import { vi } from 'vitest';
import * as Jotai from 'jotai/index';

import type { OpenAPIDefinition } from '../../../types/index.js';

import { getOperation } from '../../../models/index.js';
import type { ExtendedOpenAPIOperation } from '../../../services/index.js';

import definition from './fixtures/operationDefinition.json';
import { useCodeSamples } from '../useCodeSamples.js';
import { replaceCircularJson } from '../../../models/__tests__/helpers.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import petStore from './fixtures/petstore.json';
import { globalStoreAtom } from '../../../jotai/store.js';

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

vi.mock('../../../hooks/useTranslate', () => ({
  useTranslate: vi.fn(),
}));

vi.mock('@redocly/theme/ext/configure', () => ({
  __esModule: true,
  configure: vi.fn(),
}));

describe('useCodeSamples', () => {
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(petStore as unknown as OpenAPIDefinition, undefined, options);

  test('should return all codeSamples', () => {
    const operation = getOperation(
      parser,
      definition as unknown as ExtendedOpenAPIOperation,
      undefined,
      options,
      '',
    );
    vi.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
      if (atom === globalStoreAtom) return { options, parser };
      return {};
    });

    const { samples } = useCodeSamples(operation);

    expect(JSON.stringify([samples], replaceCircularJson)).toEqual(
      JSON.stringify([operation.payload, ...definition['x-codeSamples']], replaceCircularJson),
    );
  });

  test('should return just payload and cURL', () => {
    const options = normalizeOptions({
      codeSamples: {
        languages: [{ lang: 'curl' }, { lang: 'Payload', label: 'customPayloadLabel' }],
      },
    });

    const operation = getOperation(
      parser,
      definition as unknown as ExtendedOpenAPIOperation,
      undefined,
      options,
      '',
    );
    vi.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
      if (atom === globalStoreAtom) return { options, parser };
      return {};
    });

    const { samples } = useCodeSamples(operation);

    expect(JSON.stringify([samples], replaceCircularJson)).toEqual(
      JSON.stringify([operation.payload, ...definition['x-codeSamples']], replaceCircularJson),
    );
  });
});
