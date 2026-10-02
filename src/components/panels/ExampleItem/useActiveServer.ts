import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { CodeSamplePanelItem } from '../../../types/content.js';

import { environmentAtom } from '../../../jotai/app.js';
import {
  replaceServerVariables,
  serverMatchesUrl,
} from '../../../services/code-samples/server-variables.js';

type ActiveServer = {
  /** Environment atom value — the first entry holds the active env variables. */
  environment: [Record<string, string>, string];
  /** Variable-substituted URL of the active server. */
  url: string | undefined;
  /** Raw (templated) spec URL — keys `requestValues.serverBody`/`serverEnvVariables`. */
  specUrl: string | undefined;
};

/**
 * The active server for the code-sample panel.
 * `requestValues.serverBody`/`serverEnvVariables` are keyed by the raw
 * (templated) spec server URL, while the environment may hold the
 * variable-substituted URL — keep both forms of the active server.
 */
export function useActiveServer(node: CodeSamplePanelItem): ActiveServer {
  const source = node.source;
  const environment = useAtomValue(environmentAtom);

  return useMemo(() => {
    const envServer = environment[0].server;
    const matched = envServer
      ? node.servers?.find((s) => serverMatchesUrl(s, envServer))
      : undefined;
    if (envServer && matched) {
      return { environment, url: envServer, specUrl: matched.url };
    }
    const fallback = node.servers?.[0];
    if (fallback) {
      return { environment, url: replaceServerVariables(fallback), specUrl: fallback.url };
    }
    return { environment, url: source.servers[0]?.url, specUrl: source.servers[0]?.url };
  }, [environment, node.servers, source.servers]);
}
