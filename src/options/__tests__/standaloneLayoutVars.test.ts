import { describe, it, expect } from 'vitest';

import { normalizeOptions } from '../normalizeOptions.js';
import { getStandaloneLayoutStyle } from '../standaloneLayoutVars.js';
import type { RawApiDocsOptions } from '../../types/options.js';

/** Goes through the real normalizer, so this covers `scrollYOffset` config to CSS variable. */
function layoutStyle(scrollYOffset?: RawApiDocsOptions['scrollYOffset']) {
  return getStandaloneLayoutStyle(
    normalizeOptions({ specType: 'openapi', metadata: {}, downloadUrls: [], scrollYOffset }),
  );
}

const ZERO_OFFSET = {
  '--navbar-height': '0px',
  '--navbar-stack-height': '0px',
};

describe('getStandaloneLayoutStyle', () => {
  it('emits a zero offset when no scrollYOffset is configured', () => {
    expect(layoutStyle()).toEqual(ZERO_OFFSET);
  });

  it('emits the configured offset as a pixel value', () => {
    expect(layoutStyle(100)).toEqual({
      '--navbar-height': '100px',
      '--navbar-stack-height': '100px',
    });
  });

  it('accepts the string form an html attribute produces', () => {
    expect(layoutStyle('64')).toEqual({
      '--navbar-height': '64px',
      '--navbar-stack-height': '64px',
    });
  });

  it('emits a zero offset for a zero value', () => {
    expect(layoutStyle(0)).toEqual(ZERO_OFFSET);
  });

  it('clamps a negative offset to zero', () => {
    expect(layoutStyle(-40)).toEqual(ZERO_OFFSET);
  });

  it('reads a callback offset at call time rather than at normalization', () => {
    let offset = 0;
    const styleFor = () => layoutStyle(() => offset);

    expect(styleFor()).toEqual(ZERO_OFFSET);

    offset = 24;
    expect(styleFor()).toEqual({
      '--navbar-height': '24px',
      '--navbar-stack-height': '24px',
    });
  });
});
