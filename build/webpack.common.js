const webpack = require('webpack');

const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const StringReplacePlugin = require("string-replace-webpack-plugin");
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ngcWebpack = require('ngc-webpack');

const VERSION = JSON.stringify(require('../package.json').version);

const root = require('./helpers').root;

module.exports = function (options) {
  const conf = {
    performance: { hints: false },

    output: {
      path: root('dist'),
      filename: '[name].js',
      sourceMapFilename: '[name].[id].map',
      chunkFilename: '[id].chunk.js'
    },

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

    module: {
      exprContextCritical: false,
      rules: [
        {
          enforce: 'pre',
          test: /\.ts$/,
          exclude: [
            /node_modules/
          ],
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /styleUrls:\s*\[\s*'([\w\.\/-]*)\.css'\s*\][\s,]*$/gm,
                replacement: function (match, p1, offset, string) {
                  return `styleUrls: ['${p1}.scss'],`;
                }
              },
              {
                pattern: /(\.\/components\/Redoc\/redoc-initial-styles\.css)/gm,
                replacement: function (match, p1, offset, string) {
                  return p1.replace('.css', '.scss');
                }
              }
            ]
          })
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            /node_modules/
          ]
        },
        {
          test: /\.json$/,
          use: 'json-loader'
        },
        {
          test: /lib[\\\/].*\.css$/,
          loaders: ['raw-loader'],
          exclude: [/redoc-initial-styles\.css$/]
        }, {
          test: /\.css$/,
          loaders: ['style-loader', 'css-loader?-import'],
          exclude: [/lib[\\\/](?!.*redoc-initial-styles).*\.css$/]
        },
        {
          test: /lib[\\\/].*\.scss$/,
          loaders: ['raw-loader', "sass-loader"],
          exclude: [/redoc-initial-styles\.scss$/]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader?-import',
            'sass-loader'
          ],
          exclude: [/lib[\\\/](?!.*redoc-initial-styles).*\.scss$/]
        },
        {
          test: /\.html$/,
          loader: 'raw-loader'
        }
      ],

    },

    plugins: [
      new CheckerPlugin(),
      new webpack.DefinePlugin({
        'IS_PRODUCTION': options.IS_PRODUCTION,
        'LIB_VERSION': VERSION,
        'AOT': options.AOT
      }),

      new StringReplacePlugin()
    ],
    node: {
      global: true,
      crypto: 'empty',
      fs: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  };

  if (options.AOT) {
    conf.plugins.push(
      new ngcWebpack.NgcWebpackPlugin({
        disable: !options.AOT,
        tsConfig: root('tsconfig.webpack.json'),
        resourceOverride: root('build/resource-override.js')
      })
    );
  }

  return conf;
}
