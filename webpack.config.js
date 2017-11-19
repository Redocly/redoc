const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = env => {
  env = env || {};

  let entry;

  if (env.bundle) {
    entry = env.standalone ? ['./src/polyfills.ts', './src/standalone.tsx'] : './src/index.ts';
  } else {
    // playground or performance test
    entry = env.perf
      ? ['./perf/index.tsx'] // perf test
      : [
          // playground
          'react-dev-utils/webpackHotDevClient',
          'react-hot-loader/patch',
          './demo/playground/hmr-playground.tsx',
        ];
  }

  const config = {
    entry: entry,
    output: {
      filename: env.standalone ? 'redoc.standalone.js' : 'redoc.lib.js',
      path: __dirname + (env.bundle ? '/bundles' : 'lib'),
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
    },

    node: {
      fs: 'empty',
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
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: true,
          },
        },
        { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': env.prod ? '"production"' : '"development"',
        __DEV__: env.prod ? 'false' : 'true',
      }),
      new webpack.NamedModulesPlugin(),
    ],
  };

  if (env.prod) {
    config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  }

  if (env.lib) {
    config.externals = nodeExternals({
      // bundle in moudules that need transpiling + non-js (e.g. css)
      whitelist: ['swagger2openapi', 'reftools', /\.(?!(?:jsx?|json)$).{1,5}$/i],
    });

    config.output.library = 'Redoc';
    config.output.libraryTarget = 'umd';
  } else {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './demo/playground/index.html',
      }),
    );
  }
  return config;
};
