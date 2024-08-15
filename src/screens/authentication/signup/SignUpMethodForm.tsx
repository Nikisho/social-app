import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import GoogleSignUp from './GoogleSignUp'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import styles from '../../../utils/styles/shadow'
interface UserDataProps {
    name: string;
    age: string;
};
const SignUpMethodForm: React.FC<UserDataProps> = ({
    name,
    age
}) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <View className='w-full flex  space-y-3 h-1/2 justify-center ' >
            <View className=' h-1/3 space-y-3 self-center'>
                <Text className='text-2xl font-bold'>
                    Sign In to Your Account 🚀
                </Text>
                <Text>
                    Please choose one of the options below.
                </Text>
            </View>
            <TouchableOpacity
                style={styles.shadowButtonStyle} className='p-3 self-center w-5/6 flex items-center'>
                <Text className='text-md font-bold text-white'>
                    Use email and password
                </Text>
            </TouchableOpacity>
            <GoogleSignUp
                name={name}
                age={age}
            />
        </View>
    )
}

export default SignUpMethodForm