import { View, Text, ListRenderItem } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { FlatList } from 'react-native-gesture-handler';
import ChatCard from './ChatCard';
import { useFocusEffect } from '@react-navigation/native';

interface ChatDataProps {
  receiver_id: number
  receiver_photo: string
  receiver_name: string
  content: string;
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
      <Header />
      <FlatList
        className='-mx-2'
        data={receivers}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.receiver_id.toString()}
      />
    </View>
  )

}
export default ChatListScreen