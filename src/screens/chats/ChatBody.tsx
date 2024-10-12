import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import React from 'react';
import colours from '../../utils/styles/colours';
import { FlatList } from 'react-native-gesture-handler';
import formatTime from '../../utils/functions/formatTime';

interface Message {
    message_id: number;
    chat_room_id: number;
    sender_id: number;
    content: string;
    mediaUrl: string;
    created_at: string;
}

interface ChatProps {
    currentUser: { id: number };
    messages: ArrayLike<Message>;
}

const ChatBody: React.FC<ChatProps> = ({ currentUser, messages }) => {
    const renderItem = ({ item }: { item: Message }) => {
        const isCurrentUser = currentUser.id === item.sender_id;
        const formattedTime = formatTime(item.created_at);

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
                {item.mediaUrl && (
                    <Image
                        source={{ uri: item.mediaUrl }}
                        style={styles.image} // Use styles for better control
                        resizeMode='contain' // Keeps the aspect ratio
                        onError={() => console.log('Error loading image')} // Error handling
                    />
                )}
                {
                    item.content && (
                        <Text
                        style={{
                            color: isCurrentUser ? '#ffffff' : '#000000',
                            fontSize: 16,
                        }}
                    >
                        {item.content}
                    </Text>
                    )
                }

                <Text style={[isCurrentUser ? styles.rightAlignedText : styles.leftAlignedText]}>
                    {formattedTime}
                </Text>
            </View>
        );
    };

    return (
        <>
            {messages && (
                <View style={styles.container}>
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item: any) => item.message_id.toString()}
                        contentContainerStyle={styles.flatListContent}
                        inverted
                    />
                </View>
            )}
        </>
    );
};

const { width } = Dimensions.get('window'); // Get screen width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    flatListContent: {
        paddingHorizontal: 12,
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
    image: {
        width: width * 0.6, // 60% of screen width
        height: 200, // Set a reasonable height
        borderRadius: 10, // Match the bubble's border radius
        marginBottom: 0, // Space between image and text
    },
    rightAlignedText: {
        paddingTop: 3,
        textAlign: 'right',
        fontSize: 8,
        color: '#ffffff',
    },
    leftAlignedText: {
        paddingTop: 3,
        textAlign: 'left',
        fontSize: 8,
        color: '#000000',
    },
});

export default ChatBody;
