import * as webpack from 'webpack';

export function webpackIgnore(regexp) {
  return new webpack.NormalModuleReplacementPlugin(regexp, require.resolve('lodash.noop'));
}
