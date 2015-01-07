#OpenFin-Launcher
[![Build Status](https://travis-ci.org/openfin/node-openfin-launcher.svg?branch=master)](https://travis-ci.org/openfin/node-openfin-launcher)

OpenFin-Launcher is an Node.js module that automates the downloading and launching of The [OpenFin Runtime](http://openfin.co/). This module asumes you have an application config file. You can read up on application config options on the [OpenFin config file API docs](http://openfin.co/developers.html?url=developers/api/config/overview.html), or generate it automatically with the [openfin-config-builder](https://github.com/openfin/node-openfin-config-builder).

>Currently only supports Windows.

## Getting Started

```sh
$ npm install --save openfin-launcher
```

## Usage

```js
var openfinLauncher = require('openfin-launcher');

openfinLauncher.launchOpenFin({
        //Launch a hosted application
        configPath: 'http://localhost:5000/app.json'
        //Or a form a file path
        //configPath: 'file:/C:/helloWorld/app.json'
    })
    .then(function() {
        console.log('success!');
    })
    .fail(function(error) {
        console.log('error!', error);
    });

//you can also specify the location of the OpenFin Runtime rvm and the download url
openfinLauncher.launchOpenFin({
        configPath: 'http://localhost:5000/app.json',
        rvmPath: 'C:/helloWorld/OpenFinRMV.exe',
        rvmUrl: 'https://developer.openfin.co/release/rvm/latest'
    })
    .then(function() {
        console.log('success!');
    })
    .fail(function(error) {
        console.log('error!', error);
    });

```

##Options

####configPath
Type: `String`

Default Value: ''

OpenFin Application Configuration file path as described in the [OpenFin config file API docs](http://openfin.co/developers.html?url=developers/api/config/overview.html).

Examples: 
```js
'http://localhost:3000/app.json'
'file:/C:/helloWorld/app.json'
```

####rvmPath
Type: `String`

Default Value: `path.resolve('OpenFinRVM.exe');`

OpenFin RVM location, if not found at the specified path the latest version will be downloaded.

###rvmUrl
Type: `String`

Default Value: `https://developer.openfin.co/release/rvm/latest`

Location to the OpenFin RVM downoad URL, if the OpenFin RVM is not found this URL will be used to download the binary.

## License

MIT
