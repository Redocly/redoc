import { memo, useCallback } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Dropdown as DropdownTheme } from '@redocly/theme/components/Dropdown/Dropdown';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';
import { Button } from '@redocly/theme/components/Button/Button';
import { CheckmarkIcon } from '@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon';

import { DeepLinkAnchor, deepLinkHoverReveal } from '../../common/DeepLinkAnchor.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

export type BodyMimeTypeFieldProps = {
  mediaTypes: string[];
  value: string | undefined;
  onChange: (mime: string) => void;
  deepLink?: string | null;
  headingId?: string;
  required?: boolean;
};

function BodyMimeTypeFieldComponent({
  mediaTypes,
  value,
  onChange,
  deepLink,
  headingId,
  required,
}: BodyMimeTypeFieldProps): ReactElement | null {
  const translate = useSpecTranslate();
  const handleSelect = useCallback((mt: string) => onChange(mt), [onChange]);

  if (!mediaTypes.length) {
    return null;
  }

  const current = value && mediaTypes.includes(value) ? value : mediaTypes[0];
  const hasMultiple = mediaTypes.length > 1;
  const bodyLabel = translate('body', 'Body');

  return (
    <Title id={headingId}>
      {deepLink ? <DeepLinkAnchor to={deepLink} label={`link to ${bodyLabel}`} /> : null}
      {bodyLabel}
      {hasMultiple ? (
        <DropdownTheme
          portalled
          trigger={
            <Button variant="ghost" size="large" type="button">
              <Label data-testid="dropdown-item-media-type">{current}</Label>
            </Button>
          }
          withArrow
        >
          <DropdownMenu>
            {mediaTypes.map((mt) => (
              <StyledDropdownMenuItem
                key={mt}
                active={mt === current}
                onAction={() => handleSelect(mt)}
                suffix={mt === current && <StyledCheckmarkIcon />}
              >
                <Label>{mt}</Label>
              </StyledDropdownMenuItem>
            ))}
          </DropdownMenu>
        </DropdownTheme>
      ) : (
        <SingleMediaType>{mediaTypes[0]}</SingleMediaType>
      )}
      {required ? <RequiredLabel>{translate('required', 'required')}</RequiredLabel> : null}
    </Title>
  );
}

export const BodyMimeTypeField = memo(BodyMimeTypeFieldComponent);

const Title = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-weight: var(--font-weight-semibold);
  color: var(--text-color-primary);
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-md);
  line-height: var(--line-height-lg);
  padding: 0 0 var(--spacing-xxs);

  & > * + * {
    margin-left: var(--spacing-xxs);
  }

  & button:not(:has(*)) {
    font-family: var(--font-family-monospaced);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-lg);
  }

  ${deepLinkHoverReveal}

  & [data-component-name='Dropdown/Dropdown'] svg {
    visibility: visible;
  }
`;

const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledCheckmarkIcon = styled(CheckmarkIcon)`
  width: 16px;
  height: 16px;
  margin-left: auto;
  flex-shrink: 0;
`;

const StyledDropdownMenuItem = styled(DropdownMenuItem)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xxs) var(--spacing-sm);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

const RequiredLabel = styled.span`
  color: var(--schema-property-required-label-text-color, #e20c0c);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-regular);
`;

const SingleMediaType = styled.span`
  margin-right: var(--spacing-unit);
  cursor: default;
  background: none;
  border: none;
  padding: 0;
  color: var(--text-color-primary);
  font-size: var(--font-size-lg);
  line-height: var(--line-height-lg);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
`;
