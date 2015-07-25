#!/bin/sh
#
# used for CI services like Jenkins, Shippable, Travis-CI
#
# variables must be set by CI service
#export ANDROID_HOME=/work/adt/sdk
#export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

echo "Make sure you set AndroidManifest.xml android:debuggable to false!"

#
# bower install / upgrade
#
echo ' '
echo 'start bower ngCordova update now'
# ng-cordova install/update
bower install ngCordova
bower install ng-cordova-oauth
cp bower_components/ngCordova/dist/ng-cordova.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova.min.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova-mocks.js tests-helper/
cp bower_components/ngCordova/dist/ng-cordova-mocks.min.js tests-helper/
cp bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.js ionic/www/lib/ngCordova
cp bower_components/ng-cordova-oauth/dist/ng-cordova-oauth.min.js ionic/www/lib/ngCordova
echo ' '
echo 'bower update done - list bower installations:'
bower list


#
# install / update ionic project (resources, platforms, ...)
#
echo ' '
echo 'make ionic init'
cd ionic/
ionic platform add android
ionic resources
ionic lib
echo 'you need to update angular and angular-resource manually and'
echo 'with the same angular release as this ionic relese uses - take a starter template and copy the angular directories over'
echo ' '
echo 'Ionic update DONE'
node_modules/.bin/gulp
ionic build android
cd ..
echo "done - mobile app build for android"
