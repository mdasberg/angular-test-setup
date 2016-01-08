var config = require(__dirname + '/protractor-base.conf').config;

config.framework = 'jasmine2';
config.sauceUser = 'mdasberg'; //process.env.SAUCE_USERNAME;
config.sauceKey = '6819c778-bd98-452d-a89f-5ab3902083aa'; //process.env.SAUCE_ACCESS_KEY;

config.multiCapabilities =[{
    'browserName': 'chrome',
    'name': 'angular-test-setup - protractor - jasmine2',
    'tunnel-identifier': '1', //process.env.TRAVIS_JOB_NUMBER,
    'build': '1', //process.env.TRAVIS_BUILD_NUMBER,
    'shardTestFiles': true,
    'maxInstances': 10
}];

config.onPrepare = function () {
    var helper = require('./protractorHelper');
    helper.disableNgAnimate();
    helper.disableCssAnimate();
    helper.provideNgApimock();
    // returning the promise makes protractor wait for the reporter config before executing tests
    return helper.addJasmineReporter();
};

config.jasmineNodeOpts = {
    isVerbose: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 40000
};


exports.config = config;