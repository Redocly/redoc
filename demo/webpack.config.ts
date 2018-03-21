import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as  CopyWebpackPlugin from 'copy-webpack-plugin';
import { resolve } from 'path';

const VERSION = JSON.stringify(require('../package.json').version);
const REVISION = JSON.stringify(
  require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim(),
);

function root(filename) {
  return resolve(__dirname + '/' + filename);
}

const tsLoader = env => ({
  loader: 'ts-loader',
  options: {
    compilerOptions: {
      module: env.bench ? 'esnext' : 'es2015',
    },
  },
});

const babelHotLoader = {
  loader: 'babel-loader',
  options: {
    plugins: [
      '@babel/plugin-syntax-typescript',
      '@babel/plugin-syntax-decorators',
      '@babel/plugin-syntax-jsx',
      'react-hot-loader/babel',
    ],
  },
};

export default (env: { playground?: boolean; bench?: boolean } = {}, { mode }) => ({
  entry: [
    root('../src/polyfills.ts'),
    root(
      env.playground
        ? 'playground/hmr-playground.tsx'
        : env.bench ? '../benchmark/index.tsx' : 'index.tsx',
    ),
  ],
  output: {
    filename: 'redoc-demo.bundle.js',
    path: root('dist'),
    globalObject: 'this',
  },

  devServer: {
    contentBase: __dirname,
    watchContentBase: true,
    port: 9090,
    disableHostCheck: true,
    stats: 'minimal',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  node: {
    fs: 'empty',
  },

  performance: false,

  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { test: [/\.eot$/, /\.gif$/, /\.woff$/, /\.svg$/, /\.ttf$/], use: 'null-loader' },
      {
        test: /\.tsx?$/,
        use: mode === 'production' ? [tsLoader(env)] : [tsLoader(env), babelHotLoader],
        exclude: ['node_modules'],
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true,
          },
        },
      },
      {
        test: /node_modules\/(swagger2openapi|reftools)\/.*\.js$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            instance: 'ts2js-transpiler-only',
            compilerOptions: {
              allowJs: true,
            },
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __REDOC_VERSION__: VERSION,
      __REDOC_REVISION__: REVISION,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: env.playground ? 'demo/playground/index.html' : 'demo/index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin([
      'demo/openapi.yaml'
    ])
  ],
});
