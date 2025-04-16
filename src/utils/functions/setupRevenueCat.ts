import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export const setupRevenueCat = async () => {
    try {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
        if (Platform.OS === "ios") {
            Purchases.configure({
                apiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY!,
                useAmazon: false,
                shouldShowInAppMessagesAutomatically: true,
            });
        } else if (Platform.OS === "android") {
            Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_GOOLE_API_KEY! });
        }
    } catch (error) {
        console.error("RevenueCat failed: ", error);
    }
};
