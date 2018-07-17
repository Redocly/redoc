import memoize from 'memoize-one';
import { Component } from 'react';

import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
import { loadAndBundleSpec } from '../utils';

export interface StoreProviderProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;

  options?: RedocRawOptions;

  onLoaded?: (e?: Error) => void;

  children: (props: { loading: boolean; store?: AppStore }) => any;
}

export interface StoreProviderState {
  error?: Error;
  loading: boolean;
  resolvedSpec?: any;
  prevSpec?: any;
  prevSpecUrl?: string;
}

export class StoreProvider extends Component<StoreProviderProps, StoreProviderState> {
  static getDerivedStateFromProps(nextProps: StoreProviderProps, prevState: StoreProviderState) {
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

  state: StoreProviderState = {
    loading: true,
    resolvedSpec: null,
  };

  @memoize
  makeStore(spec, specUrl, options) {
    if (!spec) {
      return undefined;
    }
    return new AppStore(spec, specUrl, options);
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
