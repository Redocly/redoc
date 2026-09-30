import type { BadgeType } from '../types/schema.js';

export function splitBadgesByPosition(badges: BadgeType[] | undefined): {
  before: BadgeType[];
  after: BadgeType[];
} {
  if (!badges?.length) return { before: [], after: [] };
  return {
    before: badges.filter((b) => b.position === 'before'),
    after: badges.filter((b) => b.position !== 'before'),
  };
}
