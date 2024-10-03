import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import GoogleSignUp from './GoogleSignUp'
import styles from '../../../utils/styles/shadow'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp, RootStackParamList } from '../../../utils/types/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface UserDataProps {
    name: string;
    age: string | null;
};
const SignUpMethodForm: React.FC<UserDataProps> = ({
    name,
    age,
}) => {

    const navigation = useNavigation<RootStackNavigationProp>()
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
                onPress={() => { navigation.navigate('emailsignup', {
                    age: age,
                    name: name
                })}}
                style={styles.shadowButtonStyle} className='px-5 py-4 self-center w-5/6 flex flex-row items-center rounded-full'>
                                            <MaterialIcons name="email" size={24} color="white" />

                <Text className='text-lg font-bold text-white ml-8'>
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