import { memo } from 'react';

import type { ReactElement } from 'react';

import { Tag } from './Fields/index.js';
import { styled } from '../../styled-components.js';

export interface ConstraintsViewProps {
  constraints: string[];
}

function ConstraintsViewComponent({ constraints }: ConstraintsViewProps): ReactElement | null {
  if (constraints.length === 0) {
    return null;
  }
  return (
    <Wrapper>
      {constraints.map((constraint) => (
        <Tag key={constraint}> {constraint} </Tag>
      ))}
    </Wrapper>
  );
}

export const ConstraintsView = memo<ConstraintsViewProps>(ConstraintsViewComponent);

const Wrapper = styled.div`
  margin-top: var(--spacing-xxs);
`;
