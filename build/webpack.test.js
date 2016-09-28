const webpack = require('webpack');

const root = require('./helpers').root;
const VERSION = JSON.stringify(require('../package.json').version);


module.exports = {

  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.json', '.css'],
    alias: {
      http: 'stream-http',
      https: 'stream-http'
    }
  },
  externals: {
    "jquery": "jQuery",
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

  output: {
    path: root('dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
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
    },{
      test: /\.ts$/,
      loaders: [
        'awesome-typescript-loader'
      ]
    }, {
      test: /\.ts$/,
      loaders: [
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
    }, {
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
    new webpack.DefinePlugin({
      'IS_PRODUCTION': false,
      'LIB_VERSION': VERSION,
      'AOT': 'false'
    }),
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
    ])
  ],
}
