import { atom } from 'jotai';

import type { Options, OpenAPIParser } from '../services/index.js';

export interface OpenAPIDefinition {
  id: string;
  title: string;
  url?: string;
  parser: OpenAPIParser;
}

export type GlobalStoreAtom = {
  parser: OpenAPIParser;
  options: Options;
};

export const globalStoreAtom = atom<GlobalStoreAtom>({
  parser: {} as OpenAPIParser,
  options: {} as Options,
});

export const globalParserAtom = atom<OpenAPIParser>((get) => get(globalStoreAtom).parser);
export const globalOptionsAtom = atom<Options>((get) => get(globalStoreAtom).options);
