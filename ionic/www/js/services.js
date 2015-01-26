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
var McbService = angular.module('YafraApp.services', []);

/**
 * Handle system / error messages through dialogs (native or javascript)
 */
McbService.factory("SysMsg", ['appdebug', '$cordovaDevice', '$cordovaDialogs', function (appdebug, $cordovaDevice, $cordovaDialogs) {
	'use strict';
	return {
		showAlert: function (message, title, buttonName) {
			$cordovaDialogs.alert(message, title, buttonName)
				.then(function() {
					// callback success - not used
				});
			if (appdebug)
				console.log("MCB log ERROR -> " + title + " " + message);
		},
		showAlertAndLog: function (message, objectName, errorMessage) {
			$cordovaDialogs.alert(message, "MCB App Fehler", "OK")
				.then(function() {
					// callback success - not used
				});
			if (appdebug)
				console.log("MCB log ERROR - " + objectName + " -> " + message + " error message: " + errorMessage);
		},
		showInfoAndLog: function (message, objectName, logMessage) {
			$cordovaDialogs.alert(message, "MCB App Info", "OK")
				.then(function() {
					// callback success - not used
				});
			if (appdebug)
				console.log("MCB log - " + objectName + " -> " + message + " info message: " + logMessage);
		},
		showConfirmSimple: function (message, title) {
			$cordovaDialogs.confirm(message, title, ['OK'])
				.then(function(buttonIndex) {
						// callback success - not used
				});
			if (appdebug)
				console.log("MCB log simple confirm -> " + message);
		},
		showConfirm: function (message, confirmCallback, title, buttonLabels) {
			$cordovaDialogs.confirm(message, title, buttonLabels)
				.then(function(buttonIndex) {
					confirmCallback(buttonIndex);
				});
		},
		debug: function (message) {
			if (appdebug)
				console.log("MCB log -> " + message);
		},
		device: function () {
			var checkdevice = ionic.Platform.device();
			var device = {};
			if (checkdevice.model != undefined) {
				device.platform = $cordovaDevice.getPlatform();
				device.model = $cordovaDevice.getModel();
				device.version = $cordovaDevice.getVersion();
				device.uuid = $cordovaDevice.getUUID();
			} else {
				device.platform = 'Desktop';
				device.model = 'Desktop';
				device.version = '1';
				device.uuid = navigator.userAgent.substr(0, 4);
			}
			return device;
		},
		isOnBrowser: function () {
			var checkdevice = ionic.Platform.device();
			if (checkdevice.model != undefined) {
				if (checkdevice.model != 'x86_64') {
					return false; // runs on device as device is defined
				}
			}
			return true; // runs on browser as device is undefined
		},
		isOnAndroid: function () {
			var checkdevice = ionic.Platform.device();
			if (checkdevice.platform === 'android' || checkdevice.platform === 'Android') {
				return true; // runs on device as device is defined
			}
			return false; // runs on browser as device is undefined
		},
		isOniOS: function () {
			var checkdevice = ionic.Platform.device();
			if (checkdevice.platform === 'iOS') {
					return true; // runs on device as device is defined
			}
			return false; // runs on browser as device is undefined
		}
	};
}]);

/**
 * Check if CODE is available and valid
 */
