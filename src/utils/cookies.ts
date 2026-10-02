/* Utils for handling cookies based on js-cookie */
/* Adds support for passing cookies string for SSR */

import { tryDecodeURIComponent } from './string.js';

export function setCookie(
  name: string | number | boolean,
  value: string,
  attributes: { [x: string]: string | number | Date | boolean } = { path: '/' },
) {
  if (typeof document === 'undefined') {
    return;
  }

  if (typeof attributes.expires === 'number') {
    attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
  }
  if (attributes.expires) {
    attributes.expires =
      attributes.expires instanceof Date ? attributes.expires.toUTCString() : attributes.expires;
  }

  name = encodeURIComponent(name)
    .replace(/%(2[346B]|5E|60|7C)/g, tryDecodeURIComponent)
    .replace(/[()]/g, escape);

  let stringifiedAttributes = '';
  for (const attributeName in attributes) {
    if (!attributes[attributeName]) {
      continue;
    }

    stringifiedAttributes += '; ' + attributeName;

    if (attributes[attributeName] === true) {
      continue;
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    stringifiedAttributes += '=' + String(attributes[attributeName]).split(';')[0];
  }

  return (document.cookie = name + '=' + encode(value) + stringifiedAttributes);
}

export function getCookie(name: string, serverString?: string): string {
  const cookieString = typeof document !== 'undefined' ? document.cookie : serverString;

  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  const cookies = cookieString ? cookieString.split('; ') : [];
  const jar: Record<string, string> = {};
  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split('=');
    const value = parts.slice(1).join('=');

    try {
      const found = tryDecodeURIComponent(parts[0]);
      if (!(found in jar)) jar[found] = decode(value);
      if (name === found) {
        break;
      }
    } catch {
      // Do nothing...
    }
  }
  return name ? jar[name] : '';
}

export function removeCookie(
  name: string,
  attributes: { [x: string]: string | number | Date | boolean } = { path: '/' },
) {
  setCookie(name, '', { ...attributes, expires: -1 });
}

function decode(value: string) {
  if (value[0] === '"') {
    value = value.slice(1, -1);
  }
  return value.replace(/(%[\dA-F]{2})+/gi, tryDecodeURIComponent);
}

function encode(value: string) {
  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    tryDecodeURIComponent,
  );
}
