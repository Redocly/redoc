import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { OpenAPISchema } from '../../../types/openapi.js';

import { storeAtom } from '../../../jotai/store.js';

export function useSchemaDocument() {
  const store = useAtomValue(storeAtom);

  return useMemo(() => {
    const schemas: Record<string, OpenAPISchema> = {};
    Object.keys(store.schemaStore).forEach((key) => {
      const schemaEntry = store.schemaStore[key];
      const schemaName = key.split('/').pop() ?? key;
      schemas[schemaName] = schemaEntry.data;
    });

    return {
      openapi: '3.0.0',
      components: {
        schemas,
      },
    };
  }, [store.schemaStore]);
}
