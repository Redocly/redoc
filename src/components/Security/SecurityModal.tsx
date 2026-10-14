import { Fragment, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { ReactElement } from 'react';
import type { SecurityRequirements } from './types.js';

import { Segmented } from '@redocly/theme/components/Segmented/Segmented';
import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';
import { CloseIcon } from '@redocly/theme/icons/CloseIcon/CloseIcon';

import { SecurityFlowDetail } from './SecurityFlowDetail.js';
import { Divider } from './Divider.js';
import { CloseButton, ModalBackground, ModalTitle, ModalWrapper } from './styled.js';
import { useModalDismiss } from '../../hooks/useModalDismiss.js';
import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { IS_BROWSER } from '../../utils/environments.js';

export function SecurityModal({
  requirements,
  onClose,
}: {
  requirements: SecurityRequirements;
  onClose: () => void;
}): ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const translate = useSpecTranslate();

  useModalDismiss(modalRef, onClose);

  const activeRequirement = requirements[selectedIndex] || requirements[0];

  const modal = (
    <ModalBackground>
      <ModalWrapper ref={modalRef} tabIndex={0}>
        <CloseButton onClick={onClose} variant="ghost" icon={<CloseIcon />} />
        <ModalTitle>
          <SecurityIcon size="24px" />
          {translate('security', 'Security')}
        </ModalTitle>
        {requirements.length > 1 && (
          <Segmented
            value={selectedIndex}
            onChange={({ value }) => setSelectedIndex(value)}
            options={requirementLabels(requirements).map((label, index) => ({
              label,
              value: index,
            }))}
          />
        )}
        {activeRequirement.schemes.map((scheme, index) => (
          <Fragment key={scheme.name}>
            <SecurityFlowDetail scheme={scheme} />
            {index !== activeRequirement.schemes.length - 1 && <Divider label="and" />}
          </Fragment>
        ))}
      </ModalWrapper>
    </ModalBackground>
  );

  if (IS_BROWSER) {
    return createPortal(modal, document.body);
  }

  return modal;
}

/** Tab labels; alternatives that name the same schemes are told apart by their scopes. */
function requirementLabels(requirements: SecurityRequirements): string[] {
  const names = requirements.map((req) => req.schemes.map((s) => s.name).join(' and '));
  return names.map((name, index) => {
    const scopes = requirements[index].schemes.flatMap((s) => s.scopes ?? []);
    const isDuplicate = names.indexOf(name) !== names.lastIndexOf(name);
    return isDuplicate && scopes.length > 0 ? `${name} (${scopes.join(', ')})` : name;
  });
}
