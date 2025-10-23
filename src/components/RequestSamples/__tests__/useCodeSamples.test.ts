import { jest, describe, test, expect } from '@jest/globals';
import * as Jotai from 'jotai/index';

import type { OpenAPIDefinition } from '../../../types';

import { getOperation } from '../../../models';
import definition from './fixtures/operationDefinition.json';
import { useCodeSamples } from '../useCodeSamples';
import { replaceCircularJson } from '../../../models/__tests__/helpers';
import { normalizeOptions, OpenAPIParser } from '../../../services';
import petStore from './fixtures/petstore.json';
import { globalStoreAtom } from '../../../jotai/store';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

jest.mock('../../../hooks/useTranslate', () => ({
  useTranslate: jest.fn(),
}));

jest.mock('@redocly/theme/ext/configure', () => ({
  __esModule: true,
  configure: jest.fn(),
}));

describe('useCodeSamples', () => {
  const options = normalizeOptions({});
  const parser = new OpenAPIParser(petStore as OpenAPIDefinition, undefined, options);

  test('should return all codeSamples', () => {
    const operation = getOperation(parser, definition, undefined, options, '');
    jest.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
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

    const operation = getOperation(parser, definition, undefined, options, '');
    jest.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
      if (atom === globalStoreAtom) return { options, parser };
      return {};
    });

    const { samples } = useCodeSamples(operation);

    expect(JSON.stringify([samples], replaceCircularJson)).toEqual(
      JSON.stringify([operation.payload, ...definition['x-codeSamples']], replaceCircularJson),
    );
  });
});
