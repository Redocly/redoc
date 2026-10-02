import { buildASTSchema, parse } from 'graphql';

import type { ApiStore } from '../../types/store.js';

import { populateGraphqlStore } from './store.js';

export function buildGraphqlStoreFromSdl(sdl: string): ApiStore {
  return populateGraphqlStore(buildASTSchema(parse(sdl)));
}
