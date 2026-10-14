import type { CodeSamplesLanguageSwitchedEvent, LanguageSwitchProps } from '../types/events.js';

import { createTrackingEvent } from './creator.js';
import { AnalyticsEvent } from './types.js';

const languageSwitchEvent = createTrackingEvent<CodeSamplesLanguageSwitchedEvent>(
  AnalyticsEvent.CodeSampleLanguageSwitched,
);

export const createLanguageSwitchEvent = ({
  operation,
  sample,
}: LanguageSwitchProps): CodeSamplesLanguageSwitchedEvent => {
  const lang = typeof sample.lang === 'string' ? sample.lang : '';
  const label = typeof sample.label === 'string' ? sample.label : '';

  return languageSwitchEvent({
    resource: 'Redocly_CodeSample',
    action: 'LanguageSwitched',
    operationId: operation.id,
    operationPath: operation.path,
    operationHttpVerb: operation.httpVerb,
    operationSummary: operation.name,
    label: label || lang,
    lang,
    // exampleId?: string; // TODO add example switch event
  });
};
