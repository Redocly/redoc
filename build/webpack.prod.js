const webpack = require('webpack');

const VERSION = JSON.stringify(require('../package.json').version);

const root = require('./helpers').root;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: root(),
  devtool: 'cheap-module-source-map',

  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    root: root('lib'),
    descriptionFiles: ['package.json'],
    modules: [
      'node_modules',
      root('lib')
    ],
    alias: {
      http: 'stream-http',
      https: 'stream-http'
    }
  },
  externals: {
    "jquery": "jQuery"
  },
  node: {
    fs: "empty"
  },
  entry: {
    'redoc': ['./lib/polyfills.ts', './lib/vendor.ts', './lib/index.ts']
  },

  output: {
    path: root('dist'),
    filename: '[name].min.js',
    sourceMapFilename: '[name].min.map',
    library: 'Redoc',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'source-map'
    }],
    loaders: [{
      test: /\.ts$/,
      loader: 'awesome-typescript-loader',
      exclude: /(node_modules)/
    }, {
      test: /\.css$/,
      loaders: ['style', 'css?-import']
    }]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      },
      mangle: { screw_ie8 : true },
      output: {
        comments: false
      },
      sourceMap: true
    }),

    new webpack.DefinePlugin({
      'IS_PRODUCTION': true,
      'LIB_VERSION': VERSION
    })
  ],
}
