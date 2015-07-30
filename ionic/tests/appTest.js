/**
 * Created by mwn on 29/11/14.
 */

/*global describe, expect, beforeEach, it */
describe('Yafra App test loading', function() {
	'use strict';

	var appdebug, appversion;

	beforeEach(function() {
        module('YafraApp');
    });

    beforeEach(inject(function(_appdebug_, _appversion_) {
        appdebug = _appdebug_;
        appversion = _appversion_;
    }));


    describe('constant appdebug', function() {
        it('should be a true', function() {
            console.log('test: value of debug: ' + appdebug);
            expect(appdebug).toBe(true);
        });
    });

    describe('constant appversion', function() {
        it('should be set', function() {
            console.log('test: value of version: ' + appversion);
            expect(appversion).toBeDefined();
        });
    });
});