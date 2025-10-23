import { render, waitFor } from '@testing-library/react';
import * as Jotai from 'jotai/index';

import type { OpenAPIDefinition } from '../../../types';
import type { OperationModel } from '../../../models';

import { RequestSamples } from '../RequestSamples';
import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getMediaContent, getOperation } from '../../../models';
import { withTestProviders } from '../../../testProviders';
import petStore from './fixtures/petstore.json';
import definition from './fixtures/operationDefinition.json';
import {
  languageAtom,
} from '../../../jotai/app';
import { globalStoreAtom } from '../../../jotai/store';

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn((atom) => {
    if (atom === languageAtom) {
      return {
        activeLanguage: 'python',
        languages: ['python', 'javascript'],
      };
    }
    return jest.requireActual('jotai').useAtomValue(atom);
  }),
  useAtom: jest.fn((atom) => {
    if (atom === languageAtom) {
      return [
        {
          activeLanguage: 'python',
          languages: ['python', 'javascript'],
        },
        jest.fn(),
      ];
    }
    return jest.requireActual('jotai').useAtom(atom);
  }),
}));

describe('Components', () => {
  describe('RequestSamples', () => {
    let operation: OperationModel;
    const options = normalizeOptions({});

    const parser = new OpenAPIParser(petStore as OpenAPIDefinition, undefined, options);

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
      operation = getOperation(parser, definition, undefined, options, '');
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
      jest.spyOn(Jotai, 'useAtom').mockImplementation((atom) => {
        if (atom === languageAtom) {
          return [
            {
              activeLanguage: undefined,
              languages: [],
            },
            jest.fn(),
          ];
        }
        return jest.requireActual('jotai').useAtom(atom);
      });

      jest.spyOn(Jotai, 'useAtomValue').mockImplementation((atom) => {
        if (atom === languageAtom) {
          return {
            activeLanguage: undefined,
            languages: [],
          };
        }

        if (atom === globalStoreAtom) return { options, parser };
        return {};
      });

      jest.spyOn(require('../useCodeSamples'), 'useCodeSamples').mockReturnValue({
        samples: [], // Empty samples array
      });

      const optionsWithEmptyLanguages = normalizeOptions({
        codeSamples: {
          languages: [],
        },
      });

      operation = getOperation(parser, definition, undefined, optionsWithEmptyLanguages, '');
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
