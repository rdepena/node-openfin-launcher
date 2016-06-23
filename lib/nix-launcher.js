var spawn = require('child_process').spawn;
var q = require('q');
var https = require('https');
var http = require('http');
var expandOptions = require('./expand-options');

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

function download(url, existingDeffered) {
    var isHttps = url.lastIndexOf('https') >= 0;
    var downloadStream = isHttps ? https : http;
    var deffered = existingDeffered || q.defer();

    function onError(err) {
        if (isHttps) {
            console.log('HTTPS download failed, trying http');
            download(url.replace('https', 'http'), deffered);
        } else {
            deffered.reject(new Error(err));
        }
    }
    downloadStream.get(url, function(res) {
        var content = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            content += chunk;
        });

        res.on('end', function() {
            deffered.resolve(content);
        });

        res.on('error', onError);
    }).on('error', onError);
    return deffered.promise;
}

function getConfig(configPath) {
    var deffered = q.defer();
    if (isURL(configPath)) {
        return download(configPath).then(function(config) {
            console.log('got the config');
            return JSON.parse(config);
        });
    } else {
        var appConfig = require(configPath);
        deffered.resolve(appConfig);
    }
    return deffered.promise;
}

//TODO: handle linux.
function launch(options) {
    var deffered = q.defer();
    var combinedOpts = expandOptions(options);

    getConfig(combinedOpts.configPath).then(function(config) {
        try {
            var of = spawn(combinedOpts.macAppPath + '/Contents/MacOS/OpenFin', ['--startup-url="' + combinedOpts.configPath + '" ', config.runtime.arguments], {
                encoding: 'utf8'
            });

            of.stdout.on('data', function(data) {
                console.log("" + data);
            });
            of.stderr.on('data', function(data) {
                console.log("" + data);
            });

            of.on('exit', function(code) {
                console.log(code);
                deffered.resolve(code);
            });
        } catch (error) {
            deffered.reject(error);
        }
    });
    return deffered.promise;
}

module.exports = {
    launchOpenFin: launch
};
