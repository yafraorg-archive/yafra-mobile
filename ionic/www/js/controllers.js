/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var McbController = angular.module('YafraApp.controllers', []);


/**
 * Default controller
 */
McbController.controller('DefaultCtrl', function ($scope, Auth) {
	'use strict';
	$scope.authenticated = Auth.checkLogin(false);
	$scope.mcbuser = Auth.getUser();

	$scope.$on('$ionicView.beforeEnter', function () {
		$scope.mcbuser = Auth.getUser();
		$scope.authenticated = Auth.checkLogin(false);
	});
});

/**
 * LOGIN / AUTH controller - check and save CODE
 */
McbController.controller('LoginCtrl', ['$scope', '$window', '$state', '$http', 'Auth', 'SysMsg', '$cordovaOauth', 'appdebug', function ($scope, $window, $state, $http, Auth, SysMsg, $cordovaOauth, appdebug) {

	'use strict';
	$scope.authenticated = Auth.checkLogin(false);
	$scope.mcbuser = Auth.getUser();
	$scope.appdebug = appdebug;
	$scope.checked = false;
	$scope.formLogin = {};
	$scope.formLogin.regEmail = $scope.mcbuser.regEmail;
	$scope.myPush = localStorage.myPush;

	$scope.$on('app.loggedIn', function(event, args) {
		SysMsg.debug("LoginCtrl: app.loggedIn event");
		$scope.mcbuser.loggedIn = true;
		$scope.authenticated = true;
		SysMsg.debug("LoginCtrl loggedIn flag value " + $scope.mcbuser.loggedIn);
		$state.go('menu.int', {}, { reload: true });
	});
	$scope.$on('app.loggedOut', function(event, args) {
		SysMsg.debug("LoginCtrl: app.loggedOut event");
		$scope.mcbuser.loggedIn = false;
		$scope.authenticated = false;
		$scope.checked = false;
		$state.go('menu.int', {}, { reload: true });
		//$scope.$apply(function () {
		//});
		//$window.location.reload(true);
	});

	// reset the CODE to null and logout
	$scope.doLogout = function () {
		SysMsg.debug("LoginCtrl: LOGOUT process start");
		Auth.logout();
		$scope.mcbuser = Auth.getUser();
		SysMsg.showInfoAndLog('Du hesch di jetzt grad abgmäldet.', 'LoginCtrl', 'LoginCtrl: LOGOUT process stop');
	};

	// check the CODE based on click
	$scope.check = function () {
		var localDevice = SysMsg.device();
		SysMsg.debug("LoginCtrl: CHECK process start");
		Auth.validateLogin(true);
		SysMsg.debug("validateLogin got user device ok");
		// TODO: update token on iOS - Android is fix / check oauth date and re validate or ask to login again
		$scope.checked = true;
		return true;

	};


	$scope.dropboxLogin = function () {
		$cordovaOauth.dropbox("nxosb67fa0srr4z").then(function (result) {
			$scope.authenticated = true;
			SysMsg.debug("oauth result dropbox: " + JSON.stringify(result));
			$scope.mcbuser = {
				oauthProvider: 3,
				oauthProviderName: "dropbox",
				oauthAccessToken: result.access_token,
				oauthEmail: "data.email",
				regEmail: "data.name",
				oauthName: "data.name"
			};
			Auth.login($scope.mcbuser);
		}, function (error) {
			$scope.authenticated = false;
			SysMsg.debug("oauth dropbox error " + error);
		});
	};

	$scope.linkedinLogin = function () {
		$cordovaOauth.linkedin("77sir360ntx5zy", "5R2c4VzPC95TyYP5", ["r_emailaddress", "r_basicprofile"]).then(function (result) {
			$scope.authenticated = true;
			SysMsg.debug("oauth result linkedin: " + JSON.stringify(result));
			$scope.mcbuser = {
				oauthProvider: 2,
				oauthProviderName: "linkedin",
				oauthAccessToken: result.access_token,
				oauthEmail: "data.email",
				regEmail: "data.name",
				oauthName: "data.name"
			};
			Auth.login($scope.mcbuser);
		}, function (error) {
			$scope.authenticated = false;
			SysMsg.debug("oauth linkedin error " + error);
		});
	};

	$scope.googleLogin = function () {
		$cordovaOauth.google("801750855365-37vv84e8gr0o5901nm4t3u775rbmrtgq.apps.googleusercontent.com", ["email"]).then(function (result) {
			SysMsg.debug("oauth result google: " + JSON.stringify(result));

			$http.defaults.headers.common.Authorization = result.token_type + ' ' + result.access_token;
			$http({method: "get", url: "https://www.googleapis.com/userinfo/v2/me"})
				.success(function (data) {
					SysMsg.debug("oauth 2nd result google: " + JSON.stringify(data));
					$scope.authenticated = true;
					$scope.mcbuser = {
						oauthProvider: 1,
						oauthProviderName: "Google",
						oauthAccessToken: result.access_token,
						oauthEmail: data.email,
						regEmail: $scope.formLogin.regEmail,
						oauthName: data.name
					};
					Auth.login($scope.mcbuser);
					SysMsg.debug("reg email is: " + $scope.mcbuser.regEmail);
					SysMsg.debug("oauth debug login OK with oauthemail: " + $scope.mcbuser.oauthEmail);
				})
				.error(function (data, status) {
					$scope.authenticated = false;
					SysMsg.debug("oauth google get ERROR: " + status);
				});

		}, function (error) {
			$scope.authenticated = false;
			SysMsg.debug("oauth google error " + error);
		});
	};

	$scope.debugLogin = function () {
		var retCode;
		SysMsg.debug("LoginCtrl: LOGIN DEBUG process start");
		$scope.mcbuser = {
			loggedIn: false,
			check: false,
			oauthProvider: 0,
			oauthProviderName: "Debug",
			oauthAccessToken: "MCB-DEBUG-dummytoken1234" + $scope.formLogin.regEmail,
			oauthEmail: $scope.formLogin.regEmail,
			regEmail: $scope.formLogin.regEmail,
			oauthName: $scope.formLogin.regEmail
		};
		SysMsg.debug("LoginCtrl: LOGIN DEBUG reg email is: " + $scope.formLogin.regEmail);
		retCode = Auth.login($scope.mcbuser);
		$scope.mcbuser = Auth.getUser();
	};

}]);

/**
 * A simple example service that returns some data.
 */
McbController.controller('HelpCtrl', ['$scope', 'appversion', 'SysMsg', 'mcbhelp', function ($scope, appversion, SysMsg, mcbhelp) {
	// Help controller, giving some about infos
	'use strict';
	$scope.version = appversion;
	$scope.device = SysMsg.device();
	$scope.url = mcbhelp;
	SysMsg.debug("help web page is: " + $scope.url);
	$scope.closeBrowser = function () {
		$scope.infotext = 'Closed browser';
	};
	$scope.loadStart = function () {
		$scope.infotext = 'load start browser';
	};
	$scope.loadStop = function () {
		$scope.infotext = 'load stop browser';
	};
	$scope.loadError = function () {
		$scope.infotext = 'load error with browser';
	};
}]);
