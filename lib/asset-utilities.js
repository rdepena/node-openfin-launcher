var assetFetcher = require('./asset-fetcher');
var os = require('os');
var path = require('path');
var fs = require('fs');
var unzip = require('unzip');
var log = require('single-line-log').stdout;
var spawn = require('child_process').spawn;


var home = process.env.HOME;
var runtimeRoot = 'https://developer.openfin.co/release/runtime/';
var macRoot = 'mac/x64/';
var linuxRoot = 'linux/x64/';
//var linux_armRoot = 'linux/arm';

//TODO:Add linux/windows paths
var OS_TYPES = {
    windows: {
        downloadRoot: runtimeRoot
    },
    mac: {
        runtimePath: 'OpenFin.app/Contents/MacOS/OpenFin',
        downloadRoot: runtimeRoot + macRoot
    },
    linux: {
        downloadRoot: runtimeRoot + linuxRoot
    }
};

function getRunningOs() {

    if (os.type().toLowerCase().indexOf('windows') !== -1) {
        return OS_TYPES.windows;
    } else if (os.type().toLowerCase().indexOf('darwin') !== -1) {
        return OS_TYPES.mac;
    } else if (os.type().toLowerCase().indexOf('linux') !== -1) {
        return OS_TYPES.linux;
    } else {
        throw new Error('OS Not supported');
    }
}

function getDownloadLocation(version) {
    var os = getRunningOs();
    return os.downloadRoot + version;
}

function unzipFile(file, output, cb) {
    var os = getRunningOs();
    output = output || '';


    log('unziping ' + file + ' to ' + output + '\n');
    if (os === OS_TYPES.windows) {
        fs.createReadStream(file)
            .pipe(unzip.Extract({
                path: output
            }))
            .on('finish', cb)
            .on('error', function(err) {
                cb(err);
            });
    } else {
        var uz = spawn('unzip', [file, '-d', output], {
            encoding: 'utf8'
        });
        uz.on('exit', function() {
            cb();
        });
        uz.stdout.on('data', function(data) {
            console.log("" + data);
        });
        uz.stderr.on('data', function(data) {
            console.log("" + data);
        });
    }

}

function resolveRuntimeVersion(channel, cb) {
    var u = runtimeRoot + channel;
    assetFetcher.requestWithRetry(u, 'HEAD', function(err, response) {
        if (err) {
            cb(null);
        }
        if (response.headers['content-length'] > 100) {
            cb(channel);
        } else {
            assetFetcher.getData(u, function(err, data) {
                if (err) {
                    cb(null);
                } else {
                    cb(data);
                }
            });
        }

        response.resume();
    });
}

//TODO:Handle windows as well.
//we will create the folder structure:
// home/OpenFin/Runtime/version
function createFolderStructure(version, cb) {
    var ofFolder = path.join(home, 'OpenFin');
    var rtFolder = path.join(ofFolder, 'Runtime');
    var rtVersionFolder = path.join(rtFolder, version);

    fs.mkdir(ofFolder, function() {
        fs.mkdir(rtFolder, function() {
            fs.mkdir(rtVersionFolder, function() {
                cb(null, rtVersionFolder);
            });
        });
    });
}

function getRuntimeStartPath(folder, cb) {
    var os = getRunningOs();
    var rPath = path.join(folder, os.runtimePath);
    fs.stat(rPath, function(err) {
        if (err) {
            cb(null);
        } else {
            cb(rPath);
        }
    });
}

function downloadRuntime(version, cb) {
    resolveRuntimeVersion(version, function(v) {
        if (v) {
            createFolderStructure(v, function(err, dstFolder) {
                if (err) {
                    cb(err);
                } else {
                    var tmpFile = path.join(dstFolder, 'tmp');
                    getRuntimeStartPath(dstFolder, function(runtimePath) {
                        if (runtimePath) {
                            fs.chmodSync(dstFolder, 0755);
                            cb(null, runtimePath);
                        } else {
                            log('downloading version: ' + v + '\n');
                            assetFetcher.downloadFile(getDownloadLocation(v), tmpFile, function(dlErr) {
                                if (dlErr) {

                                    log('Issue downloading ' + v + '\n' + dlErr.message + '\n');
                                    cb(dlErr);
                                } else {
                                    log('Download complete, now unziping \n');
                                    console.log(tmpFile, dstFolder);
                                    unzipFile(tmpFile, dstFolder, function() {
                                        log('Unzip complete, starting runtime \n');
                                        fs.unlink(tmpFile);
                                        downloadRuntime(version, cb);
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}


module.exports = {
    resolveRuntimeVersion: resolveRuntimeVersion,
    downloadRuntime: downloadRuntime,
    unzipFile: unzipFile
};
