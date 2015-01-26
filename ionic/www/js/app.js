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
'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array or 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// Declare app level module which depends on filters, and services
var CliqueApp = angular.module('YafraApp', [
	'ionic',
	'ngResource',
	'ngCordova',
	'ngCordovaOauth',
	'YafraApp.services',
	'YafraApp.services-rest',
	'YafraApp.directives',
	'YafraApp.filters',
	'YafraApp.controllers']);

//CliqueApp.config(function ($compileProvider){
// Needed for routing to work
//  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
//});

// Version
CliqueApp.constant('appversion', '1.0.1');

// Debug mode
CliqueApp.constant('appdebug', true);

// Server URL
//CliqueApp.constant('mcbserver', 'http://app.maertplatz-clique.ch/v1');
CliqueApp.constant('mcbserver', 'http://192.168.9.26/mcb/v1');
///CliqueApp.constant('mcbserver', 'http://localhost:8080');
///CliqueApp.constant('mcbserver', 'http://192.168.9.12:8080');

CliqueApp.constant('mcbhelp', 'http://app.maertplatz-clique.ch/');

CliqueApp.run(['$ionicPlatform', '$cordovaPush', 'SysMsg', function($ionicPlatform, $cordovaPush, SysMsg) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
	    // register push notification and get local push token
	    localStorage.myPush = "";
	    if (SysMsg.isOnBrowser()) {
		    SysMsg.debug("run() - push dummy token registered - runs on Browser");
		    localStorage.myPush = "OnBrowserFakePushToken";
	    }
	    if (SysMsg.isOnAndroid()) {
		    var androidConfig = {
			    "senderID": "801750855365",
			    "ecb": "angular.element(document.querySelector('[ng-app]')).injector().get('Auth').onMcbPushNotification"
		    };
		    $cordovaPush.register(androidConfig).then(function (result) {
			    SysMsg.debug("run() - android push token registered got result: " + JSON.stringify(result));
		    }, function (err) {
			    SysMsg.debug("run() - android push token registered ERROR");
		    });
	    }
	    if (SysMsg.isOniOS()) {
		    var iosconfig = {
			    "badge": "true", "sound": "true", "alert": "true",
			    "ecb": "angular.element(document.querySelector('[ng-app]')).injector().get('Auth').onMcbPushNotification"
		    };
		    $cordovaPush.register(iosconfig).then(function (result) {
			    SysMsg.debug("run() - ios push token registered with result: " + JSON.stringify(result));
			    localStorage.myPush = result;
		    }, function (err) {
			    SysMsg.debug("run() - ios push token registered ERROR");
		    });
	    }

    });
}]);

/**
 * Routing table including associated controllers.
 */
CliqueApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('menu', {url: "/yafra", abstract: true, templateUrl: "templates/menu.html", controller: 'DefaultCtrl'})
		.state('menu.home', {url: '/home', views: {'menuContent': {templateUrl: 'templates/homeView.html', controller: 'DefaultCtrl'} }  })
		.state('menu.git', {url: '/git', views: {'menuContent': {templateUrl: 'templates/gitView.html', controller: 'DefaultCtrl'} }  })
		.state('menu.python', {url: '/python', views: {'menuContent': {templateUrl: 'templates/pythonView.html', controller: 'DefaultCtrl'} }  })
		.state('menu.php', {url: '/php', views: {'menuContent': {templateUrl: 'templates/phpView.html'} }  })
		.state('menu.nodejs', {url: '/nodejs', views: {'menuContent': {templateUrl: 'templates/nodejsView.html', controller: 'DefaultCtrl'} }  })
		.state('menu.java', {url: '/java', views: {'menuContent': {templateUrl: 'templates/javaView.html', controller: 'DefaultCtrl'} }  })
		.state('menu.int', {url: '/int', views: {'menuContent': {templateUrl: 'templates/intView.html', controller: 'IntCtrl'} }  })
		.state('menu.login', {url: '/login', views: {'menuContent': {templateUrl: 'templates/loginView.html', controller: 'LoginCtrl'} }  })
		.state('menu.help', {url: '/help', views: {'menuContent': {templateUrl: 'templates/helpView.html', controller: 'HelpCtrl'} }  });

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/yafra/home');
	//$ionicConfigProvider.views.maxCache(0);
}]);

