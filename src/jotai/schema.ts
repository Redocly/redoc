import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';

import type { SchemaEntry } from '../types/store.js';

import { storeAtom } from './store.js';

export const schemaStoreAtom = atom<Record<string, SchemaEntry>>((get) => {
  return get(storeAtom).schemaStore ?? {};
});

export const schemaEntryAtom = atomFamily((schemaId: string) =>
  atom<SchemaEntry | undefined>((get) => get(schemaStoreAtom)[schemaId]),
);
