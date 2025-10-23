import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ResponseHeadersProps } from './types.js';

import { HeadersCaption, StyledHeadersProperties } from './styled.js';
import { PropertyDetails } from '../PropertyDetails/index.js';
import { LinkToField } from '../common/LinkToField.js';
import { useTranslate } from '../../hooks/index.js';

function ResponseHeadersComponent({
  headers,
  deepLink,
}: ResponseHeadersProps): ReactElement | null {
  const translate = useTranslate();
  if (headers === undefined || headers.length === 0) {
    return null;
  }
  return (
    <StyledHeadersProperties>
      <HeadersCaption>
        {deepLink && <LinkToField to={deepLink} />}
        {translate('openapi.header', 'Headers')}
      </HeadersCaption>
      {headers.map((field, index) => (
        <PropertyDetails
          key={field.name}
          isFirst={index === 0}
          field={field}
          disableDeepLinks={!deepLink}
        />
      ))}
    </StyledHeadersProperties>
  );
}

export const ResponseHeaders = memo<ResponseHeadersProps>(ResponseHeadersComponent);
