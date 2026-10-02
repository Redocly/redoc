import type { AdmonitionProps } from '@redocly/theme/components/Admonition/Admonition';
import type { Node } from '@markdoc/markdoc';
import type { OpenAPIResponse } from './openapi.js';
import type { CodeSampleSource } from '../services/code-samples/index.js';
import type { BadgeData, ServerData, nodeTypes, panelKind } from './common.js';
import type { GroupItem, ApiItemContent, SecuritySchemeEntry } from './store.js';
import type { AsyncAPISchema, BrokerData } from './asyncapi.js';
import type { BadgeType, ExampleType } from './schema.js';

export type { ApiItemContent };

export type ContentNode =
  | ContainerNode
  | OverviewSectionWrapperNode
  | HeaderNode
  | EmptyMessageNode
  | ItemContentNode
  | SecurityNode
  | MarkdocNode
  | AdmonitionNode
  | ExternalDocsNode
  | ChannelAddressNode
  | MessageLinksNode
  | InfoMetadataNode
  | ExtensionsNode;

export type PanelNode =
  | DownloadNode
  | ServersNode
  | BrokersNode
  | ChannelBindingNode
  | OperationBindingNode
  | MessageBindingNode
  | MessageReferencesNode
  | OverviewNode
  | McpNode
  | ExamplesNode
  | McpExampleNode
  | ReferencesNode
  | LocationsPanelNode
  | GroupItemNode;

export type ContainerNode = {
  nodeType: typeof nodeTypes.CONTAINER;
  panels?: PanelNode[];
  children: ContentNode[];
};

export type OverviewSectionWrapperNode = {
  nodeType: typeof nodeTypes.OVERVIEW_SECTION_WRAPPER;
  children: ContentNode[];
  sectionId: string;
};

export type HeaderNode = {
  nodeType: typeof nodeTypes.HEADER;
  level: number;
  label: string;
  labelTranslationKey?: string;
  badges?: BadgeData[];
  deprecated?: boolean;
  isWebhook?: boolean;
  showPageActions?: boolean;
  protocolTag?: { label: string; color?: string };

  deepLinkSuffix?: string;

  graphqlReturnType?: string;
  graphqlArgs?: { name: string }[];
  graphqlDeprecated?: boolean;
  graphqlOperationType?: 'query' | 'mutation' | 'subscription';

};

export type EmptyMessageNode = {
  nodeType: typeof nodeTypes.EMPTY_MESSAGE;
  label: string;
  labelTranslationKey?: string;
};

export type ParameterData = {
  name: string;
  in?: string;
  schemaId: string;
  description?: string | Node | Node[];
  required?: boolean;
  deprecated?: boolean;
  example?: unknown;
  examples?: Record<string, ExampleType>;
  badges?: BadgeType[];
  extensions?: Record<string, unknown>;
};

export type GraphqlFieldData = {
  name: string;
  type: string;
  description?: string | Node[] | Node;
  deprecated?: boolean;
  deprecationReason?: string;
  defaultValue?: unknown;
  args?: Array<{
    name: string;
    type: string;
    description?: string | Node[] | Node;
    deprecationReason?: string;
    defaultValue?: unknown;
  }>;
};

export type GraphqlReturnTypeData = {
  type: string;
  description?: string | Node[] | Node;
  fields?: GraphqlFieldData[];
};

export type ItemContentNode = {
  nodeType: typeof nodeTypes.ITEM;


  variant:
    | 'headers'
    | 'query'
    | 'querystring'
    | 'querystring-body'
    | 'path'
    | 'parameters'
    | 'cookies'
    | 'body'
    | 'properties'
    | 'arguments'
    | 'fields'
    | 'responses'
    | 'callback'
    | 'messages'
    | 'values'
    | 'graphql-fields'
    | 'graphql-args'
    | 'return-type'
    | 'possible-types'
    | 'implements'
    | 'implemented-by'
    | 'requires-scopes';
  label?: string;
  labelTranslationKey?: string;
  schemaId?: string;
  exampleIds?: string[];
  parameters?: ParameterData[];
  graphqlSchema?: GraphqlFieldData[] | GraphqlReturnTypeData;
  required?: boolean;
  /** Webhook/callback body: the server sends it, so readOnly stays and writeOnly is dropped. */
  isEvent?: boolean;
  mediaTypes?: string[];
  mediaTypeSchemas?: Record<string, MediaTypeContent>;
  pointer?: string;
  description?: string | Node | Node[];

  graphqlTypeName?: string;
  graphqlFieldName?: string;
  graphqlOperationType?: 'query' | 'mutation' | 'subscription';

  graphqlInterfaceNames?: string[];
  graphqlTypeNames?: string[];

  responses?: Array<{
    code: string;
    summary?: string | Node[] | Node;
    description?: string | Node[] | Node;
    mediaType?: string;
    mediaTypes?: string[];
    mediaTypeContent?: Record<string, MediaTypeContent>;
    schemaId?: string;
    exampleIds?: string[];
    headers?: OpenAPIResponse['headers'];
    headerSchemaId?: string;
  }>;

  callback?: {
    httpVerb: string;
    pathName: string;
    summary?: string;
    operationId?: string;
    description?: string | Node | Node[];
    deprecated?: boolean;
    callbackName: string;
    callbackId: string;
    externalDocs?: { url: string; description?: string };
    extensions?: Record<string, unknown>;
    contentChildren?: ContentNode[];
  };

  messages?: Array<{
    name: string;
    label: string;
    summary?: string;
    description?: string | Node[] | Node;
    contentType?: string;
    schemaId?: string;
    headerSchemaId?: string;
    exampleIds?: string[];
    payload?: AsyncAPISchema;
    payloadLabel?: string;
    headers?: AsyncAPISchema;
    externalDocs?: { url: string; description?: string | Node[] | Node };
  }>;

  values?: Array<{
    name: string;
    description?: string | Node[] | Node;
    deprecated?: boolean;
    type?: string;
  }>;
};

