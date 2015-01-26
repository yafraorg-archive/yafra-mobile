#!/bin/sh
#
#
export ANDROID_HOME=/work/adt/sdk
export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

echo "Make sure you set AndroidManifest.xml android:debuggable to false!"
#cp www/res/icon/android/icon-96-xhdpi.png platforms/android/res/drawable/icon.png
#cp www/res/icon/android/icon-96-xhdpi.png platforms/android/res/drawable-xhdpi/icon.png
#cp www/res/icon/android/icon-72-hdpi.png platforms/android/res/drawable-hdpi/icon.png
#cp www/res/icon/android/icon-48-mdpi.png platforms/android/res/drawable-mdpi/icon.png
#cp www/res/icon/android/icon-36-ldpi.png platforms/android/res/drawable-ldpi/icon.png
cd ionic
ionic build android
cd platforms/android
ant clean
ant release
cd bin
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Users/mwn/Documents/mcbrelkey.keystore CordovaApp-release-unsigned.apk MCBSujet
/work/adt/sdk/build-tools/21.1.1/zipalign -v 4 CordovaApp-release-unsigned.apk MCBApp.apk
cp MCBApp.apk /work
echo "done - save in /work"
