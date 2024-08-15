import { View, Text, Alert } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styles from '../../../utils/styles/shadow'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import GoogleSignIn from './GoogleSignIn'


const SignInScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    return (
        <View className='flex items-center space-y-5 h-full'>

            <View className='w-full flex  space-y-3 h-1/2 justify-center'>
                <View className=' h-1/3 space-y-3 self-center'>
                    <Text className='text-2xl font-bold'>
                        Sign In to Your Account 🚀
                    </Text>
                    <Text>
                        Please choose one of the options below.
                    </Text>
                </View>

                <View className='w-full flex space-y-3'>

                    <TouchableOpacity style={styles.shadowButtonStyle} className='p-3 self-center  w-5/6 flex items-center'>
                        <Text className='text-md font-bold text-white'>
                            Use email and password
                        </Text>
                    </TouchableOpacity>

                    <GoogleSignIn />


                </View>
            </View>
            <View className='absolute bottom-16 flex-row space-x-2' >
                <Text className=' font-semibold p-3'>Don't have an account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('signup')}
                    style={styles.shadowButtonStyle}
                    className=' py-3 px-4 rounded-full'><Text className='font-semibold text-white'>Sign up</Text></TouchableOpacity>
            </View>

        </View>

    )
}

export default SignInScreen