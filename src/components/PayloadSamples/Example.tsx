import * as React from 'react';

import { StyledPre } from '../../common-elements/samples';
import { ExampleModel } from '../../services/models';
import { isJsonLike, langFromMime } from '../../utils';
import { JsonViewer } from '../JsonViewer/JsonViewer';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
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
  let value = useExternalExample(example, mimeType);

  if (value === undefined) {
    return <span>Loading...</span>;
  }

  if (value instanceof Error) {
    console.log(value);
    return (
      <StyledPre>
        Error loading external example: <br />
        <a className={'token string'} href={example.externalValueUrl} target="_blank">
          {example.externalValueUrl}
        </a>
      </StyledPre>
    );
  }

  if (isJsonLike(mimeType)) {
    return <JsonViewer data={value} />;
  } else {
    if (typeof value === 'object') {
      // just in case example was cached as json but used as non-json
      value = JSON.stringify(value, null, 2);
    }
    return <SourceCodeWithCopy lang={langFromMime(mimeType)} source={value} />;
  }
}
