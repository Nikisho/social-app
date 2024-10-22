import { Alert, Platform, ToastAndroid } from "react-native"

const platformAlert = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT)
    } else if (Platform.OS === 'ios') {
        Alert.alert(message);
    }
}

export default platformAlert;