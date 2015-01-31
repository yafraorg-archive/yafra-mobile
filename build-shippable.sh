#!/bin/sh
#
# used for CI services like Jenkins, Shippable, Travis-CI
#
# variables must be set by CI service
#export ANDROID_HOME=/work/adt/sdk
#export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

echo "Make sure you set AndroidManifest.xml android:debuggable to false!"
cd ionic
/home/shippable/workspace/src/github.com/yafraorg/yafra-mobile/node_modules/ionic/bin/ionic platform add android
~/update-plugins.sh /home/shippable/workspace/src/github.com/yafraorg/yafra-mobile/node_modules/ionic/bin/ionic
/home/shippable/workspace/src/github.com/yafraorg/yafra-mobile/node_modules/ionic/bin/ionic resources
/home/shippable/workspace/src/github.com/yafraorg/yafra-mobile/node_modules/ionic/bin/ionic lib
node_modules/gulp/bin/gulp.js
/home/shippable/workspace/src/github.com/yafraorg/yafra-mobile/node_modules/ionic/bin/ionic build android
cd platforms/android
ant clean
ant release
echo "done - save in /work"
