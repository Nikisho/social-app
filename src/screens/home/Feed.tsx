import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import FeedCard from '../../components/FeedCard';
interface eventListProps{
  name: string
  key: number
  description: string
  title:string
  date: Date
  photo: string
  time: Date
  id: number
} 

const Feed = () => {

  const [ eventList, setEventList ] = useState<eventListProps[]>();

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
      `)
    if (data) {setEventList(data)}
    if (error) console.error(error.message)
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View >
      {eventList?.map((event: any) => (
        <FeedCard 
          name={event.users.name}
          key={event.event_id}
          description={event.event_description}
          title={event.event_title}
          date={ event.event_date}
          photo={event.users.photo}
          time={event.event_time}
          id = {event.event_id}
        />
      ))}
    </View>
  )
}


export default Feed