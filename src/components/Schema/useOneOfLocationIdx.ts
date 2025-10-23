import { useMemo } from 'react';

import type { SchemaModel } from '../../models/index.js';

import { useLocation } from '../../hooks/useLocation.js';

const OneOfLocationRegex = /(?=oneof=)/g;

export function useOneOfLocationIdx(oneOf: SchemaModel[], level: number) {
  const location = useLocation();

  return useMemo(
    () =>
      oneOf.findIndex((_, index) => {
        const result = location.hash.split(OneOfLocationRegex);

        return result[level]?.includes(`oneof=${index}`);
      }),
    [level, location.hash, oneOf],
  );
}
