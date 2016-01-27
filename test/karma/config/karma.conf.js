(function () {
    'use strict';
    
    module.exports = function (config) {
        config.set({
                frameworks: ['jasmine'],
                files: [
                    'node_modules/angular/angular.js',
                    'node_modules/angular-resource/angular-resource.js',
                    'node_modules/angular-mocks/angular-mocks.js',
                    'src/js/*.js',
                    'src/js/**/*.js',
                    'src/partials/**/*.html',
                    'test/karma/specs/**/*.js'
                ],
                exclude: [],
                plugins: [
                    'karma-jasmine',
                    'karma-junit-reporter',
                    'karma-coverage',
                    'karma-phantomjs-launcher',
                    'karma-ng-html2js-preprocessor'
                ],
                reporters: ['progress', 'coverage', 'junit'],
                preprocessors: {
                    'src/partials/**/*.html': 'ng-html2js',
                    'src/**/*.js': 'coverage'
                },
                ngHtml2JsPreprocessor: {
                    stripPrefix: 'src/',
                    moduleName: 'templateCache'
                },
                junitReporter: {
                    outputDir: 'results/karma'
                },
                coverageReporter: {
                    reporters: [
                        {type: 'lcov', dir: 'results/karma-coverage'},
                    ]
                },
                colors: true,
                logLevel: config.LOG_INFO,
                autoWatch: true,
                browsers: ['PhantomJS'],
                captureTimeout: 10000,
                singleRun: false
            }
        );
    };
})();