import * as React from 'react';

import { StyledPre } from '../../common-elements/samples';
import { ExampleModel } from '../../services/models';
import { ExampleValue } from './ExampleValue';
import { useExternalExample } from './exernalExampleHook';

export interface ExampleProps {
  example: ExampleModel;
  mimeType: string;
}

export function Example({ example, mimeType }: ExampleProps) {
  if (example.value === undefined && example.externalValueUrl) {
    return <ExternalExample example={example} mimeType={mimeType} />;
  } else {
    return <ExampleValue value={example.value} mimeType={mimeType} />;
  }
}

export function ExternalExample({ example, mimeType }: ExampleProps) {
  const value = useExternalExample(example, mimeType);

  if (value === undefined) {
    return <span>Loading...</span>;
  }

  if (value instanceof Error) {
    return (
      <StyledPre>
        Error loading external example: <br />
        <a
          className={'token string'}
          href={example.externalValueUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {example.externalValueUrl}
        </a>
      </StyledPre>
    );
  }

  return <ExampleValue value={value} mimeType={mimeType} />;
}
