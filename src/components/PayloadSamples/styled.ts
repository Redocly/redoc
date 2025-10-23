import { CodeBlock } from '@redocly/theme/components/CodeBlock/CodeBlock';

import { styled } from '../../styled-components.js';

export const SelectLabel = styled.span`
  font-size: 12px;
  position: absolute;
  z-index: 1;
  top: -11px;
  left: 12px;
  font-weight: var(--font-weight-bold);
  color: var(--panel-samples-text-color);
  opacity: 0.7;
  font-family: var(--font-family-base);
`;

export const SelectWrapper = styled.div`
  position: relative;
`;

export const StyledCodeBlock = styled(CodeBlock)`
  border: none;
  margin: 0;

  .code-block-header {
    border-bottom: 0;
    padding-right: var(--spacing-sm);
  }
`;
