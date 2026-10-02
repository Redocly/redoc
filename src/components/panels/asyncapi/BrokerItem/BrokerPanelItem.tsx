import { styled } from 'styled-components';
import { memo, useCallback, useState, type ReactElement } from 'react';

import type { BrokersNode } from '../../../../types/content.js';
import type { BrokerData } from '../../../../types/asyncapi.js';

import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';
import { DatabaseIcon } from '@redocly/theme/icons/DatabaseIcon/DatabaseIcon';
import { KafkaIcon } from '@redocly/theme/icons/KafkaIcon/KafkaIcon';
import { RabbitMQIcon } from '@redocly/theme/icons/RabbitMQIcon/RabbitMQIcon';
import { useModalScrollLock } from '@redocly/theme/core/openapi';
import { Portal } from '@redocly/theme/components/Portal/Portal';
import { Panel } from '@redocly/theme/components/Panel/Panel';

import { MoreDetailsButton } from '../../../common/MoreDetailsButton.js';
import { useSpecTranslate } from '../../../../hooks/useTranslate.js';
import { normalizeProtocol, RESOURCES, useTelemetry } from '../../../../telemetry/index.js';
import { resolveText } from '../../../../utils/resolveText.js';
import { BrokerModal } from './BrokerModal.js';
import { HostList } from './BrokerPanel.styled.js';

function getBrokerIcon(protocol?: string): ReactElement {
  switch (protocol) {
    case 'kafka':
      return <KafkaIcon size="20px" />;
    case 'amqp':
      return <RabbitMQIcon size="20px" />;
    default:
      return <DatabaseIcon size="20px" />;
  }
}

type BrokerRowProps = {
  broker: BrokerData;
  showMoreDetailsButton: boolean;
  onOpenModal: (broker: BrokerData) => void;
};

const BrokerRow = memo(function BrokerRow({
  broker,
  showMoreDetailsButton,
  onOpenModal,
}: BrokerRowProps): ReactElement {
  return (
    <BrokerItem data-component-name="BrokerPanel/BrokerItem">
      <ServerTitle>
        <Icon>{getBrokerIcon(broker.protocol)}</Icon>
        <Label>{broker.name}</Label>
      </ServerTitle>

      {broker.url && (
        <ServerHost>
          <HostList>
            {broker.url.split(' ').map((host, index) => (
              <span key={index}>{host}</span>
            ))}
          </HostList>
          <CopyButton data={broker.url} key={broker.url} />
        </ServerHost>
      )}

      {!showMoreDetailsButton && (
        <ButtonWrapper onClick={() => onOpenModal(broker)}>
          <MoreDetailsButton expanded={false} />
        </ButtonWrapper>
      )}
    </BrokerItem>
  );
});

export function BrokerPanelItem({ node }: { node: BrokersNode }): ReactElement {
  const brokerItem = node.children[0];
  const brokers = brokerItem?.brokers ?? [];
  const translate = useSpecTranslate();
  const telemetry = useTelemetry();
  const panelHeader = resolveText(translate, node.titleTranslationKey, node.title);
  const panelLabel = brokerItem?.panelLabel || panelHeader || 'Brokers';
  const showMoreDetailsButton = !node.title;

  const [selectedBroker, setSelectedBroker] = useState<BrokerData | null>(null);

  useModalScrollLock(selectedBroker !== null);

  const handleOpenModal = useCallback(
    (broker: BrokerData) => {
      telemetry.sendServerModalOpenedMessage([
        {
          ...RESOURCES.serverModalButton,
          protocol: normalizeProtocol(broker.protocol),
          serversCount: brokers.length,
        },
      ]);
      setSelectedBroker(broker);
    },
    [telemetry, brokers.length],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedBroker(null);
  }, []);

  const brokerList = (
    <BrokerList>
      {brokers.map((broker) => (
        <BrokerRow
          key={broker.name}
          broker={broker}
          showMoreDetailsButton={showMoreDetailsButton}
          onOpenModal={handleOpenModal}
        />
      ))}
    </BrokerList>
  );

  const modal = selectedBroker && (
    <Portal mountId="api-content">
      <BrokerModal broker={selectedBroker} onClose={handleCloseModal} panelLabel={panelLabel} />
    </Portal>
  );

  if (showMoreDetailsButton) {
    return (
      <CompactWrapper>
        {brokerList}
        {modal}
      </CompactWrapper>
    );
  }

  return (
    <StyledPanel header={node.title} className="panel-api-docs" isExpandable={false}>
      {brokerList}
      {modal}
    </StyledPanel>
  );
}

const StyledPanel = styled(Panel)`
  [data-component-name='Panel/PanelBody'] {
    padding: 0;
  }
`;

const CompactWrapper = styled.div`
  background-color: var(--layer-color);
  border: var(--panel-border);
  border-radius: var(--panel-border-radius);
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: var(--panel-gap-vertical);
  }
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ServerTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-xxs);
`;

const Label = styled.span`
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
`;

const ServerHost = styled.span`
  padding-left: var(--spacing-lg);
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ButtonWrapper = styled.div`
  padding-left: var(--spacing-lg);
`;

const BrokerItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--panel-body-text-color);
`;

const BrokerList = styled.div`
  > *:not(:last-child) {
    border-bottom: var(--panel-border-local, 1px solid var(--border-color-secondary));
  }
`;
