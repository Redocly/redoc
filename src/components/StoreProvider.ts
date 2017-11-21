import { Component } from 'react';

import { AppStore } from '../services/';
import { loadAndBundleSpec } from '../utils';
import { RedocRawOptions } from '../services/RedocNormalizedOptions';

interface SpecProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;

  options?: RedocRawOptions;

  children?: any;
}

interface SpecState {
  error?: Error;
  loading: boolean;
  store?: AppStore;
}

export class StoreProvider extends Component<SpecProps, SpecState> {
  store: AppStore;

  constructor(props: SpecProps) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    let { specUrl, spec, options } = this.props;

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
    if (this.state.error) throw this.state.error;
    return this.props.children(this.state);
  }
}
