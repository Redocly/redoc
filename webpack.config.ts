/* tslint:disable:no-implicit-dependencies */
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
import * as webpack from 'webpack';
import * as path from 'path';
import { webpackIgnore } from './config/webpack-utils';

const nodeExternals = require('webpack-node-externals')({
  // bundle in modules that need transpiling + non-js (e.g. css)
  allowlist: [
    'swagger2openapi',
    'marked',
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

export default (env: { standalone?: boolean; browser?: boolean } = {}) => ({
  entry: env.standalone ? ['./src/polyfills.ts', './src/standalone.tsx'] : './src/index.ts',
  output: {
    filename: env.standalone
      ? 'redoc.standalone.js'
      : env.browser
      ? 'redoc.browser.lib.js'
      : 'redoc.lib.js',
    path: path.join(__dirname, '/bundles'),
    library: 'Redoc',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    fallback: {
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer'),
      http: false,
      fs: path.resolve(__dirname, 'src/empty.js'),
      os: path.resolve(__dirname, 'src/empty.js'),
      tty: path.resolve(__dirname, 'src/empty.js'),
      url: require.resolve('url/'),
    },
  },
  performance: false,
  externalsPresets: env.standalone || env.browser ? {} : { node: true },
  externals: env.standalone
    ? {
        esprima: 'null',
        'node-fetch': 'null',
        'node-fetch-h2': 'null',
        yaml: 'null',
        url: 'null',
        'safe-json-stringify': 'null',
      }
    : (context, request, callback) => {
        // ignore node-fetch dep of swagger2openapi as it is not used
        if (/esprima|node-fetch|node-fetch-h2|\/yaml|safe-json-stringify|url$/i.test(request)) {
          return callback(null, 'var undefined');
        }
        return nodeExternals(context, request, callback);
      },

  module: {
    rules: [
      {
        test: /\.(tsx?|[cm]?js)$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015',
          tsconfigRaw: require('./tsconfig.json'),
        },
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'esbuild-loader',
            options: {
              minify: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __REDOC_VERSION__: VERSION,
      __REDOC_REVISION__: REVISION,
      'process.env': '{}',
      'process.platform': '"browser"',
      'process.stdout': 'null',
    }),
    new ForkTsCheckerWebpackPlugin({ logger: { infrastructure: 'silent', issues: 'console' } }),
    new webpack.BannerPlugin(BANNER),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    webpackIgnore(/js-yaml\/dumper\.js$/),
    env.standalone ? webpackIgnore(/^\.\/SearchWorker\.worker$/) : undefined,
  ].filter(Boolean),
});
