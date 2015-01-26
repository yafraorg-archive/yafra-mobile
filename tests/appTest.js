/**
 * Created by mwn on 29/11/14.
 */

/*global describe, expect, beforeEach, it */
describe("Test App Loading", function() {
	"use strict";

	var appdebug, appversion;

	beforeEach(module("MCBApp"));

	beforeEach(inject(function (_appdebug_, _appversion_) {
		appdebug = _appdebug_;
		appversion = _appversion_;
	}));

	describe("when invoked", function() {

		it('should appdebug true', function() {
			expect(appdebug).toBe(true);
			console.log("test: value of debug flag: " + appdebug);
		});

		it('should appversion be set', function() {
			expect(appversion).toBeDefined();
			console.log("test: value of version: " + appversion);
		});
	});

});