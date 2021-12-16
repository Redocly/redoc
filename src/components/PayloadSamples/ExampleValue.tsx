import * as React from 'react';

import { isJsonLike, langFromMime } from '../../utils/openapi';
import { JsonViewer } from '../JsonViewer/JsonViewer';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { OptionsConsumer } from '..';
import { JsonEditorWrapper } from '../';

export interface ExampleValueProps {
  value: any;
  mimeType: string;
  editable?: boolean;
  onChange?: (value: any) => void;
}

export function ExampleValue({ value, mimeType, editable, onChange }: ExampleValueProps) {
  if (isJsonLike(mimeType)) {
    return editable ? (
      <OptionsConsumer>
        {options => (
          <JsonEditorWrapper
            schema={{}}
            text={JSON.stringify(value, null, 2)}
            onChange={onChange}
            theme={options.tryLiveEditorTheme}
          />
        )}
      </OptionsConsumer>
    ) : (
      <JsonViewer data={value} />
    );
  } else {
    if (typeof value === 'object') {
      // just in case example was cached as json but used as non-json
      value = JSON.stringify(value, null, 2);
    }
    return <SourceCodeWithCopy lang={langFromMime(mimeType)} source={value} />;
  }
}