export type SecuritySchemeDetail = {
  name: string;
  type?: string;
  scheme?: string;
  bearerFormat?: string;
  in?: string;
  paramName?: string;
  scopes?: string[];
  description?: string | Node[] | Node;
  openIdConnectUrl?: string;
  oauth2MetadataUrl?: string;
  flows?: SecuritySchemeEntry['flows'];
  deprecated?: boolean;
};

export type SecurityNode = {
  nodeType: typeof nodeTypes.SECURITY;
  requirements: Array<{
    schemes: SecuritySchemeDetail[];
  }>;
};


export type MarkdocNode = {
  nodeType: typeof nodeTypes.MARKDOC;
  content: string | Node[] | Node;
};

export type AdmonitionNode = {
  nodeType: typeof nodeTypes.ADMONITION;
  admonitionType: NonNullable<AdmonitionProps['type']>;
  name?: string;
  nameTranslationKey?: string;
  content?: string | Node[] | Node;
};

export type ExternalDocsNode = {
  nodeType: typeof nodeTypes.EXTERNAL_DOCS;
  url: string;
  description: string | Node[] | Node;
};

export type ChannelAddressNode = {
  nodeType: typeof nodeTypes.CHANNEL_ADDRESS;
  address: string;
};

export type MessageLinksNode = {
  nodeType: typeof nodeTypes.MESSAGE_LINKS;
  channelLink: string;
  messages: Array<{
    name: string;
    label: string;
  }>;
};

export type InfoMetadataRow = { key: string; value: string };

export type InfoMetadataNode = {
  nodeType: typeof nodeTypes.INFO_METADATA;
  rows: InfoMetadataRow[];
};

export type ExtensionsNode = {
  nodeType: typeof nodeTypes.EXTENSIONS;
  extensions: Record<string, unknown>;
};

type PanelItemsByKind<TKind extends PanelItem['kind']> = Extract<PanelItem, { kind: TKind }>;

type SingleChildPanelBase<TKind extends PanelItem['kind']> = {
  title?: string;
  titleTranslationKey?: string;
  children: [PanelItemsByKind<TKind>];
};

type MultiChildPanelBase<TKind extends PanelItem['kind']> = {
  title?: string;
  titleTranslationKey?: string;
  children: PanelItemsByKind<TKind>[];
};


export type PanelTag = {
  text: string;
  color?: string;
  icon?: string;
};

export type DownloadPanelItem = {
  kind: typeof panelKind.DOWNLOAD;
  label: string;
  labelTranslationKey?: string;
  url: string;
  icon?: string;
};

export type ExternalLinkPanelItem = {
  kind: typeof panelKind.EXTERNAL_LINK;
  title?: string;
  titleTranslationKey?: string;
  label: string;
  labelTranslationKey?: string;
  url: string;
  withCopyButton?: boolean;
  copyContent?: string;
};

export type EmailPanelItem = {
  kind: typeof panelKind.EMAIL;
  title?: string;
  titleTranslationKey?: string;
  email: string;
  label: string;
  labelTranslationKey?: string;
  withCopyButton?: boolean;
  copyContent?: string;
};


export type ServersPanelItem = {
  kind: typeof panelKind.SERVERS;
  servers: ServerData[];
  mode?: string;
};

export type BrokersPanelItem = {
  kind: typeof panelKind.BROKERS;
  panelLabel?: string;
  brokers: BrokerData[];
};

export type ChannelBindingPanelItem = {
  kind: typeof panelKind.CHANNEL_BINDING;
  panelLabel?: string;
  bindingKey: string;
  bindingValue: Record<string, unknown>;
};

