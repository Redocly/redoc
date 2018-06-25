import memoize from 'memoize-one';
import { Component } from 'react';

import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
import { OpenAPISpec } from '../types';
import { loadAndBundleSpec } from '../utils';

export interface StoreProviderProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;

  options?: RedocRawOptions;

  children: (props: { loading: boolean; store?: AppStore }) => any;
}

export interface StoreProviderState {
  error?: Error;
  loading: boolean;
  spec?: any;
  prevSpecUrl?: string;
}

export class StoreProvider extends Component<StoreProviderProps, StoreProviderState> {
  static getDerivedStateFromProps(props, state: StoreProviderState) {
    if (props.specUrl !== state.prevSpecUrl) {
      return {
        spec: null,
        prevSpecUrl: props.specUrl,
      };
    }

    return null;
  }

  state: StoreProviderState = {
    loading: true,
    spec: null,
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
    if (this.props.spec === null) {
      this.load();
    }
  }

  async load() {
    const { specUrl, spec, options } = this.props;
    try {
      const resolvedSpec = await loadAndBundleSpec(spec || specUrl!);
      this.setState({ spec: resolvedSpec, loading: false });
    } catch (e) {
      this.setState({ error: e });
    }
  }

  render() {
    if (this.state.error) {
      throw this.state.error;
    }

    const { specUrl, options } = this.props;
    const { loading, spec } = this.state;
    return this.props.children({
      loading,
      store: this.makeStore(spec, specUrl, options),
    });
  }
}
