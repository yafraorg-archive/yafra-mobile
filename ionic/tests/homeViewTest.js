/**
 * Created by mwn on 29/11/14.
 */
"use strict";
describe("Test App Loading", function() {

	beforeEach(module("YafraApp"));
	beforeEach(module('YafraApp.services'));

	var appdebug, $cordovaDevice, SysMsg;

	beforeEach(inject(function (_SysMsg_, _appdebug_, _$cordovaDevice_) {
		SysMsg = _SysMsg_;
		appdebug = _appdebug_;
		$cordovaDevice = _$cordovaDevice_;
	}));

	describe("when invoked", function() {

		it('should have a method to check if the path is active', function() {
			SysMsg.debug("test");
		});
	});

});