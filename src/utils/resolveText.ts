import type { TFunction } from '../hooks/useTranslate.js';

export function resolveText(
  translate: TFunction,
  translationKey: string | undefined,
  text: string | undefined,
): string {
  if (translationKey) {
    return translate(translationKey, text ?? translationKey);
  }
  return text ?? '';
}
