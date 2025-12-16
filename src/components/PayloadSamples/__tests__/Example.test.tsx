import { render } from '@testing-library/react';
import * as Jotai from 'jotai';

import type { OpenAPIDefinition, OpenAPIExample } from '../../../types/index.js';

import { Example } from '../Example.js';
import { normalizeOptions, OpenAPIParser } from '../../../services/index.js';
import { getExamples } from '../../../models/index.js';
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
        <Example example={example} mimeType={example.mime} onCopyClick={vi.fn()} />
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
        <Example example={example} mimeType={example.mime} onCopyClick={vi.fn()} />
      </Jotai.Provider>,
    );

    expect(container).toMatchSnapshot();
  });
});
