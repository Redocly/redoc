import { describe, it, expect } from 'vitest';

import type { ApiItemContent } from '../../types/store.js';
import type { RouteItem } from '../routing.js';

import { contentType } from '../../types/common.js';
import { buildRouteIndex } from '../routing.js';
import {
  appendVariantSuffix,
  serializeFieldParams,
  makeDeepLink,
  buildDeepLinkUrl,
  deepLinkToId,
  getDeepLinkId,
  hashToElementId,
  buildOpenApiFieldSuffix,
  buildOpenApiSectionSuffix,
  buildAsyncApiSuffix,
  buildGraphqlSuffix,
  isGraphqlDeepLinkAncestor,
  extractDeepLinkParamFromHash,
  getLegacyHash,
  resolveLegacyHashToRoute,
  variantMarkersOnly,
  stripVariantMarkers,
  CALLBACKS_SECTION,
  stripCallbacksSegment,
  hashTargetsCallback,
  hashIsInsideCallback,
  hashIsOutsideCallbacks,
} from '../deep-link.js';

describe('serializeFieldParams', () => {
  it('serializes params in insertion order, omitting undefined', () => {
    expect(
      serializeFieldParams({
        t: 'request',
        in: 'header',
        c: undefined,
        cb: undefined,
        ct: undefined,
        path: 'accept-language',
      }),
    ).toBe('t=request&in=header&path=accept-language');
  });

  it('returns empty string for all-undefined params', () => {
    expect(serializeFieldParams({ t: undefined, in: undefined })).toBe('');
  });

  it('includes all defined keys', () => {
    expect(serializeFieldParams({ t: 'response', c: '200', path: 'data/id' })).toBe(
      't=response&c=200&path=data/id',
    );
  });
});

describe('makeDeepLink', () => {
  it('matches openapi-docs format: /{operationId}#{operationId}/{suffix}', () => {
    expect(makeDeepLink('getUsers', 'request')).toBe('/getusers#getusers/request');
  });

  it('lowercases everything', () => {
    expect(makeDeepLink('GetUser', 'Response&c=200')).toBe('/getuser#getuser/response&c=200');
  });

  it('encodes backslashes in operation id', () => {
    expect(makeDeepLink('path\\op', 'request')).toBe('/path%5cop#path%5cop/request');
  });

  it('handles empty suffix', () => {
    expect(makeDeepLink('listPets', '')).toBe('/listpets#listpets');
  });

  it('handles suffix with leading slash', () => {
    expect(makeDeepLink('op', '/request/query')).toBe('/op#op/request/query');
  });
});

describe('buildDeepLinkUrl', () => {
  it('combines base path with deep link', () => {
    const url = buildDeepLinkUrl('/docs', 'getUsers', 'request');
    expect(url).toBe('/docs/getusers#getusers/request');
  });

  it('handles root base path', () => {
    const url = buildDeepLinkUrl('/', 'op', 't=request&in=query');
    expect(url).toBe('/op#op/t=request&in=query');
  });
});

describe('hashToElementId', () => {
  it('strips #, decodes, and lowercases', () => {
    expect(hashToElementId('#GetUsers/Request')).toBe('getusers/request');
  });

  it('works without # prefix', () => {
    expect(hashToElementId('op/t=request')).toBe('op/t=request');
  });

  it('decodes URI components before lowercasing', () => {
    expect(hashToElementId('#path%5Cop')).toBe('path\\op');
  });
});

describe('buildOpenApiFieldSuffix', () => {
  it('builds request header field suffix', () => {
    expect(buildOpenApiFieldSuffix({ t: 'request', in: 'header', path: 'accept-language' })).toBe(
      't=request&in=header&path=accept-language',
    );
  });

  it('builds response body field suffix', () => {
    expect(buildOpenApiFieldSuffix({ t: 'response', c: '200', path: 'data/id' })).toBe(
      't=response&c=200&path=data/id',
    );
  });

  it('builds callback field suffix', () => {
    expect(buildOpenApiFieldSuffix({ t: 'request', cb: 'onEvent', path: 'payload' })).toBe(
      't=request&cb=onEvent&path=payload',
    );
  });

  it('includes content type when present', () => {
    expect(
      buildOpenApiFieldSuffix({
        t: 'request',
        ct: 'application/json',
        path: 'name',
      }),
    ).toBe('t=request&ct=application/json&path=name');
  });
});

