var spawn = require('child_process').spawn;
var q = require('q');
var expandOptions = require('./expand-options');
var assetFetcher = require('./asset-fetcher');
var assetUtilities = require('./asset-utilities');

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

function download(url, existingDeferred) {
    var deferred = existingDeferred || q.defer();
    assetFetcher.getData(url, function(err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

function getConfig(configPath) {
    var deferred = q.defer();
    if (isURL(configPath)) {
        return download(configPath).then(function(config) {
            return JSON.parse(config);
        });
    } else {
        var appConfig = require(configPath);
        deferred.resolve(appConfig);
    }
    return deferred.promise;
}

function launch(options) {
    var deferred = q.defer();
    var combinedOpts = expandOptions(options);

    getConfig(combinedOpts.configPath).then(function(config) {
        try {
            assetUtilities.downloadRuntime(config.runtime.version, function(err, runtimePath) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var args = config.runtime.arguments ? config.runtime.arguments.split(' ') : [];
                    //BUG: in linux there is a bug were '--no-sandbox' is required.
                    if (assetUtilities.getRunningOs() === assetUtilities.OS_TYPES.linux) {
                        args.push('--no-sandbox');
                    }
                    args.unshift('--startup-url="' + combinedOpts.configPath + '"');
                    args.push('--version-keyword=' + config.runtime.version);
                    if (config.devtools_port) {
                        args.push('--remote-debugging-port=' + config.devtools_port);
                    }
                    var of = spawn(runtimePath, args, {
                        encoding: 'utf8'
                    });

                    of.stdout.on('data', function(data) {
                        var sData = '' + data;

                        if (options.noAttach) {
                            if (sData.indexOf('Opened on')) {
                                deferred.resolve();
                            }
                        } else {
                            console.log(sData);
                        }
                    }); 
                    of.stderr.on('data', function(data) {
                        console.log('' + data);
                    });

                    of.on('exit', function(code) {
                        console.log(code);
                        deferred.resolve(code);
                    });
                }
            });
        } catch (error) {
            console.log(error);
            deferred.reject(error);
        }
    }).fail(function(err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

module.exports = {
    launchOpenFin: launch
};
