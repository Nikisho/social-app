import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface ChatCardProps {
    item: {
        receiver_id: number
        receiver_photo: string
        receiver_name: string
    }
}
const ChatCard: React.FC<ChatCardProps> = ({
    item
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    return (
        <TouchableOpacity 
            onPress={() => {
                navigation.navigate('chat',
                  { user_id: item.receiver_id }
                );
              }}
            className='flex flex-row p-2 items-center space-x-5 bg-gray-100'>
            {
                item.receiver_photo ?

                    <Image
                        className='w-12 h-12 rounded-full'
                        source={{
                            uri: item.receiver_photo,
                        }}
                    />
                    :
                    <>
                        <FontAwesome name="user-circle" size={35} color="black" />
                    </>
            }
            <Text>
                {item.receiver_name}
            </Text>
        </TouchableOpacity>
    )
}

export default ChatCard