describe('buildOpenApiSectionSuffix', () => {
  it('returns section name alone', () => {
    expect(buildOpenApiSectionSuffix('request')).toBe('request');
  });

  it('adds sub-section with separator', () => {
    expect(buildOpenApiSectionSuffix('request', 'query')).toBe('request/query');
  });

  it('adds response code', () => {
    expect(buildOpenApiSectionSuffix('response', undefined, '200')).toBe('response&c=200');
  });

  it('includes both response code and sub-section', () => {
    expect(buildOpenApiSectionSuffix('response', 'body', '404')).toBe('response&c=404/body');
  });

  it('builds callbacks sub-section', () => {
    expect(buildOpenApiSectionSuffix('callbacks', 'myCallback')).toBe('callbacks/myCallback');
  });
});

describe('buildAsyncApiSuffix', () => {
  it('builds send/receive', () => {
    expect(buildAsyncApiSuffix({ section: 'send' })).toBe('send');
    expect(buildAsyncApiSuffix({ section: 'receive' })).toBe('receive');
  });

  it('builds parameters', () => {
    expect(buildAsyncApiSuffix({ section: 'parameters' })).toBe('parameters');
  });

  it('builds messages with message key', () => {
    expect(buildAsyncApiSuffix({ section: 'messages', messageKey: 'userSignedUp' })).toBe(
      'messages&m=userSignedUp',
    );
  });

  it('builds messages with headers subsection', () => {
    expect(
      buildAsyncApiSuffix({ section: 'messages', messageKey: 'msg1', subsection: 'headers' }),
    ).toBe('messages&m=msg1&t=headers');
  });

  it('builds messages with payload subsection', () => {
    expect(
      buildAsyncApiSuffix({ section: 'messages', messageKey: 'msg1', subsection: 'payload' }),
    ).toBe('messages&m=msg1&t=payload');
  });
});

describe('buildGraphqlSuffix', () => {
  it('builds field deep link', () => {
    expect(buildGraphqlSuffix({ t: 'field', path: 'Query.hero' })).toBe('t=field&path=Query.hero');
  });

  it('builds argument deep link', () => {
    expect(buildGraphqlSuffix({ t: 'argument', path: 'Query.hero', arg: 'id' })).toBe(
      't=argument&path=Query.hero&arg=id',
    );
  });

  it('builds return-type deep link', () => {
    expect(buildGraphqlSuffix({ t: 'return-type', path: 'Query.hero', rt: '1' })).toBe(
      't=return-type&path=Query.hero&rt=1',
    );
  });

  it('builds enum-value', () => {
    expect(buildGraphqlSuffix({ t: 'enum-value', path: 'Status.ACTIVE' })).toBe(
      't=enum-value&path=Status.ACTIVE',
    );
  });
});

describe('extractDeepLinkParamFromHash', () => {
  it('reads the example key from a request or response deep link', () => {
    expect(
      extractDeepLinkParamFromHash('#orders/placeorder/request/body&ex=corporateCard', 'ex'),
    ).toBe('corporatecard');
    expect(
      extractDeepLinkParamFromHash('#orders/placeorder/response&c=201&ex=accepted', 'ex'),
    ).toBe('accepted');
  });

  it('extracts a parameter value from hash params', () => {
    expect(extractDeepLinkParamFromHash('#operation/messages&m=UserSignedUp&t=payload', 'm')).toBe(
      'usersignedup',
    );
  });

  it('extracts params from response suffixes', () => {
    expect(extractDeepLinkParamFromHash('#getuser/response&c=404/body', 'c')).toBe('404');
  });

  it('returns undefined when key is absent', () => {
    expect(extractDeepLinkParamFromHash('#operation/request&in=header', 'c')).toBeUndefined();
  });
});

