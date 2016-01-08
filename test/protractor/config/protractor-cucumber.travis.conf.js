var config = require(__dirname + '/protractor-base.conf').config;

config.framework = 'custom';
config.frameworkPath = require.resolve('protractor-cucumber-framework');
config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.multiCapabilities =[{
    'browserName': 'chrome',
    'name': 'angular-test-setup - protractor - jasmine2',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'shardTestFiles': true,
    'maxInstances': 10
}];

config.onPrepare = function () {
    var helper = require('./protractorHelper');
    helper.disableNgAnimate();
    helper.disableCssAnimate();
    helper.provideNgApimock();
    helper.provideChai();
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