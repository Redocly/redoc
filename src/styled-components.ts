import _styled from 'styled-components';

// https://github.com/styled-components/styled-components/issues/3601#issue-1023120934
export const styled =
  // @ts-expect-error incompatibility between styled-components and @types/styled-components
  typeof _styled === 'function' ? _styled : _styled.default;
