const webpack = require('webpack');

const VERSION = JSON.stringify(require('../package.json').version);

const root = require('./helpers').root;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BANNER =
`ReDoc - OpenAPI/Swagger-generated API Reference Documentation
-------------------------------------------------------------
  Version: ${VERSION}
  Repo: https://github.com/Rebilly/ReDoc`;

const IS_MODULE = process.env.IS_MODULE != null;

const config = {
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
    'redoc': IS_MODULE ? ['./lib/vendor.ts', './lib/redoc.module.ts'] : ['./lib/polyfills.ts', './lib/vendor.ts', './lib/index.ts']
  },

  output: {
    path: root('dist'),
    filename: IS_MODULE ? '[name]-module.js' : '[name].min.js',
    sourceMapFilename: IS_MODULE ? '[name]-module.map' : '[name].min.map',
    library: 'Redoc',
    libraryTarget: 'umd',
    umdNamedDefine: true
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
      loader: 'awesome-typescript-loader',
      exclude: /(node_modules)/,
      query: IS_MODULE ? {
        noEmitHelpers: false,
      } : {}
    }, {
      test: /lib[\\\/].*\.css$/,
      loaders: ['raw-loader'],
      exclude: [/redoc-initial-styles\.css$/]
    }, {
      test: /\.css$/,
      loaders: ['style', 'css?-import'],
      exclude: [/lib[\\\/](?!.*redoc-initial-styles).*\.css$/]
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
      'LIB_VERSION': VERSION,
      'AOT': true
    })
  ],
}

if (IS_MODULE) {
  config.externals = {
    'jquery': 'jQuery',
    'esprima': 'esprima', // optional dep of ys-yaml not needed for redoc
    '@angular/platform-browser-dynamic': '@angular/platform-browser-dynamic',
    '@angular/platform-browser': '@angular/platform-browser',
    '@angular/core': '@angular/core',
    '@angular/common': '@angular/common',
    '@angular/forms': '@angular/forms',
    'core-js': 'core-js',
    'rxjs': 'rxjs',
    'zone.js/dist/zone': 'zone.js/dist/zone'
  };

  config.module.rules.push({
    test: /\.ts$/,
    loader: 'angular2-template-loader',
    exclude: [/\.(spec|e2e)\.ts$/]
  });

  config.module.rules.push({
    test: /\.html$/,
    loader: 'raw-loader'
  });
}

module.exports = config;
