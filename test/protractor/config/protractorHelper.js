(function () {
    'use strict';

    var grunt = require('grunt'),
        mkdirp = require('mkdirp'),
        path = require('path'),
        jasmineReporters = require('jasmine-reporters'),
        args = require('optimist').argv;

    module.exports = {
        disableNgAnimate: function () {
            var disableNgAnimate = function () {
                function DisabledNgAnimate($animate) {
                    $animate.enabled(false);
                }
                DisabledNgAnimate.$inject = ['$animate'];
                angular.module('disableNgAnimate', []).run(DisabledNgAnimate);
            };

            browser.addMockModule('disableNgAnimate', disableNgAnimate);
        },
        disableCssAnimate: function() {
            var disableCssAnimate = function () {
                function DisabledCssAnimate() {
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
                }
                angular
                    .module('disableCssAnimate', [])
                    .run(DisabledCssAnimate);
            };
            browser.addMockModule('disableCssAnimate', disableCssAnimate);
        },
        provideNgApimock: function() {
            global.ngApimock = require(path.resolve('.') + '/mocking/protractor.mock');
        },
        provideChai: function() {
            var chai = require('chai');
            chai.use(require('chai-as-promised'));
            global.chai = chai;
            global.expect = chai.expect;
        },
        addJasmineReporter: function() {
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
        }
    };
})();
