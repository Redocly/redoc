/* tslint:disable:no-implicit-dependencies */

import { render } from '@testing-library/react';

import { RenderHook } from '../RenderHook.js';

describe('RenderHook', () => {
  it('should render correctly', () => {
    const { container } = render(
      <RenderHook
        Hook={({ someProp }) => ({ html: `<a href='#'>${someProp}</a>` })}
        props={{ someProp: 'text' }}
      />,
    );
    expect(container.innerHTML).toEqual('<span><a href="#">text</a></span>');
  });

  it("should return null if Hook prop isn't defined", () => {
    const { container } = render(<RenderHook props={{ someProp: 'text' }} />);
    expect(container.innerHTML).toEqual('');
  });
});
