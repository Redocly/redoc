module.exports = function(config) {
  const testWebpackConfig = require('./build/webpack.test.js');
  const travis = process.env.TRAVIS;

  config.set({
    frameworks: ['jasmine', 'sinon', 'should'],
    preprocessors: {
      './tests/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'],
    },

    coverageReporter: {
      type: 'in-memory',
    },

    remapCoverageReporter: {
      'text-summary': null,
      'text-lcov': './coverage/lcov.info',
      html: './coverage/html',
    },
    webpack: testWebpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
      state: true,
    },
    client: {
      chai: {
        truncateThreshold: 0,
      },
    },
    files: [
      { pattern: './tests/spec-bundle.js', watched: false },
      { pattern: 'tests/schemas/**/*.json', included: false },
      { pattern: 'tests/schemas/**/*.yml', included: false },
      { pattern: 'lib/**/*.html', included: false },
    ],

    proxies: {
      '/tests/schemas': '/base/tests/schemas',
      '/lib/': '/base/lib/',
      '/node_modules/': '/base/node_modules/',
    },
    colors: true,
    singleRun: true,
    reporters: travis
      ? ['mocha', 'coverage', 'remap-coverage', 'coveralls']
      : ['mocha', 'coverage', 'remap-coverage'],

    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },

    browserNoActivityTimeout: 60000,
  });
};
