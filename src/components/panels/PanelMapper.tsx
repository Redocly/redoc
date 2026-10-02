import { memo } from 'react';

import type { ReactElement } from 'react';
import type { PanelNode, PanelItem } from '../../types/content.js';
import type { PanelNodeProps } from './PanelNodeProps.js';

import { panelKind } from '../../types/common.js';
import { DownloadPanelItem } from './DownloadPanelItem.js';
import { OverviewPanelItem } from './OverviewPanelItem.js';
import { ServerPanelItem } from './ServerItem/ServerPanelItem.js';
import { BrokerPanelItem } from './asyncapi/BrokerItem/BrokerPanelItem.js';
import { ChannelBindingPanelItem } from './asyncapi/ChannelBindingItem/ChannelBindingItem.js';
import { OperationBindingPanelItem } from './asyncapi/OperationBindingItem/OperationBindingItem.js';
import { MessageBindingPanelItem } from './asyncapi/MessageBindingItem/MessageBindingItem.js';
import { MessageReferencesPanelItem } from './asyncapi/MessageReferencesItem/MessageReferencesItem.js';
import { GroupPanelItem } from './GroupPanelItem.js';
import { ExamplesPanelItem } from './ExampleItem/ExamplesPanelItem.js';
import { McpPanelItem } from './McpPanelItem.js';
import { McpExamplePanelItem } from './McpExamplePanelItem.js';
import { ReferencesPanelItem } from './ReferencesPanelItem.js';
import { LocationsPanelItem } from './LocationsPanelItem.js';

type DirectPanelKind =
  | typeof panelKind.DOWNLOAD
  | typeof panelKind.SERVERS
  | typeof panelKind.BROKERS
  | typeof panelKind.CHANNEL_BINDING
  | typeof panelKind.OPERATION_BINDING
  | typeof panelKind.MESSAGE_BINDING
  | typeof panelKind.MESSAGE_REFERENCES
  | typeof panelKind.PAYLOAD
  | typeof panelKind.CODE_SAMPLE
  | typeof panelKind.CALLBACK_PAYLOAD
  | typeof panelKind.RESPONSE
  | typeof panelKind.GRAPHQL_QUERY
  | typeof panelKind.GRAPHQL_RESPONSE
  | typeof panelKind.GRAPHQL_VARIABLES
  | typeof panelKind.GRAPHQL_TYPE_SAMPLE
  | typeof panelKind.REFERENCES
  | typeof panelKind.LOCATIONS
  | typeof panelKind.GROUP_ITEMS
  | typeof panelKind.MCP_EXAMPLE;

type PanelNodeByKind<TKind extends DirectPanelKind> = Extract<
  PanelNode,
  { children: [Extract<PanelItem, { kind: TKind }>, ...PanelItem[]] }
>;

type DirectPanelComponentByKind = {
  [K in DirectPanelKind]: (props: { node: PanelNodeByKind<K> }) => ReactElement | null;
};

const OVERVIEW_ITEM_KINDS: PanelItem['kind'][] = [
  panelKind.EXTERNAL_LINK,
  panelKind.EMAIL,
  panelKind.ATTRIBUTE,
];
const MCP_SPECIAL_ITEM_KINDS: PanelItem['kind'][] = [panelKind.TAGS, panelKind.CONNECT_MCP_BUTTON];

const EXAMPLE_ITEM_KINDS: PanelItem['kind'][] = [
  panelKind.PAYLOAD,
  panelKind.CODE_SAMPLE,
  panelKind.CALLBACK_PAYLOAD,
  panelKind.RESPONSE,
  panelKind.GRAPHQL_QUERY,
  panelKind.GRAPHQL_RESPONSE,
  panelKind.GRAPHQL_VARIABLES,
  panelKind.GRAPHQL_TYPE_SAMPLE,
];

const PANEL_COMPONENT_BY_KIND: DirectPanelComponentByKind = {
  [panelKind.DOWNLOAD]: DownloadPanelItem,
  [panelKind.SERVERS]: ServerPanelItem,
  [panelKind.BROKERS]: BrokerPanelItem,
  [panelKind.CHANNEL_BINDING]: ChannelBindingPanelItem,
  [panelKind.OPERATION_BINDING]: OperationBindingPanelItem,
  [panelKind.MESSAGE_BINDING]: MessageBindingPanelItem,
  [panelKind.MESSAGE_REFERENCES]: MessageReferencesPanelItem,
  [panelKind.PAYLOAD]: ExamplesPanelItem,
  [panelKind.CODE_SAMPLE]: ExamplesPanelItem,
  [panelKind.CALLBACK_PAYLOAD]: ExamplesPanelItem,
  [panelKind.RESPONSE]: ExamplesPanelItem,
  [panelKind.GRAPHQL_QUERY]: ExamplesPanelItem,
  [panelKind.GRAPHQL_RESPONSE]: ExamplesPanelItem,
  [panelKind.GRAPHQL_VARIABLES]: ExamplesPanelItem,
  [panelKind.GRAPHQL_TYPE_SAMPLE]: ExamplesPanelItem,
  [panelKind.REFERENCES]: ReferencesPanelItem,
  [panelKind.LOCATIONS]: LocationsPanelItem,
  [panelKind.GROUP_ITEMS]: GroupPanelItem,
  [panelKind.MCP_EXAMPLE]: McpExamplePanelItem,
};

