(function () {
    var path = require('path'),
        fs = require('fs-extra'),
        glob = require('glob');

    var validExit = false;

    /** Handle event handling when an exit occurs. */
    process.on('exit', function () {
        if (!validExit) {
            console.log('Install exited unexpectedly');
            exit(1)
        }
    });

    /**
     * Handles a valid exit.
     * @param code The exit code.
     */
    function exit(code) {
        validExit = true;
        process.exit(code || 0)
    }

    glob.sync('**/lcov.info', {cwd: process.cwd() + '/results/karma/coverage', root: '/', realpath: true}).forEach(function (file) {
        var result = String(fs.readFileSync(file)).replace(new RegExp('(SF:)' + process.cwd() + '(.*)', 'g'), '$1/path/to$2');
        fs.writeFileSync(file, result);
    });

    exit(0);


})();
