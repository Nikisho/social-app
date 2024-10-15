import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import colours from '../../utils/styles/colours';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import extractTimeFromDate from '../../utils/functions/extractTimeFromDate';
import styles from '../../utils/styles/shadow';

interface ChatCardProps {
    item: {
        receiver_id: number
        receiver_photo: string
        receiver_name: string
        content: string
        last_message_time: string
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
            className='flex flex-row px-4  py-3 items-center space-x-3'>
            {
                item.receiver_photo ?
                    <View
                        style={styles.shadow}
                        className='bg-white rounded-full'
                    >

                        <Image
                            className='w-12 h-12 rounded-full'
                            source={{
                                uri: item.receiver_photo,
                            }}
                        />
                    </View>

                    :
                    <View className='bg-white rounded-full'
                        style={styles.shadow}
                    >
                        <FontAwesome name="user-circle" size={50} color="black" />
                    </View>
            }
            <View className='flex flex-row justify-between grow' >
                <View>

                    <Text>
                        {item.receiver_name}
                    </Text>
                    {
                        item.content ?
                            <Text
                                numberOfLines={1}

                                style={{ fontSize: 12, width: 220 }}
                                className={`text-gray-600 ${!item.content && 'italic'}`}
                            >
                                {item.content}
                            </Text>
                            :
                            <MaterialIcons name="insert-photo" size={24} color="black" />}
                </View>


            </View>
            <View>

                <Text style={{ fontSize: 10 }}>
                    {extractTimeFromDate(item.last_message_time)}
                </Text>
                {
                    unreadMessageCount !== 0 && (
                        <View className='flex flex-row items-center justify-end grow '
                        >
                            <View className='rounded-full'
                                style={{ backgroundColor: colours.secondaryColour }}
                            >


                                <Text
                                    style={{
                                        paddingHorizontal: 6,
                                        paddingVertical: 2,
                                        color: '#ffffff',
                                        fontSize: 12,

                                    }}
                                    className=' rounded-full'>
                                    {unreadMessageCount}
                                </Text>
                            </View>

                        </View>
                    )
                }
            </View>

        </TouchableOpacity>
    )
}

export default ChatCard
