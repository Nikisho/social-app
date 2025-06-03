import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../utils/types/types'
import Ionicons from '@expo/vector-icons/Ionicons';
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
        <View className='p-1 flex-row flex items-center space-x-5'>
            <TouchableOpacity 
                className="p-4 rounded-full justify-center items-center flex flex-r " 
                style={styles.shadowButtonStyle}
                onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={19} color="white" />
            </TouchableOpacity>
            <Text className='text-2xl font-semibold w-4/5 '>
                {displayText}
            </Text>
        </View>
  )
}

export default SecondaryHeader