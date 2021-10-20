import * as webpack from 'webpack';

export function getBabelLoader({useBuiltIns, hot}: {useBuiltIns: boolean, hot?: boolean}) {
  return {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      sourceType: 'unambiguous',
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: useBuiltIns ? 'usage' : false,
            corejs: 3,
            exclude: ['transform-typeof-symbol'],
            targets: 'defaults',
            modules: false,
          },
        ],
        ['@babel/preset-react', { development: false, runtime: 'classic' }],
        '@babel/preset-typescript',
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: false }],
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: false,
            helpers: true,
            // eslint-disable-next-line import/no-internal-modules
            version: require('@babel/runtime/package.json').version,
            regenerator: true,
          },
        ],
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        hot ? 'react-hot-loader/babel' : undefined,
      ].filter(Boolean)
    },
  };
}

export function webpackIgnore(regexp) {
  return new webpack.NormalModuleReplacementPlugin(regexp, require.resolve('lodash/noop.js'));
}
