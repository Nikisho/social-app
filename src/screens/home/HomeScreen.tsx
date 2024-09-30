import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Feed from '../../components/Feed'
import Header from '../../components/Header'
import { supabase } from '../../../supabase'
import { useFocusEffect } from '@react-navigation/native'
interface eventListProps {
  name: string
  key: number
  description: string
  title: string
  date: Date
  photo: string
  time: Date
  id: number
}
const HomeScreen = () => {
  const [eventList, setEventList] = useState<eventListProps[]>();

  const fetchEvents = async () => {
    const { error, data } = await supabase
      .from('meetup_events')
      .select(`
        *,
        users(
          id,
          name,
          photo
        )
      `).order('created_at', { ascending: false })
    if (data) { setEventList(data); }
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
