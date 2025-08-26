import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RootStackNavigationProp } from '../utils/types/types'
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../utils/styles/shadow';

interface SecondaryHeaderType {
    displayText: string;
}

const SecondaryHeader: React.FC<SecondaryHeaderType> = ({
    displayText
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute();
    const isRouteFeaturedEventScreen = route.name === 'featuredeventsevent';
    return (
        <View className='flex-row flex items-center space-x-5 m-3 max-w-3/2'>
            <TouchableOpacity
                className="p-3 rounded-full w-10 h-10 justify-center items-center flex flex-r "
                style={styles.shadowButtonStyle}
                onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={18} color="white" />
            </TouchableOpacity>
            <View className={`${isRouteFeaturedEventScreen && 'flex-1'}`} >
                <Text className='text-2xl font-semibold '>
                    {displayText}
                </Text>
            </View>
        </View>
    )
}

export default SecondaryHeader