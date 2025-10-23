import { Fragment, useState, useRef } from 'react';

import type { ReactElement } from 'react';
import type { SecurityRequirement } from '../../models/index.js';

import { useOutsideClick, useFocusTrap } from '@redocly/theme/core/openapi';
import { Button } from '@redocly/theme/components/Button/Button';
import { SecurityIcon } from '@redocly/theme/icons/SecurityIcon/SecurityIcon';
import { Segmented } from '@redocly/theme/components/Segmented/Segmented';
import { CloseIcon } from '@redocly/theme/icons/CloseIcon/CloseIcon';
import { Typography } from '@redocly/theme/components/Typography/Typography';

import { SecurityFlow } from './SecurityFlow.js';
import { Divider } from './Divider.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

interface SecurityModalProps {
  securities: SecurityRequirement[];
  onClose: () => void;
}

export function SecurityModal({ securities, onClose }: SecurityModalProps): ReactElement {
  const translate = useTranslate();
  const [selectedSecurityScheme, setSelectedSecurityScheme] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const { schemes } = securities[selectedSecurityScheme] || {};

  useOutsideClick(modalRef, onClose);
  useFocusTrap(modalRef);

  const options = securities.map(({ schemes }, index) => ({
    label: schemes.map(({ id }) => id).join(' and '),
    value: index,
  }));

  return (
    <StyledBackground>
      <Wrapper ref={modalRef} tabIndex={0}>
        <Close onClick={onClose} data-testid="close" variant="ghost" icon={<CloseIcon />} />
        <Title>
          <SecurityIcon size="24px" />
          {translate('openapi.security', 'Security')}
        </Title>
        <Segmented
          value={selectedSecurityScheme}
          onChange={({ value }) => setSelectedSecurityScheme(value)}
          options={options}
        />
        {schemes.map((scheme, index) => (
          <Fragment key={scheme.id}>
            <SecurityFlow {...scheme} securities={securities} />
            {index !== schemes.length - 1 && <Divider label="and" />}
          </Fragment>
        ))}
      </Wrapper>
    </StyledBackground>
  );
}

const Wrapper = styled.div`
  background: var(--bg-color);
  box-shadow: var(--bg-raised-shadow);
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
  overflow-y: scroll;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  .tag-grey span {
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
  }
`;

const StyledBackground = styled.div`
  background: var(--bg-color-modal-overlay);
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: var(--z-index-popover);
  left: 0;
  top: 0;
  pointer-events: auto;
`;

const Close = styled(Button)`
  position: absolute;
  right: var(--spacing-md);
  top: var(--spacing-md);
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
