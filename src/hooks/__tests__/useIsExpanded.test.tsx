import type { ReactNode } from 'react';

import { it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { useIsExpanded } from '../useIsExpanded.js';

function isExpanded(id: string, pathname: string): boolean {
  const { result } = renderHook(() => useIsExpanded(id), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[pathname]}>{children}</MemoryRouter>
    ),
  });
  return result.current;
}

it('should return true when pathname exactly equals the id', () => {
  expect(isExpanded('/pets', '/pets')).toBe(true);
});

it('should return false when pathname does not match the id', () => {
  expect(isExpanded('/pets', '/orders')).toBe(false);
});

it('should return true when pathname ends with the id', () => {
  expect(isExpanded('/pets', '/docs/pets')).toBe(true);
});

it('should return true when id is a path-segment prefix of pathname', () => {
  expect(isExpanded('/pets', '/pets/list')).toBe(true);
});

it('should return false when id matches as a string prefix but not a full segment', () => {
  expect(isExpanded('/pets', '/petstore')).toBe(false);
});

it('should return true when id has no leading slash but pathname has one', () => {
  expect(isExpanded('pets', '/pets')).toBe(true);
});

it('should return true when pathname has %5C and id has a literal backslash', () => {
  expect(isExpanded('/menu/op\\name', '/menu/op%5Cname')).toBe(true);
});

it('should return true when id has %5C encoding and pathname has a literal backslash', () => {
  expect(isExpanded('/menu/op%5Cname', '/menu/op\\name')).toBe(true);
});

it('should return true when both pathname and id use %5C uppercase encoding', () => {
  expect(isExpanded('/menu/op%5Cname', '/menu/op%5Cname')).toBe(true);
});

it('should return true when both pathname and id use %5c lowercase encoding', () => {
  expect(isExpanded('/menu/op%5cname', '/menu/op%5cname')).toBe(true);
});

it('should return true when encoded id is a segment prefix of an encoded pathname', () => {
  expect(isExpanded('/menu/op%5Cname', '/menu/op%5Cname/detail')).toBe(true);
});
