import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import type { OpenAPIDefinition, OpenAPIExample } from '../../../types';

import { Example } from '../Example';
import { normalizeOptions, OpenAPIParser } from '../../../services';
import { getExamples } from '../../../models';
import testDefinition from './fixtures/mediaTypeUrlencoded.json';

describe('Example component', () => {
  const opts = normalizeOptions({});
  const parser = new OpenAPIParser(testDefinition as OpenAPIDefinition, undefined, opts);

  it('render component without error when `externalValue` is pdf file', () => {
    const example = getExamples({
      parser,
      infoOrRef: {
        summary: 'A sample file',
        externalValue: 'https://assets.identi.tech/dummy.pdf',
      } as OpenAPIExample,
      mime: 'application/pdf',
    });
    const { container } = render(
      <Jotai.Provider>
        <Example example={example} mimeType={example.mime} onCopyClick={jest.fn()} />
      </Jotai.Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('render component with `externalValue`', () => {
    const example = getExamples({
      parser,
      infoOrRef: {
        summary: 'A sample json',
        externalValue: 'https://jsonplaceholder.typicode.com/todos/1',
      } as OpenAPIExample,
      mime: 'application/json',
    });

    const { container } = render(
      <Jotai.Provider>
        <Example example={example} mimeType={example.mime} onCopyClick={jest.fn()} />
      </Jotai.Provider>,
    );

    expect(container).toMatchSnapshot();
  });
});
