(function () {
    'use strict';

    var path = require('path');

    exports.config = {
        allScriptsTimeout: 15000,
        keepAlive: true,

        multiCapabilities: [
            {
                'browserName': 'chrome',
                'chromeOptions': {
                    args: ['test-type', '--start-maximized'] // get rid of the ignore cert warning
                },
                shardTestFiles: true,
                maxInstances: 10
            }
        ],
        params: {},
        framework: 'custom',
        frameworkPath:require.resolve('protractor-cucumber-framework'),
        onPrepare: function() {
            var helper = require('./protractorHelper');
            helper.disableNgAnimate();
            helper.disableCssAnimate();
            helper.provideNgApimock();
            helper.provideChai();
        },
        cucumberOpts: {
            require: [
                path.join(process.cwd(), 'app','**', '*.steps.js'),
                path.join(process.cwd(), 'test','protractor', 'config', 'protractor-cucumber-junit-reporter.js'),
                path.join(process.cwd(), 'test', 'protractor', 'config', 'protractor-coverage-cucumber-after-hooks.js')
            ],
            format: 'pretty'
        }
    };
})();
