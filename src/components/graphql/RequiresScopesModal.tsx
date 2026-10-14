import { useRef, memo, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';
import { CloseIcon } from '@redocly/theme/icons/CloseIcon/CloseIcon';
import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';

import { useModalDismiss } from '../../hooks/useModalDismiss.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { IS_BROWSER } from '../../utils/environments.js';

interface RequiresScopesModalProps {
  scopes: string[][];
  onClose: () => void;
  parentScopes?: string[][];
}

function ScopeGroup({ scopeGroup }: { scopeGroup: string[] }): ReactElement {
  return (
    <ScopeWrapper>
      {scopeGroup.map((scope, index) => (
        <Fragment key={scope}>
          <ScopeTag>{scope}</ScopeTag>
          {index < scopeGroup.length - 1 && <SeparatorText>and</SeparatorText>}
        </Fragment>
      ))}
    </ScopeWrapper>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <DividerWrapper>
      <DividerLabel>{label}</DividerLabel>
      <hr />
    </DividerWrapper>
  );
}

function RequiresScopesModalComponent({
  scopes,
  onClose,
  parentScopes,
}: RequiresScopesModalProps): ReactElement {
  const modalRef = useRef<HTMLDivElement>(null);
  const translate = useSpecTranslate();

  useModalDismiss(modalRef, onClose);

  const hasParentScopes = Boolean(parentScopes?.length);

  const modal = (
    <ModalBackground>
      <ModalWrapper ref={modalRef} tabIndex={0}>
        <CloseButton onClick={onClose} data-testid="close" variant="ghost" icon={<CloseIcon />} />
        <ModalTitle>
          <SecurityIcon size="24px" />
          {translate('requiredScopes', 'Required scopes')}
        </ModalTitle>

        {hasParentScopes && (
          <ItemWrapper>
            <ScopesHeader>{translate('objectScopes', 'Object scopes')}</ScopesHeader>
            {parentScopes?.map((scopeGroup) => (
              <ScopeGroup key={scopeGroup.join(',')} scopeGroup={scopeGroup} />
            ))}
          </ItemWrapper>
        )}

        {hasParentScopes && <Divider label="and" />}

        <ItemWrapper>
          {hasParentScopes && (
            <ScopesHeader>{translate('fieldScopes', 'Field scopes')}</ScopesHeader>
          )}
          {scopes.map((scopeGroup, index) => (
            <Fragment key={scopeGroup.join(',')}>
              <ScopeGroup scopeGroup={scopeGroup} />
              {index < scopes.length - 1 && <Divider label="or" />}
            </Fragment>
          ))}
        </ItemWrapper>
      </ModalWrapper>
    </ModalBackground>
  );

  if (IS_BROWSER) {
    return createPortal(modal, document.body);
  }

  return modal;
}

export const RequiresScopesModal = memo(RequiresScopesModalComponent);

const ModalBackground = styled.div`
  background: var(--bg-color-modal-overlay, rgba(0, 0, 0, 0.4));
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: var(--z-index-popover, 200);
  left: 0;
  top: 0;
  pointer-events: auto;
`;

const ModalWrapper = styled.div`
  background: var(--bg-color);
  box-shadow: var(--bg-raised-shadow, 0 8px 32px rgba(0, 0, 0, 0.15));
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  width: 720px;
  max-width: 100%;
  height: auto;
  max-height: 600px;
  overflow-y: auto;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: var(--spacing-md);
  top: var(--spacing-md);
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--h4-font-size, 20px);
  font-weight: var(--h4-font-weight, var(--font-weight-bold));
  margin-bottom: var(--spacing-md);
  svg {
    margin-right: var(--spacing-xs);
  }
`;

const ItemWrapper = styled.div`
  background: var(--layer-color, var(--bg-color));
  padding: var(--spacing-base);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color-secondary, var(--border-color-primary));
  width: 100%;
`;

const ScopesHeader = styled.p`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin: 0 0 var(--spacing-sm) 0;
`;

const ScopeWrapper = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  flex-wrap: wrap;
`;

const ScopeTag = styled.span`
  display: inline-block;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-family: var(--font-family-monospaced);
  padding: 0 var(--spacing-xxs, 4px);
  border-radius: var(--tag-border-radius);
  background: var(--tag-bg-color, var(--border-color-secondary));
  color: var(--text-color-secondary);
`;

const SeparatorText = styled.p`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  margin: 0;
`;

const DividerWrapper = styled.div`
  font-size: var(--font-size-sm);
  width: 100%;
  display: flex;
  align-items: center;
  margin: var(--spacing-xs) 0;
  text-transform: none;

  hr {
    height: 1px;
    border: none;
    background: var(--border-color-primary);
    width: 100%;
    margin-left: var(--spacing-xs);
  }
`;

const DividerLabel = styled.span`
  background-color: var(--bg-color);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  white-space: nowrap;
`;
