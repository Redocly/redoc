import type { ReactElement } from 'react';
import type { ExampleType } from '../../../types/schema.js';

import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import {
  FieldDetail,
  FieldDetailLabel,
  ExamplesList,
  ExampleItem,
  ExampleSummary,
  ExampleDescription,
} from '../styled.js';
import { ExpandableExample } from './ExpandableExample.js';

type ExamplesProps = {
  examples?: Record<string, ExampleType>;
};

export function Examples({ examples }: ExamplesProps): ReactElement | null {
  const translate = useSpecTranslate();
  if (!examples) return null;

  const entries = Object.entries(examples);
  if (entries.length === 0) return null;

  return (
    <>
      <FieldDetail>
        <FieldDetailLabel>{translate('examples', 'Examples')}:</FieldDetailLabel>
      </FieldDetail>
      <ExamplesList>
        {entries.map(([id, example]) => (
          <ExampleItem key={id}>
            <ExampleSummary>{example.summary || id}</ExampleSummary>
            {example.description ? (
              <ExampleDescription>{example.description}</ExampleDescription>
            ) : null}
            {example.value !== undefined ? <ExpandableExample value={example.value} /> : null}
          </ExampleItem>
        ))}
      </ExamplesList>
    </>
  );
}
