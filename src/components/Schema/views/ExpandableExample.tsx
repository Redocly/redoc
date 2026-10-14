import { useState } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';

import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { ExampleValueTag } from '../styled.js';

const MAX_EXAMPLE_LENGTH = 150;

export function ExpandableExample({ value }: { value: string }): ReactElement {
  const translate = useSpecTranslate();
  const [isExpanded, setIsExpanded] = useState(false);

  const needsTruncation = value.length > MAX_EXAMPLE_LENGTH;
  const shownValue = isExpanded || !needsTruncation ? value : value.slice(0, MAX_EXAMPLE_LENGTH);

  return (
    <>
      <ExampleValueTag>{shownValue}</ExampleValueTag>
      {needsTruncation && (
        <ToggleButton
          variant="link"
          size="small"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded
            ? translate('hideExample', 'Hide example')
            : translate('showExample', 'Show example')}
        </ToggleButton>
      )}
    </>
  );
}

const ToggleButton = styled(Button)`
  margin-left: var(--spacing-xs);
`;
