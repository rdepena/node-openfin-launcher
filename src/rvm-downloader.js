var q = require('q');
var assetFetcher = require('./asset-fetcher');
var assetUtilities = require('./asset-utilities');
var fs = require('fs');
var path = require('path');

function download(url, writePath) {
    var deferred = q.defer();
    var tmpLocation = '.rvmTmp';
    assetFetcher.downloadFile(url, tmpLocation, function(err) {
        if (err) {
            deferred.reject(err);
        } else {
            assetUtilities.unzipFile(tmpLocation, path.dirname(writePath), function(unzipErr) {
                if (unzipErr) {
                    deferred.reject(unzipErr);
                } else {
                    fs.unlink(tmpLocation);
                    //unzip pipe finishes early and the file is still being moved by the OS, need to wait it out.
                    setTimeout(deferred.resolve, 300);
                }
            });
        }
    });

    return deferred.promise;
}

module.exports = {
    download: download
};
