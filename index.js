var exec = require('child_process').exec,
    os = require('os'),
    path = require('path'),
    rvmDownloader = require('./lib/rvm-downloader'),
    fs = require('fs'),
    _ = require('lodash'),
    q = require('q'),
    defaultOptions = {
        rvmPath: path.resolve('OpenFinRVM.exe'),
        rvmUrl: 'https://developer.openfin.co/release/rvm/0.1.0.44',
        rvmGlobalCommand: null
    },
    nonSupportedOSMessage = 'non windows, launcher not supported.';

function launchOpenFin(options) {
    var deffered = q.defer();
    //check if we are in windows.
    _.extend(defaultOptions, options);

    function launch() {
        fs.exists(defaultOptions.rvmPath, function(exists) {
            var executeCommand = defaultOptions.rvmGlobalCommand || defaultOptions.rvmPath;
            if (exists || defaultOptions.rvmGlobalCommand) {
                exec(executeCommand + ' --config="' + defaultOptions.configPath + '"', function callback(error) {
                    if (error) {
                        console.error(error);
                        deffered.reject(error);
                    }
                    deffered.resolve();
                });
            } else {
                console.log('no rvm found at specified location, downloading');
                //make sure the second time around we specify the local repository.
                defaultOptions.rvmPath = path.resolve('OpenFinRVM.exe');
                rvmDownloader.download(defaultOptions.rvmUrl)
                    .then(launch)
                    .fail(deffered.reject);
            }
        });
    }

    if (os.type().toLowerCase().indexOf('windows') > -1) {
        launch();
    } else {
        deffered.reject(new Error(nonSupportedOSMessage));
    }

    return deffered.promise;
}

module.exports = {
    launchOpenFin: launchOpenFin,
    downloadRvm: function() {
        return rvmDownloader.download(defaultOptions.rvmUrl);
    }
};
