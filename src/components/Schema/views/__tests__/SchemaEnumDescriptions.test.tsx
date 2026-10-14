import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { Node } from '@markdoc/markdoc';

import { SchemaEnumDescriptions } from '../SchemaEnumDescriptions.js';

vi.mock('../../SchemaDescription.js', () => ({
  SchemaDescription: ({ value }: { value: unknown }) => (
    <span data-testid="schema-description" data-kind={typeof value}>
      {typeof value === 'string' ? value : 'rendered-markdoc'}
    </span>
  ),
}));

function makeMarkdocNode(text: string): Node {
  return {
    $$mdtype: 'Node',
    type: 'paragraph',
    inline: false,
    attributes: {},
    children: [
      {
        $$mdtype: 'Node',
        type: 'text',
        inline: true,
        attributes: { content: text },
        children: [],
      },
    ],
  } as unknown as Node;
}

describe('SchemaEnumDescriptions', () => {
  it('renders enum keys and routes string descriptions through SchemaDescription', () => {
    render(
      <SchemaEnumDescriptions
        values={{
          draft: 'Draft cancellation.',
          confirmed: 'Confirmed cancellation.',
        }}
      />,
    );

    expect(screen.getByText('draft')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();

    const descriptions = screen.getAllByTestId('schema-description');
    expect(descriptions).toHaveLength(2);
    expect(descriptions[0]).toHaveAttribute('data-kind', 'string');
    expect(descriptions[0]).toHaveTextContent('Draft cancellation.');
    expect(descriptions[1]).toHaveTextContent('Confirmed cancellation.');
  });

  it('does not crash when description is a Markdoc AST node and routes it through SchemaDescription', () => {
    render(
      <SchemaEnumDescriptions
        values={{
          completed: makeMarkdocNode('Completed cancellation.'),
        }}
      />,
    );

    expect(screen.getByText('completed')).toBeInTheDocument();
    const description = screen.getByTestId('schema-description');
    expect(description).toHaveAttribute('data-kind', 'object');
    expect(description).toHaveTextContent('rendered-markdoc');
  });

  it('handles a mix of string and Markdoc node descriptions for the same property', () => {
    render(
      <SchemaEnumDescriptions
        values={{
          draft: 'Draft cancellation.',
          completed: makeMarkdocNode('Completed cancellation.'),
          revoked: [makeMarkdocNode('Revoked cancellation.')],
        }}
      />,
    );

    expect(screen.getByText('draft')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText('revoked')).toBeInTheDocument();

    const descriptions = screen.getAllByTestId('schema-description');
    expect(descriptions).toHaveLength(3);
    expect(descriptions[0]).toHaveAttribute('data-kind', 'string');
    expect(descriptions[1]).toHaveAttribute('data-kind', 'object');
    expect(descriptions[2]).toHaveAttribute('data-kind', 'object');
  });

  it('uses singular "Value" header when only one entry is present', () => {
    render(<SchemaEnumDescriptions values={{ only: 'Only value.' }} />);
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument();
  });

  it('uses "Enum Value" header when multiple entries are present', () => {
    render(<SchemaEnumDescriptions values={{ first: 'First value.', second: 'Second value.' }} />);
    expect(screen.getByRole('columnheader', { name: 'Enum Value' })).toBeInTheDocument();
  });

  describe('"Items" prefix for array types (regression 2.10.5)', () => {
    it('prefixes "Items" for an array type with multiple enum values', () => {
      render(
        <SchemaEnumDescriptions
          type="Array<string>"
          values={{ first: 'First value.', second: 'Second value.' }}
        />,
      );
      expect(screen.getByRole('columnheader', { name: 'Items Enum Value' })).toBeInTheDocument();
    });

    it('prefixes "Items" for an array type with a single enum value', () => {
      render(<SchemaEnumDescriptions type="Array<string>" values={{ only: 'Only value.' }} />);
      expect(screen.getByRole('columnheader', { name: 'Items Value' })).toBeInTheDocument();
    });

    it('does not prefix "Items" for a non-array type', () => {
      render(
        <SchemaEnumDescriptions
          type="string"
          values={{ first: 'First value.', second: 'Second value.' }}
        />,
      );
      expect(screen.getByRole('columnheader', { name: 'Enum Value' })).toBeInTheDocument();
    });
  });
});
