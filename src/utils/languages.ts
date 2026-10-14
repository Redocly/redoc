import type { Language } from '../types/openapi.js';

/** Every language `codeSamples.languages` accepts. `label` is what users write in config. */
export const DEFAULT_LANGUAGES: Language[] = [
  { key: 'curl', label: 'curl', lang: 'bash' },
  { key: 'javascript', label: 'JavaScript', lang: 'javascript' },
  { key: 'node', label: 'Node.js', lang: 'javascript' },
  { key: 'python', label: 'Python', lang: 'python' },
  { key: 'java', label: 'Java', lang: 'java' },
  { key: 'csharp', label: 'C#', lang: 'csharp' },
  { key: 'php', label: 'PHP', lang: 'php' },
  { key: 'go', label: 'Go', lang: 'go' },
  { key: 'ruby', label: 'Ruby', lang: 'ruby' },
  { key: 'r', label: 'R', lang: 'r' },
  { key: 'payload', label: 'Payload', lang: 'payload' },
];

/** Accepted in config, but not offered unless asked for. */
const EXTRA_LANGUAGES: Language[] = [
  { key: 'csharpnewtonsoft', label: 'C#+Newtonsoft', lang: 'csharp' },
  { key: 'java8', label: 'Java8+Apache', lang: 'java' },
];

const BY_LABEL = new Map(
  [...DEFAULT_LANGUAGES, ...EXTRA_LANGUAGES].map((language) => [
    language.label.toLowerCase(),
    language,
  ]),
);

/** Tab identity — a custom `label` names the tab. */
export function getLangKey({ lang, label }: { lang: string; label?: string }): string {
  const name = (label || lang).toLowerCase();
  return BY_LABEL.get(name)?.key ?? name;
}

/** Language to generate code in — a custom `label` never changes it. */
export function getGeneratorKey({ lang }: { lang: string }): string {
  return BY_LABEL.get(lang.toLowerCase())?.key ?? lang.toLowerCase();
}

const SYNTAX_HIGHLIGHT_MAP: Record<string, string> = {
  curl: 'bash',
  javascript: 'javascript',
  'node.js': 'javascript',
  python: 'python',
  java: 'java',
  'java8+apache': 'java',
  'c#': 'csharp',
  'c#+newtonsoft': 'csharp',
  php: 'php',
  go: 'go',
  ruby: 'ruby',
  r: 'r',
  payload: 'json',
};

/**
 * Grammar for the syntax highlighter, resolved from the configured language name. Keep this the
 * only place a language is turned into a grammar: it is many-to-one (`Node.js` and `JavaScript`
 * both highlight as JavaScript, `Payload` as JSON), so a grammar can never identify a language.
 */
export function getSyntaxHighlightLang(lang: string): string {
  return SYNTAX_HIGHLIGHT_MAP[lang.toLowerCase()] ?? lang.toLowerCase();
}
