const webpack = require('webpack');

const root = require('./helpers').root;
const path = require('path');

const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig({
  IS_PRODUCTION: true,
  AOT: false
}), {
  devtool: 'inline-source-map',

  module: {
    exprContextCritical: false,
    rules: [
    {
      test: /\.ts$/,
      use: 'awesome-typescript-loader'
    },
    {
      test: /\.ts$/,
      use: [
        'angular2-template-loader',
      ],
      exclude: [/\.(spec|e2e)\.ts$/]
    },
    {
      /**
       * Instruments JS files with Istanbul for subsequent code coverage reporting.
       * Instrument only testing sources.
       *
       * See: https://github.com/deepsweet/istanbul-instrumenter-loader
       */
      enforce: 'post',
      test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
      include: root('lib'),
      exclude: [
        /\.(e2e|spec)\.ts$/,
        /node_modules/
      ]
    }]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
			test: /\.ts$/,
      sourceMap: false,
      inlineSourceMap: true,
      removeComments: true,
      module: "commonjs"
		}),
    // ignore changes during tests
    new webpack.WatchIgnorePlugin([
      /[\\\/]ReDoc$/i, // ignore change of ReDoc folder itself
      /node_modules[\\\/].*$/,
      /\.tmp[\\\/].*$/,
      /dist[\\\/].*$/,
      /(?:[^\\\/]*(?:[\\\/]|$))*[^\\\/]*\.css$/ // ignore css files
    ]),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.resolve(__dirname, '../src')
    )
  ],
})
