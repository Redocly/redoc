import { memo } from 'react';
import { styled, css } from 'styled-components';

import type { PropsWithChildren } from 'react';

import { NestedToggleButton } from '../common/NestedToggleButton.js';
import { cycleColorsByLevel } from '../Schema/utils.js';

interface ViewNestedProps {
  expanded: boolean;
  expandText: string;
  collapseText: string;
  level?: number;
  collapsedArgs?: Array<{ name: string; required?: boolean }>;
  onClick?: () => void;
}

function ViewNestedComponent({
  expanded,
  level,
  expandText,
  collapseText,
  children,
  collapsedArgs = [],
  onClick,
}: PropsWithChildren<ViewNestedProps>) {
  const color = expanded ? cycleColorsByLevel(level) : undefined;

  return (
    <Wrapper $expanded={expanded}>
      <ButtonWrapper>
        <ShowProperty
          expanded={expanded}
          label={expanded ? collapseText : expandText}
          color={color}
          onClick={onClick}
        />
        {!expanded && collapsedArgs.length > 0 && (
          <ArgsPreview>
            {collapsedArgs.map((arg) => (
              <ArgName key={arg.name}>
                {arg.name}
                {arg.required && <RequiredMark>*</RequiredMark>}
              </ArgName>
            ))}
          </ArgsPreview>
        )}
      </ButtonWrapper>
      {expanded && <StyledNested $color={color}>{children}</StyledNested>}
    </Wrapper>
  );
}

export const ViewNested = memo<PropsWithChildren<ViewNestedProps>>(ViewNestedComponent);

const Wrapper = styled.div<{ $expanded: boolean }>`
  width: 100%;
  margin: var(--spacing-xxs, 4px) 0;
  display: flex;
  flex-direction: row;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ $expanded }) =>
    $expanded &&
    css`
      flex-direction: column;
    `}
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-xxs, 4px);
`;

const ArgsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs, 4px);
  align-items: baseline;
`;

const ArgName = styled.span`
  color: var(--schema-inline-code-text-color, var(--text-color-primary));
  background-color: var(--bg-color-active, #f0f0f0);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  padding: 0 var(--spacing-xs, 8px);
  border-radius: var(--border-radius);
`;

const RequiredMark = styled.span`
  color: var(--color-error-base, #d32f2f);
`;

const ShowProperty = styled(NestedToggleButton)``;

const StyledNested = styled.div<{ $color?: string }>`
  position: relative;
  padding-left: var(--schema-nested-offset, 10px);
  margin: 0 0 0 10px;

  &:before {
    content: '';
    height: calc(100% + 1px);
    position: absolute;
    top: -1px;
    left: -0.5px;
    border-left: 1px solid ${({ $color }) => $color || 'var(--border-color-primary)'};
  }
`;
