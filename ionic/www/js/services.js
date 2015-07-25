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
/*global ionic */

var YafraService = angular.module('YafraApp.services', []);
/**
 * Handle system / error messages through dialogs (native or javascript)
 */
YafraService.factory('SysMsg', ['appdebug', '$cordovaDevice', '$cordovaDialogs', function (appdebug, $cordovaDevice, $cordovaDialogs) {
	'use strict';
	return {
		showAlert: function (message, title, buttonName) {
			$cordovaDialogs.alert(message, title, buttonName)
				.then(function() {
					// callback success - not used
				});
			if (appdebug)
				console.log('YAFRA log ERROR -> ' + title + ' ' + message);
		},
		showAlertAndLog: function (message, objectName, errorMessage) {
			$cordovaDialogs.alert(message, 'YAFRA App error', 'OK')
				.then(function() {
					// callback success - not used
				});
			if (appdebug)
				console.log('YAFRA log ERROR - ' + objectName + ' -> ' + message + ' error message: ' + errorMessage);
		},
		showInfoAndLog: function (message, objectName, logMessage) {
			$cordovaDialogs.alert(message, 'YAFRA App info', 'OK')
				.then(function() {
					// callback success - not used
				});
			if (appdebug)
				console.log('YAFRA log - ' + objectName + ' -> ' + message + ' info message: ' + logMessage);
		},
		showConfirmSimple: function (message, title) {
			$cordovaDialogs.confirm(message, title, ['OK'])
				.then(function(buttonIndex) {
					// callback success - not used
				});
			if (appdebug)
				console.log('YAFRA log simple confirm -> ' + message);
		},
		showConfirm: function (message, confirmCallback, title, buttonLabels) {
			$cordovaDialogs.confirm(message, title, buttonLabels)
				.then(function(buttonIndex) {
					confirmCallback(buttonIndex);
				});
		},
		debug: function (message) {
			if (appdebug)
				console.log('YAFRA log -> ' + message);
		},
		logConsole: function (message) {
			console.log(message);
		},
		device: function () {
			var checkdevice = ionic.Platform.device();
			var device = {};
			if (checkdevice.model !== undefined) {
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
			if (checkdevice.model !== undefined) {
				if (checkdevice.model !== 'x86_64') {
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
YafraService.factory('Push', ['$rootScope', '$state', 'SysMsg', '$cordovaPush', 'MsgIndicator', function ($rootScope, $state, SysMsg, $cordovaPush, MsgIndicator) {
	'use strict';
	var yafradevice = {
		'registered': false,
		'deviceId': '',
		'pushToken': '',
		'userId': 0
	};

	/**
	 * getter for yafradevice
	 * @method RegisterDeviceLocal
	 * @param {String} provider - oauth provider
	 * @return {Boolean} Returns true on success
	 */
	function internalGetDevice() {
		// set yafradevice with values from parameter given by this function
		yafradevice = {
			registered: localStorage.registered,
			deviceId: localStorage.deviceId,
			pushToken: localStorage.pushToken,
			userId: parseInt(localStorage.userId)
		};
		return yafradevice;
	}

	/**
	 * setter for yafradevice
	 * @method setyafradeviceLocal
	 * @return {Object} Returns yafradevice
	 */
	function internalSetDevice(registered, deviceId, pushToken, userId) {
		yafradevice = {
			registered: registered,
			deviceId: deviceId,
			pushToken: pushToken,
			userId: userId
		};
		localStorage.registered = yafradevice.registered;
		localStorage.deviceId = yafradevice.deviceId;
		localStorage.pushToken = yafradevice.pushToken;
		localStorage.userId = yafradevice.userId;
	}

	/**
	 * local method to register a new device on the server
	 * @method RegisterDeviceLocal
	 * @param {Object} Localyafradevice - user object
	 * @param {Object} LocalMcbDevice - device object
	 * @return {Boolean} Returns true on success
	 */
	function RegisterDeviceLocal(Localyafrauser, LocalYafraDevice) {
		SysMsg.debug('Auth RegisterDeviceLocal start');
		if (SysMsg.isOnBrowser()) {
            LocalYafraDevice.uuid = LocalYafraDevice.uuid + '-' + Localyafrauser.regEmail;
		}
		SysMsg.debug('Auth RegisterDeviceLocal done OK - calling now SendLoginLocal');
		// TODO send to backend
	}

	return {
		/**
		 * Check if logged in and valid with option to raise local message
		 * @method checkLogin
		 * @param {Boolean} showerror - show on error a local message or not
		 * @return {Boolean} Returns true on success
		 */
		checkDevice: function (showerror) {
			// Check if logged in and fire events
			// TODO: update token and check oauth date and re validate or ask to login again
			if (localStorage.registered === false) {
				SysMsg.debug('Push checkLogin is false - not registered yet');
				// TODO register
				if (showerror) {
					SysMsg.showAlertAndLog('Your device is not yet registered for push!');
				}
			} else {
				// check if accesstoken is still valid!
				return true;
			}
		},
		/**
		 * getter for user
		 * @method getUser
		 * @return {Object} Returns the user
		 */
		getDevice: function () {
			var device;
            device = internalGetDevice();
			return device; //we need some way to access actual variable value
		},
		/**
		 * Save the device push token on the server
		 * @method setUserToken
		 * @param {string} token - device push token
		 * @param {string} apiKey - oauth API key to be updated
		 */
		setDevice: function (token, apiKey) {
			var returnCode;
			var MyDevice = SysMsg.device();
			var localUser;
			SysMsg.debug('Auth setUserToken - got token ' + JSON.stringify(token));
			localUser = internalGetDevice();
			localUser.pushToken = token;
			// TODO send to backend
		},
		/**
		 * Do a user login and write data to server
		 * @method login
		 * @param {Object} yafradevice - user object as defined by this service
		 * @return {Boolean} Returns true on success
		 */
		login: function (user) {
			// Do the login
			// When done, trigger an event:
			var returnCode;
			var mcbdevice = SysMsg.device();
			localStorage.myPush = '';
            internalSetDevice(false, '', 'empty', 0);
			var myUser = internalGetDevice();

			SysMsg.debug('Auth login - platform is: ' + mcbdevice.platform);

			// do login for browser based usage / debug
			if (SysMsg.isOnBrowser()) {
				SysMsg.debug('Auth login - push dummy token registered - runs on Browser');
				user.pushToken = 'OnBrowserFakePushToken';
				localStorage.myPush = user.pushToken;
				returnCode = RegisterDeviceLocal(user, mcbdevice);
				if (returnCode === false) {
					SysMsg.debug('Auth login - debugLogin error from Register Device Local');
                    internalSetDevice(false, '', 'empty', 0);
				}
				return returnCode;
			}

			// do login for Android
			if (SysMsg.isOnAndroid()) {
				var androidConfig = {
					'senderID': '000000000',
					'ecb': "angular.element(document.querySelector('[ng-app]')).injector().get('Auth').onMcbPushNotification"
					};
				if (localStorage.myPush === '') {
					$cordovaPush.register(androidConfig).then(function (result) {
						SysMsg.debug('Auth login - android reg with yafradevice as ' + user.oauthEmail);
						returnCode = RegisterDeviceLocal(user, mcbdevice);
						return returnCode;
					}, function (err) {
						// An error occured. Show a message to the user
						localStorage.loggedIn = false;
						SysMsg.debug('Auth login - android push token registered ERROR');
						return false;
						});
				} else {
					SysMsg.debug('Auth login - android push token already available - using it: ' + localStorage.myPush);
					user.pushToken = localStorage.myPush;
					returnCode = RegisterDeviceLocal(user, mcbdevice);
					return returnCode;
					}
				}

			// do login for Apple iOS
			if (SysMsg.isOniOS()) {
				var iosconfig = {
					'badge': 'true',
					'sound': 'true',
					'alert': 'true',
					'ecb': "angular.element(document.querySelector('[ng-app]')).injector().get('Auth').onMcbPushNotification"
					};
				if (localStorage.myPush === '') {
					$cordovaPush.register(iosconfig).then(function (result) {
						SysMsg.debug('Auth login - ios push token registered with result: ' + JSON.stringify(result));
						user.pushToken = result;
						localStorage.myPush = result;
						returnCode = RegisterDeviceLocal(user, mcbdevice);
						return returnCode;
					}, function (err) {
						// An error occured. Show a message to the user
						localStorage.loggedIn = false;
						SysMsg.debug('Auth login - ios push token registered ERROR');
						return false;
					});
				} else {
					SysMsg.debug('Auth login - ios push token already available - using it: ' + localStorage.myPush);
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
            // TODO send to backend to delete token
			var myDevice = SysMsg.device();
			var myRegisteredDevice = internalGetDevice();
			if (SysMsg.isOnBrowser()) {
				SysMsg.debug('Push logout - push dummy token unregistered - runs on Browser');
			} else {
				$cordovaPush.unregister().then(function (result) {
					SysMsg.debug('Push logout - push token unregistered');
				}, function (err) {
					SysMsg.debug('Push logout - push token unregistered ERROR');
				});
			}
			SysMsg.debug('Push unregister done OK');
			localStorage.registered = false;
			localStorage.removeItem('deviceId');
			localStorage.removeItem('pushToken');
			localStorage.removeItem('userId');
			localStorage.removeItem('myPush');
			localStorage.removeItem('MsgIndicator');
			yafradevice = {
				'registered': false,
				'deviceId': '',
				'pushToken': '',
				'userId': 0
			};
			$rootScope.$broadcast('app.loggedOut');
			SysMsg.debug('Push unregistration - done');
		},
		/**
		 * global google GCM push event
		 * @method window.onNotificationGCM
		 * @param {Object} e - event object
		 */
		onYafraPushNotification: function(e) {
			// receive notification
			SysMsg.debug('Auth pushNotification: got message event ' + JSON.stringify(e));
			var myUser = internalGetDevice();
			if (SysMsg.isOnAndroid()) {
				switch (e.event) {
					case 'registered':
						if (e.regid.length > 0) {
							SysMsg.debug('Auth pushNotification - android push token registered got result: ' + e.regid);
							localStorage.myPush = e.regid;
						}
						break;

					case 'message':
						// this is the actual push notification. its format depends on the data model     from the push server
						SysMsg.debug('Auth pushNotification - android push message got: ' + e.message);
						if (e.foreground === false) {
							if (e.payload.user !== myUser.userId) {
								MsgIndicator.setNewMsgIndicators(e.payload.group);
								$state.go('menu.chat', {grpid: e.payload.group});
							}
						} else {
							if (e.payload.user !== myUser.userId) {
								SysMsg.showConfirmSimple(e.payload.username + ': ' + e.message, 'New message');
								MsgIndicator.setNewMsgIndicators(e.payload.group);
								}
						}
						break;

					case 'error':
						SysMsg.debug('Auth pushNotification - android push GCM error: ' + e.msg);
						break;

					default:
						SysMsg.debug('Auth pushNotification - android unknown GCM event has occurred');
						break;
				}
			}
			if (SysMsg.isOniOS()) {
				SysMsg.debug('Auth pushNotification iOS: got message event ' + e.alert + ' in group ' + e.group);
				if (e.foreground === '0') {
					if (e.user !== myUser.userId) {
						MsgIndicator.setNewMsgIndicators(e.group);
						$state.go('menu.message', {grpid: e.group});
					}
				} else {
					if (e.user !== myUser.userId) {
						MsgIndicator.setNewMsgIndicators(e.group);
						SysMsg.showConfirmSimple(e.alert, 'New message');
					}
				}
			}
		}
	};
}]);


/**
 * Handle system / error messages through dialogs (native or javascript)
 */
YafraService.factory('MsgIndicator', ['SysMsg', function (SysMsg) {
	'use strict';
	var msgIndicators = [];
	var msgGroupInfo = {};
	var found = false;

	function setMsgArray(groupId) {
		msgIndicators = getMsgArray();
		SysMsg.debug('msg indicator service - NEW group localstorage is: ' + JSON.stringify(msgIndicators));
		if (msgIndicators === null) {
			msgIndicators = [];
			msgIndicators.push({groupId: groupId, count: 1});
			localStorage.setItem('MsgIndicator', JSON.stringify(msgIndicators));
			return;
		}
		for (var i=0; i<msgIndicators.length; i += 1) {
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
		localStorage.setItem('MsgIndicator', JSON.stringify(msgIndicators));
		return;
	}

	function getMsgArray() {
		return JSON.parse(localStorage.getItem('MsgIndicator'));
	}

	function clearMsgGroupIndicator(groupId) {
		msgIndicators = getMsgArray();
		SysMsg.debug('msg indicator service - CLEAR group - localstorage is: ' + JSON.stringify(msgIndicators));
		if (msgIndicators !== null) {
			//SysMsg.debug('msg indicator service - reset group');
			for (var i=0; i<msgIndicators.length; i += 1) {
				if (parseInt(msgIndicators[i].groupId) === parseInt(groupId)) {
					//SysMsg.debug('msg indicator service - reset group ' + typeof msgIndicators[i].groupId + ' ' + typeof groupId);
					msgIndicators[i].count = 0;
					break;
				}
			}
		}
		localStorage.setItem('MsgIndicator', JSON.stringify(msgIndicators));
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

