var os = require('os');
var rvmDownloader = require('./lib/rvm-downloader');
var nixLauncher = require('./lib/nix-launcher');
var winLauncher = require('./lib/win-launcher');
var expandOptions = require('./lib/expand-options');

var isWindows = os.type().toLowerCase().indexOf('windows') !== -1;
var launchOpenFin = isWindows ? winLauncher.launchOpenFin : nixLauncher.launchOpenFin;

module.exports = {
    launchOpenFin: launchOpenFin,
    downloadRvm: function() {
        var defaultOptions = expandOptions({});
        return rvmDownloader.download(defaultOptions.rvmUrl);
    }
};
