import { isRecord } from './is-record.js';

type CsvCell = string | number | boolean | bigint | null | undefined;

const NEEDS_QUOTING_RE = /[",\r\n]/;

function isCsvCell(value: unknown): value is CsvCell {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  );
}

function escapeCsvCell(value: CsvCell): string {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return NEEDS_QUOTING_RE.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Serializes a sample payload as CSV (RFC 4180 quoting): a header row built from the
 * property names, then one row per record. Accepts a single flat object or an array of
 * flat objects; rows with missing properties get empty cells.
 *
 * Returns `undefined` when the payload is not tabular (empty, primitives, or nested
 * objects/arrays in a cell), so the caller can fall back to its default rendering
 * instead of showing a lossy table.
 *
 * Rows are separated by LF rather than RFC 4180's CRLF, as this is display text.
 * Cells starting with `=`, `+`, `-` or `@` are not escaped against formula injection: the
 * values come from the API description, and escaping would change values such as `-3`.
 */
export function jsonToCsv(value: unknown): string | undefined {
  const rows = Array.isArray(value) ? value : [value];
  if (rows.length === 0) return undefined;

  const headers: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (!isRecord(row)) return undefined;
    for (const [key, cell] of Object.entries(row)) {
      if (!isCsvCell(cell)) return undefined;
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  if (headers.length === 0) return undefined;

  // With a single column an empty cell would be a blank line, which CSV readers skip.
  const emptyCell = headers.length === 1 ? '""' : '';
  const lines = [headers.map((header) => escapeCsvCell(header) || emptyCell).join(',')];
  for (const row of rows as Record<string, CsvCell>[]) {
    lines.push(
      headers
        .map((header) => escapeCsvCell(Object.hasOwn(row, header) ? row[header] : undefined))
        .map((cell) => cell || emptyCell)
        .join(','),
    );
  }
  return lines.join('\n');
}