describe('callback scoping', () => {
  const ITEM = 'other/createjob';
  const CB = 'jobCompleted/post';
  const SCOPE = `${ITEM}/callbacks/jobcompleted/post`;
  const LEGACY_SECTION = `${ITEM}/jobcompleted/post/request/body`;
  const LEGACY_FIELD = `${ITEM}/t=request&cb=jobcompleted/post&path=status`;

  it('builds the suffix prefix a callback owns', () => {
    expect(buildOpenApiSectionSuffix(CALLBACKS_SECTION, CB)).toBe('callbacks/jobCompleted/post');
  });

  it('strips the callbacks segment to reach the legacy section shape', () => {
    expect(stripCallbacksSegment(`${SCOPE}/request/body`)).toBe(LEGACY_SECTION);
  });

  describe('hashTargetsCallback', () => {
    it.each([
      ['the panel anchor', `#${SCOPE}`],
      ['a section', `#${SCOPE}/request/body`],
      ['a description heading', `#${SCOPE}/appended-query-parameters`],
      ['a field', `#${ITEM}/t=request&cb=jobcompleted/post&path=status`],
      ['a legacy section', `#${LEGACY_SECTION}`],
      ['a legacy field', `#${LEGACY_FIELD}`],
      ['a legacy callback-response tab', `#${ITEM}/jobcompleted/post/callback-response&c=200`],
    ])('matches %s', (_case, hash) => {
      expect(hashTargetsCallback(hash, ITEM, CB)).toBe(true);
    });

    it.each([
      ['an operation-level hash', `#${ITEM}/request/body`],
      ['another callback', `#${ITEM}/callbacks/jobfailed/post`],
      ['a callback id that is only a prefix of this one', `#${ITEM}/callbacks/jobcomp`],
      // A repeated name+verb is suffixed `~<n>`, so this id is never a path-segment
      // prefix of its sibling's — otherwise both panels would claim the same hash.
      ['an indexed sibling section', `#${ITEM}/callbacks/jobcompleted/post~1/request/body`],
      ['an indexed sibling field', `#${ITEM}/t=request&cb=jobcompleted/post~1&path=x`],
      // Two operations can hold a callback with the same id and both render on one page.
      [
        'the same callback id on another operation',
        '#other/createsubscription/callbacks/jobcompleted/post',
      ],
      ['an empty hash', ''],
    ])('does not match %s', (_case, hash) => {
      expect(hashTargetsCallback(hash, ITEM, CB)).toBe(false);
    });
  });

  describe('hashIsInsideCallback', () => {
    it.each([
      ['a canonical section hash', `${SCOPE}/response&c=200/body`],
      ['a canonical field hash', `${ITEM}/t=response&c=200&cb=jobcompleted/post&path=x`],
      ['a legacy section hash', LEGACY_SECTION],
      ['a legacy field hash', LEGACY_FIELD],
    ])('accepts %s', (_case, hashId) => {
      expect(hashIsInsideCallback(hashId, ITEM, CB)).toBe(true);
    });

    it('rejects an operation-level hash', () => {
      expect(hashIsInsideCallback(`${ITEM}/t=response&c=202`, ITEM, CB)).toBe(false);
    });

    it('rejects a sibling callback hash', () => {
      expect(
        hashIsInsideCallback(`${ITEM}/callbacks/jobfailed/post/t=response&c=200`, ITEM, CB),
      ).toBe(false);
    });

    it.each([
      ['section', `${ITEM}/callbacks/jobcompleted/post~1/response&c=200/body`],
      ['field', `${ITEM}/t=response&c=200&cb=jobcompleted/post~1&path=x`],
    ])('rejects an indexed sibling %s hash', (_case, hashId) => {
      expect(hashIsInsideCallback(hashId, ITEM, CB)).toBe(false);
    });
  });

  describe('hashIsOutsideCallbacks', () => {
    it.each([
      ['a canonical callback hash', `${SCOPE}/response&c=200/body`],
      ['a callback field hash', `${ITEM}/t=response&c=200&cb=jobcompleted/post&path=x`],
      ['a legacy callback-response hash', `${ITEM}/jobcompleted/post/callback-response&c=200`],
      ['a legacy callback-request hash', `${ITEM}/jobcompleted/post/callback-request`],
    ])('rejects %s', (_case, hashId) => {
      expect(hashIsOutsideCallbacks(hashId, ITEM)).toBe(false);
    });

    it('accepts an operation-level hash', () => {
      expect(hashIsOutsideCallbacks(`${ITEM}/t=response&c=202`, ITEM)).toBe(true);
    });

    // Field names come from the spec, so `callbacks` and `callback-response` are legal
    // property names. Reading them as markers dropped the `c=` and rendered the wrong
    // response — the operation here declares no callbacks at all.
    it.each([
      ['a field named callbacks', `${ITEM}/t=response&c=403&path=data/callbacks/url`],
      ['a field named callback-response', `${ITEM}/t=response&c=403&path=data/callback-response`],
      ['a field named callback-request', `${ITEM}/t=response&c=403&path=data/callback-request/id`],
    ])('accepts an operation hash whose %s', (_case, hashId) => {
      expect(hashIsOutsideCallbacks(hashId, ITEM)).toBe(true);
    });

    it('accepts an operation whose own slug contains a marker', () => {
      const markerItem = 'other/callback-response';
      expect(hashIsOutsideCallbacks(`${markerItem}/t=response&c=403`, markerItem)).toBe(true);
    });
  });
});

