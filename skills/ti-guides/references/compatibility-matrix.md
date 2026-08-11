# Compatibility matrix

Which JDK, Node.js, Xcode and Android SDK versions a given Titanium SDK release can build with. Components outside the min/max ranges below are not compatible.

Only the currently supported ranges are reproduced here. Upstream also keeps collapsed tables of long-unsupported ranges (back to Titanium 1.7); if a project is pinned to something older than the rows below, consult the upstream matrix directly.

<!-- TOC-START -->
## Contents

- [1. Operating system](#1-operating-system)
- [2. Java Development Kit](#2-java-development-kit)
- [3. Node.js](#3-nodejs)
- [4. Android](#4-android)
- [5. iOS and Xcode](#5-ios-and-xcode)
- [6. Which platform can build what](#6-which-platform-can-build-what)

<!-- TOC-END -->

## 1. Operating system

| Operating system | Version |
|---|---|
| macOS | 10.11.5 and later |
| Windows | Windows 7 and later (Android) |
| Linux | Tested on Fedora and (K)Ubuntu; others should work |

## 2. Java Development Kit

The JDK is required to build Titanium apps and modules for Android. OpenJDK or Oracle both work.

| Titanium SDK version | Min JDK | Max JDK |
|---|---|---|
| 13.3.0 - latest | 18 | 25 |
| 12.8.0 - 13.2.0 | 18 | 21 |

`12.0.0 - 12.7.0` (JDK 11-17) moved to the unsupported table when 13.3.0 shipped.

## 3. Node.js

Node.js is required to install and run the Titanium SDK. On Windows, enable `dev mode` in Windows settings for Node to work correctly.

| Titanium SDK version | Min Node | Max Node |
|---|---|---|
| 13.1.1 - latest | 20.x | 24.x |
| 13.0.0 - 13.1.0 | 20.x | 22.x |
| 12.6.0 - 12.8.0 | 18.x | 22.x |

## 4. Android

As of Titanium 9.0.0 the build system downloads the needed Android SDK platforms and tools automatically. Upgrade those packages only between major projects — changes there have broken the Titanium toolchain several times.

| Titanium SDK version | Min target (`android:targetSdkVersion`) | Max target | Min supported (`android:minSdkVersion`) |
|---|---|---|---|
| 13.1.0+ | 15.x (API 35) | 15.x (API 35) | 7.x (API 24) |
| 12.8.0 - 13.0.1 | 15.x (API 35) | 15.x (API 35) | 5.x (API 21) |
| 12.5.0 - 12.8.0 | 14.x (API 34) | 14.x (API 34) | 5.x (API 21) |
| 12.0.0 - 12.5.0 | 13.x (API 33) | 13.x (API 33) | 5.x (API 21) |

A `android:targetSDKVersion` set in `tiapp.xml` must fall inside the min/max target range of the SDK in use.

> **Note:** Titanium SDK 13.4.0 is described in its release note as *preparing the SDK for Android target SDK 36*. The matrix above still lists API 35 as the maximum; treat API 36 as in-progress rather than as a supported target until the matrix says otherwise.

Developing native Android add-on modules on macOS also requires the Xcode command line tools.

## 5. iOS and Xcode

Building for iOS requires macOS — Apple's license agreement allows iOS development only on Apple hardware.

| Titanium SDK version | Min Xcode | Max Xcode | Notes |
|---|---|---|---|
| 12.6.3 - latest | 12.0.0 | 16.x | Full support for iOS 18.4 |
| 12.2.0 - 12.6.2 | 12.0.0 | 16.2 | Full support for iOS 17 |
| 10.1.0 - 12.1.2 | 11.0.0 | 13.x | Full support for iOS 15 |

| Titanium SDK version | Min iOS SDK | Max iOS SDK | Min target iOS | Max target iOS |
|---|---|---|---|---|
| 12.2.0 - latest | 13.0.0 | 17.x | 12.0 | 17.x |
| 10.1.0 - 12.1.2 | 13.0.0 | 15.x | 12.0 | 15.x |

> **Note:** these two tables lag behind the release notes. Titanium SDK 13.3.0 shipped *support for Xcode 27 and iOS 27*, which no row above reflects. Where they disagree, the release note is the newer statement — see [sdk-release-notes.md](sdk-release-notes.md).

## 6. Which platform can build what

| Target | macOS | Windows | Linux |
|---|---|---|---|
| Android | Yes | Yes | Yes |
| iOS | Yes | No | No |

Anything marked *pre-release* upstream — Beta, Developer Preview, Release Candidate, and continuous builds — is not officially supported.
