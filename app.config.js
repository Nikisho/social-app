const fs = require('fs');
const path = require('path');

export default ({ config }) => {
  // Hook to write the google-services.json from environment variable
  if (process.env.GOOGLE_SERVICES_JSON) {
    const googleServicesPath = path.resolve(__dirname, './android/app/google-services.json');
    
    try {
      fs.writeFileSync(googleServicesPath, process.env.GOOGLE_SERVICES_JSON);
      console.log('google-services.json written successfully');
    } catch (error) {
      console.error('Error writing google-services.json:', error);
    }
  } else {
    console.warn('GOOGLE_SERVICES_JSON environment variable not set');
  }

  return {
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
        supportsTablet: true
      },
      android: {
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON, // Set to path where file will be written
        ndkVersion: "26.1.10909125",
        package: "com.linkzy",
        versionCode: 1,
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
};
