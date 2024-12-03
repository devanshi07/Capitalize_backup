# React Native setup
Installing dependencies

Node & Watchman

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:

if do not have Homebrew installed then install Homebrew via (Website: https://brew.sh/)

```/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"```

then install

```brew install node
brew install watchman```

Xcode

The easiest way to install Xcode is via the Mac App Store(https://apps.apple.com/us/app/xcode/id497799835?mt=12). Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

Installing an iOS Simulator in Xcode
To install a simulator, open Xcode > Settings... (or Preferences...) and select the Platforms (or Components) tab. Select a simulator with the corresponding version of iOS you wish to use.

If you are using Xcode version 14.0 or greater to install a simulator, open Xcode > Settings > Platforms tab, then click "+" icon and select iOS… option.

CocoaPods
CocoaPods (https://cocoapods.org/) is one of the dependency management system available for iOS. CocoaPods is a Ruby gem. You can install CocoaPods using the version of Ruby that ships with the latest version of macOS.

CocoaPods Getting Started guide (https://guides.cocoapods.org/using/getting-started.html).

For creating a new project in React Native excute command npx react-native init <ProjectName>

For run a new project in React Native open project folder then implement the following command
npx react-native start then press a when server started or 
npx react-native run-android (For android)
npx react-native run-ios (For iOS)

Android studio setup (follow this website)
https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio#3
https://developer.android.com/codelabs/basic-android-kotlin-compose-install-android-studio#4