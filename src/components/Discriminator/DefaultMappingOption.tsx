import type { ReactElement } from 'react';

import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';

import { DefaultMappingIcon } from '../../icons/DefaultMappingIcon/DefaultMappingIcon.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

export interface DefaultMappingOptionProps {
  label: string;
}

export function DefaultMappingOption({ label }: DefaultMappingOptionProps): ReactElement {
  const translate = useTranslate();

  return (
    <Tooltip
      tip={translate(
        'openapi.discriminator.defaultMappingTooltip',
        "OpenAPI 3.2: defaultMapping used when other mappings don't match.",
      )}
      placement="bottom"
    >
      <Wrapper>
        <IconWrapper>
          <DefaultMappingIcon />
        </IconWrapper>
        <Label>{label}</Label>
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
