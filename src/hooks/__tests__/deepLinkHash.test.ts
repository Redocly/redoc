import { describe, it, expect } from 'vitest';

import { decodeDeepLinkSeparator, deepLinkHash } from '../deepLinkHash.js';

describe('decodeDeepLinkSeparator', () => {
  it('restores a separator that was percent-encoded in transit', () => {
    expect(decodeDeepLinkSeparator('#/orders/deleteorder%23orders/deleteorder/request')).toBe(
      '#/orders/deleteorder#orders/deleteorder/request',
    );
  });

  it('leaves a canonical deep link untouched', () => {
    const fragment = '#/orders/deleteorder#orders/deleteorder/request';

    expect(decodeDeepLinkSeparator(fragment)).toBe(fragment);
  });

  it('leaves a route-only fragment untouched', () => {
    expect(decodeDeepLinkSeparator('#/orders/deleteorder')).toBe('#/orders/deleteorder');
  });

  it('leaves a fragment that holds no route untouched', () => {
    expect(decodeDeepLinkSeparator('#tag/Orders/operation/deleteOrder')).toBe(
      '#tag/Orders/operation/deleteOrder',
    );
    expect(decodeDeepLinkSeparator('#section/overview%23extra')).toBe('#section/overview%23extra');
  });

  it('decodes only the separator, keeping encoding inside the deep link', () => {
    expect(
      decodeDeepLinkSeparator('#/orders/listorders%23orders/listorders/t=request&path=id%23n'),
    ).toBe('#/orders/listorders#orders/listorders/t=request&path=id%23n');
  });

  it('leaves a canonical deep link that carries an encoded `#` of its own', () => {
    const fragment = '#/orders/listorders#orders/listorders/t=request&path=id%23n';

    expect(decodeDeepLinkSeparator(fragment)).toBe(fragment);
  });

  it('leaves an encoded `#` that belongs to the route', () => {
    expect(decodeDeepLinkSeparator('#/orders/list%23orders#orders/list%23orders/request')).toBe(
      '#/orders/list%23orders#orders/list%23orders/request',
    );
  });

  it('is idempotent, so repeated passes cannot eat further separators', () => {
    const encoded = '#/orders/listorders%23orders/listorders/t=request&path=id%23n';
    const once = decodeDeepLinkSeparator(encoded);

    expect(decodeDeepLinkSeparator(once)).toBe(once);
  });

  it('splits at the same position deepLinkHash does', () => {
    const encoded = '#/orders/deleteorder%23orders/deleteorder/request';

    expect(deepLinkHash(decodeDeepLinkSeparator(encoded))).toBe('#orders/deleteorder/request');
    expect(deepLinkHash(encoded)).toBe('');
  });
});
