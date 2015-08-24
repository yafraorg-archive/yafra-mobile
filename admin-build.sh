#!/usr/bin/env bash
cd ionic/
node_modules/.bin/gulp yafra
platforms/ios/cordova/clean
ionic build ios
ionic build android
