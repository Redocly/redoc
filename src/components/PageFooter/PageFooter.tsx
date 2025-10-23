import { memo } from 'react';

import { OpenApiFooter } from '@redocly/theme/components/OpenApiDocs/hooks/OpenApiFooter';

export function PageFooterComponent() {
  switch (true) {
    case Boolean(OpenApiFooter):
      return <OpenApiFooter />;
    default:
      return null;
  }
}

export const PageFooter = memo(OpenApiFooter);
