import { memo } from 'react';
import merge from 'deepmerge';

import type { ReactElement } from 'react';
import type { MediaTypeSamplesProps } from './types.js';
import type { ExampleModel } from '../../models/index.js';

import { Markdown } from '../Markdown/index.js';
import { Example } from './Example.js';
import { ExampleSwitch, useExampleKey } from '../Samples/index.js';
import { arrayMergeStrategy } from '../../services/utils.js';
import { StyledCodeBlock } from './styled.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

function MediaTypeSamplesComponent({
  mediaType,
  properties,
  onChange,
  onCopyClick,
}: MediaTypeSamplesProps): ReactElement | null {
  const examples = mediaType.examples || mediaType.formExamples || {};
  const mimeType = mediaType.name;
  const examplesKeys = Object.keys(examples);
  const translate = useTranslate();
  const { exampleKey } = useExampleKey(mediaType.operation, examples);
  const example = examplesKeys.length === 1 ? Object.values(examples)[0] : examples[exampleKey];

  if (!examplesKeys.length) {
    return (
      <StyledCodeBlock
        lang="clike"
        source={translate('openapi.noResponseExample', 'No response example')}
        header={{ controls: false }}
      />
    );
  }

  // properties will be passed in developer portal
  const mergedExamples = properties
    ? ({
        ...example,
        value: merge(example.value, properties, {
          arrayMerge: arrayMergeStrategy,
        }),
      } as ExampleModel)
    : example;

  const description = mergedExamples.description;

  return (
    <>
      <ExampleSwitch examples={examples} exampleKey={exampleKey} onChange={onChange} />
      {description && <StyledMarkdown source={description} />}
      <Example
        example={mergedExamples}
        mimeType={mimeType}
        onCopyClick={onCopyClick}
      />
    </>
  );
}

const StyledMarkdown = styled(Markdown)`
  margin: 0 var(--spacing-md) var(--spacing-sm);
`;

export const MediaTypeSamples = memo<MediaTypeSamplesProps>(MediaTypeSamplesComponent);
