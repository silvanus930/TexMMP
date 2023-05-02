init:
	-react-native init Persona
	-cp -rf Persona/* .
	-rm -rf Persona
	git checkout .

deps:
	sudo gem install cocoapods
	brew install node npm
	npm install -g react-native-cli
	brew install --cask react-native-debugger
	brew install yarn watchman
	brew install ios-deploy

nodemodules:
	yarn install --force --verbose

server:
	yarn start --reset-cache --verbose

pods:
	# bundle install
	# cd ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install --repo-update --verbose
	cd ios && pod install --repo-update --verbose

iosdev: nodemodules pods
	npx react-native run-ios --configuration Debug

ios14:
	npx react-native run-ios --configuration Debug

ios14pro:
	npx react-native run-ios --simulator="iPhone 14 Pro"

ios: nodemodules pods
	npx react-native run-ios --configuration Release
	#yarn ios --verbose

iphone:
	npx react-native run-ios --verbose --scheme "Debug Persona" --device

iphoner:
	npx react-native run-ios --device --scheme "Persona" --configuration Release --verbose

stop:
	cd android && ./gradlew --stop

androidjsreleasebundle:
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

amem:
	adb shell dumpsys meminfo

aclean:
	cd android && ./gradlew clean

android: nodemodules
	make uninstall
	cd android && ./gradlew clean && cd ..
	cp android/patch/downloadProfile.js node_modules/@react-native-community/cli-hermes/build/profileHermes/downloadProfile.js
	yarn android --verbose

androidw: nodemodules
	make uninstall
	cd android && .\gradlew clean && cd ..
	yarn android

androidd:
	make uninstall
	cd android && ./gradlew clean && cd ..
	cp android/patch/downloadProfile.js node_modules/@react-native-community/cli-hermes/build/profileHermes/downloadProfile.js
	yarn android --verbose

androidr:
	make uninstall
	yarn android --variant=release

all:
	make clean && yarn install && yarn upgrade && make pods && npx react-native run-ios

arelease:
	cd android && ./gradlew assembleRelease
	adb -d install android/app/build/outputs/apk/release/app-x86_64-release.apk

androidrelease:
	make stop && cd android && ./gradlew bundleRelease --stacktrace --scan --info

atrace:
	${ANDROID_HOME}/platform-tools/systrace/systrace.py --time=45 -o trace.html sched gfx view -a com.persona.PersonaAlpha

opena:
	open android/app/build/outputs/bundle

iosr:
	yarn ios variant=release --verbose

iosrelease:
	xcodebuild -workspace ios/Persona.xcworkspace -configuration Debug -scheme Persona -destination id=E4CC653B-B548-4E1D-B1C4-C774C419D7EC

uninstall:
	- adb -d uninstall com.persona
	- adb -d uninstall com.persona.personaalpha
	- adb -e uninstall com.persona
	- adb -e uninstall com.persona.personaalpha

dsyms:
	./ios/Pods/FirebaseCrashlytics/upload-symbols -gsp ios/PersonaGoogleServiceInfo/GoogleService-Info.plist -p ios appDsyms

clean:
	- cd ios && pod deintegrate && cd ..
	- rm -rf ios/Pods
	- rm -rf ios/Podfile.lock
#	- rm -rf ~/Library/Caches/CocoaPods
	- rm -rf ~/Library/Developer/Xcode/iOS\ DeviceSupport/*
	- cd android && ./gradlew clean
	- react-native clean-project-auto
	- watchman watch-del-all
	- rm -rf $TMPDIR/react-native-packager-cache-*
	- rm -rf $TMPDIR/metro-bundler-cache-*
	- rm -rf /tmp/metro-*
	- rm -rf node_modules
	- rm yarn-error.log
	- yarn cache clean --verbose
	- adb uninstall com.persona &
	- git checkout ios/Podfile.lock
