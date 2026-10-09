/**
 * A JSON integer that a JavaScript number cannot represent exactly.
 *
 * JavaScript numbers are IEEE-754 doubles, so `JSON.parse` silently rounds any integer
 * with more than 15-16 significant digits: `10765432100123456789` comes back as
 * `10765432100123458000`. Carrying the digits from the source text is the only way to
 * render such a value correctly, which is what this wrapper is for.
 */
export class BigIntValue {
  constructor(public readonly text: string) {}

  /**
   * Picked up by `JSON.stringify` (for instance the sample copy button), so a copied
   * payload keeps every digit instead of a silently rounded number.
   */
  toJSON(): string {
    return this.text;
  }
}

/**
 * A NUL byte cannot appear literally inside a JSON string, so this prefix cannot clash
 * with data that the document author actually wrote.
 */
const SENTINEL = '\u0000bigint:';

/** The same prefix, as it has to be written into the text handed to `JSON.parse`. */
const SENTINEL_ESCAPED = '\\u0000bigint:';

function isDigit(char: string | undefined): boolean {
  return char !== undefined && char >= '0' && char <= '9';
}

/** Reads one complete JSON number token: integer part, optional fraction and exponent. */
function readNumberToken(json: string, start: number): { token: string; next: number } {
  let i = start;
  if (json[i] === '-') {
    i++;
  }
  while (isDigit(json[i])) {
    i++;
  }
  if (json[i] === '.') {
    i++;
    while (isDigit(json[i])) {
      i++;
    }
  }
  if (json[i] === 'e' || json[i] === 'E') {
    i++;
    if (json[i] === '+' || json[i] === '-') {
      i++;
    }
    while (isDigit(json[i])) {
      i++;
    }
  }
  return { token: json.slice(start, i), next: i };
}

/**
 * Rewrites integer literals that a double cannot hold exactly into strings, so the
 * following `JSON.parse` hands them back as {@link BigIntValue}.
 *
 * The text has to be walked by hand because a regular expression would also match the
 * digits of a string value (`"snowflake 10765432100123456789"`), and the digits cannot
 * be recovered once `JSON.parse` has already rounded them away.
 */
function protectUnsafeIntegers(json: string): string {
  let output = '';
  let i = 0;
  let inString = false;

  while (i < json.length) {
    const char = json[i];

    if (inString) {
      if (char === '\\') {
        output += json.slice(i, i + 2);
        i += 2;
        continue;
      }
      if (char === '"') {
        inString = false;
      }
      output += char;
      i++;
      continue;
    }

    if (char === '"') {
      inString = true;
      output += char;
      i++;
      continue;
    }

    if (char === '-' || isDigit(char)) {
      const { token, next } = readNumberToken(json, i);
      const isPlainInteger = token.search(/[.eE]/) === -1;
      output +=
        isPlainInteger && !Number.isSafeInteger(Number(token))
          ? `"${SENTINEL_ESCAPED}${token}"`
          : token;
      i = next;
      continue;
    }

    output += char;
    i++;
  }

  return output;
}

/**
 * Parses JSON text keeping integers beyond the safe range intact, so consumers can
 * render and copy them with every digit preserved.
 */
export function parseJsonPreservingBigInts(json: string): any {
  return JSON.parse(protectUnsafeIntegers(json), (_key, value) =>
    typeof value === 'string' && value.indexOf(SENTINEL) === 0
      ? new BigIntValue(value.slice(SENTINEL.length))
      : value,
  );
}
