import { useId } from 'react';
import { styled } from 'styled-components';

export const PanelWrapper = styled.div`
  border: 1px solid var(--border-color-secondary, var(--border-color-primary));
  border-radius: var(--panel-border-radius);
  background-color: var(--panel-bg-color, var(--bg-color));
  margin-top: var(--spacing-base);
`;

export const PanelHeading = styled.div`
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  padding: calc(var(--spacing-sm, 12px) + 2px) var(--spacing-md) calc(var(--spacing-xs) + 2px);
  border-bottom: 1px solid var(--border-color-secondary, var(--border-color-primary));
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-sm, 12px) var(--spacing-md) var(--spacing-md);
  gap: var(--spacing-xs);
  max-height: 400px;
  overflow-y: auto;
`;

export const PanelListItem = styled.div`
  display: flex;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-md, var(--line-height-base));
  color: var(--text-color-secondary);
  align-items: center;
`;

export const StyledListIcon = styled.svg`
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin-right: var(--spacing-sm, 12px);

  path,
  circle {
    fill: var(--border-color-primary);
    stroke: var(--border-color-primary);
  }
`;

export function ListIcon() {
  const clipId = `panel-list-icon-clip-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  return (
    <StyledListIcon viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath={`url(#${clipId})`}>
        <path d="M0 11H22" strokeLinecap="round" />
        <circle cx="4" cy="11" r="4" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </StyledListIcon>
  );
}
