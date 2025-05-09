import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../utils/types/types'
import Ionicons from '@expo/vector-icons/Ionicons';

interface SecondaryHeaderType {
    displayText: string;
}

const SecondaryHeader:React.FC<SecondaryHeaderType> = ({
    displayText
}) => {
    const navigation = useNavigation<RootStackNavigationProp>()
    return (
        <View className='p-1 flex-row flex items-center'>
            <TouchableOpacity className="py-3 pr-5 " onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
            </TouchableOpacity>
            <Text className='text-2xl font-semibold '>
                {displayText}
            </Text>
        </View>
  )
}

export default SecondaryHeader