import { useAtomValue } from 'jotai';

import type { ExampleValueProps } from './types.js';

import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';

import {
  isFormUrlEncoded,
  isJsonLike,
  langFromMime,
  urlFormEncodePayload,
} from '../../utils/index.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { StyledCodeBlock } from './styled.js';

export function ExampleValue({
  value,
  mimeType,
  encoding,
  onCopyClick,
}: ExampleValueProps): React.ReactNode {
  const { jsonSamplesExpandLevel } = useAtomValue(globalOptionsAtom);

  if (isJsonLike(mimeType)) {
    return (
      <JsonViewer
        data={value}
        expandLevel={jsonSamplesExpandLevel}
        onCopyClick={onCopyClick}
        controls={{
          report: {
            hidden: true,
          },
        }}
      />
    );
  }
  if (typeof value === 'object') {
    if (isFormUrlEncoded(mimeType)) {
      value = urlFormEncodePayload(value, encoding);
    } else {
      // just in case example was cached as json but used as non-json
      value = JSON.stringify(value, null, 2);
    }
  }
  return (
    <StyledCodeBlock
      lang={langFromMime(mimeType)}
      source={value}
      header={{
        className: 'code-block-header',
        controls: {
          copy: {
            onClick: onCopyClick,
          },
          report: {
            hidden: true,
          },
        },
      }}
    />
  );
}
