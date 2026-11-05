import { styled } from 'styled-components';
import { useState } from 'react';

import type { BrokerData } from '../../../../types/asyncapi.js';

import { Segmented } from '@redocly/theme/components/Segmented/Segmented';
import { DatabaseIcon } from '@redocly/theme/icons/DatabaseIcon/DatabaseIcon';
import { KafkaIcon } from '@redocly/theme/icons/KafkaIcon/KafkaIcon';
import { RabbitMQIcon } from '@redocly/theme/icons/RabbitMQIcon/RabbitMQIcon';

import { Modal } from '../../../common/Modal.js';
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

  const options = [...SEGMENT_OPTIONS];

  if (broker.bindings) {
    options.push({ label: 'Configuration', value: 2 });
  }

  return (
    <Modal
      data-component-name="BrokerModal/BrokerModal"
      icon={<BrokerIcon protocol={broker.protocol || ''} />}
      title={
        <>
          {broker.protocol}: {broker.name}
        </>
      }
      onClose={onClose}
      tabs={
        <Segmented
          value={selectedBlock}
          onChange={({ value }) => setSelectedBlock(value)}
          options={options}
        />
      }
    >
      <SegmentWrapper>
        {selectedBlock === 0 && <BrokerOverviewSection broker={broker} />}
        {selectedBlock === 2 && <BrokerBindingsSection broker={broker} panelLabel={panelLabel} />}
      </SegmentWrapper>
    </Modal>
  );
};

const SegmentWrapper = styled.div`
  width: 100%;
`;
