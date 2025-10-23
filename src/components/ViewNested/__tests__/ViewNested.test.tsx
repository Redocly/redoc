import { render, screen } from '@testing-library/react';

import { ViewNested } from '../ViewNested';

describe('ViewNested', () => {
  it('should render nested array content directly without show properties button', () => {
    render(
      <ViewNested expandByDefault={false} isNestedArray={true}>
        <div>Nested Array Content</div>
      </ViewNested>,
    );

    expect(screen.getByText('Nested Array Content')).toBeInTheDocument();
    expect(screen.queryByText(/Show \d+ properties/)).toBeNull();
  });

  it('should auto-expand nested arrays', () => {
    render(
      <ViewNested expandByDefault={false} isNestedArray={true}>
        <div>Nested Content</div>
      </ViewNested>,
    );

    const nestedContent = screen.getByText('Nested Content');
    expect(nestedContent).toBeVisible();
  });
});
