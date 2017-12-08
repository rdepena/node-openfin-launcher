var os = require('os');
var _ = require('lodash');
var path = require('path');


var xpLocation = '\\Local Settings\\Application Data\\OpenFin';
var winEightOrGreater = '\\AppData\\Local\\OpenFin';
var isWindows = os.type().toLowerCase().indexOf('windows') !== -1;
var isMac = os.type().toLowerCase().indexOf('darwin') !== -1;

// Resolves out environment paths (%localappdata%)
function resolveToAbsolutePath(path) {
    return path.replace(/%([^%]+)%/g, function(_, key) {
        return process.env[key];
    });
}

function expand(options) {
    var defaultOptions = {
        rvmUrl: 'https://developer.openfin.co/release/rvm/latest'
    };

    if (isWindows) {
        var windows = require('windows'); //This is Windows specific module and will NOT work on other OS flavors.

        var isXP = isWindows && (+os.release().split('.')[0]) < 6;
        var defaultAppData = path.join(process.env['USERPROFILE'], isXP ? xpLocation : winEightOrGreater);

        try {
            var openFinRvmRegistry = windows.registry('HKCU/Software/OpenFin/RVM/Settings/Deployment');

            // if a custom rvmInstallDirectory registry key is set, use its value instead of default location
            if (openFinRvmRegistry.rvmInstallDirectory !== undefined) {
                defaultAppData = path.normalize(resolveToAbsolutePath(openFinRvmRegistry.rvmInstallDirectory.value.toString()));

                console.log("rvmInstallDirectory found.  Using RVM Location: ", defaultAppData);
            }
        } catch (err) {
            console.log('deployment group policy not found, launching from:', defaultAppData);
        }

        defaultOptions.rvmPath = path.resolve(defaultAppData, 'OpenFinRVM.exe');
    }
    if (isMac) {
        //TODO:support multiple versions....
        defaultOptions.macAppPath = '/Applications/OpenFin.app';
    }
    // use the options, filling in the defaults without clobbering them
    return _.defaults(_.clone(options), defaultOptions);
}

module.exports = expand;
