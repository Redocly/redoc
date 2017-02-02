const webpack = require('webpack');

const VERSION = JSON.stringify(require('../package.json').version);

const root = require('./helpers').root;
const BANNER =
`ReDoc - OpenAPI/Swagger-generated API Reference Documentation
-------------------------------------------------------------
  Version: ${VERSION}
  Repo: https://github.com/Rebilly/ReDoc`;

const IS_MODULE = process.env.IS_MODULE != null;

const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js');

const config = webpackMerge(commonConfig({
  IS_PRODUCTION: true,
  AOT: true
}), {
  devtool: 'source-map',

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
    rules: [
      {
        test: /\.ts$/,
        use: [
          'awesome-typescript-loader?{configFileName: "tsconfig.webpack.json"}',
          'angular2-template-loader',
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        negate_iife: false // for lazy v8
      },
      mangle: { screw_ie8 : true },
      output: {
        comments: false
      },
      sourceMap: true
    }),
    new webpack.BannerPlugin(BANNER)
  ]
})

if (IS_MODULE) {
  config.externals = {
    'jquery': 'jquery',
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
}

module.exports = config;
