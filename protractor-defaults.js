module.exports = function() {
    // Some tests randomly fail with the default timeout, blame the build server
    this.setDefaultTimeout(60 * 1000);
};
