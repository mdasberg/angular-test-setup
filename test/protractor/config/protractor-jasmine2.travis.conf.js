var path = require('path');
exports.config = {
    allScriptsTimeout: 11000,

    baseUrl: 'http://localhost:9900/',

    framework: 'jasmine2',

    params: {
    },
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    multiCapabilities: [{
        'browserName': 'chrome',
        'name': 'ngApimock - protractor',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'shardTestFiles': true,
        'maxInstances': 10
    }],

    onPrepare: function () {
        global.ngApimock = require(path.resolve('.') + '/.tmp/mocking/protractor.mock');
    },
    onCleanUp: function () {
    },
    beforeLaunch: function () {
    },
    afterLaunch: function () {
    },
    jasmineNodeOpts: {
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 40000
    }
};