import { Alert, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'
import { supabase } from '../../../../supabase'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../../../context/navSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';

const GoogleSignIn = () => {

    GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const handleSignIn = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            
            if (userInfo.idToken) {
                const { data: AuthUserData, error: AuthUserError } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.idToken,
                })
                
                //Add access token to Async Storageto persist login.
                if (AuthUserData.session) {
                    await AsyncStorage.setItem('userAccessToken', AuthUserData.session.access_token);
                    await AsyncStorage.setItem('userRefreshToken', AuthUserData.session.refresh_token);
                }

                if (AuthUserError) console.error(AuthUserError.message);
                
                const { error, data } = await supabase
                    .from('users')
                    .select()
                    .eq('email', userInfo?.user.email)

                if (data) {
                    ////If no data, its a new sign up///
                    if (data.length === 0) {
                        ToastAndroid.show("You don't have an account yet. Sign up instead!", ToastAndroid.SHORT);
                        await GoogleSignin.signOut();
                        setLoading(false);
                        return;
                    }
                    dispatch(setCurrentUser({
                        name: data[0].name,
                        email: data[0].email,
                        photo: data[0].photo,
                        id: data[0].id
                    }))
                }
                if (error) console.error(error.message)

            } else {
                throw new Error('no ID token present!')
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        // user cancelled the login flow
                        break;
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }

        }
        setLoading(false)
    }
    return (
        <View className=' flex w-5/6 items-center self-center mt-2' >
            <GoogleSigninButton
                className=''
                size={GoogleSigninButton?.Size.Wide}
                style={{ "width": "103%" }}
                color={GoogleSigninButton?.Color.Dark}
                onPress={handleSignIn}
                disabled={loading}
            />
        </View>
    )
}

export default GoogleSignIn