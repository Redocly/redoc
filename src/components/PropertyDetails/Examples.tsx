import type { FieldModel } from '../../models/index.js';

import { ExampleValue, FieldLabel } from '../common/index.js';
import {
  tryDecodeURIComponent,
  normalizeText,
  serializeParameterValue,
} from '../../utils/index.js';
import { ExampleWrap, ExamplesList, ExampleSummary } from './styled.js';
import { useTranslate } from '../../hooks/index.js';
import { Markdown } from '../Markdown/index.js';

export function Examples({ field }: { field: FieldModel }) {
  const translate = useTranslate();
  if (!field.examples) {
    return null;
  }

  return (
    <>
      <FieldLabel> {translate('openapi.examples', 'Examples')}: </FieldLabel>
      <ExamplesList>
        {Object.entries(field.examples).map(([id, example]) => {
          const description = normalizeText(example.description);

          return (
            <ExampleWrap key={id}>
              <ExampleSummary>{normalizeText(example.summary) || id} </ExampleSummary>
              {description && <Markdown source={description} />}
              <ExampleValue>{getSerializedValue(field, example.value)}</ExampleValue>
            </ExampleWrap>
          );
        })}
      </ExamplesList>
    </>
  );
}

export function getSerializedValue(field: FieldModel, example: any) {
  if (field.in) {
    // decode for better readability in examples: see https://github.com/Redocly/redoc/issues/1138
    return tryDecodeURIComponent(serializeParameterValue(field, example));
  } else {
    return example;
  }
}
