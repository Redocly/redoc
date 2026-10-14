import type { CSSProperties } from 'react';
import type { ApiDocsOptions } from '../types/options.js';

export function getStandaloneLayoutStyle({ scrollYOffset }: ApiDocsOptions): CSSProperties {
  const offset = Math.max(scrollYOffset?.() ?? 0, 0);

  return {
    '--navbar-height': `${offset}px`,
    '--navbar-stack-height': `${offset}px`,
  } as CSSProperties;
}
