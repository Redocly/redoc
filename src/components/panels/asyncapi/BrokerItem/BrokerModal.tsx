import { styled } from 'styled-components';
import { useState, useRef } from 'react';

import type { BrokerData } from '../../../../types/asyncapi.js';

import { Button } from '@redocly/theme/components/Button/Button';
import { Typography } from '@redocly/theme/components/Typography/Typography';
import { Segmented } from '@redocly/theme/components/Segmented/Segmented';
import { CloseIcon } from '@redocly/theme/icons/CloseIcon/CloseIcon';
import { DatabaseIcon } from '@redocly/theme/icons/DatabaseIcon/DatabaseIcon';
import { KafkaIcon } from '@redocly/theme/icons/KafkaIcon/KafkaIcon';
import { RabbitMQIcon } from '@redocly/theme/icons/RabbitMQIcon/RabbitMQIcon';
import { useOutsideClick } from '@redocly/theme/core/hooks';
import { useFocusTrap } from '@redocly/theme/core/openapi';

import { BrokerOverviewSection } from './BrokerOverviewSection.js';
import { BrokerBindingsSection } from './BrokerBindingsSection.js';

type Protocol = 'kafka' | string;

type BrokerModalProps = {
  broker: BrokerData;
  panelLabel: string;
  onClose: () => void;
};

type SegmentOption = {
  label: string;
  value: number;
};

const SEGMENT_OPTIONS: SegmentOption[] = [{ label: 'Overview', value: 0 }];

const BrokerIcon = ({ protocol }: { protocol: Protocol }) => {
  switch (protocol) {
    case 'kafka':
      return <KafkaIcon size="24px" />;
    case 'amqp':
      return <RabbitMQIcon size="24px" />;
    default:
      return <DatabaseIcon size="24px" />;
  }
};

export const BrokerModal = ({ broker, onClose, panelLabel }: BrokerModalProps) => {
  const [selectedBlock, setSelectedBlock] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, onClose);
  useFocusTrap(modalRef);

  const options = [...SEGMENT_OPTIONS];

  if (broker.bindings) {
    options.push({ label: 'Configuration', value: 2 });
  }

  return (
    <StyledBackground data-component-name="BrokerModal/BrokerModal">
      <Wrapper ref={modalRef} tabIndex={0}>
        <Close onClick={onClose} data-testid="close" variant="ghost" icon={<CloseIcon />} />
        <Title>
          <BrokerIcon protocol={broker.protocol || ''} />
          <Protocol>{broker.protocol}</Protocol>: {broker.name}
        </Title>
        <Segmented
          value={selectedBlock}
          onChange={({ value }) => setSelectedBlock(value)}
          options={options}
        />
        <SegmentWrapper>
          {selectedBlock === 0 && <BrokerOverviewSection broker={broker} />}
          {selectedBlock === 2 && <BrokerBindingsSection broker={broker} panelLabel={panelLabel} />}
        </SegmentWrapper>
      </Wrapper>
    </StyledBackground>
  );
};

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

const Protocol = styled.span`
  text-transform: capitalize;
`;

const SegmentWrapper = styled.div`
  padding-top: var(--spacing-base);
  width: 100%;
`;
