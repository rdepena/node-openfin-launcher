var https = require('https'),
    http = require('http'),
    path = require('path'),
    unzip = require('unzip'),
    q = require('q');

function download(url) {
    var deffered = q.defer(),
        isHttps,
        downloadStream;

    function onError(err) {
        if (isHttps) {
            console.log('HTTPS download failed, trying http');
            getRvm(url.replace('https', 'http'));
        } else {
            deffered.reject(new Error(err));
        }
    }

    function getRvm(rvmUrl) {
        isHttps = rvmUrl.lastIndexOf('https') >= 0;
        downloadStream = isHttps ? https : http;

        downloadStream.get(rvmUrl, function(response) {
            if (response.statusCode !== 200) {
                onError('Download Failed');
            } else {
                response.pipe(unzip.Extract({
                    path: path.resolve()
                })).on('close', function() {
                    deffered.resolve();
                });
            }
        }).on('error', onError);
    }

    getRvm(url);

    return deffered.promise;
}

module.exports = {
    download: download
};
