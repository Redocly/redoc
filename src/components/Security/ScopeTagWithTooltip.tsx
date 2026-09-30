import { styled } from 'styled-components';

import type { ReactElement, ReactNode } from 'react';

import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';

import { getVisibleScopeLabel, isScopeTruncated } from '../../utils/security-scope.js';
import { ScopeTag } from './styled.js';

interface ScopeTagWithTooltipProps {
  text: string;
  maxChars?: number;
  tip?: string | ReactNode;
  ariaLabel?: string;
  arrowPosition?: 'left' | 'right' | 'center';
  large?: boolean;
}

export function ScopeTagWithTooltip({
  text,
  maxChars = 32,
  tip,
  ariaLabel,
  arrowPosition = 'center',
  large = false,
}: ScopeTagWithTooltipProps): ReactElement {
  const label = getVisibleScopeLabel(text, maxChars);
  const resolvedTip = tip ?? (isScopeTruncated(text, maxChars) ? text : undefined);

  if (!resolvedTip) {
    return (
      <InlineItem>
        <ScopeTag>
          <TruncatedText $large={large}>{label}</TruncatedText>
        </ScopeTag>
      </InlineItem>
    );
  }

  return (
    <InlineItem>
      <Tooltip placement="bottom" arrowPosition={arrowPosition} tip={resolvedTip}>
        <FocusableWrapper role="button" tabIndex={0} aria-label={ariaLabel ?? text}>
          <ScopeTag>
            <TruncatedText $large={large}>{label}</TruncatedText>
          </ScopeTag>
        </FocusableWrapper>
      </Tooltip>
    </InlineItem>
  );
}

const TruncatedText = styled.span<{ $large?: boolean }>`
  display: inline-flex;
  font-family: var(--font-family-base);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 16rem;
  color: var(--color-warm-grey-8);
  padding: ${({ $large }) => ($large ? '0 var(--spacing-xxs)' : '')};
  &&& {
    font-size: ${({ $large }) => ($large ? 'var(--font-size-base)' : 'var(--font-size-sm)')};
  }
`;

const FocusableWrapper = styled.span`
  cursor: default;

  &:focus-visible {
    outline: 1px solid var(--link-color-primary);
    border-radius: var(--border-radius-md);
  }
`;

const InlineItem = styled.span`
  display: inline-block;
  vertical-align: baseline;
  line-height: var(--line-height-base);
  margin: calc(var(--spacing-unit) / 2) var(--spacing-xxs) calc(var(--spacing-unit) / 2) 0;
  &:last-child {
    margin-right: 0;
  }
`;
