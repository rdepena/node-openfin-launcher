var rvmDownloader = require('./lib/rvm-downloader');
var nixLauncher = require('./lib/nix-launcher');
var winLauncher = require('./lib/win-launcher');
var expandOptions = require('./lib/expand-options');
var assetUtilities = require('./lib/asset-utilities');

var runningOs = assetUtilities.getRunningOs();
var launchOpenFin = runningOs === assetUtilities.OS_TYPES.windows ? winLauncher.launchOpenFin : nixLauncher.launchOpenFin;

module.exports = {
    launchOpenFin: launchOpenFin,
    downloadRvm: function() {
        var defaultOptions = expandOptions({});
        return rvmDownloader.download(defaultOptions.rvmUrl);
    }
};
