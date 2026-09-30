import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { TFunction, TOptions } from '@redocly/theme/core/openapi';
import type { ApiSpecType } from '../types/common.js';

import { useThemeHooks } from '@redocly/theme/core/openapi';

import { specTypeAtom } from '../jotai/store.js';

export type { TFunction, TOptions };

const SPEC_PREFIXES = ['openapi.', 'asyncapi.', 'graphql.'] as const;

function deriveSpecBareKeys(allKeys: readonly string[]): Set<string> {
  const set = new Set<string>();
  for (const key of allKeys) {
    const prefix = SPEC_PREFIXES.find((p) => key.startsWith(p));
    if (prefix) set.add(key.slice(prefix.length));
  }
  return set;
}

export function useTranslate(specType?: ApiSpecType): TFunction {
  const { translate } = useThemeHooks().useTranslate();
  const allKeys = useThemeHooks().useTranslationKeys();
  const specBareKeys = useMemo(() => deriveSpecBareKeys(allKeys), [allKeys]);

  return useCallback<TFunction>(
    (key, options) => {
      if (!key) {
        if (typeof options === 'string') return options;
        return options?.defaultValue ?? '';
      }

      if (specType && specBareKeys.has(key)) {
        return translate(`${specType}.${key}`, options);
      }

      return translate(key, options);
    },
    [translate, specType, specBareKeys],
  );
}

export function useSpecTranslate(): TFunction {
  const specType = useAtomValue(specTypeAtom);
  return useTranslate(specType);
}
