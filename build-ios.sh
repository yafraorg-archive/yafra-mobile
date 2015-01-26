#!/bin/sh
cd ionic
platforms/ios/cordova/clean
ionic build ios
cd ..
echo "done"

