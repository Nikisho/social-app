import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import GoogleSignUp from './GoogleSignUp';

const SignUpScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    return (
        <View className='flex items-center space-y-5 h-3/4 justify-center'>
            <Text className='p-2 text-3xl font-bold'>
                Sign up for Friendzy.
            </Text>

            <View className='w-full flex items-center space-y-3'>

                <TouchableOpacity
                    style={styles.shadowButtonStyle} className='p-3  self-center w-5/6 flex items-center'>
                    <Text className='text-md font-bold text-white'>
                        Use email and password
                    </Text>
                </TouchableOpacity>
                <GoogleSignUp />
                <View className='flex flex-row space-x-2 '>
                    <Text className=' font-semibold p-3 '>Already have an acccount?</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('signin')} 
                        style={styles.shadowButtonStyle}
                        className=' py-3 px-4 rounded-full'>
                        <Text className='font-bold text-white'>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}



export default SignUpScreen;



