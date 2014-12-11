var exec = require('child_process').exec,
    os = require('os'),
    path = require('path'),
    rvmDownloader = require('./lib/rvm-downloader'),
    fs = require('fs'),
    _ = require('lodash'),
    defaultOptions = {
        rvmPath: path.resolve('OpenFinRVM.exe'),
        rvmUrl: 'https://developer.openfin.co/release/rvm/latest'
    },
    callback = function () {};

function launchOpenFin(options, cb) {
    callback = cb || callback;
    //check if we are in windows.
    _.extend(defaultOptions, options);
    if (os.type().toLowerCase().indexOf('windows') > -1) {
        fs.exists(defaultOptions.rvmPath, function (exists) {
            if (exists) {
                callback();
                exec(defaultOptions.rvmPath + ' --config="' + defaultOptions.configPath +'"', function callback(error) {
                    console.log('running OpenFin');
                    if (error) {
                        console.error(error);
                    }
                });
            } else {
                console.log('no rvm found at specified location, downloading');
                //make sure the second time around we specify the local repository.
                defaultOptions.rvmPath = path.resolve('OpenFinRVM.exe');
                rvmDownloader.download(defaultOptions.rvmUrl, launchOpenFin);
            }
        });
    } else {
        console.error('non windows, launcher not supported.');
    }
}
module.exports = {
    launchOpenFin: launchOpenFin
};
