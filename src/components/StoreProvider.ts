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
  store?: AppStore;
}

export class StoreProvider extends Component<StoreProviderProps, StoreProviderState> {
  store: AppStore;

  private _resolvedSpec: OpenAPISpec;

  constructor(props: StoreProviderProps) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    const { specUrl, spec, options } = this.props;

    this.setState({
      loading: true,
    });

    try {
      this._resolvedSpec = await loadAndBundleSpec(spec || specUrl!);
      this.updateStore(this._resolvedSpec, specUrl, options);
    } catch (e) {
      this.setState({
        error: e,
      });
    }
  }

  updateStore(resolvedSpec, specUrl, options) {
    try {
      this.setState({
        loading: false,
        store: new AppStore(resolvedSpec, specUrl, options),
        error: undefined,
      });
    } catch (e) {
      this.setState({
        error: e,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.specUrl !== nextProps.specUrl || this.props.spec !== nextProps.spec) {
      setTimeout(() => this.load(), 0);
      return;
    }
    if (this.props.options !== nextProps.options && this._resolvedSpec) {
      this.updateStore(this._resolvedSpec, nextProps.specUrl, nextProps.options);
    }
  }

  setError(e?: Error) {
    this.setState({
      error: e,
    });
  }

  render() {
    if (this.state.error) {
      throw this.state.error;
    }
    return this.props.children(this.state);
  }
}
