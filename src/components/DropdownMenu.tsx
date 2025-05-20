import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../utils/styles/shadow'
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../utils/types/types';
import Fontisto from '@expo/vector-icons/Fontisto';

interface DropDownManuProps {
    signOut: () => void
    navigateProfile: () => void
}

const DropdownMenu:React.FC<DropDownManuProps> = ({
    signOut,
    navigateProfile
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();

    return (
        <View className='w-full absolute z-10 top-14 flex flex-row justify-end'>

            <View className=' w-1/3 place-self-end rounded-lg rounded-tr-none'>
                <TouchableOpacity 
                    onPress={navigateProfile}
                    className=' p-3 rounded-tl-xl flex items-center flex-row space-x-4' style={styles.shadowButtonStyle}>
                    <Ionicons name="person" size={22} color="white" />
                    <Text className='text-white font-semibold'>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('settings')}
                    className=' p-3 b flex items-center flex-row space-x-4' style={styles.shadowButtonStyle}>
                      <Fontisto name="player-settings" size={22} color="white" />
                      <Text className='text-white font-semibold'>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={signOut}
                    className='p-3  rounded-bl-xl rounded-br-xl flex items-center flex-row space-x-4' style={styles.shadowButtonStyle}>
                    <MaterialIcons name="logout" size={22} color="white" />
                    <Text className='text-white font-semibold'>Sign out</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default DropdownMenu