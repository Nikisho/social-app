import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import colours from '../../utils/styles/colours';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import extractTimeFromDate from '../../utils/functions/extractTimeFromDate';
import styles from '../../utils/styles/shadow';
import { getColorFromName } from '../../utils/functions/getColorFromName';
interface ChatCardProps {
    item: {
        user_id: number;
        featured_event_id: number;
        title: string;
        photo: string;
        last_message_content: string;
        last_message_time: string;
        chat_room_id: number;
        type: string;
        unread_count: number;
    }
}
const ChatCard: React.FC<ChatCardProps> = ({
    item
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = async () => {

        if (item.type === 'group') {
            navigation.navigate('groupchat', {
                featured_event_id: item.featured_event_id
            })
        } else {
            navigation.navigate('chat',
                { user_id: item.user_id }
            );
        }
    };

    return (
        <TouchableOpacity
            onPress={handleNavigate}
            className='flex flex-row px-5 py-3 items-center space-x-3'>
            {
                item.photo ?
                    <View
                        style={styles.shadow}
                        className='bg-white rounded-full'
                    >
                        <Image
                            className='w-12 h-12 rounded-full'
                            source={{
                                uri: item.photo,
                            }}
                        />
                    </View>
                    :
                    <View
                        style={{
                            backgroundColor: getColorFromName(item.title),
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 5,
                            borderWidth: 1
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            {item.title.charAt(0).toUpperCase()}
                        </Text>
                    </View>
            }
            <View className='flex flex-row justify-between grow' >
                <View>

                    <Text
                        numberOfLines={1} style={{ width: 220 }}
                    >
                        {item.title}
                    </Text>
                    {
                        item.last_message_content ?
                            <Text
                                numberOfLines={1}

                                style={{ fontSize: 12, width: 220 }}
                                className={`text-gray-600 ${!item.last_message_content && 'italic'}`}
                            >
                                {item.last_message_content}
                            </Text>
                            :
                            <>
                                {item.type === 'group' && (
                                    <Text className='text-gray-600 italic'>
                                        Start connecting with fellow attendees!
                                    </Text>
                                )}

                                {item.type === 'private' && (
                                    <MaterialIcons name="insert-photo" size={24} color="black" />
                                )}

                            </>
                    }
                </View>
            </View>
            <View>

                {
                    item.last_message_time && (
                        <Text style={{ fontSize: 10 }}>
                            {extractTimeFromDate(item.last_message_time)}
                        </Text>
                    )
                }
                {
                    item.unread_count !== 0 && item.unread_count !== null &&(
                        <View className='flex flex-row items-center justify-end grow '
                        >
                            <View className='rounded-full'
                                style={{ backgroundColor: colours.secondaryColour }}
                            >


                                <Text
                                    style={{
                                        paddingHorizontal: 6,
                                        paddingVertical: 1,
                                        color: '#ffffff',
                                        fontSize: 12,

                                    }}
                                    className=' rounded-full'>
                                    {/* {unreadMessageCount} */}
                                    {item.unread_count}
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
