var spawn = require('child_process').spawn;
var path = require('path');
var rvmDownloader = require('./rvm-downloader');
var fs = require('fs');
var expandOptions = require('./expand-options');



function launchOpenFin(options) {
    return new Promise((resolve, reject) => {
        var combinedOpts = expandOptions(options);
        
        function launch() {
            fs.stat(path.resolve(combinedOpts.rvmPath), function(err) {
                
                if (!err) {
                    // change the working dir to either the custom location or the
                    // default OpenFin dir in local app data
                    var wd = process.cwd();
                    process.chdir(path.resolve(path.dirname(combinedOpts.rvmPath)));
                    
                    var rvm = spawn('OpenFinRVM.exe', ['--config=' + combinedOpts.configPath], {
                        encoding: 'utf8'
                    });
                    rvm.stdout.on('data', function(data) {
                        var sData = '' + data;
                        if (options.noAttach) {
                            if (sData.indexOf("application-event") > -1) {
                                // change the working dir back
                                process.chdir(wd);
                                resolve();
                            }
                        }
                    });
                    
                    rvm.on('exit', function(code) {
                        // change the working dir back
                        process.chdir(wd);
                        resolve(code);
                    });
                    
                } else {
                    console.log('no rvm found at specified location, downloading from ', combinedOpts.rvmUrl);
                    
                    rvmDownloader.download(combinedOpts.rvmUrl, path.resolve(combinedOpts.rvmPath))
                    .then(launch)
                    .catch(reject);
                }
            });
        }
        launch();
    });
}

module.exports = {
    launchOpenFin: launchOpenFin
};
