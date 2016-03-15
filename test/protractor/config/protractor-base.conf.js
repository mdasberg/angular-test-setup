(function () {
    'use strict';

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
    };
})();