Yafra Mobile App
================

[![Build Status](https://api.shippable.com/projects/54c802e15ab6cc135289f882/badge?branchName=master)](https://app.shippable.com/projects/54c802e15ab6cc135289f882/builds/latest)

## Key functions
* public
 * calendar
 * repertoire
 * baizeplan
 * allg. infos / messages

* members only
 * login / logout
 * push messages
 * chat messages / pictures
 * contacts
 * gps with background service and dynamic maps

### login / logout structure
* email - must match the user email from DB
* token oauth2
* name or info on user

### push message structure
* token
* email
* os

## MCB app structure
ionic
backup
bower_components (for ngCordova)
tests (unit tests using karma)
tests-helper (mock libraries)

## setup
make sure the source is updated in the backup folder - run the backup.sh script to do so
run setup.sh script to install/update ionic, cordova, ngCordova and create an update skeleton
run
	ionic platform add ios
	ionic platform add android

## Plugins used
### ngCordova plugins
cordova plugin add https://github.com/christocracy/cordova-plugin-background-geolocation.git
cordova plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git
cordova plugin add de.appplant.cordova.plugin.local-notification
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
ng-cordova oauth

### plain cordova plugins
cordova plugin add org.apache.cordova.file-transfer
cordova plugin add org.apache.cordova.inappbrowser
cordova plugin add org.apache.cordova.contacts
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.file
cordova plugin add org.apache.cordova.geolocation
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.statusbar
cordova plugin add org.apache.cordova.console

### other plugins
cordova -d plugin add https://github.com/imhotep/MapKit --variable API_KEY="YOUR_API_KEY_FROM_GOOGLE"

