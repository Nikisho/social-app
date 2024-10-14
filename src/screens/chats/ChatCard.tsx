import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import colours from '../../utils/styles/colours';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ChatCardProps {
    item: {
        receiver_id: number
        receiver_photo: string
        receiver_name: string
        content: string
        room_id: number
    }
    currentUser: {
        id: number
    }
}
const ChatCard: React.FC<ChatCardProps> = ({
    item,
    currentUser
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [unreadMessageCount, setUnreadMessageCount] = useState<number | null>(null)
    const fetchMessageCount = async () => {

        const { error, data } = await supabase
            .from('messages')
            .select('*', { count: 'exact' })
            .eq('chat_room_id', item.room_id)
            .eq('read_by_recipient', false)
            .neq('sender_id', currentUser.id)
        if (data) { setUnreadMessageCount(data.length) }
        if (error) { throw error.message }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMessageCount()
        }, [])
    );
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('chat',
                    { user_id: item.receiver_id }
                );
            }}
            className='flex flex-row p-2 py-3 items-center space-x-3 bg-gray-100'>
            {
                item.receiver_photo ?

                    <Image
                        className='w-14 h-14 rounded-full'
                        source={{
                            uri: item.receiver_photo,
                        }}
                    />
                    :
                    <>
                        <FontAwesome name="user-circle" size={60} color="black" />
                    </>
            }
            <View>
                <Text>
                    {item.receiver_name}
                </Text>
                {
                    item.content ?
                        <Text
                            numberOfLines={1}
                            style={{ fontSize: 12 }}
                            className={`text-gray-600 ${!item.content && 'italic'}`}
                        >
                            {item.content}
                        </Text>
                        :
                        <MaterialIcons name="insert-photo" size={24} color="black" />}
            </View>
            {
                unreadMessageCount && (
                    <View className='flex flex-row justify-end grow'>
                        <Text
                            style={{
                                backgroundColor: colours.secondaryColour,
                                paddingHorizontal: 6,
                                paddingVertical: 2,
                                color: '#ffffff',
                                fontSize: 10

                            }}
                            className=' rounded-full'>
                            {unreadMessageCount}
                        </Text>

                    </View>
                )
            }
        </TouchableOpacity>
    )
}

export default ChatCard

const styles = StyleSheet.create({
    smallText: {
        fontSize: 5, // just a number, no unit required
    },
});