import type { RawApiDocsOptions } from '../types/options.js';

/** Option overrides applied on top of host options in `normalizeOptions`. The community edition forces enterprise options off here. */
export const EDITION_OPTION_OVERRIDES: Partial<RawApiDocsOptions> = {};
