export default {
  // Hook to write the google-services.json from environment variable
  expo: {
    updates: {
      url: "https://u.expo.dev/79e17fd1-764c-424f-9efe-1c4aabd967f6",
    },
    runtimeVersion: "1.0.0",
    scheme: 'com.linkzy',
    plugins: [
      "expo-apple-authentication",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.44271322539-jv9bd5ng9pbjkke0ol4cvklrb3g5lt71"
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "The app accesses your photos to let you share them with your friends."
        }
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-8692182271223423~9299510838",
          iosAppId: "ca-app-pub-8692182271223423~4609656473"
        }
      ],
      [
        "@stripe/stripe-react-native",
        {
          merchantIdentifier: 'merchant.com.linkzy',
          enableGooglePay: true
        }
      ],
    ],
    name: "Linkzy",
    slug: "social-app",
    version: "1.2.7",
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
      usesAppleSignIn: true,
      googleServicesFile: "./GoogleService-Info.plist",
      buildNumber: '1.1.9',
      // deploymentTarget: "12.0"
    },
    android: {
      googleServicesFile: './google-services.json', // Set to path where file will be written
      // ndkVersion: "26.1.10909125",
      package: "com.linkzy",
      useNextNotificationsApi: true,
      versionCode: 21,
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

