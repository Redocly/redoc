import * as memoize from 'memoize-one/dist/memoize-one.cjs'; // fixme: https://github.com/alexreardon/memoize-one/issues/37
import { Component, createContext } from 'react';

import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
import { loadAndBundleSpec } from '../utils';

export interface StoreBuilderProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;

  options?: RedocRawOptions;

  onLoaded?: (e?: Error) => void;

  children: (props: { loading: boolean; store?: AppStore }) => any;
}

export interface StoreBuilderState {
  error?: Error;
  loading: boolean;
  resolvedSpec?: any;
  prevSpec?: any;
  prevSpecUrl?: string;
}

const { Provider, Consumer } = createContext<AppStore | undefined>(undefined);
export { Provider as StoreProvider, Consumer as StoreConsumer };

export class StoreBuilder extends Component<StoreBuilderProps, StoreBuilderState> {
  static getDerivedStateFromProps(nextProps: StoreBuilderProps, prevState: StoreBuilderState) {
    if (nextProps.specUrl !== prevState.prevSpecUrl || nextProps.spec !== prevState.prevSpec) {
      return {
        loading: true,
        resolvedSpec: null,
        prevSpec: nextProps.spec,
        prevSpecUrl: nextProps.specUrl,
      };
    }

    return null;
  }

  state: StoreBuilderState = {
    loading: true,
    resolvedSpec: null,
  };

  @memoize
  makeStore(spec, specUrl, options) {
    if (!spec) {
      return undefined;
    }
    try {
      return new AppStore(spec, specUrl, options);
    } catch (e) {
      if (this.props.onLoaded) {
        this.props.onLoaded(e);
      }
      throw e;
    }
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    if (this.state.resolvedSpec === null) {
      this.load();
    } else if (!this.state.loading && this.props.onLoaded) {
      // may run multiple time
      this.props.onLoaded();
    }
  }

  async load() {
    const { specUrl, spec } = this.props;
    try {
      const resolvedSpec = await loadAndBundleSpec(spec || specUrl!);
      this.setState({ resolvedSpec, loading: false });
    } catch (e) {
      if (this.props.onLoaded) {
        this.props.onLoaded(e);
      }
      this.setState({ error: e });
    }
  }

  render() {
    if (this.state.error) {
      throw this.state.error;
    }

    const { specUrl, options } = this.props;
    const { loading, resolvedSpec } = this.state;
    return this.props.children({
      loading,
      store: this.makeStore(resolvedSpec, specUrl, options),
    });
  }
}
