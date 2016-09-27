const webpack = require('webpack');

const VERSION = JSON.stringify(require('../package.json').version);

const root = require('./helpers').root;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BANNER =
`ReDoc - OpenAPI/Swagger-generated API Reference Documentation
-------------------------------------------------------------
  Version: ${VERSION}
  Repo: https://github.com/Rebilly/ReDoc`;

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
    'jquery': 'jQuery',
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
    loaders: [{
      enforce: 'pre',
      test: /\.js$/,
      loader: 'source-map-loader',
      exclude: [
        /node_modules/
      ]
    },{
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
    new webpack.BannerPlugin(BANNER),
    new webpack.DefinePlugin({
      'IS_PRODUCTION': true,
      'LIB_VERSION': VERSION
    })
  ],
}
