import { useState, useMemo, memo } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { RequiresScopesDirective } from '../../utils/graphql-scopes.js';

import { Button } from '@redocly/theme/components/Button/Button';
import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';

import { RequiresScopesModal } from './RequiresScopesModal.js';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { RESOURCES, useTelemetry } from '../../telemetry/index.js';

interface RequiresScopesButtonProps {
  directive?: RequiresScopesDirective | null;
  isItem?: boolean;
}

function RequiresScopesButtonComponent({
  directive,
  isItem = false,
}: RequiresScopesButtonProps): ReactElement | null {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();

  useBodyScrollLock(isModalOpen);

  const handleOpenModal = (): void => {
    const scopes = directive?.scopes ?? [];
    telemetry.sendRequiredScopesModalOpenedMessage([
      {
        ...RESOURCES.requiredScopesButton,
        level: isItem ? 'item' : 'field',
        alternativesCount: scopes.length,
        scopesCount: scopes.reduce((total, alternative) => total + alternative.length, 0),
        isCombined: scopes.some((alternative) => alternative.length > 1),
      },
    ]);
    setIsModalOpen(true);
  };

  const requiresScopesDirective = directive ?? null;

  const shouldRender = useMemo(() => {
    if (!requiresScopesDirective) return false;
    return !(
      requiresScopesDirective.scopes.length === 0 &&
      (requiresScopesDirective.parentScopes ?? []).length > 0
    );
  }, [requiresScopesDirective]);

  if (!shouldRender) {
    return null;
  }

  const buttonContent = isItem ? (
    <ItemButtonWrapper>
      <ItemHeader>
        <SecurityIcon />
        <ItemTitle>{translate('requiredScopes', 'Required scopes')}</ItemTitle>
        <ViewDetailsBtn onClick={handleOpenModal} variant="link">
          {translate('viewSecurityDetails', 'View details')}
        </ViewDetailsBtn>
      </ItemHeader>
    </ItemButtonWrapper>
  ) : (
    <CompactButton
      variant="outlined"
      fullWidth={false}
      icon={<SecurityIcon />}
      onClick={handleOpenModal}
    >
      <CompactButtonText>{translate('requiredScopes', 'Required scopes')}</CompactButtonText>
    </CompactButton>
  );

  return (
    <>
      {buttonContent}
      {isModalOpen && requiresScopesDirective && (
        <RequiresScopesModal
          scopes={requiresScopesDirective.scopes}
          parentScopes={requiresScopesDirective.parentScopes}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export const RequiresScopesButton = memo(RequiresScopesButtonComponent);

const ItemButtonWrapper = styled.div`
  background-color: var(--layer-color, var(--bg-color));
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color-secondary, var(--border-color-primary));
  width: 100%;
  margin: var(--spacing-base) 0 var(--spacing-lg);
`;

const ItemHeader = styled.div`
  color: var(--link-color-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xxs, 4px);
`;

const ItemTitle = styled.span`
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  color: var(--text-color-primary);
  margin-left: var(--spacing-xxs, 4px);
  font-size: var(--font-size-base);
`;

const ViewDetailsBtn = styled(Button)`
  margin-left: auto;
  font-size: var(--font-size-sm);
`;

const CompactButton = styled(Button)`
  background-color: var(--layer-color, var(--bg-color));
  color: var(--link-color-primary);
  border-color: var(--border-color-secondary, var(--border-color-primary));
  align-self: flex-start;
  padding: var(--spacing-xxs, 4px) var(--spacing-xs);
  margin-top: var(--spacing-xs);

  &:hover {
    background-color: var(--button-bg-color-secondary, var(--layer-color));
    color: var(--link-color-primary);
    border-color: var(--border-color-secondary, var(--border-color-primary));
  }
`;

const CompactButtonText = styled.span`
  color: var(--text-color-primary);
`;
