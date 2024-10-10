import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import colours from '../../utils/styles/colours'
import { FlatList } from 'react-native-gesture-handler'
import formatTime from '../../utils/functions/formatTime'


interface Message {
    message_id: number;
    chat_room_id: number;
    sender_id: number;
    content: string;
    created_at: string;
}

interface ChatProps {
    currentUser: { id: number };
    messages: ArrayLike<Message>
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
                        fontSize: 16
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
                    <View className='h-screen flex-1 '>
                        <FlatList
                            data={messages}
                            renderItem={renderItem}
                            keyExtractor={(item: any) => item.message_id.toString()}
                            contentContainerStyle={styles.container}
                            inverted
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
        paddingHorizontal: 12
        // height: ''
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