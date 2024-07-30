import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import FeedCard from './FeedCard';
import { supabase } from '../../../supabase';
interface eventListProps{

}

const Feed = () => {

  const [ eventList, setEventList ] = useState<any>();

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
        />
      ))}
    </View>
  )
}


export default Feed