describe('getLegacyHash', () => {
  it('detects #tag pattern', () => {
    expect(getLegacyHash('#tag/users')).toBe('/users');
  });

  it('detects #operation pattern', () => {
    expect(getLegacyHash('#operation/getUser')).toBe('/getuser');
  });

  it('detects #paths pattern', () => {
    expect(getLegacyHash('#paths/api/users')).toBe('/api/users');
  });

  it('returns empty for non-legacy hash', () => {
    expect(getLegacyHash('#getUsers/request')).toBe('');
  });

  it('returns empty for empty hash', () => {
    expect(getLegacyHash('')).toBe('');
  });
});

describe('resolveLegacyHashToRoute', () => {
  const makeRoute = (path: string): RouteItem => ({
    path,
    label: path,
    content: { contentType: contentType.GROUP, children: [] } as ApiItemContent,
  });

  const routeIndex = buildRouteIndex(
    [
      makeRoute('/docs/viber-business-messaging'),
      makeRoute('/docs/viber-business-messaging/sendviber'),
      makeRoute('/docs/pets'),
    ],
    [],
    '/docs',
  );

  it('resolves a suffix-less legacy operation hash to its route', () => {
    expect(resolveLegacyHashToRoute('#operation/sendViber', '/docs', routeIndex)).toBe(
      '/docs/viber-business-messaging/sendviber',
    );
  });

  it('resolves a new-format route hash via the direct lookup', () => {
    expect(
      resolveLegacyHashToRoute('#viber-business-messaging/sendviber', '/docs', routeIndex),
    ).toBe('/docs/viber-business-messaging/sendviber');
  });

  it.each([
    [
      '#operation/sendViber/callbacks',
      '/docs/viber-business-messaging/sendviber#viber-business-messaging/sendviber/callbacks',
    ],
    [
      '#operation/sendViber/jobcompleted/post/callback-response&c=200',
      '/docs/viber-business-messaging/sendviber#viber-business-messaging/sendviber/jobcompleted/post/callback-response&c=200',
    ],
  ])('keeps a sub-section suffix as the element-id hash: %s', (hash, expected) => {
    expect(resolveLegacyHashToRoute(hash, '/docs', routeIndex)).toBe(expected);
  });

  it('prefers the longest route match over a shorter prefix plus suffix', () => {
    const index = buildRouteIndex([makeRoute('/docs/x/a'), makeRoute('/docs/a/b')], [], '/docs');
    expect(resolveLegacyHashToRoute('#operation/a/b', '/docs', index)).toBe('/docs/a/b');
  });

  it('resolves with an empty base path', () => {
    const index = buildRouteIndex([makeRoute('/viber/sendviber')], [], '');
    expect(resolveLegacyHashToRoute('#operation/sendViber/callbacks', '', index)).toBe(
      '/viber/sendviber#viber/sendviber/callbacks',
    );
  });

  describe('section hash of a heading from an overview partial (no route of its own)', () => {
    const index = {
      ...routeIndex,
      overviewPartialSectionIds: new Set(['section/learning-resources']),
    };

    it('resolves to the overview page', () => {
      expect(resolveLegacyHashToRoute('#section/Learning-Resources', '/docs', index)).toBe(
        '/docs#section/learning-resources',
      );
    });

    it('leaves a dangling section hash on the page', () => {
      expect(resolveLegacyHashToRoute('#section/does-not-exist', '/docs', index)).toBeUndefined();
    });
  });

  it('returns undefined for a hash that matches no route', () => {
    expect(resolveLegacyHashToRoute('#does/not/exist', '/docs', routeIndex)).toBeUndefined();
    expect(resolveLegacyHashToRoute('#operation/unknownOp', '/docs', routeIndex)).toBeUndefined();
    expect(resolveLegacyHashToRoute('', '/docs', routeIndex)).toBeUndefined();
  });
});

describe('deepLinkToId', () => {
  it('returns the part after # for an absolute deep link', () => {
    expect(deepLinkToId('/petstore/pet/getpetbyid#pet/getpetbyid/request')).toBe(
      'pet/getpetbyid/request',
    );
  });

  it('returns empty string when no hash is present', () => {
    expect(deepLinkToId('/petstore/pet/getpetbyid')).toBe('');
  });

  it('decodes URI components in the deep link before slicing', () => {
    expect(deepLinkToId('/op#path%5Cop/request')).toBe('path\\op/request');
  });

  it('preserves the case of the hash portion', () => {
    expect(deepLinkToId('/x#A/B&path=C')).toBe('A/B&path=C');
  });
});

