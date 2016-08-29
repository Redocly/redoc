module.exports = function (config) {
  const testWebpackConfig = require('./build/webpack.test.js');
  const travis = process.env.TRAVIS;

  config.set({
    frameworks: ['phantomjs-shim', 'jasmine', 'sinon', 'should'],
    preprocessors: {
      './tests/spec-bundle.js': ['coverage', 'webpack', 'sourcemap']
    },

    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'html'},
        {type: 'lcov'},
        {type: 'json'},
        {type: 'text-summary'}
      ]
    },
    webpack: testWebpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
      state: true
    },
    client: {
      chai: {
        truncateThreshold: 0
      }
    },
    files: [
      { pattern: './tests/spec-bundle.js', watched: false },
      { pattern: 'tests/schemas/**/*.json', included: false },
      { pattern: 'tests/schemas/**/*.yml', included: false },
      { pattern: 'lib/**/*.html', included: false },
      { pattern: 'lib/**/*.css', included: false }
    ],

    proxies: {
      '/tests/schemas': '/base/tests/schemas',
      '/lib/': '/base/lib/',
      '/node_modules/': '/base/node_modules/'
    },
    colors: true,
    singleRun: true,
    reporters: travis ? ['mocha', 'coverage', 'coveralls'] : ['mocha', 'coverage'],

    browsers: ['PhantomJS'],

    browserNoActivityTimeout: 60000
  });
}
