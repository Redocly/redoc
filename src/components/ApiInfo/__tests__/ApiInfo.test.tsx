import util from 'util';
import { render } from '@testing-library/react';
import * as Jotai from 'jotai';
import { BrowserRouter } from 'react-router-dom';

import type { OpenAPIInfo } from '../../../types';
import type { GroupModel } from '../../../models';

import { ApiInfo } from '../ApiInfo';

Object.defineProperty(global, 'TextEncoder', {
  value: util.TextEncoder,
});

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useAtomValue: jest.fn(),
}));

describe('ApiInfo', () => {
  it('ApiInfo renders correctly', () => {
    jest.spyOn(Jotai, 'useAtomValue').mockReturnValue({
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
        wrapper: BrowserRouter,
      },
    );

    expect(result).toMatchSnapshot();
  });
});
