import { Fragment, useCallback, useMemo, useRef, useState } from 'react';

import type { ReactElement } from 'react';
import type { SecurityRequirements } from './types.js';

import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';
import { WarningFilledIcon } from '@redocly/theme/icons/WarningFilledIcon/WarningFilledIcon';
import { Tooltip } from '@redocly/theme/components/Tooltip/Tooltip';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { countSchemes, RESOURCES, useTelemetry } from '../../telemetry/index.js';
import { SecurityModal } from './SecurityModal.js';
import { RequiredScopes } from './RequiredScopes.js';
import {
  Conjunction,
  SchemeName,
  ScopeInline,
  SecurityHeader,
  SecurityList,
  SecurityPanel,
  Title,
  ViewDetailsButton,
} from './styled.js';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';

export function SecurityButtonPanel({
  requirements,
}: {
  requirements: SecurityRequirements;
}): ReactElement {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();
  const openedAtRef = useRef<number | null>(null);

  const schemesCount = requirements.reduce((acc, r) => acc + r.schemes.length, 0);
  const isCombined = requirements.some((r) => r.schemes.length > 1);
  const securityDetails = useMemo(() => {
    const { schemeTypes, oauth2Flows } = countSchemes(requirements.flatMap((r) => r.schemes));
    return {
      schemesCount,
      isCombined,
      schemeTypes,
      ...(Object.keys(oauth2Flows).length ? { oauth2Flows } : {}),
      alternativesCount: requirements.length,
    };
  }, [requirements, schemesCount, isCombined]);

  const handleViewDetails = useCallback(() => {
    openedAtRef.current = Date.now();
    telemetry.sendViewSecurityDetailsClickedMessage([
      {
        ...RESOURCES.redocSecurityButton,
        ...securityDetails,
      },
    ]);
    setIsModalVisible(true);
  }, [telemetry, securityDetails]);
  const handleClose = useCallback(() => {
    const timeInModalMs = openedAtRef.current ? Date.now() - openedAtRef.current : 0;
    openedAtRef.current = null;
    telemetry.sendViewSecurityDetailsClosedMessage([
      {
        ...RESOURCES.redocSecurityButtonClose,
        ...securityDetails,
        timeInModalMs,
      },
    ]);
    setIsModalVisible(false);
  }, [telemetry, securityDetails]);

  useBodyScrollLock(isModalVisible);

  const securityHeader = () => (
    <SecurityHeader>
      <SecurityIcon />
      <Title>{translate('security', 'Security')}</Title>
      <ViewDetailsButton onClick={handleViewDetails} variant="link">
        {translate('viewSecurityDetails', 'View security details')}
      </ViewDetailsButton>
    </SecurityHeader>
  );

  return (
    <>
      <SecurityPanel header={securityHeader} isExpandable={false}>
        <SecurityList>
          {requirements.map((requirement, reqIndex) => {
            const isMultiple = requirements.length > 1 && requirement.schemes.length > 1;
            const schemeNodes = requirement.schemes.map((scheme, index) => (
              <Fragment key={scheme.name}>
                <SchemeName $deprecated={scheme.deprecated}>
                  {scheme.name}
                  {scheme.deprecated && (
                    <Tooltip tip="Deprecated">
                      <WarningFilledIcon color="var(--badge-deprecated-bg-color)" />
                    </Tooltip>
                  )}
                </SchemeName>
                {scheme.scopes && scheme.scopes.length > 0 && (
                  <ScopeInline>
                    ({translate('requiredScopes', 'Required scopes')}:{' '}
                    <RequiredScopes scopes={scheme.scopes} />)
                  </ScopeInline>
                )}
                {index < requirement.schemes.length - 1 && <Conjunction> and </Conjunction>}
              </Fragment>
            ));

            return (
              <Fragment key={reqIndex}>
                {isMultiple ? '(' : ''}
                {schemeNodes}
                {isMultiple ? ')' : ''}
                {reqIndex < requirements.length - 1 && <Conjunction> or </Conjunction>}
              </Fragment>
            );
          })}
        </SecurityList>
      </SecurityPanel>
      {isModalVisible && <SecurityModal requirements={requirements} onClose={handleClose} />}
    </>
  );
}
