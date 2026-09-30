import type { ReactElement } from 'react';
import type { SecurityNode } from '../../types/content.js';
import type { ContentNodeProps } from '../Mapper.js';

import { SecurityButtonPanel } from './SecurityButtonPanel.js';

export function SecuritySection({ node }: ContentNodeProps): ReactElement {
  const { requirements } = node as SecurityNode;

  if (!requirements || requirements.length === 0) {
    return <></>;
  }

  return <SecurityButtonPanel requirements={requirements} />;
}
