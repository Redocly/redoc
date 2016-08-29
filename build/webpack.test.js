const webpack = require('webpack');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const root = require('./helpers').root;
const VERSION = JSON.stringify(require('../package.json').version);


module.exports = {
  //context: root(),
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
    root: root('lib'),
    descriptionFiles: ['package.json'],
    modules: [
      'node_modules',
      root('lib'),
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

  output: {
    path: root('dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'source-map'
    }],
    loaders: [ {
      test: /\.ts$/,
      loaders: [
        'awesome-typescript-loader'
      ],
      query: {
        "sourceMap": false,
        "inlineSourceMap": true,
        "removeComments": true,
        "module": "commonjs"
      }
    }, {
      test: /\.ts$/,
      loaders: [
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
    }],
    postLoaders: [

      /**
       * Instruments JS files with Istanbul for subsequent code coverage reporting.
       * Instrument only testing sources.
       *
       * See: https://github.com/deepsweet/istanbul-instrumenter-loader
       */
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: root('lib'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }

    ]
  },


  plugins: [

    new webpack.DefinePlugin({
      'IS_PRODUCTION': false,
      'LIB_VERSION': VERSION
    }),

    new ForkCheckerPlugin()
  ],
}
