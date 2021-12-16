import * as React from 'react';

import { StyledPre } from '../../common-elements/samples';
import { ExampleModel } from '../../services/models';
import { ExampleValue } from './ExampleValue';
import { useExternalExample } from './exernalExampleHook';

export interface ExampleProps {
  example: ExampleModel;
  mimeType: string;
  editable?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export function Example({ example, mimeType, editable = false, value, onChange }: ExampleProps) {
  if (example.value === undefined && example.externalValueUrl) {
    return (
      <ExternalExample
        example={example}
        mimeType={mimeType}
        editable={editable}
        value={value}
        onChange={onChange}
      />
    );
  } else {
    return (
      <ExampleValue
        value={value || example.value}
        mimeType={mimeType}
        editable={editable}
        onChange={onChange}
      />
    );
  }
}

export function ExternalExample({ example, mimeType, editable, value, onChange }: ExampleProps) {
  const value_ = useExternalExample(example, mimeType);

  if (value_ === undefined) {
    return <span>Loading...</span>;
  }

  if (value_ instanceof Error) {
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

  return (
    <ExampleValue
      value={value || value_}
      mimeType={mimeType}
      editable={editable}
      onChange={onChange}
    />
  );
}
