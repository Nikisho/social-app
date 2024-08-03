import { GoogleSignin } from "@react-native-google-signin/google-signin"

GoogleSignin.configure(
    {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
}
)

async function GoogleAuthentication ()  {
    try {
        const user = await GoogleSignin.signIn();
        console.log(user.idToken)
        return user;

    } catch (error) {
        console.error(error)
    }
}

export default GoogleAuthentication;