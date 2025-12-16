import type { RedocConfig } from '@redocly/config';

import { querySelector } from '../../utils/dom.js';
import { isNumeric } from '../../utils/helpers.js';

export function normalizeShowExtensions(value: RedocConfig['showExtensions']): string[] | boolean {
  if (typeof value === 'undefined') {
    return false;
  }
  if (value === '') {
    return true;
  }

  if (typeof value !== 'string') {
    return value;
  }

  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return value
        .split(',')
        .map((ext) => ext.trim())
        .filter(Boolean);
  }
}

export function normalizeScrollYOffset(value: RedocConfig['scrollYOffset']): () => number {
  // just number is not valid selector and leads to crash so checking if isNumeric here
  if (typeof value === 'string' && !isNumeric(value)) {
    const el = querySelector(value);
    if (!el) {
      console.warn(
        'scrollYOffset value is a selector to non-existing element. Using offset 0 by default',
      );
    }
    const bottom = (el && el.getBoundingClientRect().bottom) || 0;
    return () => bottom;
  } else if (typeof value === 'number' || isNumeric(value)) {
    return () => (typeof value === 'number' ? value : parseFloat(value));
  } else if (typeof value === 'function') {
    return () => {
      const res = value();
      if (typeof res !== 'number') {
        console.warn(
          `scrollYOffset should return number but returned value "${res}" of type ${typeof res}`,
        );
      }
      return res;
    };
  } else if (value !== undefined) {
    console.warn(
      'Wrong value for scrollYOffset ReDoc option: should be string, number or function',
    );
  }

  return () => 0;
}
