const webpack = require('webpack');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const root = require('./helpers').root;
const VERSION = JSON.stringify(require('../package.json').version);

// TODO Refactor common parts of config

module.exports = {
  context: root(),
  devtool: 'cheap-module-source-map',
  debug: false,

  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    root: root('lib'),
    descriptionFiles: ['package.json'],
    modules: [
      'node_modules',
      root('lib')
    ],
    alias: {
      './lib/bootstrap': root('lib/bootstrap.dev'),
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
    hot: true,
    stats: {
      modules: false,
      cached: false,
      chunk: false
    }
  },

  output: {
    path: root('dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    loaders: [{
      test: /\.ts$/,
      loaders: [
        'awesome-typescript-loader',
        'angular2-template-loader'
      ],
      exclude: [/\.(spec|e2e)\.ts$/]
    },{
      test: /lib\/.*\.css$/,
      loaders: ['raw-loader'],
      exclude: [/redoc-initial-styles\.css$/]
    },{
      test: /\.css$/,
      loaders: ['style', 'css?-import'],
      exclude: [/lib\/(?!.*redoc-initial-styles).*\.css$/]
    },{
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
      'IS_PRODUCTION': false,
      'LIB_VERSION': VERSION
    }),

    new ForkCheckerPlugin()
  ],
}
