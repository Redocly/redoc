import { memo, useMemo } from 'react';

import type { TFunction } from '@redocly/theme/core/openapi';
import type { ReactElement } from 'react';
import type { SchemaModel } from '../../models/index.js';

import { strikethroughText } from '../../utils/index.js';
import { SchemaSelection } from '../common/SchemaSelection/SchemaSelection.js';
import { SelectionTitle } from '../common/index.js';
import { styled } from '../../styled-components.js';

interface DiscriminatorDropdownProps {
  activeOneOfIdx: number;
  parent: SchemaModel;
  onChange?: (idx: number) => void;
  translate: TFunction;
}

function DiscriminatorDropdownComponent({
  activeOneOfIdx,
  parent,
  onChange,
  translate,
}: DiscriminatorDropdownProps): ReactElement | null {
  const options = useMemo(() => {
    return (parent.oneOf || []).map((subSchema, idx) => {
      const label = subSchema.schema.deprecated
        ? `${strikethroughText(subSchema.title)} (${translate(
            'openapi.badges.deprecated',
            'deprecated',
          ).toLowerCase()})`
        : subSchema.title;
      return {
        label,
        value: idx,
      };
    });
  }, [parent.oneOf, translate]);

  if (parent.oneOf === undefined) {
    return null;
  }

  return (
    <Wrapper>
      <SelectionTitle>{translate('openapi.discriminator', 'Discriminator')}</SelectionTitle>
      <SchemaSelection
        options={options}
        pointer={parent.operationPointer}
        onChange={onChange}
        schema={parent}
        defaultOneOfIdx={activeOneOfIdx}
      />
    </Wrapper>
  );
}

export const Discriminator = memo<DiscriminatorDropdownProps>(DiscriminatorDropdownComponent);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
