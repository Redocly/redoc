module.exports = function (config) {
    var travis = process.env.TRAVIS;
    config.set({
        frameworks: ['phantomjs-shim', 'jspm', 'jasmine', 'sinon', 'should'],
        preprocessors: {
          'lib/**/!(*spec).js': ['babel', 'regex', 'coverage']
        },

        regexPreprocessor: {
          rules: [
            [ /'\.(.*?)\.css'/g, '\'.tmp$1.css\'']
          ]
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
                'lib/**/!(*spec).js': 'isparta'
            },
            dir: 'coverage/',
            reporters: [
                {type: 'html'},
                {type: 'text-summary'},
                {type: 'lcov'}
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
          './node_modules/reflect-metadata/Reflect.js'
        ],

        jspm: {
            config: 'system.config.js',
            loadFiles: ['tests/setup.js', 'tests/helpers.js', 'tests/unit/*.spec.js', 'lib/**/*.js'],
            serveFiles: ['tests/schemas/**/*.json','tests/schemas/**/*.yml', 'lib/**/*.html', '.tmp/*js', '.tmp/lib/**/*.css'],
            nocache: true
        },

        proxies: {
            '/tests/': '/base/tests/',
            '/lib/components/Redoc/redoc-loading-styles.css': '/base/.tmp/lib/components/Redoc/redoc-loading-styles.css',
            '/lib/': '/base/lib/',
            '/jspm_packages/': '/base/jspm_packages/',
            '/node_modules/': '/base/node_modules/',
            '/prismjs-bundle.js': '/base/.tmp/prismjs-bundle.js',
            '/.tmp/': '/base/.tmp/'
        },
        reporters: travis ? ['mocha', 'coverage', 'coveralls'] : ['mocha', 'coverage'],

        browsers: ['PhantomJS'],

        browserNoActivityTimeout: 60000
    });
}
