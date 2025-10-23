import { useCallback, useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { OpenAPIParser } from '../services/OpenAPIParser.js';
import type { SearchItemData } from '../services/search/types.js';

import { initializeSearch } from '../services/search/init.js';
import { disableTelemetryAtom } from '../jotai/app.js';
import { dataTelemetryAtom, statusTelemetryAtom } from '../jotai/telemetry.js';

export function useSearch(flatItems: any[], parser: OpenAPIParser) {
  const disableTelemetry = useAtomValue(disableTelemetryAtom);
  const setTelemetry = useSetAtom(dataTelemetryAtom);
  const setStatusTelemetry = useSetAtom(statusTelemetryAtom);

  const [searchEngine, setSearchEngine] = useState<{
    search: (query: string) => SearchItemData[];
  } | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    setSearchEngine(null);

    initializeSearch(flatItems, parser).then(({ engine, telemetryData }) => {
      setSearchEngine(engine);
      setIsReady(true);

      if (disableTelemetry) {
        return;
      }

      setTelemetry({
        operationsCount: telemetryData.operationsCount,
        requestBodies: telemetryData.requestBodies,
        extensions: telemetryData.extensions,
      });
      setStatusTelemetry('ready');
    });
  }, [disableTelemetry, flatItems, parser, setStatusTelemetry, setTelemetry]);

  const search = useCallback<(query: string) => SearchItemData[]>(
    (query: string) => {
      if (!searchEngine) return [];
      return searchEngine.search(query);
    },
    [searchEngine],
  );

  return {
    search,
    isReady,
  };
}
