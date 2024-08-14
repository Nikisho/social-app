import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface ChatCardProps {
    item: {
        receiver_id: number
        receiver_photo: string
        receiver_name: string
        content: string
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
            className='flex flex-row p-2 items-center space-x-3 bg-gray-100'>
            {
                item.receiver_photo ?

                    <Image
                        className='w-10 h-10 rounded-full'
                        source={{
                            uri: item.receiver_photo,
                        }}
                    />
                    :
                    <>
                        <FontAwesome name="user-circle" size={38} color="black" />
                    </>
            }
            <View>
                <Text>
                    {item.receiver_name}
                </Text>
                <Text 
                    numberOfLines={1} 
                    style={{fontSize: 12}}
                    className='text-gray-600'
                    >
                    {item.content}
                </Text>
            </View>

        </TouchableOpacity>
    )
}

export default ChatCard

const styles = StyleSheet.create({
    smallText: {
      fontSize: 5, // just a number, no unit required
    },
  });