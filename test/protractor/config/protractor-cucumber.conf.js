var config = require(__dirname + '/protractor-base.conf').config;

config.framework = 'custom';
config.frameworkPath = require.resolve('protractor-cucumber-framework');

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