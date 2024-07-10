import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
interface FeedCardProps {
    name: string;
    title: string;
    description: string;
}

const FeedCard: React.FC<FeedCardProps> = ({ name, title, description }) => {
    return (
        <TouchableOpacity className='rounded-lg bg-amber-300 p-2 mb-3 space-y-1'>
            <View className='flex flex-row space-x-3 items-center'>
                <FontAwesome name="user-circle" size={24} color="black" />
                <Text>
                    {name}
                </Text>

            </View>
            <Text className='text-xl'>
                {title}
            </Text>
            <Text className='whitespace-normal'>
                {description}
            </Text>
        </TouchableOpacity>
    )
}

export default FeedCard