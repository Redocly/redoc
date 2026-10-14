import { styled } from 'styled-components';

export const Tag = styled.span`
  background: var(--tag-bg-color);
  padding: 0 var(--spacing-xxs);
  font-family: var(--font-family-monospaced);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  border-radius: var(--tag-border-radius);
  color: var(--text-color-secondary);
  display: inline-flex;
  word-break: var(--code-word-break);
`;
