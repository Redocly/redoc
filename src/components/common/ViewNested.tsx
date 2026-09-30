import { styled, css } from 'styled-components';
import { memo, useState } from 'react';

import type { PropsWithChildren } from 'react';

import { isUndefined } from '@redocly/theme/core/openapi';

import { cycleColorsByLevel } from '../Schema/utils.js';
import { NestedToggleButton } from './NestedToggleButton.js';

type ViewNestedProps = {
  expandByDefault: boolean;
  level?: number;
  expandable?: boolean;
  expandText?: string;
  hideText?: string;
  hideDivider?: boolean;
  expandedAll?: boolean;
  isNestedArray?: boolean;
};

function ViewNestedComponent({
  expandByDefault,
  level,
  expandable = false,
  expandText,
  hideText,
  hideDivider = false,
  children,
  expandedAll,
  isNestedArray,
}: PropsWithChildren<ViewNestedProps>) {
  const [localExpanded, setLocalExpanded] = useState((expandByDefault || isNestedArray) ?? false);

  const expanded = !isUndefined(expandedAll) ? expandedAll : localExpanded;

  const color = expanded ? cycleColorsByLevel(level) : undefined;

  if (!expandable) return children;

  const handleToggle = () => {
    setLocalExpanded((prev) => !prev);
  };

  if (isNestedArray) {
    return (
      <>
        <LabelValue>Array [</LabelValue>
        <Wrapper $isArrayInsideArray={isNestedArray} className="view-nested-wrapper">
          <StyledNested $color={color}>{children}</StyledNested>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <Wrapper $divider={!hideDivider && !expanded} className="view-nested-wrapper">
        <ShowProperty
          expanded={expanded}
          label={expanded ? hideText || '' : expandText || ''}
          color={color}
          onClick={handleToggle}
        />
        {expanded && <StyledNested $color={color}>{children}</StyledNested>}
      </Wrapper>
    </>
  );
}

export const ViewNested = memo<PropsWithChildren<ViewNestedProps>>(ViewNestedComponent);

const ShowProperty = styled(NestedToggleButton)`
  margin: var(--spacing-xxs) 0 var(--spacing-xs);
  width: 100%;
`;

const StyledNested = styled.div<{ $color?: string }>`
  padding-left: var(--schema-nested-offset);
  border-left: 1px solid ${({ $color }) => $color || 'var(--border-color-primary)'};
  margin: -10px 0 0 9px;
  ${({ $color }) =>
    $color &&
    css`
      .schema-name {
        color: ${$color};
      }
    `}
`;

const Wrapper = styled.div<{ $divider?: boolean; $isArrayInsideArray?: boolean }>`
  width: 100%;
  ${({ $isArrayInsideArray }) =>
    $isArrayInsideArray &&
    css`
      padding-top: var(--schema-property-details-spacing);
    `}

  ${({ $divider }) =>
    $divider &&
    css`
      border-bottom: 1px solid var(--border-color-primary);
      padding-bottom: var(--schema-property-details-spacing);
    `}
`;

export const LabelValue = styled.span`
  padding: 0 var(--spacing-xs);
  border-radius: var(--tag-border-radius);
  border: 1px solid var(--border-color-secondary);
  background-color: var(--bg-color);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--tag-basic-content-color);
`;
