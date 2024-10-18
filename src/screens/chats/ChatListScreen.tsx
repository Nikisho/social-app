import { View, ListRenderItem, FlatList } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import ChatCard from './ChatCard';
import { useFocusEffect } from '@react-navigation/native';
import ChatListScreenHeader from './ChatListScreenHeader';

interface ChatDataProps {
  receiver_id: number
  receiver_photo: string
  receiver_name: string
  content: string;
  last_message_time: string;
  room_id: number
};

const ChatListScreen = () => {
  const [receivers, setReceivers] = useState();
  const currentUser = useSelector(selectCurrentUser);

  const fetchReceivers = async () => {
    const { error, data } = await supabase
      .rpc('fetch_receivers', { current_user_id: currentUser.id });
    if (data) { setReceivers(data); }
    if (error) { console.error(error.message); }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchReceivers();
    }, [])
  );
  const renderItem: ListRenderItem<ChatDataProps> = ({ item }) => (
    <ChatCard item={item}
      currentUser={currentUser}

    />
  );
  return (
    <View className='mx-2'>
      <ChatListScreenHeader/>
      <FlatList
        className={`-mx-2 ${'h-[85%]'}`}
        data={receivers}
        renderItem={renderItem}
        keyExtractor={(item: ChatDataProps) => item.receiver_id.toString()}
      />
    </View>
  )

}
export default ChatListScreen