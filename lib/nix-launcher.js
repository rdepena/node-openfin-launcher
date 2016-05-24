var exec = require('child_process').exec;
var q = require('q');
var expandOptions = require('./expand-options');

//TODO: handle linux.
//https://demoappdirectory.openf.in/desktop/config/apps/OpenFin/HelloOpenFin/app.json
function launch(options) {
    var deffered = q.defer();
    var combinedOpts = expandOptions(options);
    exec(combinedOpts.macAppPath + '/Contents/MacOS/OpenFin --startup-url="' + combinedOpts.configPath + '"',
        function(error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                deffered.reject(error);
            }
            deffered.resolve();
        });
    return deffered.promise;
}

module.exports = {
    launchOpenFin: launch
};
