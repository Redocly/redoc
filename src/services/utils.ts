import merge from 'deepmerge';

import { isObject } from '@redocly/theme/core/openapi';

import { isMergeableObject } from '../utils/index.js';

/**
 * Compare mime-types ignoring charset or other params (application/json;charset=UTF-8)
 * @param a
 * @param b
 */
export function isSameMime(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return normalizeMimeType(a) === normalizeMimeType(b);
}

/**
 * Removes the mime-types params e.g. charset (application/json;charset=UTF-8))
 * Removes any prefixes, e.g. application/hal+json => application/json
 * Spec is type/subtype;param1=value or type/semantic+format;param1=value
 * @param mimeType mime type string or undefined
 */
export function normalizeMimeType(mimeType?: string): string | undefined {
  if (!mimeType) return undefined;
  const mime = mimeType.split(';')[0].toLowerCase(); // get rid of parameters part
  const [type, subtype] = mime.split('/');
  if (subtype === undefined) {
    return type; // some wrong format, return as is
  }
  const subtypeParts = subtype.split('+');
  const syntax = subtypeParts.pop();
  return `${type}/${syntax}`;
}

export function unescapeServerVariables(str: string): string {
  // Brackets are escaped in the curl code samples #88
  // ex.: http://localhost:7700/code-samples-playground?versions#operation/Case-11_1
  const bracketsOpenReg = new RegExp('%7B', 'g'); // {
  const bracketsCloseReg = new RegExp('%7D', 'g'); // }
  return str
    .replace(bracketsOpenReg, '{')
    .replace(bracketsCloseReg, '}')
    .replace('///', '//')
    .replace('./', '.');
}

export function arrayMergeStrategy<T>(target: T[], source: T[]): T[] {
  if (!(target.length && hasObjectOrArray(target))) {
    return source;
  }

  const destination = target.filter((item) => Object.keys(item as object).length > 0);

  source.forEach(function (item, index) {
    if (isMergeableObject(item)) {
      destination[index] = merge(target[index], item, { arrayMerge: arrayMergeStrategy });
    } else if (Array.isArray(item)) {
      destination.push(item);
    } else {
      destination[index] = item;
    }
  });

  return destination;
}

const hasObjectOrArray = (array: Array<unknown>): boolean => {
  return array.some((item) => isObject(item) && Object.keys(item).length > 0);
};

export function isEmptyObject(obj: GenericObject): boolean {
  return !!obj && Object.keys(obj).length === 0;
}

export const cryptoLib =
  (typeof window !== 'undefined' &&
    (window.crypto || ((window as GenericObject).msCrypto as Crypto))) ||
  undefined;

export function deepClone(inObject) {
  if (typeof inObject !== 'object' || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  const outObject = Array.isArray(inObject) ? [] : {};

  for (const key in inObject) {
    const value = inObject[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepClone(value);
  }

  return outObject;
}
