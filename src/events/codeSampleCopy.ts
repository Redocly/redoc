import type { CodeSampleCopyProps, CodeSamplesCopiedEvent } from '../types/events.js';

import { createTrackingEvent } from './creator.js';
import { AnalyticsEvent } from './types.js';

const codeSampleCopyEvent = createTrackingEvent<CodeSamplesCopiedEvent>(
  AnalyticsEvent.CodeSampleCopied,
);

export const createCodeSampleCopyEvent = ({
  operation,
  type,
  lang = '',
  label = '',
  activeMimeName,
  activeExampleName,
}: CodeSampleCopyProps): CodeSamplesCopiedEvent => {
  return codeSampleCopyEvent({
    resource: 'Redocly_CodeSample',
    action: 'CodeSampleCopied',
    operationId: operation.id,
    operationPath: operation.path,
    operationHttpVerb: operation.httpVerb,
    operationSummary: operation.name,
    exampleId: activeExampleName,
    exampleMimeType: activeMimeName,
    label,
    lang,
    type,
  });
};
