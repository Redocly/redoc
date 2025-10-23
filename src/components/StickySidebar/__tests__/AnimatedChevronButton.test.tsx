import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { AnimatedChevronButton } from '../AnimatedChevronButton';

describe('AnimatedChevronButton', () => {
  it('should render without crashing', () => {
    const { container } = render(<AnimatedChevronButton open={false} />);
    expect(container).toBeInTheDocument();
  });

  it('should apply the correct transform when "open" is true', () => {
    const { container } = render(<AnimatedChevronButton open={true} />);
    const chevron = container.querySelector('svg');
    expect(chevron).toHaveStyle('transform: translate(2px, 8px) rotate(180deg)');
  });

  it('should apply the correct transform when "open" is false', () => {
    const { container } = render(<AnimatedChevronButton open={false} />);
    const chevron = container.querySelector('svg');
    expect(chevron).toHaveStyle('transform: translate(2px, -4px) rotate(180deg)');
  });
});
