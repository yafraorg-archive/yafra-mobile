#!/usr/bin/env bash
cd ionic/
node_modules/.bin/gulp
platforms/ios/cordova/clean
ionic build ios
ionic build android
