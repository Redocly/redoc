import { memo, useCallback } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { PayloadSamplesProps } from './types.js';

import { SelectOrLabel } from '../SelectOrLabel/index.js';
import { MediaTypesSwitch } from '../MediaTypeSwitch/index.js';
import { MimeLabel, Select } from '../common/index.js';
import { MediaTypeSamples } from './MediaTypeSamples.js';
import { SelectWrapper, StyledCodeBlock } from './styled.js';
import { activeMimeNameAtom } from '../../jotai/app.js';
import { useActivateExample, useTranslate } from '../../hooks/index.js';

function PayloadSamplesComponent({
  onlyDefaultMimeType,
  content: mimeContent,
  ...props
}: PayloadSamplesProps): ReactElement {
  const setActivateExampleName = useActivateExample(mimeContent);
  const defaultMimeType = useAtomValue(activeMimeNameAtom); // we pass defaultMimeType from portal
  const showDefaultMimeType = onlyDefaultMimeType && defaultMimeType;
  const translate = useTranslate();
  const renderSelect = useCallback(
    (props) => {
      return showDefaultMimeType ? null : (
        <SelectWrapper>
          <SelectOrLabel Label={MimeLabel} Select={Select} variant="dark" fullWidth {...props} />
        </SelectWrapper>
      );
    },
    [showDefaultMimeType],
  );

  const handleMediaTypeChange = (key: string) => setActivateExampleName(key);

  if (!mimeContent) {
    return (
      <StyledCodeBlock
        lang="text"
        source={translate('openapi.noRequestPayload', 'No request payload')}
        header={{ controls: false }}
      />
    );
  }

  return (
    <MediaTypesSwitch content={mimeContent} renderSelect={renderSelect}>
      {(mediaType) => (
        <MediaTypeSamples
          key="samples"
          mediaType={mediaType}
          {...props}
          onChange={handleMediaTypeChange}
        />
      )}
    </MediaTypesSwitch>
  );
}

export const PayloadSamples = memo<PayloadSamplesProps>(PayloadSamplesComponent);
