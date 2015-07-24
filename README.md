Yafra Mobile App
================

[![Build Status](https://api.shippable.com/projects/54c802e15ab6cc135289f882/badge?branchName=master)](https://app.shippable.com/projects/54c802e15ab6cc135289f882/builds/latest)

## Key functions
 * calendar
 * contacts
 * login / logout
 * push messages
 * gps with background service and dynamic maps

## folder structure
ionic
bower_components (for ngCordova only)
tests (unit tests using karma)
tests-helper (mock libraries)

## build and install
### install / upgrade
Use the admin-install-upgrage.sh script which basically performs the following (assuming you start from this repository):
 * install/upgrade npm ionic and cordova
 * install/upgrade ngCordova through bower
 * add platforms
 * update ionic version (the ionic js and css files)
 * build resources (icons, splash)
 * update plugins

### build
After install / upgrade run the build admin-build.sh which performs the following:
 * run gulp jshint
 * run gulp unit tests
 * run gulp e2e tests
 * build ios and android versions
 
### build online
This project uses shippable.com to build (but without ios build)

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

# Yafra links
* [Wiki](https://github.com/yafraorg/yafra/wiki)
* [Project Wiki](https://github.com/yafraorg/yafra/wiki/Mobile)
* [Development Environment specifics](https://github.com/yafraorg/yafra/wiki/DevMobile)
