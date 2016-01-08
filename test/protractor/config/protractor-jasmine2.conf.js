var config = require(__dirname + '/protractor-base.conf').config;

config.framework = 'jasmine2';

config.onPrepare = function () {
    var helper = require('./protractorHelper')
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