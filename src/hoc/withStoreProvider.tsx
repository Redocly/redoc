import {
  memo,
  useMemo,
  useLayoutEffect,
  type PropsWithChildren,
  type ReactElement,
  type ComponentType,
  type FC,
} from 'react';
import { createStore, Provider, useStore, getDefaultStore } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { ApiItem, ApiStore } from '../types/store.js';
import type { ApiDocsOptions, RawApiDocsOptions } from '../types/options.js';
import type { OpenAPIDefinition } from '../types/openapi.js';

import { createStoreContext, toRecord } from '../adapters/helpers.js';
import { populateOpenApiStore } from '../adapters/openapi/store.js';
import { DEFAULT_MAX_DISPLAYED_ENUM_VALUES } from '../options/constants.js';
import { normalizeOptions } from '../options/normalizeOptions.js';
import { globalStoreAtom } from '../jotai/store.js';
import { appStore, environmentAtom, layoutAtom } from '../jotai/app.js';
import { buildServerEnvValues } from '../services/code-samples/server-env.js';

type WithStoreProviderProps = {
  items: ApiItem[];
  store: ApiStore;
  options: RawApiDocsOptions;
  layout?: LayoutVariant;
  basePath?: string;
  spec?: Record<string, unknown> | string;
  specUrl?: string;
};

export type StoreProviderProps = {
  options?: RawApiDocsOptions;
  /** Pre-built store (e.g. from server-side `buildItems`). Preferred path — no client-side indexing. */
  apiStore?: ApiStore;
  /** Raw OpenAPI definition to index client-side. Used by json-schema tag which constructs a synthetic definition. */
  definition?: OpenAPIDefinition;
};

// Markdoc tags/nodes/components defaults are intentionally NOT merged here — that pulls in the
// Markdoc runtime and only the standalone Markdoc renderer needs it (see `buildMarkdocOptions` /
// `createMarkdocAdapter`). Embedders that render without Markdoc therefore don't bundle it via
// this shared provider.
const DEFAULT_OPTIONS = {
  ignoreNamedSchemas: ['java.io.ObjectStreamField'],
  maxDisplayedEnumValues: DEFAULT_MAX_DISPLAYED_ENUM_VALUES,
};

function buildGlobalStoreOptions(options: RawApiDocsOptions, basePath: string): ApiDocsOptions {
  const merged = { ...DEFAULT_OPTIONS, ...options, basePath };
  return normalizeOptions(merged);
}

/**
 * Keep `appStore` mounted for the store's lifetime so `atomWithStorage` loads
 * the saved cookie/session state before anything reads or writes through it.
 * One permanent subscription per store — `sub()` stacks a new listener on
 * every call and we never unsubscribe, so dedupe by store.
 */
const appStoreMountedStores = new WeakSet<object>();

function ensureAppStoreMounted(jotaiStore: ReturnType<typeof createStore>): void {
  if (appStoreMountedStores.has(jotaiStore)) {
    return;
  }
  appStoreMountedStores.add(jotaiStore);
  jotaiStore.sub(appStore, () => undefined);
}

/**
 * Seed one environment per global server. Without the seeds, a saved environment name
 * (cookie) can't resolve to a server in a fresh session and the switcher resets to the
 * first server.
 */
function seedServerEnvironments(
  jotaiStore: ReturnType<typeof createStore>,
  apiStore: ApiStore | undefined,
): void {
  if (!apiStore?.servers?.length) {
    return;
  }
  ensureAppStoreMounted(jotaiStore);

  const seed = buildServerEnvValues(apiStore.servers);
  const existing = jotaiStore.get(appStore).environments ?? {};
  const additions: Record<string, Record<string, string>> = {};
  for (const [name, values] of Object.entries(seed)) {
    const current = existing[name];
    const missing = current
      ? Object.fromEntries(Object.entries(values).filter(([field]) => !(field in current)))
      : values;
    if (Object.keys(missing).length > 0) {
      additions[name] = missing;
    }
  }

  if (Object.keys(additions).length === 0) {
    return;
  }
  jotaiStore.set(environmentAtom, { environments: additions });
}

