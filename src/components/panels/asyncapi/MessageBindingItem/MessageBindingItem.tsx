import { useAtomValue } from 'jotai';
import { memo, useContext, useMemo, type ReactElement } from 'react';

import type { MessageBindingNode } from '../../../../types/content.js';
import type { DeepLinkSectionValue } from '../../../../hooks/useDeepLinkSection.js';

import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';

import { globalOptionsAtom } from '../../../../jotai/store.js';
import { itemStoreFieldAtom } from '../../../../jotai/itemStore.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { SchemaView } from '../../../Schema/SchemaView.js';
import {
  BindingPanel,
  BindingTag,
  JsonViewerWrapper,
  Label,
  Row,
  SchemaWrapper,
  ValueCell,
  omitBindingVersion,
  JsonBindingPanel,
} from '../common/bindingPanel.js';

type KafkaMessageBinding = {
  key?: unknown;
  schemaIdLocation?: string;
  schemaIdPayloadEncoding?: string;
  schemaLookupStrategy?: string;
  bindingVersion?: string;
};

type KafkaBindingContentProps = {
  keySchemaId?: string;
  bindingValue: KafkaMessageBinding;
  messageKey?: string;
};

const KafkaBindingContent = memo(function KafkaBindingContent({
  keySchemaId,
  bindingValue,
  messageKey,
}: KafkaBindingContentProps): ReactElement {
  const sectionData = useMemo<DeepLinkSectionValue | null>(
    () => (messageKey ? { asyncSection: 'messages', messageKey, t: 'bindings' } : null),
    [messageKey],
  );

  return (
    <>
      {keySchemaId && (
        <SchemaWrapper>
          <DeepLinkSectionContext.Provider value={sectionData}>
            <SchemaView schemaId={keySchemaId} expandByDefault level={1} />
          </DeepLinkSectionContext.Provider>
        </SchemaWrapper>
      )}
      {bindingValue.schemaIdLocation && (
        <Row>
          <Label>Schema ID Location</Label>
          <ValueCell>
            <BindingTag borderless>{bindingValue.schemaIdLocation}</BindingTag>
          </ValueCell>
        </Row>
      )}
      {bindingValue.schemaIdPayloadEncoding && (
        <Row>
          <Label>Schema ID payload encoding</Label>
          <ValueCell>
            <BindingTag borderless>{bindingValue.schemaIdPayloadEncoding}</BindingTag>
          </ValueCell>
        </Row>
      )}
      {bindingValue.schemaLookupStrategy && (
        <Row>
          <Label>Schema lookup strategy</Label>
          <ValueCell>
            <BindingTag borderless>{bindingValue.schemaLookupStrategy}</BindingTag>
          </ValueCell>
        </Row>
      )}
    </>
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

export function MessageBindingPanelItem({
  node,
}: {
  node: MessageBindingNode;
}): ReactElement | null {
  const bindingItem = node.children[0];
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);
  const itemId = useContext(ItemIdContext) ?? '';
  const activeMessageKey = useAtomValue(
    useMemo(() => itemStoreFieldAtom({ itemId, key: 'activeMessageKey' }), [itemId]),
  );

  if (!bindingItem) {
    return <BindingPanel header={node.title} className="panel-api-docs" isExpandable={false} />;
  }

  const { bindingsByMessageKey } = bindingItem;
  const messageKeys = Object.keys(bindingsByMessageKey);
  const resolvedKey =
    activeMessageKey && bindingsByMessageKey[activeMessageKey] ? activeMessageKey : messageKeys[0];
  const activeBinding = resolvedKey ? bindingsByMessageKey[resolvedKey] : undefined;

  if (!activeBinding) {
    return null;
  }

  const { bindingKey, bindingValue, keySchemaId } = activeBinding;

  if (bindingKey === 'kafka') {
    return (
      <BindingPanel header={node.title} className="panel-api-docs" isExpandable={false}>
        <KafkaBindingContent
          keySchemaId={keySchemaId}
          bindingValue={bindingValue as KafkaMessageBinding}
          messageKey={resolvedKey}
        />
      </BindingPanel>
    );
  }

  return (
    <JsonBindingPanel header={node.title} className="panel-api-docs" isExpandable={false}>
      <JsonBindingContent bindingValue={bindingValue} jsonSamplesDepth={jsonSamplesDepth} />
    </JsonBindingPanel>
  );
}
