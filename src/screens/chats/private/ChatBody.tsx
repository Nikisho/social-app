import { View, Text, StyleSheet, Image, Dimensions, FlatList, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import colours from '../../../utils/styles/colours';
import extractTimeFromDate from '../../../utils/functions/extractTimeFromDate';
import Hyperlink from 'react-native-hyperlink';
import { supabase } from '../../../../supabase';

interface Message {
    message_reactions: {
        reactions: { reaction_emoji: string }
    }[];
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
    fetchMessages: () => void;
}

const ChatBody: React.FC<ChatProps> = ({ currentUser, messages, fetchMessages }) => {

    const [reactionEmojis, setReactionEmojis] = useState<{ reaction_emoji: string, reaction_id: number }[]>();
    const fetchReactionEmojis = async () => {
        const { error, data } = await supabase
            .from('reactions')
            .select('reaction_id, reaction_emoji')
        if (data) {
            setReactionEmojis(data)
        }
        if (error) console.error(error.code);
    };

    useEffect(() => {
        fetchReactionEmojis();
    }, []);

    const MessageBubble = ({ item }: { item: Message }) => {
        const isCurrentUser = currentUser.id === item.sender_id;
        const formattedTime = extractTimeFromDate(item.created_at);

        const [reactionBannerVisible, setReactionBannerVisible] = useState<boolean>(false);
        const handleReact = async (message_id: number, reaction_id: number) => {
            const { error } = await supabase
                .from('message_reactions')
                .insert({
                    message_id,
                    reaction_id,
                    user_id: currentUser.id
                });

            setReactionBannerVisible(false);

            if (error?.code === '23505') {
                // Fetch existing reaction for this message + user
                const { data: existing } = await supabase
                    .from('message_reactions')
                    .select('*')
                    .eq('message_id', message_id)
                    .eq('user_id', currentUser.id)
                    .single();
                if (existing?.reaction_id === reaction_id) {
                    // Same emoji → remove it
                    const { error: deleteError } = await supabase
                        .from('message_reactions')
                        .delete()
                        .eq('message_id', message_id)
                        .eq('user_id', currentUser.id);
                    if (deleteError) console.error(deleteError)
                } else {
                    // Different emoji → swap it
                    await supabase
                        .from('message_reactions')
                        .update({ reaction_id })
                        .eq('message_id', message_id)
                        .eq('user_id', currentUser.id);
                }
            } else if (error) {
                console.error(error);
            }
            fetchMessages();
        };

        return (
            <View>
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
                    {
                        reactionBannerVisible && (
                            <View
                                style={{
                                    right: isCurrentUser ? 10 : 'auto',
                                }}
                                className='absolute z-10 top-[-] bg-gray-400 rounded-full p-2 px-4 flex flex-row space-x-2'>
                                {
                                    reactionEmojis?.map((emoji) => (
                                        <TouchableOpacity
                                            key={emoji.reaction_id}
                                            onPress={() => handleReact(item.message_id, emoji.reaction_id)}
                                        >
                                            <Text>
                                                {emoji.reaction_emoji}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        )
                    }

                    <Pressable
                        style={({ pressed }) => [{
                            backgroundColor: isCurrentUser ? (pressed ? '#404040' : 'black') : (pressed ? '#d9e2eb' : '#edf2f7'),
                            // padding: 10,
                            borderRadius: 10,
                        }]}
                        onPress={() => { setReactionBannerVisible(!reactionBannerVisible) }}
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
                                <Hyperlink
                                    linkDefault={true}
                                    linkStyle={{ color: "blue" }}
                                >
                                    <Text
                                        selectable={true}
                                        style={{
                                            color: isCurrentUser ? '#ffffff' : '#000000',
                                            fontSize: 16,
                                        }}
                                    >
                                        {item.content}
                                    </Text>
                                </Hyperlink>
                            )
                        }

                        <Text style={[isCurrentUser ? styles.rightAlignedText : styles.leftAlignedText]}>
                            {formattedTime}
                        </Text>
                    </Pressable>
                </View>
                {

                    item.message_reactions.length >= 1 &&
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: isCurrentUser ? colours.secondaryColour : '#edf2f7',
                            paddingHorizontal: 5,
                            paddingVertical: 3,
                            marginBottom: 2,
                            borderRadius: 10,
                            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',

                        }}
                    >
                        {[...new Set(item.message_reactions.map(r => r.reactions.reaction_emoji))]
                            .slice(0, 3) // Limit to 3 emojis max
                            .map((emoji, index) => (
                                <Text key={index} className="text-xs">
                                    {emoji}
                                </Text>
                            ))}

                        {item.message_reactions.length > 1 &&
                            <Text
                                style={{
                                    color: isCurrentUser ? 'white' : 'black',
                                }}
                                className='px-1 text-xs'>
                                {item.message_reactions.length}
                            </Text>
                        }
                    </View>
                }
            </View>

        );
    };

    return (
        <>
            {messages && (
                <View style={styles.container}>
                    <FlatList
                        data={messages}
                        renderItem={({ item, index }) => {

                            return (
                                <MessageBubble
                                    item={item}
                                />
                            );
                        }}
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
        marginTop: 5,
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
