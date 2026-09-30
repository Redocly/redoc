import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import * as Sampler from 'openapi-sampler';

import type { ExampleEntry } from '../types/store.js';

import { schemaKind } from '../types/common.js';
import { convertSampleToString } from '../services/code-samples/index.js';
import { applyActiveVariantsToStore } from '../services/code-samples/discriminator.js';
import { isSequentialMediaType } from '../utils/media-type.js';
import { storeAtom, globalOptionsAtom } from './store.js';
import { schemaStoreAtom } from './schema.js';
import { activeDiscriminatorSelectAtom, activeOneOfSelectAtom } from './itemStore.js';

type SampleContext = {
  context?: 'request' | 'response';
  skipNonRequired: boolean;
  maxSampleDepth?: number;
  isXml: boolean;
};

export const exampleStoreAtom = atom<Record<string, ExampleEntry>>(
  (get) => get(storeAtom).exampleStore ?? {},
);

function buildOpenApiStub(
  schemas: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const components: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(schemas)) {
    const name = key.startsWith('components/schemas/')
      ? key.replace('components/schemas/', '')
      : key;
    components[name] = val;
  }
  return {
    openapi: '3.0.0',
    info: { title: '', version: '' },
    paths: {},
    components: { schemas: components },
  };
}

function hasVariantSelections(
  disc?: Record<string, number>,
  oneOf?: Record<string, number>,
): boolean {
  return (!!disc && Object.keys(disc).length > 0) || (!!oneOf && Object.keys(oneOf).length > 0);
}

const defaultResolvedStoreAtom = atom<Record<string, Record<string, unknown>>>((get) =>
  applyActiveVariantsToStore(get(schemaStoreAtom)),
);

const resolvedStoreForSamplerAtom = atomFamily((itemId: string) =>
  atom<Record<string, Record<string, unknown>>>((get) => {
    if (!itemId) return get(defaultResolvedStoreAtom);
    const disc = get(activeDiscriminatorSelectAtom(itemId));
    const oneOf = get(activeOneOfSelectAtom(itemId));
    if (!hasVariantSelections(disc, oneOf)) return get(defaultResolvedStoreAtom);
    return applyActiveVariantsToStore(get(schemaStoreAtom), disc, oneOf);
  }),
);

const defaultVariantSpecAtom = atom<Record<string, unknown>>((get) =>
  buildOpenApiStub(get(defaultResolvedStoreAtom)),
);

export const itemSpecForSamplerAtom = atomFamily((itemId: string) =>
  atom<Record<string, unknown>>((get) => {
    const resolved = get(resolvedStoreForSamplerAtom(itemId));
    // Items without selections share the default map — reuse its stub too.
    if (resolved === get(defaultResolvedStoreAtom)) return get(defaultVariantSpecAtom);
    return buildOpenApiStub(resolved);
  }),
);

type ExampleAtomKeyParts = {
  itemId: string;
  schemaId: string;
  context?: 'request' | 'response';
  mediaType?: string;
};

const EMPTY_KEY = '';

export function buildExampleAtomKey(
  schemaId: string,
  context?: 'request' | 'response',
  mediaType?: string,
  itemId?: string,
): string {
  if (!schemaId) return EMPTY_KEY;
  return JSON.stringify({
    itemId: itemId ?? '',
    schemaId,
    context: context ?? '',
    mediaType: mediaType ?? '',
  });
}

function parseExampleAtomKey(paramKey: string): ExampleAtomKeyParts | undefined {
  if (!paramKey) return undefined;
  try {
    const parsed = JSON.parse(paramKey) as Record<string, unknown>;
    if (!parsed || typeof parsed.schemaId !== 'string' || !parsed.schemaId) return undefined;
    const itemId = typeof parsed.itemId === 'string' ? parsed.itemId : '';
    const ctx = typeof parsed.context === 'string' ? parsed.context : '';
    const mt = typeof parsed.mediaType === 'string' ? parsed.mediaType : '';
    return {
      itemId,
      schemaId: parsed.schemaId,
      context: ctx === 'request' || ctx === 'response' ? ctx : undefined,
      mediaType: mt || undefined,
    };
  } catch {
    return undefined;
  }
}

export const generatedExampleAtom = atomFamily((paramKey: string) => {
  const parts = parseExampleAtomKey(paramKey);

  return atom<unknown>((get) => {
    if (!parts) return undefined;
    const { itemId, schemaId, context, mediaType } = parts;
    const entry = get(schemaStoreAtom)[schemaId];
    if (!entry || entry.kind !== schemaKind.JSON_SCHEMA) return undefined;

    const spec = get(itemSpecForSamplerAtom(itemId));
    // Sample the collapsed entry — raw entry.data still holds nested oneOf (always branch 0).
    const schemaForSampling = get(resolvedStoreForSamplerAtom(itemId))[schemaId] ?? entry.data;
    const { onlyRequiredInSamples, generatedSamplesMaxDepth } = get(globalOptionsAtom);


    const normalizedMediaType = mediaType?.toLowerCase();
    const isXml = normalizedMediaType ? normalizedMediaType.includes('xml') : false;

    try {
      const sampleContext: SampleContext = {
        context,
        skipNonRequired: context === 'request' && onlyRequiredInSamples,
        maxSampleDepth: generatedSamplesMaxDepth,
        isXml,
      };

      const sample = sampleSchema(schemaForSampling, spec, sampleContext);
      if (sample === null || sample === undefined) return sample;

      if (normalizedMediaType && isSequentialMediaType(normalizedMediaType)) {
        return toSequentialSample(entry.data, sample, spec, sampleContext, normalizedMediaType);
      }
      return sample;
    } catch {
      return undefined;
    }
  });
});

function toSequentialSample(
  schema: Record<string, unknown>,
  fallbackSample: unknown,
  spec: Record<string, unknown>,
  sampleContext: SampleContext,
  mediaType: string,
): unknown {
  const variants = getOneOfVariants(schema);
  if (variants.length > 0) {
    const streamItems = variants
      .map((variantSchema) => sampleSchema(variantSchema, spec, sampleContext))
      .filter((item) => item !== null && item !== undefined);
    if (streamItems.length > 0) {
      return convertSampleToString(streamItems, mediaType, schema, false);
    }
  }
  return convertSampleToString(fallbackSample, mediaType, schema, true);
}

function getOneOfVariants(schema: Record<string, unknown>): Record<string, unknown>[] {
  const maybeOneOf = schema.oneOf;
  if (!Array.isArray(maybeOneOf)) return [];
  return maybeOneOf.filter(
    (variant): variant is Record<string, unknown> =>
      typeof variant === 'object' && variant !== null,
  );
}

function sampleSchema(
  schema: Record<string, unknown>,
  spec: Record<string, unknown>,
  { context, skipNonRequired, maxSampleDepth, isXml }: SampleContext,
): unknown {
  return Sampler.sample(
    schema,
    {
      skipReadOnly: context === 'request',
      skipWriteOnly: context === 'response',
      quiet: true,
      skipNonRequired,
      // @ts-expect-error openapi-sampler types incorrect
      maxSampleDepth,
      ...(isXml && { format: 'xml' }),
    },
    spec,
  );
}
