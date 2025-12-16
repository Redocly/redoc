import { useState, useRef } from 'react';

import type { ReactElement } from 'react';
import type { SecurityRequirement } from '../../models/index.js';

import { Portal } from '@redocly/theme/components/Portal/Portal';
import { useModalScrollLock } from '@redocly/theme/core/openapi';

import { SecurityButton } from './SecurityButton.js';
import { SecurityModal } from './SecurityModal.js';
import { useTelemetry } from '../../hooks/index.js';

interface SecurityProps {
  securities: SecurityRequirement[];
}

interface SecurityContext {
  securityTypes: string[];
  schemesCount: number;
  isCombined: boolean;
  modalOpenTime: number;
}

export function Security({ securities }: SecurityProps): ReactElement | null {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const telemetry = useTelemetry();
  const securityContextRef = useRef<SecurityContext | null>(null);

  useModalScrollLock(isModalVisible);

  if (!securities.length) {
    return null;
  }

  const handleViewDetailsClick = (): void => {
    const allSchemes = securities.flatMap((security) => security.schemes);
    const securityTypes = [...new Set(allSchemes.map((scheme) => scheme.type))];
    const schemesCount = allSchemes.length;
    const isCombined = securityTypes.length > 1;
    const modalOpenTime = Date.now();

    securityContextRef.current = {
      securityTypes,
      schemesCount,
      isCombined,
      modalOpenTime,
    };

    telemetry.sendViewSecurityDetailsClickedMessage({
      id: 'openapi-docs-security-button',
      object: 'button',
      uri: window.location.href,
      securityTypes,
      schemesCount,
      isCombined,
    });

    setIsModalVisible(true);
  };

  const handleModalClose = (): void => {
    if (securityContextRef.current) {
      const timeInModalMs = Date.now() - securityContextRef.current.modalOpenTime;

      telemetry.sendViewSecurityDetailsClosedMessage({
        id: 'openapi-docs-security-button',
        object: 'button',
        uri: window.location.href,
        securityTypes: securityContextRef.current.securityTypes,
        schemesCount: securityContextRef.current.schemesCount,
        isCombined: securityContextRef.current.isCombined,
        timeInModalMs,
      });

      securityContextRef.current = null;
    }

    setIsModalVisible(false);
  };

  return (
    <>
      <SecurityButton securities={securities} onClick={handleViewDetailsClick} />
      {isModalVisible && (
        <Portal mountId="api-content">
          <SecurityModal securities={securities} onClose={handleModalClose} />
        </Portal>
      )}
    </>
  );
}
