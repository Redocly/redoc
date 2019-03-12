import * as React from 'react';

import { isJsonLike, langFromMime } from '../../utils/openapi';
import { JsonViewer } from '../JsonViewer/JsonViewer';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

export interface ExampleValueProps {
  value: any;
  mimeType: string;
}

export function ExampleValue({ value, mimeType }: ExampleValueProps) {
  if (isJsonLike(mimeType)) {
    return <JsonViewer data={value} />;
  } else {
    return <SourceCodeWithCopy lang={langFromMime(mimeType)} source={value} />;
  }
}
