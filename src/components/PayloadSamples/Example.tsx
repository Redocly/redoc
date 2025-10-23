import type { ReactElement } from 'react';
import type { ExampleProps } from './types.js';

import { ExampleValue } from './ExampleValue.js';

export function Example({
  example,
  mimeType,
  onCopyClick,
}: ExampleProps): ReactElement {
  return (
    <ExampleValue
      value={example.value}
      mimeType={mimeType}
      encoding={example.encoding}
      onCopyClick={onCopyClick}
    />
  );
}
