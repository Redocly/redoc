import { Component } from 'react';

import { AppStore } from '../services/';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';
import { loadAndBundleSpec } from '../utils';

interface StoreProviderProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;

  options?: RedocRawOptions;

  children: (props: { loading: boolean; store?: AppStore }) => any;
}

interface StoreProviderState {
  error?: Error;
  loading: boolean;
  store?: AppStore;
}

export class StoreProvider extends Component<StoreProviderProps, StoreProviderState> {
  store: AppStore;

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
      const resolvedSpec = await loadAndBundleSpec(spec || specUrl!);
      this.setState({
        loading: false,
        store: new AppStore(resolvedSpec, specUrl, options),
      });
    } catch (e) {
      this.setState({
        error: e,
      });
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
