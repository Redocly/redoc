import type { Node } from '@markdoc/markdoc';
import type { ResolvedNavItem } from '@redocly/config';
import type { JSONSchema7 } from 'json-schema';
import type { Referenced, ObjectValues } from './common.js';
import type { ApiItem, StoreContext } from './store.js';
import type { ApiDocsOptions } from './options.js';

export type AsyncApiDefinition = {
  asyncapi: string;
  id?: string;
  info: AsyncApiInfo;
  servers?: Record<string, AsyncApiServer>;
  defaultContentType?: string;
  channels?: AsyncApiChannels;
  operations?: AsyncApiOperations;
  components?: AsyncApiComponents;
  'x-tagGroups'?: {
    name: string;
    tags: string[];
  }[];
  'x-redocly-catalog-key'?: string;
};

export type AsyncApiDefinitionReferenced = {
  asyncapi: string;
  id?: string;
  info: AsyncApiInfo;
  servers?: Record<string, AsyncApiServer>;
  defaultContentType?: string;
  channels?: AsyncApiChannels;
  operations?: AsyncApiOperationsReferenced;
  components?: AsyncApiComponentsReferenced;
  'x-tagGroups'?: {
    name: string;
    tags: string[];
  }[];
};

export type AsyncApiInfo = {
  title: string;
  version: string;
  description?: string | Node[] | Node;
  termsOfService?: string;
  contact?: AsyncApiContact;
  license?: AsyncApiLicense;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
};

export type AsyncApiContact = {
  name?: string;
  url?: string;
  email?: string;
};

export type AsyncApiLicense = {
  name: string;
  url?: string;
};

export type AsyncApiTag = {
  name: string;
  description?: string | Node[] | Node;
  externalDocs?: AsyncApiExternalDocs;
};

export type AsyncApiExternalDocs = {
  description?: string | Node[] | Node;
  url: string;
};

export type AsyncApiServer = {
  host: string;
  /** AsyncAPI 2.x servers carry `url` instead of `host`. */
  url?: string;
  protocol: string;
  protocolVersion?: string;
  pathname?: string;
  description?: string | Node[] | Node;
  title?: string;
  summary?: string;
  variables?: AsyncApiServerVariables;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiServerBinding;
};

export type AsyncApiServerVariables = {
  [name: string]: AsyncApiServerVariable;
};

export type AsyncApiChannels = {
  [name: string]: AsyncApiChannel;
};

export type AsyncApiServerVariable = {
  enum?: string[];
  default: string;
  description?: string | Node[] | Node;
  examples?: string[];
};

export type AsyncApiServerBinding = {
  kafka?: AsyncApiServerKafkaBinding;
};

export type AsyncApiServerKafkaBinding = {
  schemaRegistryUrl?: string;
  schemaRegistryVendor?: string;
  bindingVersion?: string;
};

export type AsyncApiChannel = {
  address?: string;
  messages?: AsyncApiMessages;
  title?: string;
  summary?: string;
  description?: string | Node[] | Node;
  servers?: AsyncApiServer[];
  parameters?: AsyncApiParameters;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiChannelBinding;
  'x-badges'?: AsyncApiXBadges[];
};

export type AsyncApiXBadges = {
  name: string;
  position?: 'before' | 'after';
  color?: string;
};

export type AsyncApiChannelBinding = {
  kafka?: AsyncApiChannelKafkaBinding;
  amqp?: AsyncApiChannelAMQPBinding;
};

export type AsyncApiChannelKafkaBinding = {
  topic?: string;
  partitions?: number;
  replicas?: number;
  bindingVersion?: string;
  topicConfiguration?: {
    'cleanup.policy'?: string[];
    'retention.ms'?: number;
    'retention.bytes'?: number;
    'delete.retention.ms'?: number;
    'max.message.bytes'?: number;
    'confluent.key.schema.validation'?: boolean;
    'confluent.key.subject.name.strategy'?: string;
    'confluent.value.schema.validation'?: boolean;
    'confluent.value.subject.name.strategy'?: string;
  };
};

export type AsyncApiChannelAMQPBinding = {
  is: 'routingKey' | 'queue';
};

export type AsyncApiMessages = {
  [name: string]: AsyncApiMessage;
};

export type AsyncApiParameters = {
  [name: string]: AsyncApiParameter;
};

export type AsyncApiParameter = {
  enum?: string[];
  default?: string;
  description?: string | Node[] | Node;
  examples?: string[];
  location?: string;
};

export type AsyncApiMessage = {
  headers?: AsyncAPISchema;
  payload?: AsyncAPISchema;
  correlationId?: AsyncApiCorrelationId;
  contentType?: string;
  name?: string;
  title?: string;
  summary?: string;
  description?: string | Node[] | Node;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiMessageBinding;
  examples?: AsyncApiMessageExample[];
};

export type AsyncApiMessageReferenced = {
  headers?: AsyncAPISchema;
  payload?: Referenced<AsyncAPISchema>;
  correlationId?: AsyncApiCorrelationId;
  contentType?: string;
  name?: string;
  title?: string;
  summary?: string;
  description?: string | Node[] | Node;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiMessageBinding;
  examples?: AsyncApiMessageExample[];
};

