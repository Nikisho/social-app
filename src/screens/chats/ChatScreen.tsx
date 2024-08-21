import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { ChatScreenRouteProp, RootStackNavigationProp, RootStackParamList } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import ChatHeader from './ChatHeader';
import InputBox from './InputBox';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatBody from './ChatBody';

interface UserDataProps {
  name: string;
  photo: string;
  id: number;
}


const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { user_id } = route.params
  const currentUser = useSelector(selectCurrentUser);
  const [chatRoomIdState, setChatRoomIdState] = useState<number>();
  const [userData, setUserData] = useState<UserDataProps>();
  const [messages, setMessages] = useState<string[]>([])

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
    } else {
      //No data returned so the room does not exist. We can make one 
      const { data: newChatRoom, error } = await supabase
        .from('chat_rooms')
        .insert({})
        .select();

      const chatRoomId = newChatRoom![0].chat_room_id
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
      setMessages(data)
    }
    if (error) console.error(error.message);
  };

  const sendMessage = async (newMessage: string) => {
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        chat_room_id: chatRoomIdState,
        content: newMessage
      });
    fetchMessages();
    if (error) console.error(error.message);
  };

  useEffect(() => {
    fetchUserData();
    fetchChatData();
    fetchMessages();
  }, [chatRoomIdState]);

  return (
    <SafeAreaProvider className='h-screen'>
      {
        userData && (
          <>
            <ChatHeader
              name={userData.name}
              photo={userData.photo}
              user_id={userData.id}
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
            />
          </>
        )
      }



    </SafeAreaProvider>
  )
}

export default ChatScreen