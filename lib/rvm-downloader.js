var q = require('q');
var assetFetcher = require('./asset-fetcher');
var assetUtilities = require('./asset-utilities');
var fs = require('fs');

function download(url, writePath) {
    var deffered = q.defer();
    var tmpLocation = '.rvmTmp';
    assetFetcher.downloadFile(url, tmpLocation, function(err) {
        if (err) {
            deffered.reject(err);
        } else {
            assetUtilities.unzipFile(tmpLocation, writePath, function(unzipErr) {
                if (unzipErr) {
                    deffered.reject(unzipErr);
                } else {
                    fs.unlink(tmpLocation);
                    deffered.resolve();
                }
            });
        }
    });

    return deffered.promise;
}

module.exports = {
    download: download
};
