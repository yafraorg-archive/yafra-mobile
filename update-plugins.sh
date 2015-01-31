#!/bin/sh
#
# shell script to setup / update cordova plugins
#
if [ -z "$1" ];
	then IONICEXE=ionic
	else IONICEXE=$1
fi

# add plugins
$IONICEXE plugin add com.ionic.keyboard
$IONICEXE plugin add https://github.com/phonegap-build/PushPlugin.git
$IONICEXE plugin add de.appplant.cordova.plugin.local-notification
$IONICEXE plugin add https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git
$IONICEXE plugin add org.apache.cordova.camera
$IONICEXE plugin add org.apache.cordova.console
$IONICEXE plugin add org.apache.cordova.contacts
$IONICEXE plugin add org.apache.cordova.device
$IONICEXE plugin add org.apache.cordova.dialogs
$IONICEXE plugin add org.apache.cordova.file
$IONICEXE plugin add org.apache.cordova.file-transfer
$IONICEXE plugin add org.apache.cordova.geolocation
$IONICEXE plugin add org.apache.cordova.inappbrowser
$IONICEXE plugin add org.apache.cordova.splashscreen
$IONICEXE plugin add org.apache.cordova.statusbar
$IONICEXE plugin add https://github.com/christocracy/cordova-plugin-background-geolocation.git
