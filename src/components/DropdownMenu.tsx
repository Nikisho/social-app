import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import styles from '../utils/styles/shadow'
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

interface DropDownManuProps {
    signOut: () => void
    navigateProfile: () => void
}

const DropdownMenu:React.FC<DropDownManuProps> = ({
    signOut,
    navigateProfile
}) => {
    return (
        <View className='w-full absolute z-10 top-14 flex flex-row justify-end'>

            <View className=' w-1/3 place-self-end bg-white rounded-lg rounded-tr-none'>
                <TouchableOpacity 
                    onPress={navigateProfile}
                    className=' p-3 bg-white rounded-tl-xl flex justify-between flex-row' style={styles.shadowButtonStyle}>
                    <Text className='text-white font-semibold'>Profile</Text>
                    <Ionicons name="person" size={22} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={signOut}
                    className='p-3 border-t bg-white rounded-bl-xl rounded-br-xl flex justify-between flex-row' style={styles.shadowButtonStyle}>
                    <Text className='text-white font-semibold'>Sign out</Text>
                    <MaterialIcons name="logout" size={22} color="white" />
                </TouchableOpacity>
            </View>
        </View>

    )
}

export default DropdownMenu