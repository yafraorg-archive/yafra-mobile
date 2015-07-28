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
        console.log('test: value of debug: ' + appdebug);
    }));


    describe('constant appdebug', function() {
            it('should be a true', function() {
                expect(appdebug).toBe(true);
                console.log('test: value of debug: ' + appdebug);
            });
    });

    describe('constant appversion', function() {
            it('should appversion be set', function() {
                expect(appversion).toBeDefined();
                console.log('test: value of version: ' + appversion);
            });
    });
});