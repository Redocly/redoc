import { useEffect, useId, useRef } from 'react';
import { css, styled } from 'styled-components';

import type { ReactElement, ReactNode } from 'react';

import { Button } from '@redocly/theme/components/Button/Button';
import { Typography } from '@redocly/theme/components/Typography/Typography';
import { CloseIcon } from '@redocly/theme/icons/CloseIcon/CloseIcon';
import { useFocusTrap } from '@redocly/theme/core/openapi';

import { useModalDismiss } from '../../hooks/useModalDismiss.js';

type ModalProps = {
  icon: ReactNode;
  title: ReactNode;
  onClose: () => void;
  tabs?: ReactNode;
  children: ReactNode;
  'data-component-name'?: string;
};

export function Modal({
  icon,
  title,
  onClose,
  tabs,
  children,
  'data-component-name': componentName,
}: ModalProps): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);
  const titleId = useId();

  useModalDismiss(dialogRef, onClose);

  // Declared before useFocusTrap, so it records the opener before focus moves into the dialog;
  // kept in a ref, because StrictMode re-runs the effect after focus is already inside.
  useEffect(() => {
    openerRef.current ??= document.activeElement;
    return () => {
      const opener = openerRef.current;
      if (opener instanceof HTMLElement && document.activeElement === document.body) {
        opener.focus();
      }
    };
  }, []);

  useFocusTrap(dialogRef);

  return (
    <Overlay data-component-name={componentName}>
      <Dialog ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <CloseButton
          onClick={onClose}
          data-testid="close"
          aria-label="Close"
          variant="ghost"
          icon={<CloseIcon />}
        />
        <Header>
          <Title id={titleId}>
            {icon}
            {title}
          </Title>
          {tabs && <Tabs>{tabs}</Tabs>}
        </Header>
        <Body tabIndex={0} $afterTabs={Boolean(tabs)}>
          {children}
        </Body>
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-index-popover, 200);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: min(100px, 15vh) 0 var(--spacing-lg);
  background: var(--bg-color-modal-overlay, rgba(0, 0, 0, 0.4));
  pointer-events: auto;
`;

const Dialog = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 720px;
  max-width: 100%;
  max-height: min(600px, 100%);
  overflow: hidden;
  background: var(--bg-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--bg-raised-shadow, 0 8px 32px rgba(0, 0, 0, 0.15));
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: var(--spacing-md);
  top: var(--spacing-md);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
  padding-right: calc(var(--spacing-md) + 32px + var(--spacing-xs));
`;

const Title = styled(Typography)`
  display: flex;
  align-items: center;
  font-size: var(--h4-font-size);
  font-weight: var(--h4-font-weight);
  margin-bottom: var(--spacing-lg);

  svg {
    margin-right: var(--spacing-xs);
  }
`;

const Tabs = styled.div`
  padding-bottom: var(--spacing-base);
`;

const Body = styled.div<{ $afterTabs: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 0;
  overflow-y: auto;
  padding: 0 var(--spacing-lg) var(--spacing-lg);

  ${({ $afterTabs }) =>
    $afterTabs &&
    css`
      /* The gap under the tabs stays put while the body scrolls, so the content does not add its own. */
      & > :first-child {
        margin-top: 0;
      }
    `}

  .tag-grey span {
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
  }
`;
