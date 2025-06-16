import { View, Text, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import React from 'react';
import Hyperlink from 'react-native-hyperlink';
import extractTimeFromDate from '../../../utils/functions/extractTimeFromDate';
import colours from '../../../utils/styles/colours';
import { getColorFromName } from '../../../utils/functions/getColorFromName';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';

interface Message {
    message_id: number;
    chat_room_id: number;
    sender_id: number;
    content: string;
    mediaUrl: string;
    created_at: string;
    users: {
        photo: string;
        name: string
    }
}

interface ChatProps {
    messages: ArrayLike<Message>;
}

const GroupChatBody: React.FC<ChatProps> = ({ messages }) => {
    const currentUser = useSelector(selectCurrentUser);

    const renderItem = ({ item }: { item: Message }) => {
        const isCurrentUser = currentUser.id === item.sender_id;
        const formattedTime = extractTimeFromDate(item.created_at);
 
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-end',
                    marginVertical: 5,
                }}
            >
                {/* Show avatar on the left only for other users */}
                {!isCurrentUser && (
                    item.users?.photo ? (

                        <Image
                            source={{ uri: item.users.photo }}
                            className='rounded-full h-10 w-10 border'
                            style={{ marginRight: 10 }}
                        />
                    )
                        :
                        <View
                            style={{
                                backgroundColor: getColorFromName(item.users.name),
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                {item.users.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                )}

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
                    <View>
                        {/* Name displayed above message for other users */}
                        {!isCurrentUser && (
                            <Text style={{ fontWeight: 'bold', marginBottom: 5, color: '#333' }}>
                                {item.users?.name}
                            </Text>
                        )}

                        {item.content && (
                            <Hyperlink linkDefault={true} linkStyle={{ color: 'blue' }}>
                                <Text
                                    selectable
                                    style={{
                                        color: isCurrentUser ? '#ffffff' : '#000000',
                                        fontSize: 16,
                                    }}
                                >
                                    {item.content}
                                </Text>
                            </Hyperlink>
                        )}

                        <Text style={isCurrentUser ? styles.rightAlignedText : styles.leftAlignedText}>
                            {formattedTime}
                        </Text>
                    </View>

                </View>
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
                        keyExtractor={(item: Message) => item.message_id.toString()}
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
        flexDirection: 'row'
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

export default GroupChatBody;
