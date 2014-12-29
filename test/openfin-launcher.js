/*global describe, it */
'use strict';
var openfinLauncher = require('../'),
    expect = require('chai').expect;

describe('openfin-launcher', function() {
    describe('launchOpenFin function', function() {
        it('should exist', function() {
            expect(openfinLauncher.launchOpenFin).not.be.undefined();
        });
    });
});
