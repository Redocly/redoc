/** Community edition: only the payload tab and languages with spec-provided `x-codeSamples` are offered. */
export function filterAvailableLanguages<L extends { key: string }>(
  languages: L[],
  definitionSampleKeys: Set<string>,
): L[] {
  return languages.filter((l) => l.key === 'payload' || definitionSampleKeys.has(l.key));
}
