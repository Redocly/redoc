import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';

import { DefaultMappingIcon } from '../../../icons/DefaultMappingIcon/DefaultMappingIcon.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

export type DefaultMappingOptionLabelProps = {
  label: string;
};

export function DefaultMappingOptionLabel({ label }: DefaultMappingOptionLabelProps): ReactElement {
  const translate = useSpecTranslate();

  return (
    <Tooltip
      tip={translate(
        'discriminator.defaultMappingTooltip',
        "OpenAPI 3.2: defaultMapping used when other mappings don't match.",
      )}
      placement="bottom"
    >
      <Wrapper>
        <IconWrapper>
          <DefaultMappingIcon />
        </IconWrapper>
        <Label>{translate('discriminator.defaultMapping', label)}</Label>
      </Wrapper>
    </Tooltip>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;
