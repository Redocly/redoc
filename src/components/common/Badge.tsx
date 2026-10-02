import { styled, css } from 'styled-components';

import type { ReactElement } from 'react';

import { Tag } from '@redocly/theme/components/Tag/Tag';

export const TextBadge = styled(Tag)`
  text-transform: uppercase;
  background-color: unset;
  border: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  align-self: flex-end;
`;

export const StyledBadge = styled(Tag)<{
  color?: string;
  $deprecated?: boolean;
  webhook?: boolean;
}>`
  margin-left: 0;
  ${({ $deprecated }) =>
    $deprecated &&
    css`
      color: var(--badge-deprecated-text-color);
      background-color: var(--badge-deprecated-bg-color);
      border-radius: var(--badge-deprecated-border-radius);
    `};
  ${({ webhook }) =>
    webhook &&
    css`
      color: var(--badge-webhook-text-color);
      background-color: var(--badge-webhook-bg-color);
      border-radius: var(--badge-webhook-border-radius);
    `};
`;

export const NavigationBadge = styled(StyledBadge)<{ $deprecated?: boolean }>`
  margin-left: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  padding: 0 var(--spacing-xxs);
  max-width: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export function renderPropertyBadge(badge: { name: string; color?: string }): ReactElement {
  return (
    <StyledBadge key={badge.name} color={badge.color}>
      {badge.name}
    </StyledBadge>
  );
}
