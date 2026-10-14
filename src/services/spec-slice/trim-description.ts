import { isRecord } from '../../adapters/helpers.js';

const MAX_DESCRIPTION_LENGTH = 100;

export function trimDescription(description: string): string {
  return description.length > MAX_DESCRIPTION_LENGTH
    ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)} ... trimmed`
    : description;
}

export function trimInfoDescription(draft: Record<string, unknown>): void {
  const { info } = draft;
  if (isRecord(info) && typeof info.description === 'string') {
    draft.info = { ...info, description: trimDescription(info.description) };
  }
}
