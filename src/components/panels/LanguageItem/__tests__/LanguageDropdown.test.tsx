import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { TelemetryContext } from '../../../../contexts/telemetry.js';
import { LanguageDropdown } from '../LanguageDropdown.js';

vi.mock('@redocly/theme/components/Dropdown/Dropdown', () => ({
  Dropdown: ({ trigger, children }: any) => (
    <div>
      <div data-testid="dropdown-trigger">{trigger}</div>
      <div data-testid="dropdown-menu">{children}</div>
    </div>
  ),
}));
vi.mock('@redocly/theme/components/Dropdown/DropdownMenu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../LanguageItem.js', () => ({
  LanguageItem: ({ item }: any) => <span>{item.title}</span>,
}));
vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({ CheckmarkIcon: () => null }));

afterEach(() => {
  cleanup();
});

it('should render just the trigger for a single sample and a full dropdown for multiple samples', () => {
  const { rerender } = render(
    <LanguageDropdown
      samples={[{ key: 'Python', title: 'Python', lang: 'Python' }]}
      activeTab="Python"
      onChange={vi.fn()}
    />,
  );
  expect(screen.queryByTestId('dropdown-menu')).toBeNull();
  expect(screen.getByText('Python')).toBeInTheDocument();

  rerender(
    <LanguageDropdown
      samples={[
        { key: 'Python', title: 'Python', lang: 'Python' },
        { key: 'curl', title: 'curl', lang: 'curl' },
      ]}
      activeTab="Python"
      onChange={vi.fn()}
    />,
  );
  expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
});

it('should call onChange with the selected language key', () => {
  const onChange = vi.fn();
  render(
    <LanguageDropdown
      samples={[
        { key: 'Python', title: 'Python', lang: 'Python' },
        { key: 'curl', title: 'curl', lang: 'curl' },
      ]}
      activeTab="Python"
      onChange={onChange}
    />,
  );
  fireEvent.click(screen.getByText('curl'));
  expect(onChange).toHaveBeenCalledWith('curl');
});

it('should use the provided trigger element instead of the default button', () => {
  render(
    <LanguageDropdown
      samples={[
        { key: 'Python', title: 'Python', lang: 'Python' },
        { key: 'curl', title: 'curl', lang: 'curl' },
      ]}
      activeTab="Python"
      onChange={vi.fn()}
      trigger={<button data-testid="custom-trigger">Open</button>}
    />,
  );
  expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
});

it.each([
  ['curl', 'curl'],
  ['Acme Payments SDK', 'other'],
])('fires sendSelectLanguageClickedMessage for %s as %s', (title, language) => {
  const telemetry = { sendSelectLanguageClickedMessage: vi.fn() };
  render(
    <TelemetryContext.Provider value={telemetry as never}>
      <LanguageDropdown
        samples={[
          { key: 'Python', title: 'Python', lang: 'Python' },
          { key: 'curl', title: 'curl', lang: 'curl' },
          { key: 'acme payments sdk', title: 'Acme Payments SDK', lang: 'Python' },
        ]}
        activeTab="Python"
        onChange={vi.fn()}
      />
    </TelemetryContext.Provider>,
  );

  fireEvent.click(screen.getByText(title));

  expect(telemetry.sendSelectLanguageClickedMessage).toHaveBeenCalledTimes(1);
  expect(telemetry.sendSelectLanguageClickedMessage.mock.calls[0][0][0]).toMatchObject({
    id: 'selectLanguageButton',
    object: 'button',
    language,
  });
});
