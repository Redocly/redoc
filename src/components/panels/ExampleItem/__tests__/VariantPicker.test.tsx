import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import type { SchemaVariantSelection } from '../hooks.js';

import { VariantPicker } from '../selectors.js';

function makeSelection(overrides: Partial<SchemaVariantSelection> = {}): SchemaVariantSelection {
  return {
    options: [
      { key: 'cat', label: 'Cat' },
      { key: 'dog', label: 'Dog' },
    ],
    activeIdx: 0,
    onSelect: () => {},
    kind: 'oneOf',
    optionMeta: [{}, {}],
    ...overrides,
  };
}

describe('VariantPicker', () => {
  it('renders nothing when no selection is provided', () => {
    const { container } = render(<VariantPicker />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the active option label inside the trigger', () => {
    render(<VariantPicker selection={makeSelection({ activeIdx: 1 })} />);
    const trigger = screen.getByRole('button', { name: 'Variant' });
    expect(trigger).toHaveTextContent('Dog');
  });

  it('uses "Discriminator" as the default aria-label for discriminator axes', () => {
    render(<VariantPicker selection={makeSelection({ kind: 'discriminator' })} />);
    expect(screen.getByRole('button', { name: 'Discriminator' })).toBeInTheDocument();
  });

  it('uses "Variant" as the default aria-label for oneOf/anyOf axes', () => {
    render(<VariantPicker selection={makeSelection({ kind: 'oneOf' })} />);
    expect(screen.getByRole('button', { name: 'Variant' })).toBeInTheDocument();
  });

  it('respects an explicit label override', () => {
    render(<VariantPicker selection={makeSelection()} label="Body schema" />);
    expect(screen.getByRole('button', { name: 'Body schema' })).toBeInTheDocument();
  });

  it('opens the menu and lists every option label', () => {
    render(<VariantPicker selection={makeSelection()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Variant' }));

    const items = screen.getAllByRole('menuitem');
    expect(items.map((el) => el.textContent)).toEqual(['Cat', 'Dog']);
  });

  it('invokes onSelect with the chosen option index when a menu item is clicked', () => {
    const onSelect = vi.fn();
    render(<VariantPicker selection={makeSelection({ onSelect })} />);

    fireEvent.click(screen.getByRole('button', { name: 'Variant' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Dog' }));

    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('renders the defaultMapping icon in the trigger when the default option is active', () => {
    render(
      <VariantPicker
        selection={makeSelection({
          options: [
            { key: 'cat', label: 'cat' },
            { key: 'default', label: 'Default mapping' },
          ],
          activeIdx: 1,
          optionMeta: [{}, { isDefaultMapping: true }],
        })}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Variant' });
    expect(trigger.querySelector('svg[viewBox="0 0 12 12"]')).not.toBeNull();
  });

  it('does not render the defaultMapping icon in the trigger when a regular option is active', () => {
    render(
      <VariantPicker
        selection={makeSelection({
          options: [
            { key: 'cat', label: 'cat' },
            { key: 'default', label: 'Default mapping' },
          ],
          activeIdx: 0,
          optionMeta: [{}, { isDefaultMapping: true }],
        })}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Variant' });
    expect(trigger.querySelector('svg[viewBox="0 0 12 12"]')).toBeNull();
  });
});
