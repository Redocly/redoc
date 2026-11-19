/** Stands in for `useThemeHooks`: translates a key to `english[key]`, else to the fallback text. */
export function themeHooksMock(english: Record<string, string> = {}): {
  useThemeHooks: () => {
    useTranslate: () => { translate: (key: string, fallback: string) => string };
    useTranslationKeys: () => string[];
  };
} {
  return {
    useThemeHooks: () => ({
      useTranslate: () => ({ translate: (key, fallback) => english[key] ?? fallback }),
      useTranslationKeys: () => [],
    }),
  };
}
