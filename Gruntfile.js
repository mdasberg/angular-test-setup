'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var serveStatic = require('serve-static'),
        path = require('path'),
        tmp = '.tmp';

    var config = {
        hosts: {
            runtime: 'localhost',
            fqdn: 'localhost',
            seleniumAddress: 'http://localhost:4444/wd/hub'
        },
        paths: {
            tmp: tmp,
            src: 'src',
            test: 'test',
            results: tmp + '/results',
            instrumented: tmp + '/instrumented',
            config: 'config',
            build: 'dist'
        }
    };

    grunt.initConfig({
        config: config,
        clean: {
            files: [
                '<%=config.paths.tmp%>'
            ]
        },
        instrument: {
            files: '<%=config.paths.src%>/**/*.js',
            options: {
                basePath: '<%=config.paths.instrumented%>',
                lazy: false
            }
        },
        portPick: {
            options: {
                port: 9900,
                limit: 9
            },
            connectSource: {
                targets: [
                    'connect.source.options.port'
                ]
            },
            connectTest: {
                targets: [
                    'connect.test.options.port'
                ]
            },
            watch: {
                targets: [
                    'watch.options.livereload',
                    'connect.source.options.livereload',
                ]
            },
            protractorJasmine: {
                targets: [
                    'protractor_coverage.jasmine2.options.collectorPort'
                ]
            },
            protractorCucumber: {
                targets: [
                    'protractor_coverage.cucumber.options.collectorPort',
                    'protractor_coverage.cucumber.options.args.params.collectorPort'
                ]
            }
        },
        connect: {
            options: {
                hostname: '*',
                useAvailablePort: true
            },
            runtime: {
                options: {
                    port: 0,
                    open: true,
                    livereload: 0,
                    middleware: function (connect) {
                        grunt.log.ok('Mocking has been enabled and can located at /mocking');
                        return [
                            connect().use('/node_modules', serveStatic(__dirname + '/node_modules')),
                            connect().use('/mocking', serveStatic(config.paths.tmp + '/mocking')),
                            connect().use('/', serveStatic(config.paths.test + '/protractor')),
                            connect().use('/', serveStatic(config.paths.src)),
                            connect().use('/', serveStatic(config.paths.tmp))
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
                            connect().use('/node_modules', serveStatic(__dirname + '/node_modules')),
                            connect().use('/mocking', serveStatic(config.paths.tmp + '/mocking')),
                            connect().use('/js', serveStatic(config.paths.instrumented + '/src/js')),
                            connect().use('/', serveStatic(config.paths.src)),
                            connect().use('/', serveStatic(config.paths.test + '/protractor')),
                        ];
                    }
                }
            },
            distribution: {
                options: {
                    port: 0,
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect().use('/', serveStatic(config.paths.dist))
                        ];
                    }
                }
            }
        },
        ngApimock : {
            options: {
                defaultOutputDir: '<%= config.paths.tmp %>/mocking',
                defaultPassThrough: []
            },
            mock: {
                src: '<%=config.paths.test %>/mocks',
                moduleName: 'todo',
                dependencies: {
                    angular: '/node_modules/angular/angular.js'
                }
            }
        },
        jshint: {
            report: {
                options: {
                    jshintrc: '.jshintrc',
                    reporter: require('jshint-stylish')
                },
                files: {
                    src: ['<%= config.paths.src %>/**/*.js']
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
                configFile: '<%=config.paths.test %>/karma/config/karma.conf.js'
            }
        },
        protractor_coverage: {
            options: {
                keepAlive: true,
                noColor: false
            },
            jasmine2: {
                options: {
                    collectorPort: 0,
                    coverageDir: '<%=config.paths.results%>/protractor-coverage/jasmine2',
                    args: {
                        seleniumAddress: '<%=config.hosts.seleniumAddress%>',
                        params: {
                            resultsDir: '<%=config.paths.results%>/protractor/jasmine2',
                            testDir: '<%=config.paths.test%>/protractor'
                        },
                        baseUrl: 'http://<%=config.hosts.fqdn%>:<%= connect.test.options.port %>',
                        specs: [
                            '<%=config.paths.test%>/protractor/specs/**/*.spec.js'
                        ]
                    }
                },
                configFile: '<%=config.paths.test%>/protractor/config/protractor-jasmine2.conf.js'
            },
            cucumber: {
                options: {
                    collectorPort: 0,
                    noInject: true,
                    coverageDir: '<%=config.paths.results%>/protractor-coverage/cucumber',
                    args: {
                        seleniumAddress: '<%=config.hosts.seleniumAddress%>',
                        params: {
                            resultsDir: '<%=config.paths.results%>/protractor/cucumber',
                            testDir: '<%=config.paths.test%>/protractor',
                            collectorPort: 0
                        },
                        baseUrl: 'http://<%=config.hosts.fqdn%>:<%= connect.test.options.port %>',
                        specs: [
                            '<%=config.paths.test%>/protractor/specs/**/*.feature'
                        ]
                    }
                },
                configFile: '<%=config.paths.test%>/protractor/config/protractor-cucumber.conf.js'
            }
        },
        makeReport: {
            src: '<%=config.paths.results%>/protractor-coverage/**/*.json',
            options: {
                type: 'lcov',
                dir: '<%=config.paths.results%>/protractor-coverage',
                print: 'detail'
            }
        },
        watch: {
            js: {
                files: ['<%=config.paths.src%>/{,*/}*.js']
            },
            html: {
                files: ['<%=config.paths.src%>/index.html']
            }
        }
    });


    grunt.registerTask('serve', 'Serve the app using the distribution .', [
        'prepare',
        'connect:runtime',
        'watch'
    ]);

    grunt.registerTask('prepare', 'Prepare the build with all the necessary stuff.', [
        'clean',
        'portPick',
        'ngApimock'
    ]);

    grunt.registerTask('test', 'Execute tests.', [
        'force:on',
        'jshint',
        'instrument',
        'connect:test',
        'protractor_coverage',
        'makeReport',
        'force:reset'
    ]);

    grunt.registerTask('default', 'Default task', function (suite) {
        grunt.task.run([
            'prepare',
            'test'
        ]);
    });
};