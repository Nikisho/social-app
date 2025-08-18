import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { GroupChatScreenProps } from '../../../utils/types/types'
import { supabase } from '../../../../supabase'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../context/navSlice'
import InputBox from './InputBox'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import GroupChatHeader from './GroupChatHeader'
import GroupChatBody from './GroupChatBody'
import LoadingScreen from '../../loading/LoadingScreen'
import { Text } from 'react-native'
import ChatClosed from './ChatClosed'
import formatDate from '../../../utils/functions/formatDate'
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday'



interface Message {
    message_reactions: {
        reactions: { reaction_emoji: string }
    }[];
    message_id: number;
    chat_room_id: number;
    sender_id: number;
    mediaUrl: string
    content: string;
    created_at: string;
    users: {
        photo: string;
        name: string;
        id: number;
    }
}


interface EventDataProps {
    title: string
    image_url: string;
    featured_event_id: number;
    chat_room_id: number;
    //   tickets_sold: number
    date: string;
    time: string;
    //   max_tickets: number
    organizers: {
        user_id: number
        users: { name: string; photo: string }
    }
}

const GroupChatScreen = () => {
    const route = useRoute<GroupChatScreenProps>()
    const currentUser = useSelector(selectCurrentUser);
    const { featured_event_id } = route.params;
    const [messages, setMessages] = useState<ArrayLike<Message>>([]);
    const [eventData, setEventData] = useState<EventDataProps | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const today = new Date();
    const eventDatePlus24Hours = new Date(new Date(eventData?.date!).getTime() + 60 * 60 * 24 * 1000);

    const fetchEventData = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*, organizers(user_id, users(*))`)
            .eq('featured_event_id', featured_event_id)
            .single()

        if (error) {
            console.error(error.message)
        }
        if (data) {
            setEventData(data)
        }
    };

    const setMessagesRead = async (chatRoomID: number) => {
        const { error } = await supabase
            .from('messages')
            .update({ read_by_recipient: true })
            .eq('chat_room_id', chatRoomID)
            .neq('sender_id', currentUser.id)
            .eq('read_by_recipient', false);
        if (error) { console.error(error.message) }
    };

    const fetchMessages = async (isInitialLoad?: boolean) => {
        //The room ID constant does not update right away, 
        // on the first render it has value undefined
        // so we return here, then once it updates the second render
        // fetches the messages

        isInitialLoad && setLoading(true);
        if (!eventData?.chat_room_id) return;
        const { error, data } = await supabase
            .from('messages')
            .select(`*, 
                users(
                    photo,
                    name,
                    id
                ),
                message_reactions (
                reaction_id,
                reactions (reaction_emoji)
            )
                `)
            .eq('chat_room_id', eventData?.chat_room_id)
            .order('created_at', { ascending: false })

        if (data) {
            setMessages(data);
            setMessagesRead(eventData?.chat_room_id)
        }
        if (error) console.error(error.message);
        isInitialLoad && setLoading(false);
    };


    const sendMessage = async (newMessage: string) => {
        // const unique_file_identifier = uuidv4(9);
        // const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/chat_rooms_media/${chatRoomIdState}/${unique_file_identifier}.jpg`
        // if (media) {
        //     await updateProfilePictureInStorageBucket(media.base64!, unique_file_identifier);
        // }
        const { error } = await supabase
            .from('messages')
            .insert({
                sender_id: currentUser.id,
                chat_room_id: eventData?.chat_room_id,
                // mediaUrl: media ? mediaUrl : null,
                content: newMessage
            });

        const { error: ChatRoomError } = await supabase
            .from('chat_rooms')
            .update({
                updated_at: new Date()
            })
            .eq('chat_room_id', eventData?.chat_room_id);
        await fetchMessages();
        if (error) console.error(error.message);
        if (ChatRoomError) console.error(ChatRoomError.message);
    };

    const subscription = supabase
        .channel('chat_rooms')
        .on('postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'chat_rooms',
                filter: `chat_room_id=eq.${eventData?.chat_room_id}`
            },
            (payload) => {
                console.log('Change detected:', payload);
                fetchMessages();  // Re-fetch unread messages count when data changes
            }
        )
        .subscribe();

    useEffect(() => {
        fetchEventData();
        fetchMessages(true);
    }, [eventData?.chat_room_id]);


    if (loading) {
        return <LoadingScreen displayText='Getting your messages...' />
    }

    return (
        <SafeAreaProvider className='h-screen flex'>

            {
                eventData && (
                    <>
                        <GroupChatHeader
                            {...eventData!}
                        />
                        <GroupChatBody
                            messages={messages}
                            {...eventData!}
                            fetchMessages={fetchMessages}
                        />

                        {
                            eventDatePlus24Hours && eventDatePlus24Hours < today ?
                                <ChatClosed
                                    message={`This event ended on ${formatDateShortWeekday(eventData.date)}`}
                                />
                                :
                                <InputBox
                                    onSendMessage={sendMessage}
                                />
                        }

                    </>
                )
            }
        </SafeAreaProvider>
    )
}

export default GroupChatScreen