import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../../utils/styles/shadow';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import HomeScreen from '../home/HomeScreen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../context/navSlice';

GoogleSignin.configure();

const LoginScreen = () => {
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            dispatch(setCurrentUser({ userInfo }))

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
        <View className='flex items-center space-y-5 h-3/4 justify-center'>
            <Text className='p-2 text-3xl font-bold'>
                Sign up for JustMeet.
            </Text>

            <View className='w-full flex items-center space-y-3'>

                <TouchableOpacity style={styles.shadow} className='p-3 bg-amber-300  rounded-2xl  w-5/6 flex items-center'>
                    <Text className='text-lg font-bold'>
                        Use email and password
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignIn} style={styles.shadow} className='p-3 bg-gray-100 rounded-2xl w-5/6 flex items-center'>
                    <Text className='text-lg font-bold'>
                        Continue with Google
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}



export default LoginScreen;



