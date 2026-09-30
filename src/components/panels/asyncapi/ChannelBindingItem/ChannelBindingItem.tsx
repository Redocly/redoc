import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';
import { memo, useState, type ReactElement } from 'react';

import type { ChannelBindingNode } from '../../../../types/content.js';

import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';

import { globalOptionsAtom } from '../../../../jotai/store.js';
import { useSchemaFieldTelemetry } from '../../../../telemetry/index.js';
import { MoreDetailsButton } from '../../../common/MoreDetailsButton.js';
import {
  BindingPanel,
  BindingTag,
  JsonViewerWrapper,
  Label,
  Row,
  ValueCell,
  omitBindingVersion,
  JsonBindingPanel,
} from '../common/bindingPanel.js';

type KafkaChannelBinding = {
  topic?: string;
  partitions?: number;
  replicas?: number;
  bindingVersion?: string;
  topicConfiguration?: Record<string, unknown>;
};

type KafkaOperationBinding = {
  groupId?: { type: string; enum?: string[] };
  clientId?: { type: string; enum?: string[] };
  bindingVersion?: string;
};

type TopicConfigurationContentProps = {
  topicConfiguration: Record<string, unknown>;
};

const TOPIC_CONFIG_LABELS: Record<string, string> = {
  'cleanup.policy': 'Cleanup policy',
  'retention.ms': 'Retention, ms',
  'retention.bytes': 'Retention, bytes',
  'delete.retention.ms': 'Delete retention, ms',
  'max.message.bytes': 'Max message bytes',
  'confluent.key.schema.validation': 'Confluent key schema validation',
  'confluent.key.subject.name.strategy': 'Confluent key subject name strategy',
  'confluent.value.schema.validation': 'Confluent value schema validation',
  'confluent.value.subject.name.strategy': 'Confluent value subject name strategy',
};

const TopicConfigurationContent = memo(function TopicConfigurationContent({
  topicConfiguration,
}: TopicConfigurationContentProps): ReactElement {
  return (
    <TopicConfigurationWrapper>
      {Object.entries(topicConfiguration).map(([key, value]) => (
        <TopicConfigurationRow key={key}>
          <span>{TOPIC_CONFIG_LABELS[key] ?? key}</span>
          <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
        </TopicConfigurationRow>
      ))}
    </TopicConfigurationWrapper>
  );
});

type JsonBindingContentProps = {
  bindingValue: Record<string, unknown>;
  jsonSamplesDepth: number;
};

const JsonBindingContent = memo(function JsonBindingContent({
  bindingValue,
  jsonSamplesDepth,
}: JsonBindingContentProps): ReactElement {
  return (
    <JsonViewerWrapper>
      <JsonViewer data={omitBindingVersion(bindingValue)} expandLevel={jsonSamplesDepth} />
    </JsonViewerWrapper>
  );
});

export function ChannelBindingPanelItem({ node }: { node: ChannelBindingNode }): ReactElement {
  const bindingItem = node.children[0];
  const [expanded, setExpanded] = useState(false);
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);
  const reportToggle = useSchemaFieldTelemetry();

  if (!bindingItem) {
    return <BindingPanel header={node.title} className="panel-api-docs" isExpandable={false} />;
  }

  const { bindingKey, bindingValue } = bindingItem;

  if (bindingKey === 'kafka') {
    const kafka = bindingValue as KafkaChannelBinding & KafkaOperationBinding;
    const { topicConfiguration } = kafka;
    const hasTopicConfig = topicConfiguration && Object.keys(topicConfiguration).length > 0;
    const hasChannelFields =
      kafka.topic || kafka.partitions != null || kafka.replicas != null || hasTopicConfig;
    const hasOperationFields = kafka.groupId || kafka.clientId;
    const toggleTopicConfiguration = (): void => {
      const next = !expanded;
      reportToggle({
        depth: 0,
        expanded: next,
        childCount: Object.keys(topicConfiguration ?? {}).length,
        kind: 'binding',
      });
      setExpanded(next);
    };

    return (
      <BindingPanel header={node.title} className="panel-api-docs" isExpandable={false}>
        {kafka.topic && (
          <Row>
            <Label>Topic</Label>
            <ValueCell>
              <BindingTag borderless>{kafka.topic}</BindingTag>
            </ValueCell>
          </Row>
        )}
        {kafka.partitions != null && (
          <Row>
            <Label>Partitions</Label>
            <ValueCell>
              <BindingTag borderless color="blue">
                {kafka.partitions}
              </BindingTag>
            </ValueCell>
          </Row>
        )}
        {kafka.replicas != null && (
          <Row>
            <Label>Replicas</Label>
            <ValueCell>
              <BindingTag borderless color="green">
                {kafka.replicas}
              </BindingTag>
            </ValueCell>
          </Row>
        )}
        {kafka.groupId && (
          <Row>
            <Label>Group ID</Label>
            <ValueCell>
              <BindingTag borderless>
                {kafka.groupId.enum ? kafka.groupId.enum.join(', ') : kafka.groupId.type}
              </BindingTag>
            </ValueCell>
          </Row>
        )}
        {kafka.clientId && (
          <Row>
            <Label>Client ID</Label>
            <ValueCell>
              <BindingTag borderless>
                {kafka.clientId.enum ? kafka.clientId.enum.join(', ') : kafka.clientId.type}
              </BindingTag>
            </ValueCell>
          </Row>
        )}
        {hasTopicConfig && (
          <>
            <ExpandRow onClick={toggleTopicConfiguration}>
              <MoreDetailsButton expanded={expanded} />
            </ExpandRow>
            {expanded && <TopicConfigurationContent topicConfiguration={topicConfiguration} />}
          </>
        )}
        {!hasChannelFields && !hasOperationFields && (
          <JsonBindingContent bindingValue={bindingValue} jsonSamplesDepth={jsonSamplesDepth} />
        )}
      </BindingPanel>
    );
  }

  return (
    <JsonBindingPanel header={node.title} className="panel-api-docs" isExpandable={false}>
      <JsonBindingContent bindingValue={bindingValue} jsonSamplesDepth={jsonSamplesDepth} />
    </JsonBindingPanel>
  );
}

const ExpandRow = styled.div`
  min-height: 40px;
  padding: var(--spacing-xs) var(--spacing-md);
  align-items: center;
  display: flex;
  width: 100%;
  gap: var(--spacing-md);
  background-color: var(--layer-color);
  cursor: pointer;

  &:hover {
    background-color: var(--layer-color-ontonal-hover);
  }
`;

const TopicConfigurationWrapper = styled.div`
  padding-left: var(--spacing-xs);
  background-color: var(--layer-color);

  & div {
    border-bottom: none;
  }
`;

const TopicConfigurationRow = styled.div`
  min-height: 30px;
  padding: var(--spacing-xs) var(--spacing-md);
  align-items: start;
  display: flex;
  width: 100%;
  gap: var(--spacing-md);

  & > * {
    flex: 1;
  }
`;
