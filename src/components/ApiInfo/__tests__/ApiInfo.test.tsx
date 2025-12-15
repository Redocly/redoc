import util from 'util';
import { render } from '@testing-library/react';
import * as Jotai from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { OpenAPIInfo } from '../../../types/index.js';
import type { GroupModel } from '../../../models/index.js';

import { ApiInfo } from '../ApiInfo.js';
import { TestBrowserRouter } from '../../../testProviders.js';

Object.defineProperty(global, 'TextEncoder', {
  value: util.TextEncoder,
});

vi.mock('jotai', async () => ({
  ...(await vi.importActual('jotai')),
  useAtomValue: vi.fn(),
}));

describe('ApiInfo', () => {
  it('ApiInfo renders correctly', () => {
    vi.spyOn(Jotai, 'useAtomValue').mockReturnValue({
      parser: {
        definition: {
          info: {
            downloadFileName: 'downloadFileNameValue',
            summary: ' ',
            description: 'This is a sample server Petstore server.',
          },
        },
      },
      options: {
        downloadDefinitionUrl: 'downloadDefinitionUrlValue',
        expandDefaultServerVariables: true,
      },
    });
    const result = render(
      <ApiInfo
        layout={LayoutVariant.THREE_PANEL}
        item={
          {
            infoDefinition: {
              info: {
                downloadFileName: 'downloadFileNameValue',
                summary: 'Some summary',
                description: 'This is a sample server Petstore server.',
              },
            } as unknown as OpenAPIInfo,
          } as unknown as GroupModel
        }
      />,
      {
        wrapper: TestBrowserRouter,
      },
    );

    expect(result).toMatchSnapshot();
  });
});
