import { act, render } from '@testing-library/react';

import type { ReactElement } from 'react';
import type { SelectProps } from '../../common';
import type { OperationModel } from '../../../models';

import { MediaTypesSwitch } from '../MediaTypesSwitch';
import { getOperation } from '../../../models';
import { normalizeOptions, OpenAPIParser } from '../../../services';
import testDefinition from './fixtures/test-definition.json';
import { withTestProviders } from '../../../testProviders';

describe('Components', () => {
  describe('MediaTypesSwitch', () => {
    const options = normalizeOptions({});
    const parser = new OpenAPIParser(testDefinition, undefined, options);
    let operation: OperationModel;
    beforeEach(() => {
      operation = getOperation(
        parser,
        {
          pointer: '#/paths/~1test/get',
          pathName: '/test',
          httpVerb: 'GET',
          pathParameters: [],
          pathServers: [],
          isWebhook: false,
          ...testDefinition.paths['/test'].get,
        },
        undefined,
        options,
        '',
      );
    });

    test('renders with default media type by default', () => {
      const childrenFn = jest.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = jest.fn<ReactElement | null, [SelectProps]>(() => null);

      const { getByText } = render(
        withTestProviders(
          <MediaTypesSwitch renderSelect={renderSelectFn} content={operation.requestBody?.content}>
            {childrenFn}
          </MediaTypesSwitch>,
          { definition: parser.definition },
        ),
      );

      expect(renderSelectFn.mock.calls[0][0].options).toEqual([
        { idx: 0, value: 'application/json' },
        { idx: 1, value: 'application/xml' },
      ]);

      expect(getByText('children: application/json')).toBeInTheDocument();
    });

    test('withLabel renders label', () => {
      const childrenFn = jest.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = jest.fn(() => <>dropdown</>);

      const { getByText } = render(
        withTestProviders(
          <MediaTypesSwitch
            withLabel
            renderSelect={renderSelectFn}
            content={operation.requestBody?.content}
          >
            {childrenFn}
          </MediaTypesSwitch>,
          { definition: parser.definition },
        ),
      );

      expect(getByText('Content type')).toBeInTheDocument();
    });

    test('should try to restore scroll on switch', async () => {
      const childrenFn = jest.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = jest.fn<ReactElement | null, [SelectProps]>(() => <>dropdown</>);

      const { findByText, container } = render(
        withTestProviders(
          <MediaTypesSwitch
            withLabel
            renderSelect={renderSelectFn}
            content={operation.requestBody?.content}
          >
            {childrenFn}
          </MediaTypesSwitch>,
          { definition: parser.definition },
        ),
      );

      // Create a mock implementation of window.scrollBy
      const scrollByMock = jest.fn();
      Object.defineProperty(window, 'scrollBy', { value: scrollByMock });

      const rectMock = jest.fn(() => {
        return (rectMock.mock.calls.length > 1 ? { y: 150 } : { y: 100 }) as unknown as DOMRect;
      });

      jest.spyOn(container.firstElementChild, 'getBoundingClientRect').mockImplementation(rectMock);

      act(() => {
        renderSelectFn.mock.calls[0][0].onChange(renderSelectFn.mock.calls[0][0].options[1]);
      });

      await findByText('children: application/xml');

      await new Promise((resolve) => setTimeout(resolve, 500)); // sleep

      expect(rectMock).toHaveBeenCalledTimes(2);
      expect(scrollByMock).toHaveBeenCalledWith(0, 50);
    });

    test('should not throw and render null for empty media types', () => {
      const childrenFn = jest.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = jest.fn(() => null);

      const { container } = render(
        withTestProviders(
          <MediaTypesSwitch
            renderSelect={renderSelectFn}
            // @ts-ignore invalid content shape
            content={null}
          >
            {childrenFn}
          </MediaTypesSwitch>,
          { definition: parser.definition },
        ),
      );

      expect(container.firstChild).toBeNull();

      const { container: container2 } = render(
        withTestProviders(
          <MediaTypesSwitch
            renderSelect={renderSelectFn}
            // @ts-expect-error invalid content shape
            content={{ mediaTypes: null }}
          >
            {childrenFn}
          </MediaTypesSwitch>,
          { definition: parser.definition },
        ),
      );

      expect(container2.firstChild).toBeNull();

      const { container: container3 } = render(
        withTestProviders(
          <MediaTypesSwitch
            renderSelect={renderSelectFn}
            // @ts-expect-error invalid content shape
            content={{ mediaTypes: [] }}
          >
            {childrenFn}
          </MediaTypesSwitch>,
          { definition: parser.definition },
        ),
      );

      expect(container3.firstChild).toBeNull();
    });
  });
});
