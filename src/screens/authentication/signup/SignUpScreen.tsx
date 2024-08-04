import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import styles from '../../../utils/styles/shadow';
import { GoogleSignin, GoogleSigninButton, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../../context/navSlice';
import { supabase } from '../../../../supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import GoogleSignUp from './GoogleSignUp';

GoogleSignin.configure(
    // {
    //     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    // }
)

const SignUpScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <View className='flex items-center space-y-5 h-3/4 justify-center'>
            <Text className='p-2 text-3xl font-bold'>
                Sign up for Friendzy.
            </Text>

            <View className='w-full flex items-center space-y-3'>

                <TouchableOpacity
                    style={styles.shadow} className='p-3 self-center bg-teal-400  w-5/6 flex items-center'>
                    <Text className='text-md font-bold'>
                        Use email and password
                    </Text>
                </TouchableOpacity>
                <GoogleSignUp />
                <View className='flex flex-row space-x-2 '>
                    <Text className=' font-semibold p-3'>Already have an acccount?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('signin')} className='bg-teal-400 py-3 px-4 rounded-full'><Text className='font-semibold'>Sign in</Text></TouchableOpacity>
                </View>
            </View>

        </View>
    )
}



export default SignUpScreen;



