import { useAtomValue } from 'jotai';
import { type ReactElement } from 'react';

import type { OperationBindingNode } from '../../../../types/content.js';

import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';

import { globalOptionsAtom } from '../../../../jotai/store.js';
import { SchemaView } from '../../../Schema/SchemaView.js';
import {
  BindingPanel,
  JsonViewerWrapper,
  SchemaWrapper,
  omitBindingVersion,
  JsonBindingPanel,
} from '../common/bindingPanel.js';

export function OperationBindingPanelItem({
  node,
}: {
  node: OperationBindingNode;
}): ReactElement | null {
  const bindingItem = node.children[0];
  const { jsonSamplesDepth } = useAtomValue(globalOptionsAtom);

  if (!bindingItem) {
    return <BindingPanel header={node.title} className="panel-api-docs" isExpandable={false} />;
  }

  const { bindingKey, bindingValue, groupIdSchemaId, clientIdSchemaId } = bindingItem;

  if (bindingKey === 'kafka' && (groupIdSchemaId || clientIdSchemaId)) {
    return (
      <BindingPanel header={node.title} className="panel-api-docs" isExpandable={false}>
        {groupIdSchemaId && (
          <SchemaWrapper>
            <SchemaView schemaId={groupIdSchemaId} expandByDefault level={1} />
          </SchemaWrapper>
        )}
        {clientIdSchemaId && (
          <SchemaWrapper>
            <SchemaView schemaId={clientIdSchemaId} expandByDefault level={1} />
          </SchemaWrapper>
        )}
      </BindingPanel>
    );
  }

  return (
    <JsonBindingPanel header={node.title} className="panel-api-docs" isExpandable={false}>
      <JsonViewerWrapper>
        <JsonViewer data={omitBindingVersion(bindingValue)} expandLevel={jsonSamplesDepth} />
      </JsonViewerWrapper>
    </JsonBindingPanel>
  );
}
