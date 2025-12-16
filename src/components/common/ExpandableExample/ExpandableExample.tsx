import { useMemo, useState } from 'react';

import type { ReactElement } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';

import { Markdown } from '../../Markdown/index.js';
import { ExampleValue } from '../Fields/index.js';
import { useTranslate } from '../../../hooks/index.js';
import { styled } from '../../../styled-components.js';

const MAX_EXAMPLE_LENGTH = 150;

export interface ExpandableExampleProps {
  value: string;
}

export function ExpandableExample({ value }: ExpandableExampleProps): ReactElement {
  const translate = useTranslate();
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedValue = useMemo(() => value.slice(0, MAX_EXAMPLE_LENGTH), [value]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container>
      <Markdown source={isExpanded ? value : truncatedValue} />
      {(value !== truncatedValue || isExpanded) && (
        <ButtonWrap>
          <Button variant="link" size="small" onClick={toggleExpand}>
            {isExpanded
              ? translate('openapi.hideExample', 'Hide example')
              : translate('openapi.showExample', 'Show example')}
          </Button>
        </ButtonWrap>
      )}
    </Container>
  );
}

const Container = styled(ExampleValue)`
  display: inline;

  & * {
    display: inline;
  }
`;

const ButtonWrap = styled.span`
  margin-left: var(--spacing-xs);
`;