McbService.factory('Auth', ['$rootScope', '$state', 'SysMsg', '$cordovaPush', 'MsgIndicator', function ($rootScope, $state, SysMsg, $cordovaPush, MsgIndicator) {
	'use strict';
	var mcbuser = {
		'loggedIn': false,
		'checked': false,
		'oauthProvider': '',
		'oauthProviderName': 'n/a',
		'oauthAccessToken': '',
		'oauthEmail': '',
		'oauthName': 'n/a',
		'regEmail': '',
		'pushToken': '',
		'userId': 0
	};

/*	window.onNotificationGCM = function(e) {
	};
*/
	/**
	 * getter for mcbuser
	 * @method RegisterDeviceLocal
	 * @param {String} provider - oauth provider
	 * @return {Boolean} Returns true on success
	 */
	function getMcbUserLocal() {
		// set mcbuser with values from parameter given by this function
		mcbuser = {
			loggedIn: localStorage.loggedIn,
			checked: localStorage.checked,
			oauthProvider: parseInt(localStorage.oauthProvider),
			oauthProviderName: localStorage.oauthProviderName,
			oauthAccessToken: localStorage.oauthAccessToken,
			oauthEmail: localStorage.oauthEmail,
			regEmail: localStorage.regEmail,
			oauthName: localStorage.oauthName,
			pushToken: localStorage.pushToken,
			userId: parseInt(localStorage.userId)
		};
		return mcbuser;
	}

	/**
	 * setter for mcbuser
	 * @method setMcbUserLocal
	 * @return {Object} Returns mcbuser
	 */
	function setMcbUserLocal(loggedIn, checked, oauthProvider, oauthProviderName, oauthAccessToken, oauthEmail, oauthName, regEmail, pushToken, userId) {
		mcbuser = {
			loggedIn: loggedIn,
			checked: checked,
			oauthProvider: oauthProvider,
			oauthProviderName: oauthProviderName,
			oauthAccessToken: oauthAccessToken,
			oauthEmail: oauthEmail,
			regEmail: regEmail,
			oauthName: oauthName,
			pushToken: pushToken,
			userId: userId
		};
		localStorage.loggedIn = mcbuser.loggedIn;
		localStorage.checked = mcbuser.checked;
		localStorage.oauthProvider = mcbuser.oauthProvider;
		localStorage.oauthProviderName = mcbuser.oauthProviderName;
		localStorage.oauthAccessToken = mcbuser.oauthAccessToken;
		localStorage.oauthEmail = mcbuser.oauthEmail;
		localStorage.regEmail = mcbuser.regEmail;
		localStorage.oauthName = mcbuser.oauthName;
		localStorage.pushToken = mcbuser.pushToken;
		localStorage.userId = mcbuser.userId;
	}

	/**
	 * local method to register a new device on the server
	 * @method RegisterDeviceLocal
	 * @param {Object} LocalMcbUser - user object
	 * @param {Object} LocalMcbDevice - device object
	 * @return {Boolean} Returns true on success
	 */
	function RegisterDeviceLocal(LocalMcbUser, LocalMcbDevice) {
		SysMsg.debug("Auth RegisterDeviceLocal start");
		if (SysMsg.isOnBrowser()) {
			LocalMcbDevice.uuid = LocalMcbDevice.uuid + "-" + LocalMcbUser.regEmail;
		}
		SysMsg.debug("Auth RegisterDeviceLocal done OK - calling now SendLoginLocal");
		SendLoginLocal(LocalMcbUser, LocalMcbDevice);
	}

	/**
	 * local method to update or save login data on this device
	 * @method SendLoginLocal
	 * @param {Object} LocalMcbUser - user object
	 * @param {Object} LocalMcbDevice - device object
	 * @return {Boolean} Returns true on success
	 */
	function SendLoginLocal(LocalMcbUser, LocalMcbDevice) {
		SysMsg.debug("Auth SendLoginLocal start with token " + LocalMcbUser.pushToken);
		if (SysMsg.isOnAndroid()) {
			if (localStorage.myPush !== null) {
				LocalMcbUser.pushToken = localStorage.myPush;
			}
		}
		SysMsg.debug("Auth SendLoginLocal - MCBUser save done OK");
		SysMsg.debug("Auth SendLoginLocal: got userdevice");
		// TODO add a date of login (or on the server) so we can check the apikey validity
		// All done - set final user with all data and set as logged in and checked
		localStorage.loggedIn = true;
		setMcbUserLocal(true, true, LocalMcbUser.oauthProvider, LocalMcbUser.oauthProvider, LocalMcbUser.oauthAccessToken, LocalMcbUser.oauthEmail, LocalMcbUser.oauthName, LocalMcbUser.regEmail, LocalMcbUser.pushToken, LocalMcbUser.user);
		$rootScope.$broadcast('app.loggedIn');
	}

	return {
		/**
		 * Check if logged in and valid with option to raise local message
		 * @method checkLogin
		 * @param {Boolean} showerror - show on error a local message or not
		 * @return {Boolean} Returns true on success
		 */
		checkLogin: function (showerror) {
			// Check if logged in and fire events
			// TODO: update token and check oauth date and re validate or ask to login again
			if (localStorage.oauthAccessToken == null) {
				SysMsg.debug("Auth checkLogin FALSE null oauthAccessToken");
				localStorage.loggedIn = false;
				if (showerror) {
					SysMsg.showAlert(
						'Du bist nicht angemeldet, bitte anmelden um erweiterte Funktionen zu nutzen!', // message
						'Anmeldung', 'Ha verstande' // title and buttonName
					);
				}
				return false;
			} else if (localStorage.loggedIn === "false") {
				SysMsg.debug("Auth checkLogin FALSE - localstorage loggedIn flag is false");
				if (showerror) {
					SysMsg.showAlert(
						'Du bist nicht angemeldet, bitte anmelden um erweiterte Funktionen zu nutzen!', // message
						'Anmeldung', 'Ha verstande' // title and buttonName
					);
				}
				return false;
			} else {
				// check if accesstoken is still valid!
				return true;
			}
		},
		/**
		 * validate login and tokens
		 * @method validateLogin
		 * @param {Boolean} showerror - show on error a local message or not
		 * @return {Boolean} Returns true on success
		 */
		validateLogin: function (showerror) {
			// Check if logged in and fire events
			SysMsg.debug("Auth validateLogin start");
			var localDevice = SysMsg.device();
			var localUser = getMcbUserLocal();
			if (localUser.oauthAccessToken == null) {
				SysMsg.debug("Auth validateLogin FALSE null oauthAccessToken");
				if (showerror) {
					SysMsg.showAlert(
						'Du bist nicht angemeldet, bitte anmelden um erweiterte Funktionen zu nutzen!', // message
						'Anmeldung', 'Ha verstande' // title and buttonName
					);
				}
				return false;
			}
			return true;
		},
		/**
		 * getter for user
		 * @method getUser
		 * @return {Object} Returns the user
		 */
		getUser: function () {
			var localUser;
			localUser = getMcbUserLocal();
			return localUser; //we need some way to access actual variable value
		},
		/**
		 * Save the device push token on the server
		 * @method setUserToken
		 * @param {string} token - device push token
		 * @param {string} apiKey - oauth API key to be updated
		 */
		setUserToken: function (token, apiKey) {
			var returnCode;
			var MyDevice = SysMsg.device();
			var localUser;
			SysMsg.debug("Auth setUserToken - got token " + JSON.stringify(token));
			localUser = getMcbUserLocal();
			localUser.pushToken = token;
			// TODO: set updated API key oauthAccessToken
			returnCode = SendLoginLocal(localUser, MyDevice);
		},
		/**
		 * Do a user login and write data to server
		 * @method login
		 * @param {Object} mcbuser - user object as defined by this service
		 * @return {Boolean} Returns true on success
		 */
		login: function (user) {
			// Do the login
			// When done, trigger an event:
			var returnCode;
			var mcbdevice = SysMsg.device();
			localStorage.backgroundGps = '0';
			localStorage.myPush = "";

			if (user.oauthAccessToken === null) {
				SysMsg.debug("Auth login - wrong accesstoken given " + JSON.stringify(user));
				localStorage.loggedIn = false;
				return false;
			}

			setMcbUserLocal(false, false, user.oauthProvider, user.oauthProviderName, user.oauthAccessToken, user.oauthEmail, user.oauthName, user.regEmail, "empty", 0);
			var myUser = getMcbUserLocal();

			SysMsg.debug("Auth login - platform is: " + mcbdevice.platform);

			// do login for browser based usage / debug
			if (SysMsg.isOnBrowser()) {
				SysMsg.debug("Auth login - push dummy token registered - runs on Browser");
				user.pushToken = "OnBrowserFakePushToken";
				localStorage.myPush = user.pushToken;
				returnCode = RegisterDeviceLocal(user, mcbdevice);
				if (returnCode === false) {
					SysMsg.debug("Auth login - debugLogin error from Register Device Local");
					setMcbUserLocal(false, false, user.oauthProvider, user.oauthProviderName, user.oauthAccessToken, user.oauthEmail, user.oauthName, user.regEmail, user.pushToken, user.userId);
				}
				return returnCode;
			}

			// do login for Android
			if (SysMsg.isOnAndroid()) {
				var androidConfig = {
					"senderID": "801750855365",
					"ecb": "angular.element(document.querySelector('[ng-app]')).injector().get('Auth').onMcbPushNotification"
					};
				if (localStorage.myPush === "") {
					$cordovaPush.register(androidConfig).then(function (result) {
						SysMsg.debug("Auth login - android reg with mcbuser as " + user.oauthEmail);
						returnCode = RegisterDeviceLocal(user, mcbdevice);
						return returnCode;
					}, function (err) {
						// An error occured. Show a message to the user
						localStorage.loggedIn = false;
						SysMsg.debug("Auth login - android push token registered ERROR");
						return false;
						});
				} else {
					SysMsg.debug("Auth login - android push token already available - using it: " + localStorage.myPush);
					user.pushToken = localStorage.myPush;
					returnCode = RegisterDeviceLocal(user, mcbdevice);
					return returnCode;
					}
				}

			// do login for Apple iOS
			if (SysMsg.isOniOS()) {
				var iosconfig = {
					"badge": "true",
					"sound": "true",
					"alert": "true",
					"ecb": "angular.element(document.querySelector('[ng-app]')).injector().get('Auth').onMcbPushNotification"
					};
				if (localStorage.myPush === "") {
					$cordovaPush.register(iosconfig).then(function (result) {
						SysMsg.debug("Auth login - ios push token registered with result: " + JSON.stringify(result));
						user.pushToken = result;
						localStorage.myPush = result;
						returnCode = RegisterDeviceLocal(user, mcbdevice);
						return returnCode;
					}, function (err) {
						// An error occured. Show a message to the user
						localStorage.loggedIn = false;
						SysMsg.debug("Auth login - ios push token registered ERROR");
						return false;
					});
				} else {
					SysMsg.debug("Auth login - ios push token already available - using it: " + localStorage.myPush);
					user.pushToken = localStorage.myPush;
					returnCode = RegisterDeviceLocal(user, mcbdevice);
					return returnCode;
				}
			}
		},
		/**
		 * Do a logout on this device - de register device
		 * @method logout
		 * @return {Boolean} Returns true on success
		 */
		logout: function () {
			var myDevice = SysMsg.device();
			var myUser = getMcbUserLocal();
			if (SysMsg.isOnBrowser()) {
				SysMsg.debug("Auth logout - push dummy token unregistered - runs on Browser");
				myDevice.uuid = myDevice.uuid + "-" + myUser.regEmail;
			} else {
				$cordovaPush.unregister().then(function (result) {
					SysMsg.debug("Auth logout - push token unregistered");
				}, function (err) {
					SysMsg.debug("Auth logout - push token unregistered ERROR");
				});
			}
			SysMsg.debug("Auth logout - LogoutUser done OK");
			localStorage.loggedIn = false;
			localStorage.checked = true;
			localStorage.removeItem('oauthAccessToken');
			localStorage.removeItem('oauthProvider');
			localStorage.removeItem('oauthProviderName');
			localStorage.removeItem('oauthEmail');
			// localStorage.removeItem('regEmail');
			localStorage.removeItem('oauthName');
			localStorage.removeItem('pushToken');
			localStorage.removeItem('userId');
			localStorage.removeItem('myPush');
			localStorage.removeItem('MsgIndicator');
			localStorage.backgroundGps = '0';
			mcbuser = {
				'loggedIn': false,
				'checked': false,
				'oauthProvider': '',
				'oauthProviderName': 'n/a',
				'oauthAccessToken': '',
				'oauthEmail': '',
				'oauthName': 'n/a',
				'regEmail': '',
				'pushToken': '',
				'userId': 0
			};
			$rootScope.$broadcast('app.loggedOut');
			SysMsg.debug("Auth logout - done");
		},
		/**
		 * global google GCM push event
		 * @method window.onNotificationGCM
		 * @param {Object} e - event object
		 */
		onMcbPushNotification: function(e) {
			// receive notification
			SysMsg.debug("Auth pushNotification: got message event " + JSON.stringify(e));
			var myUser = getMcbUserLocal();
			if (SysMsg.isOnAndroid()) {
				switch (e.event) {
					case 'registered':
						if (e.regid.length > 0) {
							SysMsg.debug("Auth pushNotification - android push token registered got result: " + e.regid);
							localStorage.myPush = e.regid;
						}
						break;

					case 'message':
						// this is the actual push notification. its format depends on the data model     from the push server
						SysMsg.debug("Auth pushNotification - android push message got: " + e.message);
						if (e.foreground === false) {
							if (e.payload.user !== myUser.userId) {
								MsgIndicator.setNewMsgIndicators(e.payload.group);
								$state.go("menu.chat", {grpid: e.payload.group});
							}
						} else {
							if (e.payload.user !== myUser.userId) {
								SysMsg.showConfirmSimple(e.payload.username + ': ' + e.message, 'Neii Nochricht');
								MsgIndicator.setNewMsgIndicators(e.payload.group);
								}
						}
						break;

					case 'error':
						SysMsg.debug("Auth pushNotification - android push GCM error: " + e.msg);
						break;

					default:
						SysMsg.debug('Auth pushNotification - android unknown GCM event has occurred');
						break;
				}
			}
			if (SysMsg.isOniOS()) {
				SysMsg.debug("Auth pushNotification iOS: got message event " + e.alert + " in group " + e.group);
				if (e.foreground === "0") {
					if (e.user !== myUser.userId) {
						MsgIndicator.setNewMsgIndicators(e.group);
						$state.go("menu.chat", {grpid: e.group});
					}
				} else {
					if (e.user !== myUser.userId) {
						MsgIndicator.setNewMsgIndicators(e.group);
						SysMsg.showConfirmSimple(e.alert, 'Neii Nochricht');
					}
				}
			}
		}
	};
}]);


