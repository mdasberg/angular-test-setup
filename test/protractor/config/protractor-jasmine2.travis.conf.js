var config = require(__dirname + '/protractor-jasmine2.conf').config;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.multiCapabilities.forEach(function (capability) {
    capability['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
    capability['build'] = process.env.TRAVIS_BUILD_NUMBER;
});

exports.config = config;