var spawn = require('child_process').spawn;
var expandOptions = require('./expand-options');
var assetFetcher = require('./asset-fetcher');
var assetUtilities = require('./asset-utilities');

function isURL(str) {
    return (typeof str === 'string') && str.lastIndexOf('http') >= 0;
}

function download(url) {
    return new Promise((resolve, reject) => {
        assetFetcher.getData(url, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function getConfig(configPath) {
    return new Promise((resolve) => {
        if (isURL(configPath)) {
            return download(configPath).then(function(config) {
                return JSON.parse(config);
            });
        } else {
            //TODO: this should not require the file in.
            var appConfig = require(configPath);
            resolve(appConfig);
        }
    });
}

function launch(options) {
    return new Promise((resolve, reject) => {
        const combinedOpts = expandOptions(options);
        
        getConfig(combinedOpts.configPath).then(function(config) {
            try {
                assetUtilities.downloadRuntime(config.runtime.version, (err, runtimePath) => {
                    if (err) {
                        reject(err);
                    } else {
                        const args = config.runtime.arguments ? config.runtime.arguments.split(' ') : [];
                        //BUG: in linux there is a bug were '--no-sandbox' is required.
                        if (assetUtilities.getRunningOs() === assetUtilities.OS_TYPES.linux) {
                            args.push('--no-sandbox');
                        }
                        args.unshift('--startup-url="' + combinedOpts.configPath + '" ');
                        const of = spawn(runtimePath, args, {
                            encoding: 'utf8'
                        });
                        
                        of.stdout.on('data', data => {
                            var sData = '' + data;
                            
                            if (options.noAttach) {
                                if (sData.indexOf('Opened on')) {
                                    resolve();
                                }
                            } else {
                                console.log(sData);
                            }
                        });
                        of.stderr.on('data', data => {
                            console.log('' + data);
                        });
                        
                        of.on('exit', code => {
                            console.log(code);
                            resolve(code);
                        });
                    }
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        }).catch(err => {
            reject(err);
        });
        
    });
}

module.exports = {
    launchOpenFin: launch
};
