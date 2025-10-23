import { memo } from 'react';
import { css } from 'styled-components';

import type { PropsWithChildren } from 'react';
import type { OpenAPIXBadges } from '../../types/index.js';

import { Badge } from '@redocly/theme/components/Badge/Badge';

import { styled } from '../../styled-components.js';

interface CustomBadgesProps {
  badges?: OpenAPIXBadges[];
}

function CustomBadgesComponent({ badges, children }: PropsWithChildren<CustomBadgesProps>) {
  if (!badges) return <>{children}</>;

  const badgesBefore = badges.filter(({ position }) => position === 'before');
  const badgesAfter = badges.filter(({ position }) => position === 'after');
  return (
    <>
      {badgesBefore.map(({ name, color }) => (
        <StyledBadge key={name} color={color}>
          {name}
        </StyledBadge>
      ))}
      {children}
      {badgesAfter.map(({ name, color }) => (
        <StyledBadge key={name} color={color}>
          {name}
        </StyledBadge>
      ))}
    </>
  );
}

export const CustomBadges = memo<PropsWithChildren<CustomBadgesProps>>(CustomBadgesComponent);

export const StyledBadge = styled(Badge)`
  margin-left: 0;
  background-color: ${({ color }) => color || 'var(--color-info-base)'};
  ${({ deprecated }) =>
    deprecated &&
    css`
      color: var(--badge-deprecated-text-color);
      background-color: var(--badge-deprecated-bg-color);
      border-radius: var(--badge-deprecated-border-radius);
    `};
`;

export const NavigationBadge = styled(StyledBadge)<{ deprecated?: boolean; color?: string }>`
  margin-left: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  padding: 0 var(--spacing-xxs);
  max-width: 80px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
