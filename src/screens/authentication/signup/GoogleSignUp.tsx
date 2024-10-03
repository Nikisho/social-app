import { View, Text, ToastAndroid, Alert, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import { supabase } from '../../../../supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../../utils/styles/shadow';
import AntDesign from '@expo/vector-icons/AntDesign';

interface UserDataProps {
    name: string;
    age: string | null;
};

const GoogleSignUp: React.FC<UserDataProps> = ({
    name,
    age
}) => {

    GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const handleSignIn = async () => {
        setLoading(true);
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.idToken) {
                const { data: AuthUserData, error: AuthUserError } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.idToken,
                });

                if (AuthUserData.session) {
                    await AsyncStorage.setItem('userAccessToken', AuthUserData.session.access_token);
                    await AsyncStorage.setItem('userRefreshToken', AuthUserData.session.refresh_token);
                }

                if (AuthUserError) console.error(AuthUserError.message)
                const { error, data } = await supabase
                    .from('users')
                    .insert({
                        name: name,
                        email: userInfo.user.email,
                        // photo: userInfo.user.photo,
                        uid: AuthUserData.user?.id,
                        age: age,
                        auth_provider: 'google'
                    })
                    .select('id')
                if (error) { console.error(error.message); }
                if (error?.code === '23505') {
                    Platform.OS === 'android' ?
                        ToastAndroid.show('You already have an account, just sign in!', ToastAndroid.SHORT)
                        :
                        Alert.alert('You already have an account, just sign in!')

                    setLoading(false);
                    return;
                }
                if (data) {
                    dispatch(setCurrentUser({
                        name: name,
                        email: userInfo.user.email,
                        // photo: userInfo.user.photo,
                        id: data[0].id
                    }))
                }
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
        setLoading(false);
    };

    return (
        <View className=' flex w-5/6 items-center self-center mt-2' >

            <TouchableOpacity className='w-full bg-white px-5 py-4 rounded-full flex flex-row 
                                items-center'
                style={styles.shadow}
                onPress={handleSignIn}
                disabled={loading}
            >
                <AntDesign name="google" size={24} color="red" />
                <Text className=' font-semibold text-lg ml-12'>
                    Continue with Google
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default GoogleSignUp