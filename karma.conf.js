module.exports = function (config) {
    config.set({
        frameworks: ['phantomjs-shim', 'jspm', 'jasmine', 'sinon', 'should'],
        preprocessors: {
          '.tmp/lib/**/!(*spec).js': ['babel', 'coverage']
        },
        babelPreprocessor: {
            options: {
                sourceMap: 'inline',
                "optional": [
                  "runtime",
                  "optimisation.modules.system",
                  "es7.decorators",
                  "es7.classProperties"
                ]
            },
            sourceFileName: function(file) {
              return file.originalPath;
            }
        },

        coverageReporter: {
            instrumenters: { isparta : require('isparta') },
            instrumenter: {
                '.tmp/lib/**/!(*spec).js': 'isparta'
            },
            dir: 'coverage/',
            reporters: [
                {type: 'html'},
                {type: 'lcov'},
                {type: 'json'}
            ]
        },
        client: {
          chai: {
            truncateThreshold: 0
          }
        },
        //load angular dependencies and browser polyfills
        files: [
          'node_modules/zone.js/dist/zone.js',
          'node_modules/zone.js/dist/fake-async-test.js',
          'node_modules/zone.js/dist/async-test.js',
          'node_modules/zone.js/dist/jasmine-patch.js',
          'node_modules/zone.js/dist/long-stack-trace-zone.js',
          'node_modules/babel-polyfill/dist/polyfill.js',
          './node_modules/reflect-metadata/Reflect.js',
          '.tmp/prismjs-bundle.js'
        ],

        jspm: {
            config: 'system.config.js',
            loadFiles: ['.tmp/tests/setup.js', '.tmp/tests/helpers.js', '.tmp/lib/**/*.js',
            '.tmp/tests/unit/*.js'],
            serveFiles: ['tests/schemas/**/*.json','tests/schemas/**/*.yml', 'lib/**/*.html',
            '.tmp/lib/**/*.json', '.tmp/*js', '.tmp/lib/**/*.css']
        },

        proxies: {
            '/.tmp/': '/base/.tmp/',
            '/tests/schemas': '/base/tests/schemas',
            '/lib/components/redoc/redoc-initial-styles.scss': '/base/.tmp/lib/components/Redoc/redoc-initial-styles.scss',
            '/lib/version.json': '/base/.tmp/lib/version.json',
            '/lib/': '/base/lib/',
            '/jspm_packages/': '/base/jspm_packages/',
            '/node_modules/': '/base/node_modules/'
        },
        reporters: ['mocha', 'coverage'],

        browsers: ['PhantomJS'],

        browserNoActivityTimeout: 60000
    });
}
