#!/bin/sh
#
# used for CI services like Jenkins, Shippable, Travis-CI
#
# variables must be set by CI service
#export ANDROID_HOME=/work/adt/sdk
#export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

echo "Make sure you set AndroidManifest.xml android:debuggable to false!"
cd ionic
~/node_modules/ionic/bin/ionic platform add android
~/update-plugins.sh ~/node_modules/ionic/bin/ionic
~/node_modules/ionic/bin/ionic resources
~/node_modules/ionic/bin/ionic lib
node_modules/gulp/bin/gulp.js
~/node_modules/ionic/bin/ionic build android
cd platforms/android
ant clean
ant release
echo "done - save in /work"
