(function () {
    'use strict';

    module.exports = function (grunt) {
        require('load-grunt-tasks')(grunt);
        require('time-grunt')(grunt);
        const serveStatic = require('serve-static');

        grunt.initConfig({
            clean: {
                mocking: ['.mocking'],
                results: ['.results'],
                instrumented: ['.instrumented']
            },
            portPick: {
                options: {
                    port: 9900,
                    limit: 9
                },
                connectRuntime: {
                    targets: [
                        'connect.runtime.options.port'
                    ]
                },
                connectTest: {
                    targets: [
                        'connect.test.options.port'
                    ]
                },
                protractorCucumber: {
                    targets: [
                        'protractor_coverage.cucumberlocal.options.collectorPort',
                        'protractor_coverage.cucumberlocal.options.args.params.collectorPort',
                        'protractor_coverage.cucumbertravis.options.collectorPort',
                        'protractor_coverage.cucumbertravis.options.args.params.collectorPort'
                    ]
                }
            },
            ngApimock: {
                options: {
                    defaultOutputDir: '.mocking',
                    defaultPassThrough: []
                },
                mock: {
                    src: 'test/mocks',
                    moduleName: 'todo'
                }
            },
            connect: {
                options: {
                    hostname: '*'
                },
                runtime: {
                    options: {
                        port: 0,
                        open: true,
                        livereload: 0,
                        middleware: function (connect) {
                            grunt.log.ok('Mocking has been enabled and can located at /mocking');
                            return [
                                connect().use('/node_modules', serveStatic('node_modules')),
                                connect().use('/mocking', serveStatic('.mocking')),
                                connect().use('/', serveStatic('app')),
                                connect().use(require('ng-apimock/lib/utils').ngApimockRequest)
                            ];
                        }
                    }
                },
                test: {
                    options: {
                        port: 0,
                        open: false,
                        middleware: function (connect) {
                            return [
                                connect().use('/node_modules', serveStatic('node_modules')),
                                connect().use('/', serveStatic('.instrumented/app')),
                                connect().use('/', serveStatic('app')),
                                connect().use('/', serveStatic('test/protractor')),
                                connect().use(require('ng-apimock/lib/utils').ngApimockRequest)
                            ];
                        }
                    }
                }
            },
            watch: {
                js: {
                    files: ['src/{,*/}*.js']
                },
                html: {
                    files: ['src/index.html']
                }
            },
            instrument: {
                files: 'app/**/*.js',
                options: {
                    basePath: '.instrumented',
                    lazy: false
                }
            },
            protractor_coverage: {
                options: {
                    keepAlive: true,
                    noColor: false
                },
                cucumberlocal: {
                    options: {
                        collectorPort: 0,
                        noInject: true, // needed for cucumber
                        coverageDir: '.results/protractor-coverage/cucumber',
                        args: {
                            seleniumAddress: 'http://localhost:4444/wd/hub',
                            params: {
                                resultsDir: '.results/protractor/cucumber',
                                testDir: 'test/protractor',
                                collectorPort: 0
                            },
                            baseUrl: 'http://localhost:<%= connect.test.options.port %>',
                            specs: [
                                'app/**/*.feature'
                            ]
                        }
                    },
                    configFile: 'test/protractor/config/protractor-cucumber.conf.js'
                },
                cucumbertravis: {
                    options: {
                        collectorPort: 0,
                        noInject: true, // needed for cucumber
                        coverageDir: '.results/protractor-coverage/cucumber',
                        args: {
                            params: {
                                resultsDir: '.results/protractor/cucumber',
                                testDir: 'test/protractor',
                                collectorPort: 0
                            },
                            baseUrl: 'http://localhost:<%= connect.test.options.port %>',
                            specs: [
                                'app/**/*.feature'
                            ]
                        }
                    },
                    configFile: 'test/protractor/config/protractor-cucumber-travis.conf.js'
                }
            },
            makeReport: {
                src: '.results/protractor-coverage/**/*.json',
                options: {
                    type: 'lcov',
                    dir: '.results/protractor-coverage',
                    print: 'detail'
                }
            },
            jshint: {
                report: {
                    options: {
                        jshintrc: '.jshintrc',
                        reporter: require('jshint-stylish')
                    },
                    files: {
                        src: ['app/**/*.js', '!app/**/*.spec.js', '!app/**/*.steps.js', '!app/**/*.po.js']
                    }
                }
            },
            karma: {
                options: {
                    singleRun: true,
                    reporters: ['progress', 'coverage', 'junit']
                },
                unit: {
                    basePath: process.cwd(),
                    configFile: 'karma.conf.js'
                }
            }
        });

        grunt.registerTask('serve', 'Serve the app using the distribution .', [
            'clean',
            'portPick',
            'ngApimock',
            'connect:runtime',
            'watch'
        ]);

        grunt.registerTask('test', 'Execute the tests.', function (environment) {
            const DEFAULT_ENV = 'local';
            if (environment === undefined) {
                environment = DEFAULT_ENV;
            }

            grunt.task.run([
                'clean',
                'portPick',
                'ngApimock',
                'force:on',
                'jshint',
                'karma',
                'instrument',
                'connect:test',
                'protractor_coverage:cucumber' + environment,
                'makeReport',
                'force:reset'
            ]);
        });

        grunt.registerTask('default', 'Default task', [
            'local'
        ]);

        grunt.registerTask('local', 'Run tests locally', [
            'test'
        ]);
        grunt.registerTask('travis', 'Run tests on Travis CI', [
            'test:travis'
        ]);
    };

})();