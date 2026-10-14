type ResolveExample = (id: string) => { key?: string } | undefined;


/**
 * Resolves a spec-level example key to a store example id.
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

