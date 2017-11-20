import * as React from 'react';
import * as PropTypes from 'prop-types';

import { RedocNormalizedOptions } from '../services/RedocNormalizedOptions';
import { ThemeInterface } from '../theme';

export interface RedocRawOptions {
  theme?: ThemeInterface;
  scrollYOffset?: number | string | Function;
}

export interface OptionsProviderProps {
  options: RedocRawOptions;
}

export class OptionsProvider extends React.Component<OptionsProviderProps> {
  static childContextTypes = {
    redocOptions: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      redocOptions: new RedocNormalizedOptions(this.props.options),
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
