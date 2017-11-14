const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = env => {
  env = env || {};

  const config = {
    entry: env.prod
      ? env.perf ? ['./perf/index.tsx'] : ['./src/hmr-playground.tsx']
      : [
          'react-dev-utils/webpackHotDevClient',
          'react-hot-loader/patch',
          './src/hmr-playground.tsx',
        ],

    output: {
      filename: 'redoc.bundle.js',
      path: __dirname + '/lib',
    },

    devServer: {
      contentBase: __dirname + '/demo',
      watchContentBase: true,
      port: 9090,
      stats: 'errors-only',
    },

    devtool: 'source-map',

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      alias: {
        // react: 'preact-compat',
        // 'react-dom': 'preact-compat',
        // 'create-react-class': 'preact-compat/lib/create-react-class',
        // 'preact-compat': 'preact-compat/dist/preact-compat',
        // 'react-deep-force-update': 'preact-deep-force-update',
      },
    },

    node: {
      fs: 'empty',
      crypto: 'empty',
    },

    externals: {
      esprima: 'esprima',
      'node-fetch': 'fetch',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
          exclude: ['node_modules'],
        },
        {
          test: /node_modules\/(swagger2openapi|reftools)\/.*\.js$/,
          use: {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: true,
              allowJs: true,
              instance: 'ts2js-transpiler-only',
            },
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true,
                },
              },
            ],
          }),
        },
        // { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': env.prod ? '"production"' : '"development"',
        __DEV__: env.prod ? 'false' : 'true',
      }),
      new ExtractTextPlugin({
        filename: 'redoc.css',
        allChunks: true,
      }),
      new HtmlWebpackPlugin({
        template: './demo/index.html',
      }),
      new webpack.NamedModulesPlugin(),
    ],
  };
  if (env.prod) {
    config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  } else {
    config.plugins.push(new DashboardPlugin());
  }
  return config;
};
