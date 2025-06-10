import { View, Text, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { ChatScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import ChatHeader from './ChatHeader';
import InputBox from './InputBox';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatBody from './ChatBody';
import SendMedia from './SendMedia';
import { decode } from 'base64-arraybuffer';
import { uuidv4 } from '../../utils/functions/uuidv4';
import { ImagePickerAsset } from 'expo-image-picker';

interface UserDataProps {
  name: string;
  photo: string;
  id: number;
}

interface Message {
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
  const [media, setMedia] = useState<ImagePickerAsset| null>(null);
  const navigation = useNavigation<RootStackNavigationProp>();

  const fetchUserData = async () => {
    const { error, data } = await supabase
      .from('users')
      .select()
      .eq('id', user_id)
    if (data) setUserData(data[0]);
    if (error) console.error(error.message);
  };
  
  const fetchChatData = async () => {
    //check if chat room exists
    const { data, error } = await supabase
      .rpc('fetch_chat_room', { user_id_1: user_id, user_id_2: currentUser.id });
    if (data) {
      setChatRoomIdState(data)
      setMessagesRead(data)
    } else {
      //No data returned so the room does not exist. We can make one 
      const { data: newChatRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          type: 'private'
        })
        .select();

      const chatRoomId = newChatRoom![0].chat_room_id
      setMessagesRead(chatRoomId)

      setChatRoomIdState(newChatRoom![0].chat_room_id);
      //Now that we have inserted a row in the chat_rooms table, we can add two rows corresponding 
      //To the participants with the chat_room_id
      const { error: participantError } = await supabase.from('participants').insert([
        { chat_room_id: chatRoomId, user_id: user_id },
        { chat_room_id: chatRoomId, user_id: currentUser.id },
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
    const { error } = await supabase
      .from('messages')
      .update({ read_by_recipient: true })
      .eq('chat_room_id', chatRoomID)
      .neq('sender_id', currentUser.id)
      .eq('read_by_recipient', false);
    if (error) { console.error(error.message) }
  }
  const fetchMessages = async () => {
    //The room ID constant does not update right away, 
    // on the first render it has value undefined
    // so we return here, then once it updates the second render
    // fetches the messages
    if (!chatRoomIdState) return;
    const { error, data } = await supabase
      .from('messages')
      .select()
      .eq('chat_room_id', chatRoomIdState)
      .order('created_at', { ascending: false })

    if (data) {
      setMessages(data);
      setMessagesRead(chatRoomIdState)
    }
    if (error) console.error(error.message);
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
        mediaUrl: media? mediaUrl : null,
        content: newMessage
      });
      await fetchMessages();
    if (error) console.error(error.message);
  };

  //This is to refresh the messages whenever the user receives a message
  const subscription = supabase
  .channel('messages')
  .on('postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `sender_id=eq.${user_id}`
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

    if (error) {throw error.message};

    Alert.alert('You will not receive updates and messages from this user')
    navigation.navigate('chatlist');
  };

  useEffect(() => {
    fetchUserData();
    fetchChatData();
    fetchMessages();
  }, [chatRoomIdState]);


  if (media) {
    return <SendMedia 
              media={media} 
              setMedia={setMedia}
              onSendMessage={sendMessage}
            />
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
            />
          </>
        )
      }
      {
        chatRoomIdState && (
          <>
            <ChatBody
              messages={messages}
              currentUser={currentUser}
            />
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