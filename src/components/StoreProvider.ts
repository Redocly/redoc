import { Component, Children } from 'react';
import * as PropTypes from 'prop-types';
import { AppStore, HistoryService } from '../services/';

interface SpecProps {
  specUrl?: string;
  spec?: object;
  store?: AppStore;
}

export class StoreProvider extends Component<SpecProps, { error?: Error }> {
  store: AppStore;

  static childContextTypes = {
    store: PropTypes.object.isRequired,
  };

  constructor(props: SpecProps) {
    super(props);
    this.state = {};

    this.store = props.store || new AppStore();

    if (!this.store.spec.loaded) {
      this.store.spec
        .load(props.spec! || props.specUrl)
        .then(() => {
          HistoryService.emit();
          this.setError();
        })
        .catch(e => this.setError(e));
    }
  }

  setError(e?: Error) {
    this.setState({
      error: e,
    });
  }

  getChildContext() {
    return { store: this.props.store || this.store };
  }

  render() {
    if (this.state.error) throw this.state.error;
    return Children.only(this.props.children);
  }
}
