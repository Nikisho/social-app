import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../utils/types/types'
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../utils/styles/shadow';

interface SecondaryHeaderType {
    displayText: string;
}

const SecondaryHeader:React.FC<SecondaryHeaderType> = ({
    displayText
}) => {
    const navigation = useNavigation<RootStackNavigationProp>()
    return (
        <View className='flex-row flex items-center space-x-5 m-3'>
            <TouchableOpacity 
                className="p-3 rounded-full w-10 h-10 justify-center items-center flex flex-r " 
                style={styles.shadowButtonStyle}
                onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={18} color="white" />
            </TouchableOpacity>
            <Text className='text-2xl font-semibold w-4/5 '>
                {displayText}
            </Text>
        </View>
  )
}

export default SecondaryHeader