export function withStoreProvider<P extends WithStoreProviderProps>(
  WrappedComponent: ComponentType<P>,
): FC<P> {
  const WithStoreProvider = memo((props: P) => {
    const { items, options, store: propsStore, layout, basePath = '', spec, specUrl } = props;
    const currentStore = useStore();
    const existingStore = currentStore !== getDefaultStore() ? currentStore : undefined;

    const normalizedOptions = useMemo(
      () => buildGlobalStoreOptions(options, basePath),
      [options, basePath],
    );
    const resolvedLayout = layout ?? normalizedOptions.layout;

    useLayoutEffect(() => {
      if (existingStore) {
        const current = existingStore.get(globalStoreAtom);
        seedServerEnvironments(existingStore, propsStore ?? current.store);
        existingStore.set(layoutAtom, resolvedLayout);
        existingStore.set(globalStoreAtom, {
          items,
          store: propsStore ?? current.store,
          options: normalizedOptions,
          definition: spec ?? current.definition,
          definitionUrl: specUrl ?? current.definitionUrl,
        });
      }
    }, [resolvedLayout, normalizedOptions, existingStore, items, propsStore, spec, specUrl]);

    const store = useMemo(() => {
      if (existingStore) {
        return null;
      }

      const storeData = {
        items,
        store: propsStore,
        options: normalizedOptions,
        definition: spec,
        definitionUrl: specUrl,
      };

      const newStore = createStore();
      newStore.set(globalStoreAtom, storeData);
      ensureAppStoreMounted(newStore); // force mount so init data is read from storage
      newStore.set(layoutAtom, resolvedLayout);
      seedServerEnvironments(newStore, propsStore);
      return newStore;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingStore, items, propsStore, normalizedOptions, resolvedLayout]);

    if (existingStore || !store) {
      return <WrappedComponent {...props} />;
    }

    return (
      <Provider store={store}>
        <WrappedComponent {...props} />
      </Provider>
    );
  });

  WithStoreProvider.displayName = `WithStoreProvider(${getDisplayName(WrappedComponent)})`;

  return WithStoreProvider;
}

function getDisplayName<T>(WrappedComponent: ComponentType<T>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function buildStoreFromDefinition(
  definition: OpenAPIDefinition,
  normalizedOptions: ApiDocsOptions,
): ApiStore {
  const storeCtx = createStoreContext(toRecord(definition));
  populateOpenApiStore(definition, storeCtx, normalizedOptions);
  return {
    schemaStore: storeCtx.schemaStore,
    exampleStore: storeCtx.exampleStore,
    securitySchemeStore: storeCtx.securitySchemeStore,
    mcp: storeCtx.document['x-mcp'] as ApiStore['mcp'],
  };
}

export const StoreProvider = memo(function StoreProvider({
  children,
  definition,
  apiStore: apiStoreProp,
  options: rawOptions,
}: PropsWithChildren<StoreProviderProps>): ReactElement {
  const jotaiStore = useMemo(() => {
    const normalizedOptions = buildGlobalStoreOptions(
      { specType: 'openapi', ...rawOptions } as RawApiDocsOptions,
      rawOptions?.basePath ?? '',
    );

    let apiStore: ApiStore;
    if (apiStoreProp) {
      apiStore = apiStoreProp;
    } else if (definition) {
      apiStore = buildStoreFromDefinition(definition, normalizedOptions);
    } else {
      throw new Error('StoreProvider requires either apiStore or definition');
    }

    const store = createStore();
    store.set(globalStoreAtom, {
      items: [],
      store: apiStore,
      options: normalizedOptions,
    });
    ensureAppStoreMounted(store);
    store.set(layoutAtom, LayoutVariant.STACKED);
    seedServerEnvironments(store, apiStore);
    return store;
  }, [apiStoreProp, definition, rawOptions]);

  return <Provider store={jotaiStore}>{children}</Provider>;
});
