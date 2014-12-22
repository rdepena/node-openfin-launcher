var https = require('https'),
    path = require('path'),
    unzip = require('unzip'),
    q = require('q');

function download(url) {
    var deffered = q.defer();
    https.get(url, function(response) {
        response.pipe(unzip.Extract({
            path: path.resolve()
        })).on('close', function() {
            deffered.resolve();
        });
    }).on('error', function(err) {
        deffered.reject(new Error(err));
    });

    return deffered.promise;
}

module.exports = {
    download: download
};
