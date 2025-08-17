import { View, Text, StyleSheet, Image, Dimensions, FlatList, Pressable, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Hyperlink from 'react-native-hyperlink';
import extractTimeFromDate from '../../../utils/functions/extractTimeFromDate';
import colours from '../../../utils/styles/colours';
import { getColorFromName } from '../../../utils/functions/getColorFromName';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
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
    users: {
        photo: string;
        name: string;
        id: number;
    };
}

interface ChatProps {
    messages: ArrayLike<Message>;
    fetchMessages: () => void
    organizers: {
        user_id: number
    }
}

const GroupChatBody: React.FC<ChatProps> = ({ messages, organizers, fetchMessages }) => {
    const currentUser = useSelector(selectCurrentUser);
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

    const MessageBubble = ({ item, isGroupStart }: {
        item: Message,
        isGroupStart: boolean
    }) => {
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
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    marginTop: isGroupStart ? 10 : 0,
                }}
            >
                {/* Avatar placeholder for non-current user */}
                {!isCurrentUser && (
                    item.users?.photo ? (
                        <Image
                            source={{ uri: item.users.photo }}
                            className="rounded-full h-10 w-10 border"
                            style={{
                                marginRight: 10,
                                marginTop: 10,
                                opacity: isGroupStart ? 1 : 0,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                backgroundColor: getColorFromName(item.users.name),
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 10,
                                opacity: isGroupStart ? 1 : 0,
                            }}
                        >
                            {isGroupStart && (
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                    {item.users.name.charAt(0).toUpperCase()}
                                </Text>
                            )}
                        </View>
                    )
                )}

                <View
                    style={{
                        // flexGrow: ,
                        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-start',
                        flex: 1
                    }}
                >

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
                                padding: 10,
                                borderRadius: 10,
                            }]}
                            onPress={() => { setReactionBannerVisible(!reactionBannerVisible) }}
                        >
                            <View>
                                {/* Name + organiser badge */}
                                {isGroupStart && !isCurrentUser && (
                                    <View className="flex flex-row space-x-2 items-center mb-1">
                                        <Text style={{ fontWeight: 'bold', color: '#333' }}>
                                            {item.users?.name}
                                        </Text>
                                        {item.sender_id === organizers.user_id && (
                                            <View className="bg-green-100 px-1 rounded-full flex-row items-center border-green-800 border">
                                                <Text className="text-green-800 font-semibold text-xs text-center">
                                                    Organiser
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Message text */}
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

                                {/* Timestamp */}
                                <Text
                                    style={
                                        isCurrentUser
                                            ? styles.rightAlignedText
                                            : styles.leftAlignedText
                                    }
                                >
                                    {formattedTime}
                                </Text>
                            </View>

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
                                // borderWidth: 0.2
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

            </View >
        );
    };


    return (
        <>
            {messages && (
                <View style={styles.container}>
                    <FlatList
                        data={messages}
                        renderItem={({ item, index }) => {
                            const previousMessage = messages[index + 1];
                            const isGroupStart = !previousMessage || previousMessage.sender_id !== item.sender_id;

                            return (
                                <MessageBubble
                                    item={item}
                                    isGroupStart={isGroupStart}
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
        // padding: 10,
        paddingBottom: 5,
        borderRadius: 10,
        maxWidth: '80%',
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
