#!/bin/sh
#
# shell script to setup / update ionic, cordova and ngCordova via npm and bower
#

# save the sources to the www tree
#echo "are you sure you backuped before ? (enter at prompt yes)"
#read BACKUP
#if [ "$BACKUP" != "yes" ];
#	then exit
#fi
echo ' '
echo 'doing bower update now'
# ng-cordova install/update
bower install ngCordova
bower install ng-cordova-oauth
cp bower_components/ngCordova/dist/ng-cordova.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova.min.js ionic/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova-mocks.js tests-helper/
cp bower_components/ngCordova/dist/ng-cordova-mocks.min.js tests-helper/
cp bower_components/ng-cordova-oauth/ng-cordova-oauth.js ionic/www/lib/ngCordova
cp bower_components/ng-cordova-oauth/ng-cordova-oauth.min.js ionic/www/lib/ngCordova


echo ' '
echo 'bower update done - list bower installations:'
bower list