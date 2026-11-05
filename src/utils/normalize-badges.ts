import type { BadgeData } from '../types/common.js';

import { reportError } from '../telemetry/reportError.js';
import { isRecord } from './is-record.js';

function isBadge(value: unknown): value is BadgeData {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    (value.color === undefined || typeof value.color === 'string') &&
    (value.position === undefined || value.position === 'before' || value.position === 'after')
  );
}

function reportInvalid(value: unknown): void {
  const got =
    value === null ? 'null' : Array.isArray(value) ? 'a list with invalid entries' : typeof value;
  reportError(
    'invalidValue',
    new TypeError(`expected a list of badges, got ${got}`),
    'Ignored "x-badges"',
  );
}

// Returns copies of the usable badges of an `x-badges` value (name, color and position only),
// or undefined when there are none. Anything that is not a list is dropped and reported.
export function normalizeBadges(value: unknown): BadgeData[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value)) {
    reportInvalid(value);
    return undefined;
  }
  const badges = value
    .filter(isBadge)
    .map(({ name, color, position }) => ({ name, color, position }));
  if (badges.length !== value.length) reportInvalid(value);
  return badges.length > 0 ? badges : undefined;
}
