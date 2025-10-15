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
import markMessagesRead from '../../../utils/functions/markMessagesRead'
import { ImagePickerAsset } from 'expo-image-picker'
import { uuidv4 } from '../../../utils/functions/uuidv4'
import { decode } from 'base64-arraybuffer'
import SendMedia from '../SendMedia'



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
    series_id: number | null;
    organizers: {
        user_id: number
        users: { name: string; photo: string }
    }
}

const GroupChatScreen = () => {
    const route = useRoute<GroupChatScreenProps>()
    const currentUser = useSelector(selectCurrentUser);
    const [media, setMedia] = useState<ImagePickerAsset | null>(null);
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

    const fetchMessages = async (isInitialLoad?: boolean) => {
        //The room ID constant does not update right away, 
        // on the first render it has value undefined
        // so we return here, then once it updates the second render
        // fetches the messages

        isInitialLoad && setLoading(true);
        if (!eventData?.chat_room_id) {
            isInitialLoad && setLoading(false);
            return;
        }

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
            isInitialLoad && markMessagesRead(eventData?.chat_room_id!, currentUser.id, data[0]?.message_id)
        }
        if (error) console.error(error.message);
        isInitialLoad && setLoading(false);
    };


  const updateMediaInStorageBucket = async (file: string, unique_file_identifier: string, chatRoomIdState: number) => {
    const arrayBuffer = decode(file);
    try {
      const { error } = await supabase
        .storage
        .from('chat_rooms_media')
        .upload(`${chatRoomIdState}/${unique_file_identifier}.jpg`, arrayBuffer, {
          contentType: 'image/png',
          upsert: true,
        });
      if (error) {
        console.error('Upload error:', error.message);
      }
    } catch (error) {
      console.error('Conversion or upload error:', error);
    }
  }

    const sendMessage = async (newMessage: string) => {
        const unique_file_identifier = uuidv4(9);
        const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/chat_rooms_media/${eventData?.chat_room_id}/${unique_file_identifier}.jpg`
        if (media) {
            await updateMediaInStorageBucket(media.base64!, unique_file_identifier, eventData?.chat_room_id!);
        }
        const { error } = await supabase
            .from('messages')
            .insert({
                sender_id: currentUser.id,
                chat_room_id: eventData?.chat_room_id,
                mediaUrl: media ? mediaUrl : null,
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
                fetchMessages(false);  // Re-fetch unread messages count when data changes
            }
        )
        .subscribe();

    useEffect(() => {
        fetchEventData();
        fetchMessages(true);
    }, [eventData?.chat_room_id]);

      if (media) {
        return <SendMedia
          media={media}
          setMedia={setMedia}
          onSendMessage={sendMessage}
        />
      }

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
                            (eventDatePlus24Hours && eventDatePlus24Hours < today) && !eventData.series_id ?
                                <ChatClosed
                                    message={`This event ended on ${formatDateShortWeekday(eventData.date)}`}
                                />
                                :
                                <InputBox
                                    onSendMessage={sendMessage}
                                    setMedia={setMedia}
                                />
                        }

                    </>
                )
            }
        </SafeAreaProvider>
    )
}

export default GroupChatScreen