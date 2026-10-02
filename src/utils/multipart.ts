export type ParsedMultipartPart = {
  name: string;
  value?: string;
  fileName?: string;
  contentType?: string;
};

const DISPOSITION_RE =
  /Content-Disposition:\s*form-data;\s*name="([^"]+)"(?:;\s*filename="([^"]+)")?/i;
const CONTENT_TYPE_RE = /Content-Type:\s*([^\r\n]+)/i;
const BODY_START_RE = /\r?\n\r?\n/;
const REGEX_ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;

function partBody(raw: string): string {
  const bodyStart = BODY_START_RE.exec(raw);
  return bodyStart ? raw.slice(bodyStart.index + bodyStart[0].length).trim() : '';
}

export function parseMultipartFormData(text: string): ParsedMultipartPart[] | undefined {
  if (typeof text !== 'string' || text.length === 0) return undefined;

  const boundaryMatch = text.replace(/^\s+/, '').match(/^--([^\r\n]+)/);
  if (!boundaryMatch) return undefined;

  const boundary = boundaryMatch[1].replace(REGEX_ESCAPE_RE, '\\$&');
  const rawParts = text
    .split(new RegExp(`--${boundary}(?:--)?`, 'g'))
    .filter((part) => part.trim().length > 0);

  const parts: ParsedMultipartPart[] = [];
  for (const raw of rawParts) {
    const dispositionMatch = raw.match(DISPOSITION_RE);
    if (!dispositionMatch) continue;

    const [, name, fileName] = dispositionMatch;
    const contentType = raw.match(CONTENT_TYPE_RE)?.[1].trim();

    if (fileName) {
      parts.push({ name, fileName, ...(contentType ? { contentType } : {}) });
      continue;
    }

    parts.push({ name, value: partBody(raw) });
  }

  return parts.length > 0 ? parts : undefined;
}
