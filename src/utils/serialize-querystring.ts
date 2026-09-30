type HarParam = { name: string; value: string };

export function objectToHarParams(obj: unknown, parentKey = ''): HarParam[] {
  const res: HarParam[] = [];
  if (!obj || typeof obj !== 'object') return res;
  const entries = Array.isArray(obj)
    ? obj.map((v, i) => [String(i), v] as const)
    : Object.entries(obj as Record<string, unknown>);

  for (const [key, value] of entries) {
    const currentKey = parentKey ? `${parentKey}[${key}]` : key;

    if (typeof value === 'object' && value !== null) {
      res.push(...objectToHarParams(value, currentKey));
    } else {
      const name = Array.isArray(obj) && parentKey ? parentKey : currentKey;
      res.push({ name, value: String(value) });
    }
  }

  return res;
}
