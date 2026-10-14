import { useCallback } from 'react';

import type { EventPayload } from '@redocly/redoc-opentelemetry';

import { useTelemetry } from '../hooks/useTelemetry.js';
import { RESOURCES } from './events.js';

export type SchemaFieldToggle = Omit<
  EventPayload<'com.redocly.schemaField.expanded'>[0],
  keyof typeof RESOURCES.schemaFieldToggle | 'specType'
>;

export function useSchemaFieldTelemetry(): (toggle: SchemaFieldToggle) => void {
  const telemetry = useTelemetry();
  return useCallback(
    (toggle: SchemaFieldToggle) =>
      telemetry.sendSchemaFieldExpandedMessage([{ ...RESOURCES.schemaFieldToggle, ...toggle }]),
    [telemetry],
  );
}