function hasOnlyKind<K extends DirectPanelKind>(
  node: PanelNode,
  kind: K,
): node is PanelNodeByKind<K> {
  return node.children.length > 0 && node.children.every((item) => item.kind === kind);
}

function renderKind<K extends DirectPanelKind>(node: PanelNode, kind: K): ReactElement | null {
  if (!hasOnlyKind(node, kind)) {
    return null;
  }

  const Component = PANEL_COMPONENT_BY_KIND[kind];
  return Component({ node });
}

function resolvePanelComponent(node: PanelNode): ReactElement | null {
  if (!node?.children?.length) {
    return null;
  }

  const itemKinds = node.children.map((entry) => entry.kind);
  const uniqueKinds = new Set(itemKinds);

  if (itemKinds.some((kind) => MCP_SPECIAL_ITEM_KINDS.includes(kind))) {
    return <McpPanelItem node={node} />;
  }

  if (itemKinds.every((kind) => OVERVIEW_ITEM_KINDS.includes(kind))) {
    return <OverviewPanelItem node={node} />;
  }

  if (
    itemKinds.length > 0 &&
    itemKinds.every((kind) =>
      EXAMPLE_ITEM_KINDS.includes(kind as (typeof EXAMPLE_ITEM_KINDS)[number]),
    )
  ) {
    return <ExamplesPanelItem node={node} />;
  }

  if (uniqueKinds.size === 1) {
    const [kind] = uniqueKinds;
    switch (kind) {
      case panelKind.DOWNLOAD:
        return renderKind(node, panelKind.DOWNLOAD);
      case panelKind.SERVERS:
        return renderKind(node, panelKind.SERVERS);
      case panelKind.BROKERS:
        return renderKind(node, panelKind.BROKERS);
      case panelKind.CHANNEL_BINDING:
        return renderKind(node, panelKind.CHANNEL_BINDING);
      case panelKind.OPERATION_BINDING:
        return renderKind(node, panelKind.OPERATION_BINDING);
      case panelKind.MESSAGE_BINDING:
        return renderKind(node, panelKind.MESSAGE_BINDING);
      case panelKind.MESSAGE_REFERENCES:
        return renderKind(node, panelKind.MESSAGE_REFERENCES);
      case panelKind.PAYLOAD:
        return renderKind(node, panelKind.PAYLOAD);
      case panelKind.CODE_SAMPLE:
        return renderKind(node, panelKind.CODE_SAMPLE);
      case panelKind.CALLBACK_PAYLOAD:
        return renderKind(node, panelKind.CALLBACK_PAYLOAD);
      case panelKind.RESPONSE:
        return renderKind(node, panelKind.RESPONSE);
      case panelKind.GRAPHQL_QUERY:
        return renderKind(node, panelKind.GRAPHQL_QUERY);
      case panelKind.GRAPHQL_RESPONSE:
        return renderKind(node, panelKind.GRAPHQL_RESPONSE);
      case panelKind.GRAPHQL_VARIABLES:
        return renderKind(node, panelKind.GRAPHQL_VARIABLES);
      case panelKind.GRAPHQL_TYPE_SAMPLE:
        return renderKind(node, panelKind.GRAPHQL_TYPE_SAMPLE);
      case panelKind.REFERENCES:
        return renderKind(node, panelKind.REFERENCES);
      case panelKind.LOCATIONS:
        return renderKind(node, panelKind.LOCATIONS);
      case panelKind.GROUP_ITEMS:
        return renderKind(node, panelKind.GROUP_ITEMS);
      case panelKind.MCP_EXAMPLE:
        return renderKind(node, panelKind.MCP_EXAMPLE);
      default:
        return null;
    }
  }

  return null;
}

function PanelMapperComponent({ node }: PanelNodeProps): ReactElement | null {
  return resolvePanelComponent(node);
}

export const PanelMapper = memo(PanelMapperComponent);
