import { memo, Fragment } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';

import { BodyPortal } from '../common/BodyPortal.js';
import { Modal } from '../common/Modal.js';
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
  const translate = useSpecTranslate();

  const hasParentScopes = Boolean(parentScopes?.length);

  const modal = (
    <Modal
      icon={<SecurityIcon size="24px" />}
      title={translate('requiredScopes', 'Required scopes')}
      onClose={onClose}
    >
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
        {hasParentScopes && <ScopesHeader>{translate('fieldScopes', 'Field scopes')}</ScopesHeader>}
        {scopes.map((scopeGroup, index) => (
          <Fragment key={scopeGroup.join(',')}>
            <ScopeGroup scopeGroup={scopeGroup} />
            {index < scopes.length - 1 && <Divider label="or" />}
          </Fragment>
        ))}
      </ItemWrapper>
    </Modal>
  );

  if (IS_BROWSER) {
    return <BodyPortal>{modal}</BodyPortal>;
  }

  return modal;
}

export const RequiresScopesModal = memo(RequiresScopesModalComponent);

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
