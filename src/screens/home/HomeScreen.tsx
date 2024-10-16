import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Feed from '../../components/Feed'
import Header from '../../components/Header'
import { supabase } from '../../../supabase'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
interface eventListProps {
  user_name: string
  key: number
  event_description: string
  event_title: string
  event_date: string
  user_photo: string
  event_time: string
  event_id: number
  user_id: number;

}
const HomeScreen = () => {
  const [eventList, setEventList] = useState<eventListProps[]>();
  const currentUser = useSelector(selectCurrentUser);

  const fetchEvents = async () => {
    const { error, data } = await supabase
      .rpc('get_events_excluding_blocked_users', { current_user_id: currentUser.id });
      
    if (data) { setEventList(data);}
    if (error) console.error(error.message)
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();

    }, [])
  );
  return (
    <View className='mx-2'>
      <Header />
      <Feed
        eventList={eventList!}
        fetchEvents={fetchEvents}
      />
    </View>
  )
}

export default HomeScreen
