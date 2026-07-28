import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import styles from '../utils/styles/shadow'

interface ManageEventBannerComponentProps {
    onPress: () => void;
    title: string;
    description: string
}

const ManageEventBannerComponent:React.FC<ManageEventBannerComponentProps> = ({
    onPress,
    title,
    description

}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={Platform.OS === 'ios' ? styles.shadow : { borderWidth: 1 }}
            className="bg-white mt-4 rounded-2xl p-4 flex-row items-center justify-between">
            <View>
                <Text className="text-black/70 text-base font-semibold">{title}</Text>
                <Text className="text-black text-lg font-bold">
                    {description}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ManageEventBannerComponent