export type AsyncApiCorrelationId = {
  description?: string | Node[] | Node;
  location: string;
};

export type AsyncApiMessageBinding = {
  kafka?: AsyncApiMessageKafkaBinding;
};

export type AsyncApiMessageKafkaBinding = {
  key?: JSONSchema7;
  schemaIdLocation?: string;
  schemaIdPayloadEncoding?: string;
  schemaLookupStrategy?: string;
  bindingVersion?: string;
};

export type AsyncApiMessageExample = {
  payload?: Record<string, unknown>;
  name?: string;
  summary?: string;
};

export type MultiFormatSchemaObject = {
  schema: JSONSchema7 | AvroSchema;
  schemaFormat: string;
};

export type AsyncApiOperations = {
  [name: string]: AsyncApiOperation;
};

export type AsyncApiOperationsReferenced = {
  [name: string]: AsyncApiOperationReferenced;
};

export type AsyncApiOperation = {
  action: 'send' | 'receive';
  channel: AsyncApiChannel;
  title?: string;
  summary?: string;
  description?: string | Node[] | Node;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiOperationBinding;
  traits?: AsyncApiOperationTraits[];
  messages?: AsyncApiMessage[];
  reply?: AsyncApiOperationReply;
  'x-badges'?: AsyncApiXBadges[];
};

export type AsyncApiOperationReferenced = {
  action: 'send' | 'receive';
  channel: AsyncApiChannel;
  title?: string;
  summary?: string;
  description?: string | Node[] | Node;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiOperationBinding;
  traits?: AsyncApiOperationTraits[];
  messages?: Referenced<AsyncApiMessage>[];
  reply?: AsyncApiOperationReply;
  'x-badges'?: AsyncApiXBadges[];
};

export type AsyncApiOperationReply = {
  address?: {
    description?: string | Node[] | Node;
    location: string;
  };
  channel?: AsyncApiChannel;
  messages?: AsyncApiMessage[];
};

export type AsyncApiOperationTraits = {
  title?: string;
  summary?: string;
  description?: string | Node[] | Node;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiOperationBinding;
};

export type AsyncApiOperationBinding = {
  kafka?: AsyncApiOperationKafkaBinding;
};

export type AsyncApiOperationKafkaBinding = {
  groupId?: {
    type: string;
    enum: string[];
  };
  clientId?: {
    type: string;
    enum: string[];
  };
  bindingVersion?: string;
};

export type AsyncApiComponents = {
  messages: Record<string, AsyncApiMessage>;
  schemas: Record<string, AsyncAPISchema>;
  tags: Record<string, AsyncApiTag>;
};

export type AsyncApiComponentsReferenced = {
  messages: Record<string, AsyncApiMessageReferenced>;
  schemas: Record<string, AsyncAPISchema>;
  tags: Record<string, AsyncApiTag>;
};

export type AvroSchema = {
  type: string | string[] | AvroSchema[];
  name?: string;
  doc?: string;
  symbols?: string[];
  fields?: Array<{
    name: string;
    type: AvroSchema | string | (string | AvroSchema)[];
    doc?: string;

    default?: unknown;
  }>;
  items?: AvroSchema | string;
  values?: AvroSchema | string;
};

export type ResolvedAsyncApiNavItem = ResolvedNavItem & {
  items?: ResolvedAsyncApiNavItem[];
  action?: string;
  ast?: Node | Node[];
  httpVerb?: string;
};

export type DownloadUrls = {
  url: string;
};

export type ChannelWithKey = AsyncApiChannel & {
  key: string;
};

export type AsyncAPISchema = JSONSchema7 | MultiFormatSchemaObject;

export const CONST_PROTOCOL_VARIANT = {
  DEFAULT: 'default',
  KAFKA: 'kafka',
  AMQP: 'amqp',
  WSS: 'wss',
} as const;

export type ProtocolVariant = ObjectValues<typeof CONST_PROTOCOL_VARIANT>;

export type AsyncApiBuildContext = {
  document: AsyncApiDefinition;
  options: ApiDocsOptions;
  basePath: string;
  storeCtx: StoreContext;
  protocol: ProtocolVariant | null;
  channelToOperations: Record<string, string[]>;
  groups: Record<string, ApiItem[]>;
  items: ApiItem[];
  descriptionItems: ApiItem[];
  channelSummaries: Map<string, string>;
  processContent: boolean;
};

export type BrokerData = {
  /** Server host (3.x `host`, 2.x `url`); absent only for invalid documents. */
  url?: string;
  description?: string | Node[] | Node;
  name?: string;

  variables?: Record<
    string,
    { enum?: string[]; default: string; description?: string | Node[] | Node; examples?: string[] }
  >;
  protocol?: string;
  protocolVersion?: string;
  pathname?: string;
  title?: string;
  summary?: string;
  tags?: AsyncApiTag[];
  externalDocs?: AsyncApiExternalDocs;
  bindings?: AsyncApiServerBinding;
};

export type AsyncApiContext = {
  protocol: string | null;
};
