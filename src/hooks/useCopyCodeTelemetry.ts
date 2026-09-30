import { useCallback } from 'react';

import { useTelemetry } from './useTelemetry.js';
import { RESOURCES } from '../telemetry/events.js';
import { languageOf } from '../telemetry/fields.js';

/**
 * Returns a factory: `onCopy(language?)` produces a `copy.onClick` handler for
 * `@redocly/theme` CodeBlock controls that fires `sendCopyCodeSnippetClickedMessage`
 * with the given `snippetType` and optional `language` (reported via `languageOf`).
 * When supplied via `controls.copy.onClick`, this overrides the theme's built-in
 * generic copy event.
 *
 * `specType` is auto-added by `RedocTelemetry.send()`.
 *
 * @example
 * const onCopy = useCopyCodeTelemetry('response');
 * <CodeBlock header={{ controls: { copy: { onClick: onCopy('xml') } } }} />
 */
export function useCopyCodeTelemetry(
  snippetType: 'request' | 'response',
): (language?: string) => () => void {
  const telemetry = useTelemetry();
  return useCallback(
    (language?: string) => () => {
      telemetry.sendCopyCodeSnippetClickedMessage([
        {
          ...RESOURCES.copyCodeSnippetButton,
          snippetType,
          ...(language ? { language: languageOf(language) } : {}),
        },
      ]);
    },
    [telemetry, snippetType],
  );
}
