import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styles from '../../../utils/styles/shadow'
import { useNavigation } from '@react-navigation/native'
import GoogleSignIn from './GoogleSignIn'
import { RootStackNavigationProp } from '../../../utils/types/types'


const SignInScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
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

                    <TouchableOpacity 
                        onPress={() => {navigation.navigate('emailsignin')}}
                        style={styles.shadowButtonStyle} className='p-3 self-center  w-5/6 flex items-center'>
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