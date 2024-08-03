import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import styles from '../../utils/styles/shadow';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../context/navSlice';
import { supabase } from '../../../supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

GoogleSignin.configure(
    // {
    //     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    // }
)

const SignUpScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
        const handleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            const { error, data } = await supabase
            .from('users')
            .insert({
                name: userInfo.user.name,
                email: userInfo.user.email,
                photo: userInfo.user.photo
            })
            .select('id')
            if (error) {console.error(error.message);}
            if (error?.code === '23505') {
                Alert.alert('You already have an account, just sign in!')
            }
            if (data) {
                dispatch(setCurrentUser({ 
                    name: userInfo.user.name ,
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
        <View className='flex items-center space-y-5 h-3/4 justify-center'>
            <Text className='p-2 text-3xl font-bold'>
                Sign up for Friendzy.
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
                <View className='flex flex-row space-x-2 '>
                    <Text className=' font-semibold p-3'>Already have an acccount?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('signin')} className='bg-yellow-400 py-3 px-4 rounded-full'><Text className='font-semibold'>Sign in</Text></TouchableOpacity>
                </View>
            </View>

        </View>
    )
}



export default SignUpScreen;



