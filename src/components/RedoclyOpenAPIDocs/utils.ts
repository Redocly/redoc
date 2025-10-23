import { useRef } from 'react';
import isDeepEqual from 'fast-deep-equal';

import type { DependencyList } from 'react';
import type { OpenAPIDefinition, OpenAPISecurityScheme } from '../../types/index.js';

import { safeSlugify } from '../../utils/string.js';

export function fixSpec(resolvedSpec: OpenAPIDefinition) {
  const schemas = (resolvedSpec.components && resolvedSpec.components.securitySchemes) || {};
  for (const s of Object.keys(schemas)) {
    const scheme = schemas[s] as OpenAPISecurityScheme;
    if (scheme['x-type']) {
      scheme.type = scheme['x-type'];
    }
    if (scheme['x-scheme']) {
      scheme.scheme = scheme['x-scheme'];
    }
  }
}

export function useDeepCompareMemoize(value: DependencyList): Array<number> {
  const ref = useRef<DependencyList>(null);
  const signalRef = useRef<number>(0);

  if (!isDeepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current];
}

export function getMarkdownHeaderId(children) {
  if (typeof children[0] === 'string') {
    return `section/${safeSlugify(children[0])}`;
  } else if (children.children) {
    return getMarkdownHeaderId(children[0]);
  }
}
