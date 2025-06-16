import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { FeaturedEventGroupChatScreenProps } from '../../../utils/types/types'
import { supabase } from '../../../../supabase'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../context/navSlice'
import InputBox from './InputBox'
import ChatBody from '../../chats/ChatBody'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import GroupChatHeader from './GroupChatHeader'
import GroupChatBody from './GroupChatBody'



interface Message {
    message_id: number;
    chat_room_id: number;
    sender_id: number;
    mediaUrl: string
    content: string;
    created_at: string;
    users : {
        photo: string;
        name: string;
    }
}


interface EventDataProps {
    title: string
    image_url: string;
    //   is_free: boolean
    featured_event_id: number
    //   tickets_sold: number
    //   date: Date
    //   max_tickets: number
    //   organizers: {
    //     user_id: number
    //     users: { name: string; photo: string }
    //   }
}

const FeaturedEventGroupChatScreen = () => {
    const route = useRoute<FeaturedEventGroupChatScreenProps>()
    const currentUser = useSelector(selectCurrentUser);
    const { featured_event_id, chat_room_id, } = route.params;
    const [messages, setMessages] = useState<ArrayLike<Message>>([]);
    const [eventData, setEventData] = useState<EventDataProps | null>(null)

    const fetchEventData = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*, organizers(user_id, users(*))`)
            .eq('featured_event_id', featured_event_id)
            .single()

        if (error) {
            console.error(error.message)
            return
        }
        setEventData(data)
    }
    const fetchMessages = async () => {
        //The room ID constant does not update right away, 
        // on the first render it has value undefined
        // so we return here, then once it updates the second render
        // fetches the messages
        if (!chat_room_id) return;
        const { error, data } = await supabase
            .from('messages')
            .select(`*, 
                users(
                    photo,
                    name
                )`)
            .eq('chat_room_id', chat_room_id)
            .order('created_at', { ascending: false })

        if (data) {
            setMessages(data);
            console.log(data)
            //   setMessagesRead(chat_room_id) 
        }
        if (error) console.error(error.message);
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
                chat_room_id: chat_room_id,
                // mediaUrl: media ? mediaUrl : null,
                content: newMessage
            });
        await fetchMessages();
        if (error) console.error(error.message);
    };


    useEffect(() => {
        fetchEventData();
        fetchMessages();
    }, [chat_room_id]);

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
                            currentUser={currentUser}
                        />
                        <InputBox
                            onSendMessage={sendMessage}
                        />
                    </>
                )
            }
        </SafeAreaProvider>
    )
}

export default FeaturedEventGroupChatScreen