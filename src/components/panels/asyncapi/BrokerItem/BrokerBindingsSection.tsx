import { useAtomValue } from 'jotai';
import { useMemo } from 'react';

import type { BrokerData } from '../../../../types/asyncapi.js';

import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';

import { globalOptionsAtom } from '../../../../jotai/store.js';
import { ExternalDocumentation } from '../../../common/ExternalDocumentation.js';
import {
  Block,
  Header,
  Section,
  Label,
  Value,
  ExternalDocumentationWrapper,
} from './BrokerPanel.styled.js';

type BrokerBindingsSectionProps = {
  broker: BrokerData;
  panelLabel: string;
};

type Binding = {
  key: string;
  value: {
    schemaRegistryUrl?: string;
    schemaRegistryVendor?: string;
    bindingVersion?: string;
  };
};

const renderBinding = ({
  binding,
  jsonSamplesDepth,
}: {
  binding: Binding;
  jsonSamplesDepth: number;
}) => {
  const { key, value } = binding;

  switch (key) {
    case 'kafka':
      return (
        <>
          {value.schemaRegistryUrl && (
            <Section>
              <Label data-testid="schema-registry-url-label">Schema Registry URL:</Label>
              <ExternalDocumentationWrapper>
                <ExternalDocumentation externalDocs={{ url: value.schemaRegistryUrl }} compact />
              </ExternalDocumentationWrapper>
            </Section>
          )}
          {value.schemaRegistryUrl && (
            <Section>
              <Label data-testid="schema-registry-vendor-label">Schema Registry Vendor:</Label>
              <Value data-testid="schema-registry-vendor-value">{value.schemaRegistryVendor}</Value>
            </Section>
          )}
          {value.bindingVersion && (
            <Section>
              <Label data-testid="binding-version-label">Binding Version:</Label>
              <Value data-testid="binding-version-value">{value.bindingVersion}</Value>
            </Section>
          )}
        </>
      );
    default:
      return <JsonViewer data={value} expandLevel={jsonSamplesDepth} />;
  }
};

export const BrokerBindingsSection = ({ broker, panelLabel }: BrokerBindingsSectionProps) => {
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);
  const binding = useMemo(
    () =>
      Object.entries(broker.bindings || {}).map(([key, value]) => ({
        key,
        value,
      }))[0],
    [broker.bindings],
  );

  return (
    <Block data-component-name="BrokerBindingsSection/BrokerBindingsSection">
      <Header>{panelLabel} Configuration</Header>
      {renderBinding({ binding, jsonSamplesDepth })}
    </Block>
  );
};