export type OperationBindingPanelItem = {
  kind: typeof panelKind.OPERATION_BINDING;
  panelLabel?: string;
  bindingKey: string;
  bindingValue: Record<string, unknown>;
  groupIdSchemaId?: string;
  clientIdSchemaId?: string;
};

export type KeyValuePanelItem = {
  kind: typeof panelKind.ATTRIBUTE;
  title?: string;
  titleTranslationKey?: string;
  label: string;
  labelTranslationKey?: string;
  value: string;
  withCopyButton?: boolean;
  copyContent?: string;
};

export type TagsPanelItem = {
  kind: typeof panelKind.TAGS;
  title?: string;
  titleTranslationKey?: string;
  tags: PanelTag[];
};

export type ConnectMcpButtonPanelItem = {
  kind: typeof panelKind.CONNECT_MCP_BUTTON;
  title?: string;
  titleTranslationKey?: string;
  mcpUrl: string;
  actions: string[];
};

export type BaseExamplePanelItem = {
  schemaId?: string;
  examples: {
    name?: string;
    summary?: string;
    statusCode?: string;
    mediaType?: string;
    value?: unknown;
  }[];
};

export type PayloadExamplesPanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.PAYLOAD;
  panelLabel?: string;
  exampleIds?: string[];
  mediaTypes?: string[];
  mediaTypeSchemas?: Record<string, MediaTypeContent>;
  messagesByKey?: Record<
    string,
    {
      schemaId?: string;
      exampleIds?: string[];
    }
  >;
};

export type MessageBindingData = {
  bindingKey: string;
  bindingValue: Record<string, unknown>;
  keySchemaId?: string;
};

export type MessageBindingPanelItem = {
  kind: typeof panelKind.MESSAGE_BINDING;
  panelLabel?: string;
  bindingsByMessageKey: Record<string, MessageBindingData>;
};

export type MessageChannelReference = {
  key: string;
  label: string;
  link: string;
};

export type MessageReferencesGroups = {
  exchanges: MessageChannelReference[];
  queues: MessageChannelReference[];
};

export type MessageReferencesPanelItem = {
  kind: typeof panelKind.MESSAGE_REFERENCES;
  panelLabel?: string;
  referencesByMessageKey: Record<string, MessageReferencesGroups>;
};


export type DefinitionCodeSample = {
  lang: string;
  label?: string;
  source: string;
};

export type CodeSamplePanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.CODE_SAMPLE;
  source: CodeSampleSource;
  definitionSamples?: DefinitionCodeSample[];
  isWebhook?: boolean;
  servers?: {
    url: string;
    name?: string;
    description?: string;
    variables?: Record<string, { default?: string }>;
    /** Set on entries injected by `mergeInMockServer` (never present in specs). */
    isMockServer?: boolean;
  }[];
  exampleIds?: string[];
  mediaTypes?: string[];
  mediaTypeSchemas?: Record<string, MediaTypeContent>;
};

export type ResponseExamplesPanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.RESPONSE;
  exampleIds?: string[];
  responseCodes?: ResponseCodeEntry[];
  /** Webhook response: the client sends it, so samples drop readOnly like a request. */
  isEvent?: boolean;
  hideHeaderTitle?: boolean;
  exampleKey?: string;
};

export type GraphQLQueryPanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.GRAPHQL_QUERY;
  graphqlOperationData?: GraphQLOperationData;
};

export type GraphQLResponsePanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.GRAPHQL_RESPONSE;
  graphqlOperationData?: GraphQLOperationData;
};

export type GraphQLVariablesPanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.GRAPHQL_VARIABLES;
  graphqlOperationData?: GraphQLOperationData;
};

export type GraphQLTypeSamplePanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.GRAPHQL_TYPE_SAMPLE;
  graphqlOperationData?: GraphQLOperationData;
};

export type CallbackPayloadPanelItem = BaseExamplePanelItem & {
  kind: typeof panelKind.CALLBACK_PAYLOAD;
  callbackName?: string;
  path?: string;
  httpVerb?: string;
  servers?: {
    url: string;
    name?: string;
    description?: string;
    variables?: Record<string, { default?: string }>;
    /** Set on entries injected by `mergeInMockServer` (never present in specs). */
    isMockServer?: boolean;
  }[];
  definitionSamples?: DefinitionCodeSample[];
  mediaTypes?: string[];
  mediaTypeSchemas?: Record<string, MediaTypeContent>;
};

export type ExamplePanelItem =
  | PayloadExamplesPanelItem
  | CodeSamplePanelItem
  | ResponseExamplesPanelItem
  | CallbackPayloadPanelItem
  | GraphQLQueryPanelItem
  | GraphQLResponsePanelItem
  | GraphQLVariablesPanelItem
  | GraphQLTypeSamplePanelItem;

