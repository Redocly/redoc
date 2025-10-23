import { memo } from 'react';

import type { ReactElement } from 'react';
import type { FieldModel } from '../../models/index.js';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { PropertyDetails } from '../PropertyDetails/index.js';
import { LinkToField } from '../common/LinkToField.js';
import { styled } from '../../styled-components.js';

interface ParametersGroupProps {
  title: string;
  parameters: FieldModel[];
  deepLink: string;
}

function ParametersGroupComponent({
  title,
  parameters,
  deepLink,
}: ParametersGroupProps): ReactElement | null {
  if (!parameters || !parameters.length) {
    return null;
  }

  return (
    <Wrapper>
      <Title>
        <LinkToField to={deepLink} />
        {title}
      </Title>
      {parameters.map((field, index) => (
        <PropertyDetails key={field.name} isFirst={index === 0} field={field} />
      ))}
    </Wrapper>
  );
}

export const ParametersGroup = memo<ParametersGroupProps>(ParametersGroupComponent);

const Title = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 18px;
  line-height: var(--line-height-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-color-primary);
  padding: var(--spacing-xxs) 0;

  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const Wrapper = styled.div`
  margin-top: var(--spacing-md);
`;
