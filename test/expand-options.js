/*global describe, it */
const assert = require('assert');
const expandOptions = require('../src/expand-options');

describe('expand-options', () => {

    it('Given an empty object should have defaults', () => {
        const testObj = expandOptions({});

        assert(typeof(testObj.rvmUrl) === 'string', 'expected rvmPath to be a string');
    });

    it('Given an object it should expand it', () => {
        const myObj = {
            myVal: 5            
        };

        const testObj = expandOptions(myObj);

        assert(typeof(testObj.rvmUrl) === 'string', 'expected rvmPath to be a string');
        assert(testObj.myVal === myObj.myVal, 'expected object to contain myVal');
    });
});