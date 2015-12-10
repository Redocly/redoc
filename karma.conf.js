module.exports = function (config) {
    config.set({
        frameworks: ['phantomjs-shim', 'jspm', 'mocha', 'chai', 'sinon'],

        //load angular dependencies and browser polyfills
        files: [
          'node_modules/zone.js/dist/zone-microtask.js',
          'node_modules/babel-polyfill/dist/polyfill.js',
          'node_modules/reflect-metadata/Reflect.js'
        ],

        jspm: {
            config: 'system.config.js',
            loadFiles: ['tests/**/*.spec.js', 'lib/**/*.js'],
            serveFiles: ['tests/schemas/**/*.json'],
            nocache: true
        },

        proxies: {
            '/tests/': '/base/tests/',
            '/lib/': '/base/lib/',
            '/jspm_packages/': '/base/jspm_packages/',
            '/node_modules/': '/base/node_modules/',
        },
        reporters: ['mocha'],

        browsers: ['PhantomJS'],

        browserNoActivityTimeout: 60000
    });
}
