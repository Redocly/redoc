import type { AsyncApiChannelBinding, ProtocolVariant } from '../../../types/asyncapi.js';

type Options = {
  channel: string;
  channels: string;
  servers: string;
  server: string;
  send: string;
  receive: string;
  sendLabel: string;
  receiveLabel: string;
  channelBinding: string;
  payload: string;
};

type Params = {
  protocol: string | null;
  channelBindings?: AsyncApiChannelBinding;
};

const DEFAULT_LABELS: Options = {
  channel: 'Channel',
  channels: 'Channels',
  servers: 'Servers',
  server: 'Server',
  send: 'Send',
  receive: 'Receive',
  sendLabel: 'Send',
  receiveLabel: 'Receive',
  channelBinding: 'Channel binding',
  payload: 'Payload',
};

const KAFKA_LABELS: Options = {
  channel: 'Topic',
  channels: 'Topics',
  servers: 'Brokers',
  server: 'Broker',
  send: 'Pub',
  receive: 'Sub',
  sendLabel: 'Publish',
  receiveLabel: 'Subscribe',
  channelBinding: 'Topic configuration',
  payload: 'Value',
};

const AMQP_LABEL_EXCHANGE: Options = {
  channel: 'Exchange',
  channels: 'Exchanges',
  servers: 'Brokers',
  server: 'Broker',
  send: 'Pub',
  receive: 'Cons',
  sendLabel: 'Publish',
  receiveLabel: 'Consume',
  channelBinding: 'Exchange configuration',
  payload: 'Payload',
};

const AMQP_LABEL_QUEUE: Options = {
  channel: 'Queue',
  channels: 'Queues',
  servers: 'Brokers',
  server: 'Broker',
  send: 'Pub',
  receive: 'Cons',
  sendLabel: 'Publish',
  receiveLabel: 'Consume',
  channelBinding: 'Queue configuration',
  payload: 'Payload',
};

export function componentLabelsByProtocol({ protocol, channelBindings }: Params): Options {
  const isExchange = channelBindings?.amqp?.is === 'routingKey';

  switch (protocol) {
    case 'kafka':
      return KAFKA_LABELS;
    case 'amqp':
      return isExchange ? AMQP_LABEL_EXCHANGE : AMQP_LABEL_QUEUE;
    default:
      return DEFAULT_LABELS;
  }
}

export function itemLabelsByProtocol(
  protocol: ProtocolVariant | null,
  channelBindings?: AsyncApiChannelBinding,
): {
  channel: string;
  send: string;
  receive: string;
} {
  switch (protocol) {
    case 'kafka':
      return {
        channel: 'topic',
        send: 'pub',
        receive: 'sub',
      };
    case 'amqp':
      return {
        channel: channelBindings?.amqp?.is === 'routingKey' ? 'exch' : 'queue',
        send: 'pub',
        receive: 'cons',
      };
    default:
      return {
        channel: 'channel',
        send: 'send',
        receive: 'receive',
      };
  }
}
