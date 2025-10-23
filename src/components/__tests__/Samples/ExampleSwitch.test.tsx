import { render } from '@testing-library/react';

import { ExampleSwitch } from '../../Samples';
import { exampleXML, examples } from '../mocks/examples';

describe('ExampleSwitch', () => {
  const exampleKey = 'cat';

  it('should correctly render ExampleSwitch', () => {
    const { container } = render(
      <ExampleSwitch exampleKey={exampleKey} examples={examples} onChange={() => {}} />,
    );

    expect(container.getElementsByClassName('dropdown-wrapper').length).toBe(1);
    expect(container.getElementsByClassName('dropdown-option').length).toBe(3);
  });

  it('should correctly display ExampleSwitch with a different number of examples in the media type', () => {
    let examplesObj = {
      exampleKey: 'bee',
      examples: examples,
    };

    const { container, rerender } = render(
      <ExampleSwitch
        exampleKey={examplesObj.exampleKey}
        examples={examplesObj.examples}
        onChange={() => {}}
      />,
    );

    expect(container.getElementsByClassName('dropdown-wrapper').length).toBe(1);
    expect(container.getElementsByClassName('dropdown-option').length).toBe(3);

    examplesObj = {
      exampleKey: 'foo',
      examples: exampleXML,
    };
    rerender(
      <ExampleSwitch
        exampleKey={examplesObj.exampleKey}
        examples={examplesObj.examples}
        onChange={() => {}}
      />,
    );
    expect(container.getElementsByClassName('dropdown-wrapper').length).toBe(1);
    expect(container.getElementsByClassName('dropdown-option').length).toBe(2);
  });
});
