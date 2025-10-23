import { renderHook } from '@testing-library/react';

import { useOneOfLocationIdx } from '../useOneOfLocationIdx';

jest.mock('../../../hooks/useLocation', () => ({
  useLocation: jest.fn().mockReturnValue({
    pathname: '/',
    hash: '#plans/postplan/t=request&path=&oneof=1/trial&oneof=0/period',
  }),
}));

describe('useOneOfLocationIdx', () => {
  it('should return the index of the oneOf item in the hash', () => {
    const oneOf = [{}, {}, {}];
    const level = 1;
    const { result } = renderHook(() => useOneOfLocationIdx(oneOf, level));

    expect(result.current).toBe(1);
  });

  it('should return -1 if the oneOf item is not found in the hash', () => {
    const oneOf = [{}, {}, {}];
    const level = 3;
    const { result } = renderHook(() => useOneOfLocationIdx(oneOf, level));

    expect(result.current).toBe(-1);
  });
});
