var coverage = require('grunt-protractor-coverage/cucumber');

var coverageHook = function () {
    this.After(function (scenario, callback) {
        console.log(browser.params.collectorPort)
        coverage.options.port = browser.params.collectorPort;
        coverage.getCoverage(callback);
    });
};

module.exports = coverageHook;