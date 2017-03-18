(function () {
    'use strict';

    module.exports = function (config) {
        config.set({
                frameworks: ['jasmine'],
                files: [
                    'node_modules/angular/angular.js',
                    'node_modules/angular-resource/angular-resource.js',
                    'node_modules/angular-mocks/angular-mocks.js',
                    'app/todo.module.js',
                    'app/todo/*.js',
                    'app/todo/*.tpl.html',
                    'app/todo/*.spec.js'
                ],
                exclude: [
                    'app/todo/*.po.js',
                    'app/todo/*.steps.js'
                ],
                plugins: [
                    'karma-jasmine',
                    'karma-junit-reporter',
                    'karma-coverage',
                    'karma-phantomjs-launcher',
                    'karma-ng-html2js-preprocessor'
                ],
                reporters: ['progress', 'coverage', 'junit'],
                preprocessors: {
                    'app/todo/*.tpl.html': 'ng-html2js',
                    'app/**/*.js': 'coverage'
                },
                ngHtml2JsPreprocessor: {
                    stripPrefix: 'app/',
                    moduleName: 'templateCache'
                },
                junitReporter: {
                    outputDir: '.results/karma'
                },
                coverageReporter: {
                    reporters: [
                        {type: 'lcov', dir: '.results/karma-coverage'},
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