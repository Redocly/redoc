import { styled } from '../../styled-components.js';

export const Tag = styled.div`
  border-radius: var(--border-radius);
  padding: 0 var(--spacing-xxs);
  font-family: var(--font-family-monospaced);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-primary);
  background-color: var(--tag-bg-color);
`;

export const StyledLink = styled.a`
  color: var(--link-color-primary);
  text-decoration: none;
  word-wrap: break-word;
`;
