const webpack = require('webpack');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const root = require('./helpers').root;
const VERSION = JSON.stringify(require('../package.json').version);
const IS_PRODUCTION = process.env.NODE_ENV === "production";
// TODO Refactor common parts of config

module.exports = {
  context: root(),
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.js', '.json', '.css'],
    alias: {
      http: 'stream-http',
      https: 'stream-http'
    }
  },
  externals: {
    'jquery': 'jquery',
    'esprima': 'esprima' // optional dep of ys-yaml not needed for redoc
  },
  node: {
    fs: "empty",
    crypto: "empty",
    global: true,
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  },
  entry: {
    'redoc': './lib/index.ts',
    'vendor': './lib/vendor.ts',
    'polyfills': './lib/polyfills.ts'
  },

  devServer: {
    outputPath: root('dist'),
    watchOptions: {
      poll: true
    },
    port: 9000,
    hot: false,
    stats: 'errors-only'
  },

  output: {
    path: root('dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].[id].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    exprContextCritical: false,
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: [
        /node_modules/
      ]
    }, {
      test: /\.ts$/,
      loaders: [
        'awesome-typescript-loader',
        'angular2-template-loader'
      ],
      exclude: [/\.(spec|e2e)\.ts$/]
    }, {
      test: /lib[\\\/].*\.css$/,
      loaders: ['raw-loader'],
      exclude: [/redoc-initial-styles\.css$/]
    }, {
      test: /\.css$/,
      loaders: ['style', 'css?-import'],
      exclude: [/lib[\\\/](?!.*redoc-initial-styles).*\.css$/]
    }, {
      test: /\.html$/,
      loader: 'raw-loader'
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'polyfills'],
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      'IS_PRODUCTION': IS_PRODUCTION,
      'LIB_VERSION': VERSION,
      'AOT': IS_PRODUCTION
    }),

    new ForkCheckerPlugin()
  ],
}
