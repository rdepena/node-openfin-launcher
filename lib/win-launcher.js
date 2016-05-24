var exec = require('child_process').exec;
var path = require('path');
var rvmDownloader = require('./rvm-downloader');
var fs = require('fs');
var q = require('q');
var expandOptions = require('./expand-options');



// this is equivalent to %localappdata%\OpenFin
function launchOpenFin(options) {
    var deffered = q.defer();
    var combinedOpts = expandOptions(options);

    function launch() {
        //TODO:fs.exists is deprecated, need to chenge this at some point.
        fs.exists(path.resolve(combinedOpts.rvmPath), function(exists) {

            if (exists) {

                // change the working dir to either the custom location or the
                // default OpenFin dir in local app data
                process.chdir(path.resolve(path.dirname(combinedOpts.rvmPath)));

                exec('OpenFinRVM.exe --config="' + combinedOpts.configPath + '"', function callback(error) {
                    if (error) {
                        deffered.reject(error);
                    }
                    deffered.resolve();

                });

            } else {
                console.log('no rvm found at specified location, downloading from ', combinedOpts.rvmUrl);

                rvmDownloader.download(combinedOpts.rvmUrl, path.resolve(combinedOpts.rvmPath))
                    .then(launch)
                    .fail(deffered.reject);
            }
        });
    }
    launch();
    return deffered.promise;
}

module.exports = {
    launchOpenFin: launchOpenFin
};
