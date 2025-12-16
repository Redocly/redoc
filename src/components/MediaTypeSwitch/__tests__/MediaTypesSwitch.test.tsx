import { act, render } from '@testing-library/react';

import type { ReactElement } from 'react';
import type { SelectProps } from '../../common/index.js';
import type { OperationModel } from '../../../models/index.js';

import { MediaTypesSwitch } from '../MediaTypesSwitch.js';
import { getOperation } from '../../../models/index.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import testDefinition from './fixtures/test-definition.json';
import { withTestProviders } from '../../../testProviders.js';

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
          isAdditionalOperation: false,
          ...testDefinition.paths['/test'].get,
        },
        undefined,
        options,
        '',
      );
    });

    test('renders with default media type by default', () => {
      const childrenFn = vi.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = vi.fn<(props: SelectProps) => ReactElement | null>(() => null);

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
      const childrenFn = vi.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = vi.fn(() => <>dropdown</>);

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
      const childrenFn = vi.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = vi.fn<(props: SelectProps) => ReactElement | null>(() => (
        <>dropdown</>
      ));

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
      const scrollByMock = vi.fn();
      Object.defineProperty(window, 'scrollBy', { value: scrollByMock });

      const rectMock = vi.fn(() => {
        return (rectMock.mock.calls.length > 1 ? { y: 150 } : { y: 100 }) as unknown as DOMRect;
      });

      vi.spyOn(container?.firstElementChild as Element, 'getBoundingClientRect').mockImplementation(
        rectMock,
      );

      act(() => {
        const selectProps = renderSelectFn.mock.calls[0][0];
        selectProps.onChange(selectProps.options[1]);
      });

      await findByText('children: application/xml');

      await new Promise((resolve) => setTimeout(resolve, 500)); // sleep

      expect(rectMock).toHaveBeenCalledTimes(2);
      expect(scrollByMock).toHaveBeenCalledWith(0, 50);
    });

    test('should not throw and render null for empty media types', () => {
      const childrenFn = vi.fn((mimeType) => <>children: {mimeType.name}</>);
      const renderSelectFn = vi.fn(() => null);

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
