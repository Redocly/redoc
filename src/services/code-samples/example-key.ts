type ResolveExample = (id: string) => { key?: string } | undefined;

type ResponseCodeExamples = {
  exampleIds?: string[];
  mediaTypeContent?: Record<string, { exampleIds?: string[] }>;
};

/**
 * Resolves an `exampleKey` from a pluggable tag to a store example id.
 * Spec-level keys (e.g. `beta` under `examples:`) never equal the generated
 * store ids (`example_N`), so the lookup goes through the entry's `key`;
 * direct id equality is kept for callers that already hold a store id.
 * Keys are matched across the whole list before falling back to id equality,
 * so an author key that happens to look like a store id can't be shadowed.
 */
export function findExampleIdByKey(
  exampleIds: string[] | undefined,
  key: string | undefined,
  resolveExample: ResolveExample,
): string | undefined {
  if (!key || !exampleIds?.length) return undefined;
  return (
    exampleIds.find((id) => resolveExample(id)?.key === key) ?? exampleIds.find((id) => id === key)
  );
}

/** Response code entries whose examples (in any media type) contain `key`. */
export function responseCodesContainingKey<T extends ResponseCodeExamples>(
  responseCodes: T[] | undefined,
  key: string | undefined,
  resolveExample: ResolveExample,
): T[] {
  if (!key || !responseCodes?.length) return [];
  return responseCodes.filter((entry) => responseCodeContainsKey(entry, key, resolveExample));
}

/** Media type of a request-body map (mediaType → { exampleIds }) whose examples contain `key`. */
export function mediaTypeContainingKey(
  requestBody: Record<string, { exampleIds?: string[] }> | undefined,
  key: string | undefined,
  resolveExample: ResolveExample,
): string | undefined {
  if (!key || !requestBody) return undefined;
  return Object.keys(requestBody).find((mediaType) =>
    Boolean(findExampleIdByKey(requestBody[mediaType]?.exampleIds, key, resolveExample)),
  );
}

function responseCodeContainsKey(
  entry: ResponseCodeExamples,
  key: string,
  resolveExample: ResolveExample,
): boolean {
  if (findExampleIdByKey(entry.exampleIds, key, resolveExample)) {
    return true;
  }
  return Object.values(entry.mediaTypeContent ?? {}).some(({ exampleIds }) =>
    Boolean(findExampleIdByKey(exampleIds, key, resolveExample)),
  );
}
