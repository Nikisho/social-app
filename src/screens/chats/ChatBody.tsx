import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
import colours from '../../utils/styles/colours'
import { FlatList } from 'react-native-gesture-handler'
import { supabase } from '../../../supabase'
import { useFocusEffect } from '@react-navigation/native'
import formatTime from '../../utils/functions/formatTime'


interface Message {
    message_id: number;
    chat_room_id: number;
    sender_id: number;
    content: string;
    created_at: string;
}

interface MessageProps {
    item: Message;
}
interface ChatProps {
    currentUser: { id: number };
    messages: string[]
}

const ChatBody: React.FC<ChatProps> = ({ currentUser, messages }) => {
    const renderItem = ({ item }: { item: Message }) => {
        const isCurrentUser = currentUser.id === item.sender_id;
        const formattedTime = formatTime(item.created_at)

        return (
            <View
                style={[
                    {
                        backgroundColor: isCurrentUser ? colours.secondaryColour : '#edf2f7',
                        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                    },
                    styles.messageBubble,
                    isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                ]}
            >
                <Text
                    style={{
                        color: isCurrentUser ? '#ffffff' : '#000000',
                    }}
                >
                    {item.content}
                </Text>
                <Text style={[
                    isCurrentUser ? styles.rightAlignedText : styles.leftAlignedText
                ]}>
                    {formattedTime}
                </Text>
            </View>
        );
    };

    return (
        <>
            {
                messages && (
                    <View className='overflow-y-scroll space-y-5 px-3 py-3'>
                        <FlatList
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={(item: any) => item.message_id.toString()}
                            contentContainerStyle={styles.container}
                        />
                    </View>
                )
            }

        </>

    )
}
const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        paddingBottom: 5,
        borderRadius: 10,
        maxWidth: '80%',
        marginVertical: 5,
    },
    currentUserBubble: {
        borderBottomRightRadius: 0,
    },
    otherUserBubble: {
        borderBottomLeftRadius: 0,
    },
    rightAlignedText: {
        paddingTop: 3,
        textAlign: 'right',
        fontSize: 8,
        color: '#ffffff'
    },
    leftAlignedText: {
        paddingTop: 3,
        textAlign: 'left',
        fontSize: 8,
        color: '#000000'
    },
});

export default ChatBody