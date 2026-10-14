import type { ApiDocsMetadata } from '../../../types/options.js';
import type { InfoMetadataRow } from '../../../types/content.js';

const FILTER_OUT_KEYS = ['title', 'description'] as const;

function mapMetadataEntry([key, value]: [string, unknown]): InfoMetadataRow | null {
  if ((FILTER_OUT_KEYS as readonly string[]).includes(key)) {
    return null;
  }

  if (Array.isArray(value)) {
    const flat = value.filter((val) => typeof val !== 'object').join(', ');
    return { key, value: flat };
  }

  if (typeof value === 'object' && value !== null) {
    return null;
  }

  return { key, value: String(value) };
}

export function buildGraphqlConfigMetadataRows(
  metadata: ApiDocsMetadata | undefined,
): InfoMetadataRow[] {
  if (!metadata || typeof metadata !== 'object') {
    return [];
  }

  return Object.entries(metadata)
    .map((entry) => mapMetadataEntry(entry))
    .filter((row): row is InfoMetadataRow => row != null);
}
