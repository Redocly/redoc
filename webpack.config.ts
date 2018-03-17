import * as webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

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

export default env => {
  env = env || {};

  let entry;

  if (env.lib) {
    entry = env.standalone ? ['./src/polyfills.ts', './src/standalone.tsx'] : './src/index.ts';
  } else {
    // playground or performance test
    entry = env.perf
      ? ['./benchmark/index.tsx'] // perf test
      : [
          // playground
          './src/polyfills.ts',
          './demo/playground/hmr-playground.tsx',
        ];
  }

  const HotReloaderRule = {
    test: /\.tsx?$/,
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-syntax-typescript',
          '@babel/plugin-syntax-decorators',
          '@babel/plugin-syntax-jsx',
          'react-hot-loader/babel',
        ],
      },
    },
  };

  const config: webpack.Configuration = {
    entry: entry,
    output: {
      filename: env.standalone ? 'redoc.standalone.js' : 'redoc.lib.js',
      path: __dirname + (env.lib ? '/bundles' : 'lib'),
    },

    devServer: {
      contentBase: __dirname + '/demo',
      host: '0.0.0.0',
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
      'node-fetch': 'null',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'awesome-typescript-loader',
            options: {
              module: env.perf ? 'esnext' : 'es2015',
            },
          },
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
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              minimize: true,
            },
          },
        },
        { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': env.prod ? '"production"' : '"development"',
        __REDOC_VERSION__: VERSION,
        __REDOC_REVISION__: REVISION,
        __REDOC_DEV__: env.prod ? 'false' : 'true',
      }),
      new webpack.NamedModulesPlugin(),
    ],
  };

  if (env.prod) {
    config.plugins!.push(new webpack.optimize.ModuleConcatenationPlugin());
  } else {
    (config.module as webpack.NewModule).rules.push(HotReloaderRule);
  }

  if (env.lib) {
    config.output!.library = 'Redoc';
    config.output!.libraryTarget = 'umd';

    if (!env.standalone) {
      config.externals = (context, request, callback) => {
        // ignore node-fetch dep of swagger2openapi as it is not used
        if (/node-fetch$/i.test(request)) return callback(null, 'var undefined');
        return nodeExternals(context, request, callback);
      };
    }
  } else {
    config.plugins!.push(
      new HtmlWebpackPlugin({
        template: env.perf ? './benchmark/index.html' : './demo/playground/index.html',
      }),
    );
  }

  return config;
};
