# Water Purification Monitor - Flutter App

A comprehensive Flutter mobile application for monitoring water quality parameters in real-time with 3D visualization, AI chatbot support, and analytics.

## Features

- **Real-time Water Quality Monitoring**
  - Turbidity, Temperature, and Conductivity tracking
  - Live 3D water bottle visualization
  - Overall quality scoring system

- **UVC Purification Control**
  - Start, pause, resume, and stop purification cycles
  - Real-time progress tracking
  - Visual UVC LED indicator

- **Authentication**
  - Email/Password registration and login
  - Google Sign-In integration
  - Secure Firebase Authentication

- **Detailed Analytics**
  - Individual parameter detail screens with charts
  - Historical data visualization
  - Date range filtering
  - Export to CSV and PDF (coming soon)

- **AI Chatbot**
  - Google Gemini AI integration
  - Water purification knowledge base
  - Automatic forum integration

- **Community Forum**
  - Real-time message updates
  - User and chatbot conversations
  - Persistent storage in Firestore

- **Dark Mode Support**
  - System-wide theme toggle
  - Persistent theme preference

## Prerequisites

Before you begin, ensure you have the following installed:

- **Flutter SDK** (3.0.0 or higher)
  - Download from: https://flutter.dev/docs/get-started/install
  - Verify installation: `flutter doctor`

- **Android Studio** (for Android development)
  - Download from: https://developer.android.com/studio

- **Xcode** (for iOS development, macOS only)
  - Download from Mac App Store

- **Firebase Account**
  - Create a project at: https://console.firebase.google.com

## Installation

### 1. Install Flutter

If you haven't installed Flutter yet:

**Windows:**
```powershell
# Download Flutter SDK from https://flutter.dev/docs/get-started/install/windows
# Extract to C:\src\flutter
# Add to PATH: C:\src\flutter\bin

# Verify installation
flutter doctor
```

**macOS/Linux:**
```bash
# Download and extract Flutter SDK
# Add to PATH in ~/.bashrc or ~/.zshrc
export PATH="$PATH:`pwd`/flutter/bin"

# Verify installation
flutter doctor
```

### 2. Clone/Navigate to Project

```bash
cd "c:\Users\chenuka\Documents\antigravity\water purification flutter\flutter_app"
```

### 3. Install Dependencies

```bash
flutter pub get
```

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: "Water Purification Monitor"
4. Follow the setup wizard

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select a location close to you

### Step 4: Set up Firestore Collections

Create the following collections in Firestore:

- `waterQuality` - For water quality readings
- `bottles` - For bottle locations
- `forum` - For forum messages
- `users` - For user data

### Step 5: Configure Android App

1. In Firebase Console, click the Android icon
2. Enter package name: `com.waterpurification.water_purification_app`
3. Download `google-services.json`
4. Place it in: `flutter_app/android/app/google-services.json`

5. Update `android/build.gradle`:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

6. Update `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'

android {
    defaultConfig {
        minSdkVersion 21  // Update this
    }
}
```

### Step 6: Configure iOS App (if targeting iOS)

1. In Firebase Console, click the iOS icon
2. Enter bundle ID: `com.waterpurification.waterPurificationApp`
3. Download `GoogleService-Info.plist`
4. Open `ios/Runner.xcworkspace` in Xcode
5. Drag `GoogleService-Info.plist` into the Runner folder
6. Ensure "Copy items if needed" is checked

### Step 7: Configure Google Sign-In

**Android:**
1. Get SHA-1 fingerprint:
```bash
cd android
./gradlew signingReport
```
2. Add SHA-1 to Firebase Console (Project Settings > Your apps > Android app)

**iOS:**
1. In `ios/Runner/Info.plist`, add:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.YOUR-CLIENT-ID</string>
        </array>
    </dict>
</array>
```
(Replace YOUR-CLIENT-ID with your actual client ID from GoogleService-Info.plist)

## Google Gemini AI Setup

1. Get API key from: https://makersuite.google.com/app/apikey
2. Open `lib/screens/chatbot/chatbot_screen.dart`
3. Replace `YOUR_GEMINI_API_KEY` with your actual API key:
```dart
_geminiService = GeminiService(apiKey: 'YOUR_ACTUAL_API_KEY');
```

## Running the App

### Android

```bash
# List available devices
flutter devices

# Run on connected Android device/emulator
flutter run
```

### iOS (macOS only)

```bash
# Open iOS simulator
open -a Simulator

# Run on iOS simulator
flutter run
```

### Build Release APK (Android)

```bash
flutter build apk --release
```

The APK will be at: `build/app/outputs/flutter-apk/app-release.apk`

### Build iOS App (macOS only)

```bash
flutter build ios --release
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── config/
│   ├── routes.dart          # Route definitions
│   └── constants.dart       # App constants
├── models/                  # Data models
├── services/                # Firebase, Auth, Gemini services
├── providers/               # State management
├── screens/                 # UI screens
│   ├── auth/               # Login, Register
│   ├── dashboard/          # Main dashboard
│   ├── details/            # Parameter details
│   ├── forum/              # Community forum
│   ├── chatbot/            # AI chatbot
│   └── reports/            # Analytics
└── widgets/                 # Reusable widgets
```

## Troubleshooting

### Flutter not recognized
- Ensure Flutter is added to your system PATH
- Restart your terminal/command prompt
- Run `flutter doctor` to check installation

### Firebase connection issues
- Verify `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) is in the correct location
- Check that Firebase project is properly configured
- Ensure internet connection is active

### Build errors
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

### Google Sign-In not working
- Verify SHA-1 fingerprint is added to Firebase Console
- Check that Google Sign-In is enabled in Firebase Authentication
- Ensure google-services.json is up to date

## Features Coming Soon

- [ ] PDF export for reports
- [ ] CSV export for data
- [ ] Push notifications
- [ ] Offline data caching
- [ ] Multiple bottle management
- [ ] Water quality predictions using ML

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase and Flutter documentation
3. Check Flutter doctor: `flutter doctor -v`

## License

This project is for educational and monitoring purposes.
