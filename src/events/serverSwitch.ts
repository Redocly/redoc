import type { TargetServerSwitchedEvent, TargetServerSwitchProps } from '../types/events.js';

import { createTrackingEvent } from './creator.js';
import { AnalyticsEvent } from './types.js';

const targetServerSwitchEvent = createTrackingEvent<TargetServerSwitchedEvent>(
  AnalyticsEvent.TargetServerSwitched,
);

export const createTargetServerSwitchEvent = ({
  operation,
  serverUrl,
}: TargetServerSwitchProps): TargetServerSwitchedEvent =>
  targetServerSwitchEvent({
    resource: 'Redocly_CodeSample',
    action: 'TargetServerSwitched',
    operationId: operation.id,
    operationPath: operation.path,
    operationHttpVerb: operation.httpVerb,
    operationSummary: operation.name,
    serverUrl,
  });