/**
 * Handle system / error messages through dialogs (native or javascript)
 */
McbService.factory('MsgIndicator', ['SysMsg', function (SysMsg) {
	'use strict';
	var msgIndicators = [];
	var msgGroupInfo = {};
	var found = false;

	function setMsgArray(groupId) {
		msgIndicators = getMsgArray();
		SysMsg.debug("msg indicator service - NEW group localstorage is: " + JSON.stringify(msgIndicators));
		if (msgIndicators === null) {
			msgIndicators = [];
			msgIndicators.push({groupId: groupId, count: 1});
			localStorage.setItem("MsgIndicator", JSON.stringify(msgIndicators));
			return;
		}
		for (var i=0; i<msgIndicators.length; i++) {
			if (msgIndicators[i].groupId === groupId) {
				msgIndicators[i].count += 1;
				found = true;
				break;
			}
		}
		if (found !== true) {
			msgIndicators.push({groupId: groupId, count: 1});
			return;
		}
		localStorage.setItem("MsgIndicator", JSON.stringify(msgIndicators));
		return;
	}

	function getMsgArray() {
		return JSON.parse(localStorage.getItem("MsgIndicator"));
	}

	function clearMsgGroupIndicator(groupId) {
		msgIndicators = getMsgArray();
		SysMsg.debug("msg indicator service - CLEAR group - localstorage is: " + JSON.stringify(msgIndicators));
		if (msgIndicators !== null) {
			//SysMsg.debug("msg indicator service - reset group");
			for (var i=0; i<msgIndicators.length; i++) {
				if (parseInt(msgIndicators[i].groupId) === parseInt(groupId)) {
					//SysMsg.debug("msg indicator service - reset group " + typeof msgIndicators[i].groupId + " " + typeof groupId);
					msgIndicators[i].count = 0;
					break;
				}
			}
		}
		localStorage.setItem("MsgIndicator", JSON.stringify(msgIndicators));
		return;
	}

	return {
		getNewMsgIndicators: function () {
			return getMsgArray();
		},
		setNewMsgIndicators: function (groupId) {
			setMsgArray(groupId);
		},
		clearGroup: function (groupId) {
			clearMsgGroupIndicator(groupId);
		},
		clearNewMsgIndicators: function () {
			localStorage.removeItem('MsgIndicator');
		}
	};
}]);

