(function () {
    'use strict';

    var grunt = require('grunt');
    var mkdirp = require('mkdirp');
    var path = require('path');

    module.exports = {
        disableNgAnimate: function () {
            var disableNgAnimate = function () {
                function DisabledNgAnimate($animate) {
                    $animate.enabled(false);
                }

                DisabledNgAnimate.$inject = ['$animate'];
                angular.module('disableNgAnimate', []).run(DisabledNgAnimate);
            };

            browser.addMockModule('disableNgAnimate', disableNgAnimate);
        },
        disableCssAnimate: function () {
            var disableCssAnimate = function () {
                function DisabledCssAnimate() {
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
                }

                angular
                    .module('disableCssAnimate', [])
                    .run(DisabledCssAnimate);
            };
            browser.addMockModule('disableCssAnimate', disableCssAnimate);
        },
        provideNgApimock: function () {
            global.ngApimock = require(path.resolve('.') + '/mocking/protractor.mock');
        },
        provideChai: function () {
            var chai = require('chai');
            chai.use(require('chai-as-promised'));
            global.chai = chai;
            global.expect = chai.expect;
        }
    };
})();
