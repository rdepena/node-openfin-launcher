
#openfin-launcher
[![Build Status](https://travis-ci.org/openfin/node-openfin-launcher.svg?branch=master)](https://travis-ci.org/openfin/node-openfin-launcher)

A Node.js module that can download and launch the [OpenFin Runtime](http://openfin.co/).

Currently only supports Windows.

### Install

```sh
$ npm install --save openfin-launcher
```

### Usage

```js
var openfinLauncher = require('openfin-launcher');

//for a non hosted app.json file
openfinLauncher.launchOpenFin({
        configPath: 'file:/C:/helloWorld/app.json'
    })
    .then(function() {
        console.log('success!');
    })
    .fail(function(error) {
        console.log('error!', error);
    });

//or a hosted app.json file
openfinLauncher.launchOpenFin({
        configPath: 'http://localhost:5000/app.json'
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
## License

MIT
