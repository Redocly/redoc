export function isWithinExpansionLevel(
  level: number,
  schemasExpansionLevel: number | undefined,
  fallbackLevel: number,
): boolean {
  return level < (schemasExpansionLevel ?? fallbackLevel);
}

export const REQUIRED_EXPAND_LEVEL = 4;

export function isRequiredAutoExpanded(
  level: number,
  required: boolean | undefined,
  schemasExpansionLevel: number | undefined,
): boolean {
  if (schemasExpansionLevel !== undefined) {
    return false;
  }
  return Boolean(required) && level <= REQUIRED_EXPAND_LEVEL;
}
