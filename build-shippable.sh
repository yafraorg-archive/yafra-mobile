#!/bin/sh
#
# used for CI services like Jenkins, Shippable, Travis-CI
#
# variables must be set by CI service
#export ANDROID_HOME=/work/adt/sdk
#export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

echo "Make sure you set AndroidManifest.xml android:debuggable to false!"
NODEPATH=/home/shippable/workspace/src/github.com/yafraorg/yafra-mobile/node_modules
cd ionic
$NODEPATH/ionic/bin/ionic platform add android
$NODEPATH/ionic/bin/ionic resources
$NODEPATH/gulp/bin/gulp.js
$NODEPATH/ionic/bin/ionic build android
echo "done - save in /work"
