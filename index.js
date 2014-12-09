var exec = require('child_process').exec,
    os = require('os'),
    path = require('path'),
    rvmDownloader = require('./lib/rvm-downloader'),
    fs = require('fs'),
    _ = require('lodash'),
    defaultOptions = {
        rvmPath: path.resolve('OpenFinRVM.exe'),
        configPath: 'http://localhost:5000/app.json',
        rvmUrl: 'https://developer.openfin.co/release/rvm/latest'
    };

function launchOpenFin(options) {
    //check if we are in windows.
    _.extend(defaultOptions, options);
    if (os.type().toLowerCase().indexOf('windows') > -1) {
        fs.exists(defaultOptions.rvmPath, function (exists) {
            if (exists) {
                exec(defaultOptions.rvmPath + ' --config="' + defaultOptions.configPath +'"', function callback(error) {
                    console.log('running openfin');
                    if (error) {
                        console.error(error);
                    }
                });
            } else {
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
