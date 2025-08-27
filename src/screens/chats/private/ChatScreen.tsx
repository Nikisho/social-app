import { Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ChatScreenRouteProp, RootStackNavigationProp } from '../../../utils/types/types';
import { supabase } from '../../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import ChatHeader from './ChatHeader';
import InputBox from './InputBox';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatBody from './ChatBody';
import SendMedia from '../SendMedia';
import { decode } from 'base64-arraybuffer';
import { uuidv4 } from '../../../utils/functions/uuidv4';
import { ImagePickerAsset } from 'expo-image-picker';
import EmptyChat from './EmptyChat';
import LoadingScreen from '../../loading/LoadingScreen';
import markMessagesRead from '../../../utils/functions/markMessagesRead';

interface UserDataProps {
  name: string;
  photo: string;
  id: number;
}

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
}

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { user_id } = route.params
  const currentUser = useSelector(selectCurrentUser);
  const [chatRoomIdState, setChatRoomIdState] = useState<number>();
  const [userData, setUserData] = useState<UserDataProps>();
  const [messages, setMessages] = useState<ArrayLike<Message>>([]);
  const [media, setMedia] = useState<ImagePickerAsset | null>(null);
  const navigation = useNavigation<RootStackNavigationProp>();
  const [loading, setLoading] = useState<boolean>(false);
  const [onlineStatus, setOnlineStatus] = useState<'online' | 'offline'>('offline');

  const fetchUserData = async () => {
    const { error, data } = await supabase
      .from('users')
      .select()
      .eq('id', user_id)
    if (data) setUserData(data[0]);
    if (error) console.error(error.message);
  };

  const fetchChatData = async () => {

    const { data: existingChat, error: existingChatError } = await supabase
      .from('private_chats')
      .select()
      .or(`and(user1_id.eq.${user_id},user2_id.eq.${currentUser.id}),and(user1_id.eq.${currentUser.id},user2_id.eq.${user_id})`)
      .single();
    if (existingChatError) { console.error(existingChatError.message) };

    if (existingChat) {
      setChatRoomIdState(existingChat.chat_room_id);
      return existingChat.chat_room_id;
    } else {

      const { data: newChatRoom, error: newChatRoomError } = await supabase
        .from('chat_rooms')
        .insert({
          type: 'private'
        })
        .select()
        .single();

      setChatRoomIdState(newChatRoom.chat_room_id);
      if (newChatRoomError) {
        console.error('Error adding chat room:', newChatRoomError);
        return;
      }

      const { error: privateChatError } = await supabase.from('private_chats').insert({
        user1_id: user_id,
        user2_id: currentUser.id,
        chat_room_id: newChatRoom.chat_room_id,
      });
      if (privateChatError) {
        console.error('Error adding private chat:', privateChatError);
        return;
      }

      const { error: participantError } = await supabase.from('participants').insert([
        { chat_room_id: newChatRoom.chat_room_id, user_id: user_id },
        { chat_room_id: newChatRoom.chat_room_id, user_id: currentUser.id },
      ]);
      if (participantError) {
        console.error('Error adding participants:', participantError);
        return;
      }
    }

  };
  //When the user opens a chat here we set the unread messages to read in the DB
  //This is done in the chat screen directly to update no matter where the user opens the chat from
  const setMessagesRead = async (chatRoomID: number) => {
    if (!chatRoomIdState) return;
    const { error } = await supabase
      .from('messages')
      .update({ read_by_recipient: true })
      .eq('chat_room_id', chatRoomID)
      .neq('sender_id', currentUser.id)
      .eq('read_by_recipient', false);
    if (error) { console.error(error.message) }

  }
  const fetchMessages = async (isInitialLoad?: boolean) => {
    // console.log(chatRoomIdState)
    //The room ID constant does not update right away, 
    // on the first render it has value undefined
    // so we return here, then once it updates the second render
    // fetches the messages
    isInitialLoad && setLoading(true);

    if (!chatRoomIdState) {
      isInitialLoad && setLoading(false);
      return;
    };
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
      .eq('chat_room_id', chatRoomIdState)
      .order('created_at', { ascending: false })

    if (data) {
      setMessages(data);
      markMessagesRead(chatRoomIdState!, currentUser.id, data[0]?.message_id)
    }
    if (error) console.error(error.message);
    isInitialLoad && setLoading(false);

  };

  const updateProfilePictureInStorageBucket = async (file: string, unique_file_identifier: string) => {
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
    const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/chat_rooms_media/${chatRoomIdState}/${unique_file_identifier}.jpg`
    if (media) {
      await updateProfilePictureInStorageBucket(media.base64!, unique_file_identifier);
    }
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        chat_room_id: chatRoomIdState,
        mediaUrl: media ? mediaUrl : null,
        content: newMessage
      });

    const { error: ChatRoomError } = await supabase
      .from('chat_rooms')
      .update({
        updated_at: new Date()
      })
      .eq('chat_room_id', chatRoomIdState);

    await fetchMessages();
    if (error) console.error(error.message);
    if (ChatRoomError) console.error(ChatRoomError.message);
  };

  //This is to refresh the messages whenever the user receives a message
  const subscription = supabase
    .channel('chat_rooms')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'chat_rooms',
        filter: `chat_room_id=eq.${chatRoomIdState}`
      },
      (payload) => {
        console.log('Change detected:', payload);
        fetchMessages();  // Re-fetch unread messages count when data changes
      }
    )
    .subscribe();

  const blockAndReportUser = async () => {

    const { error } = await supabase
      .from('user_blocked_users')
      .insert({
        user_id: currentUser.id,
        blocked_user_id: user_id
      });

    if (error) { throw error.message };

    Alert.alert('You will not receive updates and messages from this user')
    navigation.navigate('chatlist');
  };

  useEffect(() => {
    fetchUserData();
    fetchChatData();
    fetchMessages(true);
    setMessagesRead(chatRoomIdState!);
  }, [chatRoomIdState]);


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
    <SafeAreaProvider className='h-screen'>
      {
        userData && (
          <>
            <ChatHeader
              name={userData.name}
              photo={userData.photo}
              user_id={userData.id}
              blockAndReportUser={blockAndReportUser}
              onlineStatus={'tbc'}
            />
          </>
        )
      }
      {
        chatRoomIdState && (
          <>
            {
              messages.length === 0 ?
                <EmptyChat
                  user_id={user_id}
                  name={userData?.name!}
                /> :
                <ChatBody
                  messages={messages}
                  fetchMessages={fetchMessages}
                />
            }
            <InputBox
              onSendMessage={sendMessage}
              setMedia={setMedia}
            />
          </>
        )
      }



    </SafeAreaProvider>
  )
}

export default ChatScreen