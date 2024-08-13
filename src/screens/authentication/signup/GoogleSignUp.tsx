import { View, Text, Alert } from 'react-native'
import React from 'react'
import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import { supabase } from '../../../../supabase';

const GoogleSignUp = () => {
    GoogleSignin.configure({webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID});
    const dispatch = useDispatch();
    const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.idToken,
                })
                console.log(error, data)
            } else {
                throw new Error('no ID token present!')
            }
            const { error, data } = await supabase
                .from('users')
                .insert({
                    name: userInfo.user.name,
                    email: userInfo.user.email,
                    photo: userInfo.user.photo,
                    auth_provider: 'google'
                })
                .select('id')
            if (error) { console.error(error.message); }
            if (error?.code === '23505') {
                Alert.alert('You already have an account, just sign in!');
                return;
            }
            if (data) {
                dispatch(setCurrentUser({
                    name: userInfo.user.name,
                    email: userInfo.user.email,
                    photo: userInfo.user.photo,
                    id: data[0].id
                }))
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
    };

    return (
        <View className=' flex w-5/6 items-center self-center mt-2' >

            <GoogleSigninButton
                size={GoogleSigninButton?.Size.Wide}
                style={{ "width": "103%" }}
                color={GoogleSigninButton?.Color.Dark}
                onPress={handleSignIn}
            // disabled={isInProgress}
            />
        </View>
    )
}

export default GoogleSignUp