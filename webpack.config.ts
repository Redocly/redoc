/* tslint:disable:no-implicit-dependencies */
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import * as webpack from 'webpack';

import * as path from 'path';

const nodeExternals = require('webpack-node-externals')({
  // bundle in modules that need transpiling + non-js (e.g. css)
  allowlist: [
    'swagger2openapi',
    /reftools/,
    'oas-resolver',
    'oas-kit-common',
    'oas-schema-walker',
    /\.(?!(?:jsx?|json)$).{1,5}$/i,
  ],
});

const VERSION = JSON.stringify(require('./package.json').version);
let REVISION;

try {
  REVISION = JSON.stringify(
    require('child_process').execSync('git rev-parse --short HEAD').toString().trim(),
  );
} catch (e) {
  console.error('Skipping REDOC_REVISION');
}

const BANNER = `ReDoc - OpenAPI/Swagger-generated API Reference Documentation
-------------------------------------------------------------
  Version: ${VERSION}
  Repo: https://github.com/Redocly/redoc`;

export default (env: { standalone?: boolean } = {}, { mode }) => ({
  entry: env.standalone ? ['./src/polyfills.ts', './src/standalone.tsx'] : './src/index.ts',
  output: {
    filename: env.standalone ? 'redoc.standalone.js' : 'redoc.lib.js',
    path: path.join(__dirname, '/bundles'),
    library: 'Redoc',
    libraryTarget: 'umd',
    globalObject: 'this',
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  node: {
    fs: 'empty',
  },

  performance: false,

  optimization: {
    minimize: !!env.standalone,
  },

  externals: env.standalone
    ? {
        esprima: 'esprima',
        'node-fetch': 'null',
        'node-fetch-h2': 'null',
        yaml: 'null',
        'safe-json-stringify': 'null',
      }
    : (context, request, callback) => {
        // ignore node-fetch dep of swagger2openapi as it is not used
        if (/esprima|node-fetch|node-fetch-h2|yaml|safe-json-stringify$/i.test(request)) {
          return callback(null, 'var undefined');
        }
        return nodeExternals(context, request, callback);
      },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'es2015',
                declaration: false,
              },
            },
          },
          {
            loader: 'babel-loader',
            options: {
              generatorOpts: {
                decoratorsBeforeExport: true,
              },
              plugins: [
                ['@babel/plugin-syntax-typescript', { isTSX: true }],
                ['@babel/plugin-syntax-decorators', { legacy: true }],
                '@babel/plugin-syntax-jsx',
                [
                  'babel-plugin-styled-components',
                  {
                    minify: true,
                    displayName: mode !== 'production',
                  },
                ],
              ],
            },
          },
        ],
        exclude: [/node_modules/],
      },
      {
        test: /node_modules\/(swagger2openapi|reftools|oas-resolver|oas-kit-common|oas-schema-walker)\/.*\.js$/,
        use: {
          loader: 'ts-loader',
          options: {
            instance: 'ts2js-transpiler-only',
            transpileOnly: true,
            compilerOptions: {
              allowJs: true,
              declaration: false,
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: {
            sourceMap: false,
          },
        },
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __REDOC_VERSION__: VERSION,
      __REDOC_REVISION__: REVISION,
    }),
    new ForkTsCheckerWebpackPlugin({ logger: { infrastructure: 'silent', issues: 'console' } }),
    new webpack.BannerPlugin(BANNER),
    ignore(/js-yaml\/dumper\.js$/),
    ignore(/json-schema-ref-parser\/lib\/dereference\.js/),
    env.standalone ? ignore(/^\.\/SearchWorker\.worker$/) : ignore(/$non-existing^/),
  ],
});

function ignore(regexp) {
  return new webpack.NormalModuleReplacementPlugin(regexp, require.resolve('lodash/noop.js'));
}
