#!/bin/sh
#
# shell script to setup / update ionic, cordova and ngCordova via npm and bower
#

# save the sources to the www tree
echo "did you do a commit before ? (enter at prompt yes)"
#read BACKUP
#if [ "$BACKUP" != "yes" ];
#	then exit
#fi

#
# UPDATE IONIC tools
#

echo ' '
echo 'doing npm cordova and ionic update now'
# setup / update software
npm -g update ionic cordova karma protractor
echo ' '
echo 'node/npm update done - installed apps:'
npm list -g --depth=0

echo ' '
echo 'start bower update now'
./update-bower.sh

echo ' '
echo 'make backup and update ionic css and js stuff and gulp'
# make backup and update ionic JS libs
cp -R ionic ionic-bup
./update-platform.sh ionic
cd ionic/
ionic lib
node_modules/gulp/bin/gulp.js
ionic build ios
ionic build android
cd ..



#
# MAKE NEW IONIC template
#

echo ' '
echo 'create new ionic project now and copy app over it'
ionic start ionic-new sidemenu
mkdir ionic-new/www/lib/ngCordova
mkdir ionic-new/resources

# copy backup back into new ionic
cp ionic-new/config.xml ionic-new/config-orig.xml
cp ionic-new/ionic.project ionic-new/ionic-orig.project
cp ionic-bup/config.xml ionic-new/
cp ionic-bup/ionic.project ionic-new/
cp ionic-bup/www/index.html ionic-new/www/
cp ionic-bup/www/templates/* ionic-new/www/templates/
cp ionic-bup/www/js/* ionic-new/www/js/
cp ionic-bup/www/img/* ionic-new/www/img/
cp ionic-bup/www/css/* ionic-new/www/css/
cp -r resources/*.png ionic-new/resources/

cp bower_components/ngCordova/dist/ng-cordova.js ionic-new/www/lib/ngCordova
cp bower_components/ngCordova/dist/ng-cordova.min.js ionic-new/www/lib/ngCordova
cp bower_components/ng-cordova-oauth/ng-cordova-oauth.js ionic-new/www/lib/ngCordova
cp bower_components/ng-cordova-oauth/ng-cordova-oauth.min.js ionic-new/www/lib/ngCordova


echo ' '
echo 'build new ionic project'
cd ionic-new
ionic platform add ios
ionic platform add android
cd ..
./update-platform.sh ionic-new
cd ionic-new
node_modules/gulp/bin/gulp.js
ionic build ios
ionic build android
cd ..

echo 'Ionic update DONE'
