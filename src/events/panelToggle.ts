import type { PanelToggleEvent, PanelToggleProps } from '../types/events.js';

import { createTrackingEvent } from './creator.js';
import { AnalyticsEvent } from './types.js';

const panelToggleEvent = createTrackingEvent<PanelToggleEvent>(AnalyticsEvent.PanelToggle);

export const createPanelToggleEvent = ({
  operation,
  isExpanded,
  panelType,
}: PanelToggleProps): PanelToggleEvent => {
  return panelToggleEvent({
    resource: 'Redocly_Operation',
    action: 'PanelToggled',
    operationId: operation.id,
    operationPath: operation.path,
    operationHttpVerb: operation.httpVerb,
    operationSummary: operation.name,
    panelType,
    state: isExpanded ? 'expanded' : 'collapsed',
  });
};
