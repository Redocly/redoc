import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const VERSION = JSON.stringify(require('../package.json').version);
const REVISION = JSON.stringify(
  require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()
    .trim(),
);

export default {
  entry: __dirname + '/index.tsx',
  output: {
    filename: 'redoc-demo.bundle.js',
    path: __dirname + '/dist',
  },

  devServer: {
    contentBase: __dirname,
    watchContentBase: true,
    port: 8081,
    stats: 'errors-only',
  },

  devtool: 'eval',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  node: {
    fs: 'empty',
  },

  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { test: [/\.eot$/, /\.gif$/, /\.woff$/, /\.svg$/, /\.ttf$/], use: 'null-loader' },
      {
        test: /\.tsx?$/,
        use: [
          'react-hot-loader/webpack',
          {
            loader: 'ts-loader',
            options: {
              module: 'es2015',
            },
          },
        ],
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
          transpileOnly: true,
          instance: 'ts2js-transpiler-only',
          options: {
            allowJs: true,
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __REDOC_VERSION__: VERSION,
      __REDOC_REVISION__: REVISION,
      __REDOC_DEV__: false,
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: 'demo/index.html',
    }),
  ],
};
