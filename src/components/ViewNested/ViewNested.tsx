import { css } from 'styled-components';
import { memo, useEffect, useState } from 'react';

import type { PropsWithChildren } from 'react';

import { isUndefined } from '@redocly/theme/core/openapi';

import { cycleColorsByLevel } from '../PropertyDetails/cycleColorsByLevel.js';
import { CircleIcon } from '../PropertyDetails/PlusCircleIcon.js';
import { LabelValue } from '../common/styled.js';
import { styled } from '../../styled-components.js';

interface ViewNestedProps {
  expandByDefault: boolean;
  level?: number;
  expandable?: boolean;
  expandText?: string;
  hideText?: string;
  hideDivider?: boolean;
  expandedAll?: boolean;
  isNestedArray?: boolean;
}

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
  const [expanded, setExpanded] = useState((expandByDefault || isNestedArray) ?? false);
  useEffect(() => {
    if (!isUndefined(expandedAll)) {
      setExpanded(expandedAll);
    }
  }, [expandedAll]);

  const color = expanded ? cycleColorsByLevel(level) : undefined;

  if (!expandable) return children;

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  if (isNestedArray) {
    return (
      <>
        <LabelValue>Array [</LabelValue>
        <Wrapper $isArrayInsideArray={isNestedArray} className="view-nested-wrapper">
          <StyledNested color={color}>{children}</StyledNested>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <Wrapper $divider={!hideDivider && !expanded} className="view-nested-wrapper">
        <ShowProperty onClick={handleToggle}>
          <CircleIcon sign={expanded ? '-' : '+'} color={color} />
          {!expanded && expandText}
          {expanded && (hideText || '')}
        </ShowProperty>
        {expanded && <StyledNested color={color}>{children}</StyledNested>}
      </Wrapper>
    </>
  );
}

export const ViewNested = memo<PropsWithChildren<ViewNestedProps>>(ViewNestedComponent);

const ShowProperty = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  gap: var(--spacing-xxs);
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
  margin: var(--spacing-xxs) 0 var(--spacing-xs);
  width: 100%;
`;

const StyledNested = styled.div<{ color?: string }>`
  padding-left: var(--schema-nested-offset);
  border-left: 1px solid ${({ color }) => color || 'var(--border-color-primary)'};
  margin: -10px 0 0 9px;
  ${({ color }) =>
    color &&
    css`
      .schema-name {
        color: ${color};
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
