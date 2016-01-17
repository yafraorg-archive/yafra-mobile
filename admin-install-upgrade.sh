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
npm -g install bower
npm -g install cordova ionic
npm -g install karma protractor
npm -g install ios-sim ios-deploy
echo ' '
echo 'node/npm update done - installed apps:'
npm list -g --depth=0


#
# bower install / upgrade
#
echo ' '
echo 'start bower ngCordova update now'
rm -rf bower_components/
# ng-cordova install/update
bower -config.interactive=false install ngCordova
bower -config.interactive=false install ng-cordova-oauth
bower -config.interactive=false install angular-mocks#1.4.3
cp bower_components/ngCordova/dist/ng-cordova.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova.min.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova-mocks.js ionic/tests-helper/
cp bower_components/ngCordova/dist/ng-cordova-mocks.min.js ionic/tests-helper/
cp bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.js ionic/www/lib/ngCordova
cp bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.min.js ionic/www/lib/ngCordova
cp bower_components/angular-mocks/angular-mocks.js ionic/tests-helper/
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
mkdir -p hooks
rm -rf node_modules/
# install local npm apps
npm install
# remove existing platforms and plugins
ionic platform rm ios
ionic platform rm android
rm -rf plugins/*

# add platforms
ionic platform add ios
ionic platform add android
ionic plugin add com.ionic.keyboard
ionic plugin add cordova-plugin-camera
ionic plugin add org.apache.cordova.console
ionic plugin add cordova-plugin-contacts
ionic plugin add cordova-plugin-device
ionic plugin add cordova-plugin-dialogs
ionic plugin add cordova-plugin-file
ionic plugin add cordova-plugin-file-transfer
ionic plugin add cordova-plugin-geolocation
ionic plugin add cordova-plugin-inappbrowser
ionic plugin add cordova-plugin-splashscreen
ionic plugin add cordova-plugin-statusbar
ionic plugin add cordova-plugin-whitelist
ionic plugin add https://github.com/phonegap-build/PushPlugin.git
ionic plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git

# build resources like images
ionic resources

# update ionic libraries
ionic lib
echo 'you need to update angular and angular-resource manually and'
echo 'with the same angular release as this ionic relese uses - take a starter template and copy the angular directories over'
cd ..

#ionic start ionic-new sidemenu

echo 'Ionic update DONE'
