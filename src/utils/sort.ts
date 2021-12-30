/**
 * Function that returns a comparator for sorting objects by some specific key alphabetically.
 *
 * @param {String} property key of the object to sort, if starts from `-` - reverse
 */
export function alphabeticallyByProp<T>(property: string): (a: T, b: T) => number {
  let sortOrder = 1;

  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }

  return (a: T, b: T) => {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
}
