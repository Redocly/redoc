import type { ApiSpecType, RawApiDocsOptions } from './api.js';

export type SpecEntry = {
  basePath: string;
  type: ApiSpecType;
  fixture?: string;
  css?: string;
  options?: Partial<RawApiDocsOptions>;
};
