import * as React from 'react';
import { createContext } from 'react';

import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
import { loadAndBundleSpec } from '../utils';

export interface StoreBuilderProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;

  options?: RedocRawOptions;

  onLoaded?: (e?: Error) => void;

  children: (props: { loading: boolean; store: AppStore | null }) => any;
}

export interface StoreBuilderState {
  error?: Error;
  loading: boolean;
  resolvedSpec?: any;
  prevSpec?: any;
  prevSpecUrl?: string;
}

const StoreContext = createContext<AppStore | undefined>(undefined);
const { Provider, Consumer } = StoreContext;
export { Provider as StoreProvider, Consumer as StoreConsumer, StoreContext };

export function StoreBuilder(props: StoreBuilderProps) {
  const { spec, specUrl, options, onLoaded, children } = props;

  const [resolvedSpec, setResolvedSpec] = React.useState<any>(null);

  React.useEffect(() => {
    async function load() {
      if (!spec && !specUrl) {
        return undefined;
      }
      setResolvedSpec(null);
      const resolved = await loadAndBundleSpec(spec || specUrl!);
      setResolvedSpec(resolved);
    }
    load();
  }, [spec, specUrl]);

  const store = React.useMemo(() => {
    if (!resolvedSpec) return null;
    try {
      return new AppStore(resolvedSpec, specUrl, options);
    } catch (e) {
      if (onLoaded) {
        onLoaded(e);
      }
      throw e;
    }
  }, [resolvedSpec, specUrl, options]);

  React.useEffect(() => {
    if (store && onLoaded) {
      onLoaded();
    }
  }, [store, onLoaded]);

  return children({
    loading: !store,
    store,
  });
}
