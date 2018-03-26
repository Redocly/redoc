import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as path from 'path';

const nodeExternals = require('webpack-node-externals')({
  // bundle in moudules that need transpiling + non-js (e.g. css)
  whitelist: ['swagger2openapi', /reftools/, /\.(?!(?:jsx?|json)$).{1,5}$/i],
});

const VERSION = JSON.stringify(require('./package.json').version);
const REVISION = JSON.stringify(
  require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim(),
);

const BANNER = `ReDoc - OpenAPI/Swagger-generated API Reference Documentation
-------------------------------------------------------------
  Version: ${VERSION}
  Repo: https://github.com/Rebilly/ReDoc`;

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
      }
    : (context, request, callback) => {
        // ignore node-fetch dep of swagger2openapi as it is not used
        if (/node-fetch$/i.test(request)) return callback(null, 'var undefined');
        if (/esprima$/i.test(request)) return callback(null, 'var undefined');
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
              },
            },
          },
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                '@babel/plugin-syntax-typescript',
                '@babel/plugin-syntax-decorators',
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
        exclude: ['node_modules'],
      },
      {
        test: /node_modules\/(swagger2openapi|reftools)\/.*\.js$/,
        use: {
          loader: 'ts-loader',
          options: {
            instance: 'ts2js-transpiler-only',
            transpileOnly: true,
            compilerOptions: {
              allowJs: true,
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
            minimize: true,
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
    new ForkTsCheckerWebpackPlugin({ silent: true }),
    new webpack.BannerPlugin(BANNER),
    ignore(/js-yaml\/dumper\.js$/),
    ignore(/json-schema-ref-parser\/lib\/dereference\.js/),
  ],
});

function ignore(regexp) {
  return new webpack.NormalModuleReplacementPlugin(regexp, require.resolve('lodash/noop.js'));
}
