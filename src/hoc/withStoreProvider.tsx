import {
  memo,
  useMemo,
  useLayoutEffect,
  type ComponentType,
  type FC,
} from 'react';
import { createStore, Provider, useStore, getDefaultStore } from 'jotai';

import type { ApiItem, ApiStore } from '../types/store.js';
import type { ApiDocsOptions, RawApiDocsOptions } from '../types/options.js';

import { DEFAULT_MAX_DISPLAYED_ENUM_VALUES } from '../options/constants.js';
import { normalizeOptions } from '../options/normalizeOptions.js';
import { globalOptionsAtom, globalStoreAtom } from '../jotai/store.js';
import { appStore, environmentAtom, layoutAtom } from '../jotai/app.js';
import { buildServerEnvValues } from '../services/code-samples/server-env.js';

type WithStoreProviderProps = {
  items: ApiItem[];
  store: ApiStore;
  options: RawApiDocsOptions;
  layout?: ApiDocsOptions['layout'];
  basePath?: string;
  spec?: Record<string, unknown> | string;
  specUrl?: string;
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
    }, [existingStore, items, propsStore]);

    useLayoutEffect(() => {
      if (!store) {
        return;
      }
      store.set(layoutAtom, resolvedLayout);
      if (store.get(globalOptionsAtom) === normalizedOptions) {
        return;
      }
      store.set(globalOptionsAtom, normalizedOptions);
    }, [store, normalizedOptions, resolvedLayout]);

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
