var exec = require('child_process').exec,
    os = require('os'),
    nonSupportedOSMessage = 'non windows, launcher not supported.';


//kick out if not in windows
var isWindows = os.type().toLowerCase().indexOf('windows') !== -1;

if (!isWindows) {
    console.log(nonSupportedOSMessage);
    process.exit();
} 


var path = require('path'),
    rvmDownloader = require('./lib/rvm-downloader'),
    fs = require('fs'),
    _ = require('lodash'),
    q = require('q');

    // this is equivalent to %localappdata%\OpenFin
    var defaultAppData = path.join(process.env['USERPROFILE'],'\\AppData\\Local\\OpenFin'),
    defaultOptions = {
        rvmPath: path.resolve(defaultAppData, 'OpenFinRVM.exe'),
        rvmUrl: 'https://developer.openfin.co/release/rvm/0.1.0.44',
        rvmGlobalCommand: null //this is undocumented, do we still need it?
    };

function launchOpenFin(options) {
    var deffered = q.defer();
    
    // use the options, filling in the defaults without clobbering them 
    var combinedOpts = _.defaults(_.clone(options), defaultOptions);

    function launch() {
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
                console.log('no rvm found at specified location, downloading');
                
                rvmDownloader.download(combinedOpts.rvmUrl)
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