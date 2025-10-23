import { useCallback } from 'react';

export function useTranslate(): (key: string, value?: string) => string {
  const translate = useCallback((translationKey, value) => value || translationKey, []);
  return translate;
}
