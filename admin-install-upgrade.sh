#!/usr/bin/env bash
#
# install / upgrade script for ionic based project
# installs/updates the nodejs modules and initializes the project
#

#
# npm installs / upgrades
#

echo ' '
echo 'doing npm cordova and ionic update now'
# setup / update software
npm -g update ionic cordova karma protractor ios-sim ios-deploy
echo ' '
echo 'node/npm update done - installed apps:'
npm list -g --depth=0


#
# bower install / upgrade
#
echo ' '
echo 'start bower ngCordova update now'
# ng-cordova install/update
bower -config.interactive=false install ngCordova
bower -config.interactive=false install ng-cordova-oauth
bower -config.interactive=false install angular-mocks#1.3.13
cp bower_components/ngCordova/dist/ng-cordova.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova.min.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova-mocks.js tests-helper/
cp bower_components/ngCordova/dist/ng-cordova-mocks.min.js tests-helper/
cp bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.js ionic/www/lib/ngCordova
cp bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.min.js ionic/www/lib/ngCordova
cp bower_components/angular-mocks/angular-mocks.js tests-helper/
echo ' '
echo 'bower update done - list bower installations:'
bower list


#
# install / update ionic project (resources, platforms, ...)
#
echo ' '
echo 'make backup and update ionic css and js stuff and gulp'
cp -R ionic ionic-bup
cd ionic/
# install local npm apps
npm install --save-dev gulp gulp-util bower gulp-concat gulp-sass gulp-minify-css gulp-rename shelljs
# remove existing platforms and plugins
ionic platform rm ios
ionic platform rm android
rm -rf plugins/*
# add platforms
ionic platform add ios
ionic platform add android
# add plugins - moved to plugins.json
#ionic plugin add com.ionic.keyboard
#ionic plugin add org.apache.cordova.camera
#ionic plugin add org.apache.cordova.console
#ionic plugin add org.apache.cordova.contacts
#ionic plugin add org.apache.cordova.device
#ionic plugin add org.apache.cordova.dialogs
#ionic plugin add org.apache.cordova.file
#ionic plugin add org.apache.cordova.file-transfer
#ionic plugin add org.apache.cordova.geolocation
#ionic plugin add org.apache.cordova.inappbrowser
#ionic plugin add org.apache.cordova.splashscreen
#ionic plugin add org.apache.cordova.statusbar
#ionic plugin add https://github.com/phonegap-build/PushPlugin.git
#ionic plugin add de.appplant.cordova.plugin.local-notification
#ionic plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git
#ionic plugin add https://github.com/christocracy/cordova-plugin-background-geolocation.git
#ionic plugin add https://github.com/VitaliiBlagodir/cordova-plugin-datepicker.git
# build resources like images
ionic resources
# update ionic libraries
ionic lib
echo 'you need to update angular and angular-resource manually and'
echo 'with the same angular release as this ionic relese uses - take a starter template and copy the angular directories over'
cd ..

#ionic start ionic-new sidemenu

echo 'Ionic update DONE'
