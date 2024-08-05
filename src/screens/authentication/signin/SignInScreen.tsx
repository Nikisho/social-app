import { View, Text, Alert } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styles from '../../../utils/styles/shadow'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import GoogleSignIn from './GoogleSignIn'

GoogleSignin.configure(
    // {
    //     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    // }
)
const SignInScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    return (
        <View className='flex items-center space-y-5 h-3/4 justify-center '>
            <Text className='p-2 text-3xl font-bold'>
                Sign in to Friendzy.
            </Text>

            <View className='w-full flex space-y-3'>

                <TouchableOpacity style={styles.shadowButtonStyle} className='p-3 self-center  w-5/6 flex items-center'>
                    <Text className='text-md font-bold'>
                        Use email and password
                    </Text>
                </TouchableOpacity>

                <GoogleSignIn />

                <View className='flex flex-row space-x-2 self-center' >
                    <Text className=' font-semibold p-3'>Don't have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('signup')}
                        style={styles.shadowButtonStyle}
                        className=' py-3 px-4 rounded-full'><Text className='font-semibold'>Sign up</Text></TouchableOpacity>
                </View>
            </View>

        </View>

    )
}

export default SignInScreen