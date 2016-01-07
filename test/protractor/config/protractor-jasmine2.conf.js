var jasmineReporters = require('jasmine-reporters'),
    grunt = require('grunt'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    args = require('optimist').argv,
    config = require(__dirname + '/protractor-base.conf').config;

config.framework = 'jasmine2';

config.onPrepare = function () {
    // Disable animations so e2e tests run more quickly
    var disableNgAnimate = function () {
        angular.module('disableNgAnimate', []).run(['$animate', function ($animate) {
            $animate.enabled(false);
        }]);
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);

    var disableCssAnimate = function () {
        angular
            .module('disableCssAnimate', [])
            .run(function () {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '* {' +
                    '-webkit-transition: none !important;' +
                    '-moz-transition: none !important' +
                    '-o-transition: none !important' +
                    '-ms-transition: none !important' +
                    'transition: none !important' +
                    '}';
                document.getElementsByTagName('head')[0].appendChild(style);
            });
    };

    browser.addMockModule('disableCssAnimate', disableCssAnimate);

    global.ngApimock = require(path.resolve('.') + '/.tmp/mocking/protractor.mock');

    // returning the promise makes protractor wait for the reporter config before executing tests
    return browser.getProcessedConfig().then(function (config) {
        // you could use other properties here if you want, such as platform and version
        var browserName = config.capabilities.browserName;

        var directory = args.params.resultsDir + path.sep + browserName;
        mkdirp(directory, function (err) {
            if (err) {
                throw new Error('Could not create directory ' + directory);
            }
        });

        var junitReporter = new jasmineReporters.JUnitXmlReporter({
            consolidateAll: false, // need to work with sharding
            savePath: directory,
            filePrefix: 'results'
        });
        jasmine.getEnv().addReporter(junitReporter);
        browser.driver.manage().window().maximize();
        browser.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);
    });
};

config.jasmineNodeOpts = {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 40000
};

exports.config = config;