import * as React from 'react';
import * as PropTypes from 'prop-types';

import { RedocNormalizedOptions } from '../services/RedocNormalizedOptions';

export interface OptionsProviderProps {
  options: RedocNormalizedOptions;
}

export class OptionsProvider extends React.Component<OptionsProviderProps> {
  static childContextTypes = {
    redocOptions: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      redocOptions: this.props.options,
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

export class ComponentWithOptions<P = {}, S = {}> extends React.Component<P, S> {
  static contextTypes = {
    redocOptions: PropTypes.object,
  };

  get options(): RedocNormalizedOptions {
    return this.context.redocOptions || {};
  }
}
