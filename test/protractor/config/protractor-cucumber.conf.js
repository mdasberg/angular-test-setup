var grunt = require('grunt'),
    environment = grunt.config.get('environment'),
    path = require('path'),
    config = require(__dirname + '/protractor-base.conf').config;

config.framework = 'custom';
config.frameworkPath = require.resolve('protractor-cucumber-framework');

if (environment === 'travis') {
    config.sauceUser = process.env.SAUCE_USERNAME;
    config.sauceKey = process.env.SAUCE_ACCESS_KEY;

    config.multiCapabilities.forEach(function (capability) {
        capability['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
        capability['build'] = process.env.TRAVIS_BUILD_NUMBER;
    });
}

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
    var chai = require('chai');
    chai.use(require('chai-as-promised'));
    global.chai = chai;
    global.expect = chai.expect;
    global.ngApimock = require(path.resolve('.') + '/.tmp/mocking/protractor.mock');
};

config.cucumberOpts = {
    require: [
        process.cwd() + '/test/protractor/**/step_definitions/*.steps.js',
        process.cwd() + '/test/protractor/**/support/*.js',
        __dirname + '/protractor-coverage-cucumber-after-hooks.js',
        __dirname + '/protractor-cucumber-junit-reporter.js'
    ],
    format: 'summary'
};

exports.config = config;