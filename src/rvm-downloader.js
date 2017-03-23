var assetFetcher = require('./asset-fetcher');
var assetUtilities = require('./asset-utilities');
var fs = require('fs');
var path = require('path');

const tmpLocation = '.rvmTmp';

function download(url, writePath) {
    return new Promise((resolve, reject) => {
        assetFetcher.downloadFile(url, tmpLocation, err => {
            if (err) {
                reject(err);
            } else {
                assetUtilities.unzipFile(tmpLocation, path.dirname(writePath), unzipErr => {
                    if (unzipErr) {
                        reject(unzipErr);
                    } else {
                        fs.unlink(tmpLocation);
                        //unzip pipe finishes early and the file is still being moved by the OS, need to wait it out.
                        setTimeout(resolve, 300);
                    }
                });
            }
        });
    });
}

module.exports = {
    download: download
};
