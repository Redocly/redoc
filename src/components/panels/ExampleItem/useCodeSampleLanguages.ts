import { useMemo } from 'react';
import { useAtom } from 'jotai';

import type { CodeSamplePanelItem } from '../../../types/content.js';

import { filterAvailableLanguages } from '../../../services/code-samples/language-availability.js';
import { DEFAULT_LANGUAGES, getLangKey } from '../../../utils/languages.js';
import { languageAtom } from '../../../jotai/app.js';

export const PAYLOAD_LANGUAGE =
  DEFAULT_LANGUAGES.find((l) => l.key === 'payload') ?? DEFAULT_LANGUAGES[0];

const PAYLOAD_LANGUAGE_TAB = {
  key: PAYLOAD_LANGUAGE.key,
  lang: PAYLOAD_LANGUAGE.lang,
  title: PAYLOAD_LANGUAGE.label,
};

export const WEBHOOK_LANGUAGE_SAMPLES = [PAYLOAD_LANGUAGE_TAB];

type LanguageTab = { key: string; lang: string; title: string };

type CodeSampleLanguages = {
  /** Language tabs offered for this panel. */
  languages: LanguageTab[];
  /** `x-codeSamples` limited to the configured languages. */
  filteredDefinitionSamples: CodeSamplePanelItem['definitionSamples'];
  activeLanguage: string;
  setLanguage: (key: string) => void;
};

/** Which language tabs the code-sample panel offers and which one is active. */
export function useCodeSampleLanguages(
  node: CodeSamplePanelItem,
  hasPayloadData: boolean,
): CodeSampleLanguages {
  const [{ activeLanguage: globalLanguage, languages: configuredLanguages }, setLanguage] =
    useAtom(languageAtom);
  const preferredLanguage = node.isWebhook ? 'payload' : globalLanguage || 'curl';
  const definitionSamples = node.definitionSamples;

  const filteredDefinitionSamples = useMemo(() => {
    if (!definitionSamples?.length) return definitionSamples;
    const configuredKeys = new Set((configuredLanguages ?? []).map((l) => l.key));
    return definitionSamples.filter((ds) => configuredKeys.has(getLangKey(ds)));
  }, [definitionSamples, configuredLanguages]);

  const languages = useMemo(() => {
    const langs = (configuredLanguages ?? []).map(({ key, lang, title }) => ({
      key,
      lang,
      title,
    }));

    let filtered = hasPayloadData ? langs : langs.filter((l) => l.key !== 'payload');

    const defSampleKeys = new Set(filteredDefinitionSamples?.map((ds) => getLangKey(ds)) ?? []);
    if (node.isWebhook) {
      filtered = filtered.filter((l) => l.key === 'payload' || defSampleKeys.has(l.key));
    }

    const available = filterAvailableLanguages(filtered, defSampleKeys);
    if (!available.length) {
      return [langs.find((l) => l.key === PAYLOAD_LANGUAGE_TAB.key) ?? PAYLOAD_LANGUAGE_TAB];
    }

    return available;
  }, [hasPayloadData, configuredLanguages, node.isWebhook, filteredDefinitionSamples]);

  // The preferred (global) language may not be offered here — e.g. the
  // community edition offers only payload + x-codeSamples languages.
  const activeLanguage = languages.some((l) => l.key === preferredLanguage)
    ? preferredLanguage
    : (languages[0]?.key ?? preferredLanguage);

  return { languages, filteredDefinitionSamples, activeLanguage, setLanguage };
}
