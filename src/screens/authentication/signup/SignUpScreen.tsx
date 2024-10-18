import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../../../utils/styles/shadow'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../../utils/types/types'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import GoogleSignUp from './GoogleSignUp'
import AppleSignUp from './AppleSignUp'
import Eula from './Eula'

const SignInScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [isChecked, setChecked] = useState<boolean>(false);
    return (
        <View className='flex items-center space-y-5 h-full'>
            <View className='w-full flex  space-y-3 h-1/2 justify-center'>
                <View className=' h-1/3 space-y-3 self-center'>
                    <Text className='text-2xl font-bold'>
                        Sign Up to Linkzy Now 🚀
                    </Text>
                    <Text>
                        Please choose one of the options below.
                    </Text>
                </View>
                <View className='w-full flex space-y-3'>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('emailsignup') }}
                        disabled={!isChecked}
                        style={styles.shadowButtonStyle} className={`px-5 py-4 self-center w-5/6 flex flex-row items-center rounded-full ${!isChecked && 'opacity-50'}`}>

                        <MaterialIcons name="email" size={24} color="white" />
                        <Text className='text-lg font-bold text-white ml-8'>
                            Use email and password
                        </Text>
                    </TouchableOpacity>
                    <GoogleSignUp isChecked={isChecked}/>
                    {
                        Platform.OS === 'ios' && (
                            <AppleSignUp isChecked={isChecked} />
                        )
                    }
                </View>
            </View>
            <Eula
                isChecked={isChecked}
                setChecked={setChecked}
            />
            <View className='absolute bottom-16 flex-row space-x-2' >
                <Text className=' font-semibold p-3'>Already have an account?</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('signin')}
                    style={styles.shadowButtonStyle}
                    className=' py-3 px-4 rounded-full'><Text className='font-semibold text-white'>Sign In</Text></TouchableOpacity>
            </View>

        </View>

    )
}

export default SignInScreen