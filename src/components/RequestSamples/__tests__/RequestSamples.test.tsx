import { render, waitFor } from '@testing-library/react';
import * as Jotai from 'jotai/index';

import type { OpenAPIDefinition } from '../../../types/index.js';
import type { OperationModel } from '../../../models/index.js';

import * as useCodeSamplesModule from '../useCodeSamples.js';

import { RequestSamples } from '../RequestSamples.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getMediaContent, getOperation } from '../../../models/index.js';
import { withTestProviders } from '../../../testProviders.js';
import petStore from './fixtures/petstore.json';
import type { ExtendedOpenAPIOperation } from '../../../services/index.js';

import definition from './fixtures/operationDefinition.json';
import {
  languageAtom,
} from '../../../jotai/app.js';
import { globalStoreAtom } from '../../../jotai/store.js';

vi.mock('jotai', async () => {
  const actual = await vi.importActual<typeof Jotai>('jotai');
  return {
    ...actual,
    useAtomValue: vi.fn((atom) => {
      if (atom === languageAtom) {
        return {
          activeLanguage: 'python',
          languages: ['python', 'javascript'],
        };
      }
      return actual.useAtomValue(atom);
    }),
    useAtom: vi.fn((atom) => {
      if (atom === languageAtom) {
        return [
          {
            activeLanguage: 'python',
            languages: ['python', 'javascript'],
          },
          vi.fn(),
        ];
      }
      return actual.useAtom(atom);
    }),
  };
});

vi.mock('@redocly/theme/core/openapi', async () => ({
  ...(await vi.importActual('@redocly/theme/core/openapi')),
  getOperationColor: vi.fn(() => 'blue'),
}));

describe('Components', () => {
  describe('RequestSamples', () => {
    let operation: OperationModel;
    const options = normalizeOptions({});

    const parser = new OpenAPIParser(petStore as unknown as OpenAPIDefinition, undefined, options);

    const info = {
      'application/json': {
        schema: {
          additionalProperties: {
            format: 'int32',
          },
        },
        examples: {
          bee: {
            mime: 'application/json',
            value: {
              category: {
                id: 0,
                name: 'string',
              },
              honeyPerDay: 3.14,
              id: 0,
              petType: 'bee',
              status: 'available',
            },
          },
          cat: {
            mime: 'application/json',
            value: {
              category: {
                id: 0,
                name: 'string',
              },
              huntingSkill: 'adventurous',
              id: 0,
              petType: 'cat',
              status: 'available',
            },
          },
        },
      },
      'application/xml': {
        schema: {
          additionalProperties: {
            format: 'int32',
          },
        },
      },
    };
    test('should renders correctly without mimeType selector', () => {
      operation = getOperation(
        parser,
        definition as unknown as ExtendedOpenAPIOperation,
        undefined,
        options,
        '',
      );
      // @ts-ignore
      operation.requestBody.content.mediaTypes = operation.requestBody?.content?.mediaTypes.filter(
        (m) => m.name === 'application/json',
      );
      const PROPS = {
        onlyDefaultMimeType: true,
        operation,
        content: getMediaContent({
          parser,
          info,
          isRequestType: true,
          options,
          data: { operation },
        }),
      };
      const { queryByText } = render(
        withTestProviders(<RequestSamples {...PROPS} />, {
          definition: parser.definition,
        }),
      );

      expect(queryByText('application/json', { selector: 'label' })).not.toBeInTheDocument();
    });

    test('should renders correctly with empty languages', async () => {
      vi.spyOn(Jotai, 'useAtom').mockImplementation((atom) => {
        if (atom === languageAtom) {
          return [
            {
              activeLanguage: undefined,
              languages: [],
            },
            vi.fn(),
          ] as unknown as ReturnType<typeof Jotai.useAtom>;
        }
        return [{}, vi.fn()] as unknown as ReturnType<typeof Jotai.useAtom>;
      });

      vi.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
        if (atom === languageAtom) {
          return {
            activeLanguage: undefined,
            languages: [],
          };
        }

        if (atom === globalStoreAtom) return { options, parser };
        return {};
      });

      vi.spyOn(useCodeSamplesModule, 'useCodeSamples').mockReturnValue({
        samples: [], // Empty samples array
      });

      const optionsWithEmptyLanguages = normalizeOptions({
        codeSamples: {
          languages: [],
        },
      });

      operation = getOperation(
        parser,
        definition as unknown as ExtendedOpenAPIOperation,
        undefined,
        optionsWithEmptyLanguages,
        '',
      );
      const PROPS = {
        operation,
        content: getMediaContent({
          parser,
          info,
          isRequestType: true,
          options: optionsWithEmptyLanguages,
          data: { operation },
        }),
      };

      const { container } = render(
        withTestProviders(<RequestSamples {...PROPS} />, {
          definition: parser.definition,
        }),
      );

      await waitFor(() => {
        expect(container.getElementsByClassName('dropdown-wrapper').length).toBe(0);
        expect(container.getElementsByClassName('dropdown-option').length).toBe(0);
      });
    });
  });
});
