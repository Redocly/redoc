import type { SeoData } from '../../types/common.js';

/** Drops keys whose value is undefined so the item defaults never blank a site-wide fallback. */
export function resolveItemSeo(_node: object | null | undefined, fallback: SeoData): SeoData {
  const result: SeoData = {};
  for (const key of Object.keys(fallback) as (keyof SeoData)[]) {
    const value = fallback[key];
    if (value !== undefined) result[key] = value;
  }
  return result;
}
