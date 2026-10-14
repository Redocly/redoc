export const DEFAULT_SPEC = 'specs/cafe/openapi.yaml';

export type SpecOption = { value: string; label: string };

export const SPEC_OPTIONS: SpecOption[] = [
  { value: DEFAULT_SPEC, label: 'Cafe (OpenAPI 3.2)' },
  { value: 'specs/cafe-asyncapi-amqp.yaml', label: 'Cafe AMQP Events (AsyncAPI 3.0)' },
  { value: 'specs/cafe-asyncapi-kafka.yaml', label: 'Cafe Kafka Events (AsyncAPI 3.0)' },
  { value: 'specs/cafe-asyncapi-mqtt.yaml', label: 'Cafe MQTT Events (AsyncAPI 3.0)' },
  { value: 'specs/cafe-asyncapi-websocket.yaml', label: 'Cafe WebSocket Events (AsyncAPI 3.0)' },
  { value: 'specs/cafe.graphql', label: 'Cafe (GraphQL)' },
  {
    value: 'https://raw.githubusercontent.com/openai/openai-openapi/refs/heads/main/openapi.json',
    label: 'OpenAI (OpenAPI 3.0)',
  },
  {
    value:
      'https://raw.githubusercontent.com/hey-api/hey-api/refs/heads/main/specs/openapi/anthropic.json',
    label: 'Anthropic (OpenAPI 3.0)',
  },
  {
    value: 'https://api.apis.guru/v2/specs/instagram.com/1.0.0/swagger.yaml',
    label: 'Instagram (OpenAPI 2.0)',
  },
  {
    value: 'https://api.apis.guru/v2/specs/googleapis.com/calendar/v3/openapi.yaml',
    label: 'Google Calendar (OpenAPI 3.0)',
  },
];
