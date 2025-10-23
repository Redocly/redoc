import { useState } from 'react';

import type { ReactElement } from 'react';
import type { SecurityRequirement } from '../../models/index.js';

import { Portal } from '@redocly/theme/components/Portal/Portal';
import { useModalScrollLock } from '@redocly/theme/core/openapi';

import { SecurityButton } from './SecurityButton.js';
import { SecurityModal } from './SecurityModal.js';

interface SecurityProps {
  securities: SecurityRequirement[];
}

export function Security({ securities }: SecurityProps): ReactElement | null {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useModalScrollLock(isModalVisible);

  if (!securities.length) {
    return null;
  }

  return (
    <>
      <SecurityButton securities={securities} onClick={() => setIsModalVisible(true)} />
      {isModalVisible && (
        <Portal mountId="api-content">
          <SecurityModal securities={securities} onClose={() => setIsModalVisible(false)} />
        </Portal>
      )}
    </>
  );
}
