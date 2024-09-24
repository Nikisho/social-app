export default {
  // Hook to write the google-services.json from environment variable
  expo: {
    plugins: [
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps._some_id_here_"
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ]
    ],
    name: "social-app",
    slug: "social-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.linkzy',
      googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      googleServicesFile: './android/app/google-services.json', // Set to path where file will be written
      // ndkVersion: "26.1.10909125",
      package: "com.linkzy",
      useNextNotificationsApi: true,
      versionCode: 3,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: ["android.permission.RECORD_AUDIO"]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "79e17fd1-764c-424f-9efe-1c4aabd967f6"
      }
    }
  }
};

