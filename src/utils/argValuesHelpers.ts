export function argValueToBoolean(val?: string | boolean, defaultValue?: boolean): boolean {
  if (val === undefined) {
    return defaultValue || false;
  }
  if (typeof val === 'string') {
    return val !== 'false';
  }
  return val;
}

export function argValueToNumber(value: number | string | undefined, defaultValue = 0): number {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }

  if (typeof value === 'number') {
    return value;
  }

  return defaultValue;
}

export function argValueToInt(value: number | string | undefined, defaultValue = 0): number {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }

  if (typeof value === 'number') {
    return Math.ceil(value);
  }
  return defaultValue;
}

export function argValueToExpandLevel(
  value?: number | string | undefined,
  defaultValue?: number,
): number | undefined {
  if (value === undefined) return defaultValue;
  if (value === 'all') return Infinity;

  return argValueToInt(value, defaultValue);
}
