/**
 * Convert simple JSON to plain text.
 * @param {object} json
 * @return string
 */
export function jsonToTextPlain(json: object): string {
  let result: string = '';

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      result += `"${key}": "${json[key]}"\n`;
    }
  }

  return result;
}
