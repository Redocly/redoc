import { it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { ViewNested } from '../ViewNested.js';

const mockCycleColorsByLevel = vi.hoisted(() => vi.fn(() => 'blue'));

vi.mock('@redocly/theme/core/openapi', () => ({
  isUndefined: (v: unknown) => v === undefined,
}));
vi.mock('../../icons/PlusCircleIcon/PlusCircleIcon.js', () => ({
  PlusCircleIcon: ({ sign }: any) => <span data-testid="toggle-icon">{sign}</span>,
}));
vi.mock('../../Schema/utils.js', () => ({
  cycleColorsByLevel: mockCycleColorsByLevel,
}));

beforeEach(() => {
  mockCycleColorsByLevel.mockClear();
});

it('should render children directly when not expandable', () => {
  render(
    <ViewNested expandByDefault={false}>
      <span>content</span>
    </ViewNested>,
  );
  expect(screen.getByText('content')).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
});

it('should show expandText when collapsed, toggle children and labels on click', () => {
  render(
    <ViewNested expandByDefault={false} expandable expandText="Show more" hideText="Hide">
      <span>nested content</span>
    </ViewNested>,
  );
  expect(screen.getByText('Show more')).toBeInTheDocument();
  expect(screen.queryByText('nested content')).toBeNull();

  fireEvent.click(screen.getByRole('button'));
  expect(screen.queryByText('Show more')).toBeNull();
  expect(screen.getByText('Hide')).toBeInTheDocument();
  expect(screen.getByText('nested content')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Show more')).toBeInTheDocument();
  expect(screen.queryByText('nested content')).toBeNull();
});

it('should start expanded when expandByDefault is true', () => {
  render(
    <ViewNested expandByDefault expandable expandText="Show" hideText="Hide">
      <span>nested content</span>
    </ViewNested>,
  );
  expect(screen.getByText('nested content')).toBeInTheDocument();
  expect(screen.queryByText('Show')).toBeNull();
});

it('should use expandedAll to override local expanded state', () => {
  const { rerender } = render(
    <ViewNested expandByDefault={false} expandable expandText="Show" expandedAll={true}>
      <span>nested content</span>
    </ViewNested>,
  );
  expect(screen.getByText('nested content')).toBeInTheDocument();

  rerender(
    <ViewNested expandByDefault={false} expandable expandText="Show" expandedAll={false}>
      <span>nested content</span>
    </ViewNested>,
  );
  expect(screen.queryByText('nested content')).toBeNull();
});

it('should render Array label and always show children when isNestedArray is true', () => {
  render(
    <ViewNested expandByDefault={false} expandable isNestedArray>
      <span>array item</span>
    </ViewNested>,
  );
  expect(screen.getByText('Array [')).toBeInTheDocument();
  expect(screen.getByText('array item')).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
});

it('should call cycleColorsByLevel with the level prop when expanded', () => {
  render(
    <ViewNested expandByDefault expandable level={3}>
      <span>content</span>
    </ViewNested>,
  );
  expect(mockCycleColorsByLevel).toHaveBeenCalledWith(3);
});

it('should not call cycleColorsByLevel when collapsed', () => {
  render(
    <ViewNested expandByDefault={false} expandable level={3}>
      <span>content</span>
    </ViewNested>,
  );
  expect(mockCycleColorsByLevel).not.toHaveBeenCalled();
});

it('should call cycleColorsByLevel with level when isNestedArray is true since it is always expanded', () => {
  render(
    <ViewNested expandByDefault={false} expandable isNestedArray level={2}>
      <span>array item</span>
    </ViewNested>,
  );
  expect(mockCycleColorsByLevel).toHaveBeenCalledWith(2);
});