export type ReferencesPanelItem = {
  kind: typeof panelKind.REFERENCES;
  graphqlTypeName?: string;
  references: {
    name: string;
    pointer: string;
    field?: string;
  }[];
};

export type LocationsPanelItem = {
  kind: typeof panelKind.LOCATIONS;
  locations: string[];
};

export type GroupItemsPanelItem = {
  kind: typeof panelKind.GROUP_ITEMS;
  title: string;
  titleTranslationKey?: string;
  items: GroupItem[];
};

export type OverviewPanelItem = ExternalLinkPanelItem | EmailPanelItem | KeyValuePanelItem;

export type McpPanelItem =
  | KeyValuePanelItem
  | TagsPanelItem
  | ExternalLinkPanelItem
  | ConnectMcpButtonPanelItem;

export type McpExamplePanelItem = {
  kind: typeof panelKind.MCP_EXAMPLE;
  headerTitleTranslationKey: string;
  data: unknown;
  language?: string;
};

export type PanelItem =
  | DownloadPanelItem
  | OverviewPanelItem
  | ServersPanelItem
  | BrokersPanelItem
  | ChannelBindingPanelItem
  | OperationBindingPanelItem
  | MessageBindingPanelItem
  | MessageReferencesPanelItem
  | McpPanelItem
  | McpExamplePanelItem
  | ExamplePanelItem
  | ReferencesPanelItem
  | LocationsPanelItem
  | GroupItemsPanelItem;

export type DownloadNode = MultiChildPanelBase<typeof panelKind.DOWNLOAD>;

export type ServersNode = SingleChildPanelBase<typeof panelKind.SERVERS>;

export type BrokersNode = SingleChildPanelBase<typeof panelKind.BROKERS>;

export type ChannelBindingNode = SingleChildPanelBase<typeof panelKind.CHANNEL_BINDING>;

export type OperationBindingNode = SingleChildPanelBase<typeof panelKind.OPERATION_BINDING>;

export type MessageBindingNode = SingleChildPanelBase<typeof panelKind.MESSAGE_BINDING>;

export type MessageReferencesNode = SingleChildPanelBase<typeof panelKind.MESSAGE_REFERENCES>;

export type OverviewNode = MultiChildPanelBase<
  typeof panelKind.EXTERNAL_LINK | typeof panelKind.EMAIL | typeof panelKind.ATTRIBUTE
>;


export type McpNode = MultiChildPanelBase<
  | typeof panelKind.ATTRIBUTE
  | typeof panelKind.TAGS
  | typeof panelKind.EXTERNAL_LINK
  | typeof panelKind.CONNECT_MCP_BUTTON
>;

export type CodeSampleRequestValues = {
  security?: Record<string, unknown>;
  envVariables?: Record<string, string>;
  serverEnvVariables?: Record<string, Record<string, string>>;
};

export type CodeSampleParamEntry = {
  name: string;
  value: string;
  serverValues?: Record<string, string>;
  serializationMime?: string;
};

export type CodeSampleOperationData = {
  method: string;
  path: string;
  serverUrl?: string;
  headers?: CodeSampleParamEntry[];
  queryString?: CodeSampleParamEntry[];
  cookies?: CodeSampleParamEntry[];
  pathParams?: { name: string; value: string }[];
  body?: unknown;
  bodyMediaType?: string;
  requestValues?: CodeSampleRequestValues;
  securityRequirements?: Array<Record<string, string[]>>;
};

export type MediaTypeContent = {
  schemaId?: string;
  exampleIds?: string[];
};

export type ResponseCodeEntry = {
  code: string;
  schemaId?: string;
  exampleIds?: string[];
  mediaTypes?: string[];
  mediaTypeContent?: Record<string, MediaTypeContent>;
};

export type GraphQLOperationData = {
  operationType: 'query' | 'mutation' | 'subscription';
  operationName: string;
  typeName: string;
};

export type ExamplesNode = MultiChildPanelBase<
  | typeof panelKind.PAYLOAD
  | typeof panelKind.CODE_SAMPLE
  | typeof panelKind.RESPONSE
  | typeof panelKind.CALLBACK_PAYLOAD
  | typeof panelKind.GRAPHQL_QUERY
  | typeof panelKind.GRAPHQL_RESPONSE
  | typeof panelKind.GRAPHQL_VARIABLES
  | typeof panelKind.GRAPHQL_TYPE_SAMPLE
>;

export type ReferencesNode = SingleChildPanelBase<typeof panelKind.REFERENCES>;

export type LocationsPanelNode = SingleChildPanelBase<typeof panelKind.LOCATIONS>;

export type GroupItemNode = MultiChildPanelBase<typeof panelKind.GROUP_ITEMS>;

export type McpExampleNode = SingleChildPanelBase<typeof panelKind.MCP_EXAMPLE>;
