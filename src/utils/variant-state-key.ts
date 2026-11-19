export function buildVariantStateKey(
  parentPath: ReadonlyArray<string> | undefined,
  localPart: string,
): string {
  const basePath = parentPath?.length ? parentPath.join('/') : '';
  return basePath ? `${basePath}/${localPart}` : localPart;
}