describe('getDeepLinkId', () => {
  it('returns undefined when input is undefined or empty', () => {
    expect(getDeepLinkId(undefined)).toBeUndefined();
    expect(getDeepLinkId('')).toBeUndefined();
  });

  it('returns undefined when the URL has no hash portion', () => {
    expect(getDeepLinkId('/op/getpetbyid')).toBeUndefined();
  });

  it('returns the hash portion when present', () => {
    expect(getDeepLinkId('/op#op/request')).toBe('op/request');
  });

  it('returns undefined when the hash portion is empty (trailing #)', () => {
    // deepLinkToId returns '' which falsy-collapses to undefined in getDeepLinkId.
    expect(getDeepLinkId('/op#')).toBeUndefined();
  });
});

describe('appendVariantSuffix', () => {
  it('appends the suffix to the last segment of the parent path', () => {
    expect(appendVariantSuffix(['user', 'profile'], '&oneof=1')).toEqual([
      'user',
      'profile&oneof=1',
    ]);
  });

  it('returns a single-element array with the suffix when parents are empty', () => {
    expect(appendVariantSuffix([], '&oneof=2')).toEqual(['&oneof=2']);
  });

  it('treats undefined parents the same as empty', () => {
    expect(appendVariantSuffix(undefined, '&d=0')).toEqual(['&d=0']);
  });

  it('does not mutate the input array', () => {
    const parents = ['a', 'b'];
    appendVariantSuffix(parents, '&oneof=1');
    expect(parents).toEqual(['a', 'b']);
  });
});

describe('variantMarkersOnly', () => {
  it('keeps only segments that contain a variant marker', () => {
    expect(variantMarkersOnly(['user', 'profile&oneof=1', 'address', 'kind&d=0'])).toEqual([
      '&oneof=1',
      '&d=0',
    ]);
  });

  it('strips the name prefix, keeping the marker portion from the first &', () => {
    expect(variantMarkersOnly(['payment&oneof=2'])).toEqual(['&oneof=2']);
  });

  it('returns empty array when no segment has a marker', () => {
    expect(variantMarkersOnly(['a', 'b', 'c'])).toEqual([]);
  });

  it('returns empty array for undefined input', () => {
    expect(variantMarkersOnly(undefined)).toEqual([]);
  });
});

describe('isGraphqlDeepLinkAncestor', () => {
  it('matches a field whose path is an ancestor of the hash target', () => {
    const hash = '#query/hero#query/hero/t=field&path=Character.friends';
    expect(isGraphqlDeepLinkAncestor(hash, 'Character')).toBe(true);
  });

  it('matches the operation field when the target is one of its arguments', () => {
    const hash = '#query/hero/t=argument&path=Query.hero.id&arg=id';
    expect(isGraphqlDeepLinkAncestor(hash, 'Query.hero')).toBe(true);
  });

  it('does not match the exact target (only ancestors expand)', () => {
    const hash = '#x/t=field&path=User.address';
    expect(isGraphqlDeepLinkAncestor(hash, 'User.address')).toBe(false);
  });

  it('does not false-match a partial path segment', () => {
    const hash = '#x/t=field&path=Query.heroes.first';
    expect(isGraphqlDeepLinkAncestor(hash, 'Query.hero')).toBe(false);
  });

  it('matches case-insensitively', () => {
    const hash = '#x/t=field&path=user.address.street';
    expect(isGraphqlDeepLinkAncestor(hash, 'USER.ADDRESS')).toBe(true);
  });

  it('returns false for an empty hash or path', () => {
    expect(isGraphqlDeepLinkAncestor('', 'User.address')).toBe(false);
    expect(isGraphqlDeepLinkAncestor('#x/t=field&path=User.address', '')).toBe(false);
  });
});

describe('stripVariantMarkers', () => {
  it('removes a marker embedded mid-path without truncating the rest', () => {
    expect(stripVariantMarkers('_embedded.quote&d=0.order.items[]')).toBe(
      '_embedded.quote.order.items[]',
    );
  });

  it('removes a trailing marker from a single segment', () => {
    expect(stripVariantMarkers('quote&d=0')).toBe('quote');
    expect(stripVariantMarkers('profile&oneof=1')).toBe('profile');
  });

  it('returns an empty string for a marker-only piece', () => {
    expect(stripVariantMarkers('&d=0')).toBe('');
    expect(stripVariantMarkers('&oneof=2')).toBe('');
  });

  it('removes multiple markers', () => {
    expect(stripVariantMarkers('a&d=0&oneof=1')).toBe('a');
  });

  it('leaves plain names untouched', () => {
    expect(stripVariantMarkers('order.items[]')).toBe('order.items[]');
  });
});
