import { memo } from 'react';

import type { ReactElement } from 'react';
import type { MediaContentModel } from '../../models/index.js';

import { BodyContent } from '../common/BodyContent/index.js';

interface BodyContentProps {
  content: MediaContentModel;
  description?: string | GenericObject;
  required?: boolean;
  deepLink?: string;
}

function BodyComponent({
  content,
  description,
  required,
  deepLink,
}: BodyContentProps): ReactElement {
  return (
    <BodyContent
      content={content}
      required={required}
      description={description}
      skipReadOnly={content.isRequestType}
      skipWriteOnly={!content.isRequestType}
      deepLink={deepLink}
    />
  );
}

export const Body = memo<BodyContentProps>(BodyComponent);
