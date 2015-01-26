#!/bin/sh
#
# shell script to setup / update ionic, cordova and ngCordova via npm and bower
#

# arguments are: 1: ionic directory
if [ -z "$1" ]; then
        echo Please specify ionic directory
        exit
fi

echo 'doing update now'

# add platforms and plugins
cd $1
# install local npm apps
npm install --save-dev gulp gulp-util bower gulp-concat gulp-sass gulp-minify-css gulp-rename shelljs

ionic resources

# remove existing platforms and plugins
ionic platform rm ios
ionic platform rm android
rm -rf plugins/*

# add platforms
ionic platform add ios
ionic platform add android

# add plugins
ionic plugin add com.ionic.keyboard
ionic plugin add https://github.com/phonegap-build/PushPlugin.git
ionic plugin add de.appplant.cordova.plugin.local-notification
ionic plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git
ionic plugin add org.apache.cordova.camera
ionic plugin add org.apache.cordova.console
ionic plugin add org.apache.cordova.contacts
ionic plugin add org.apache.cordova.device
ionic plugin add org.apache.cordova.dialogs
ionic plugin add org.apache.cordova.file
ionic plugin add org.apache.cordova.file-transfer
ionic plugin add org.apache.cordova.geolocation
ionic plugin add org.apache.cordova.inappbrowser
ionic plugin add org.apache.cordova.splashscreen
ionic plugin add org.apache.cordova.statusbar
ionic plugin add https://github.com/christocracy/cordova-plugin-background-geolocation.git
