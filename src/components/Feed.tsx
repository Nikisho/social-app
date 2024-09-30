import { View, Text, ScrollView, Platform, RefreshControl } from 'react-native'
import React from 'react'
import { supabase } from '../../supabase';
import FeedCard from './FeedCard';
interface FeedProps {
  eventList: {
    name: string
    key: number
    description: string
    title: string
    date: Date
    photo: string
    time: Date
    id: number
  }[]
  fetchEvents: () => void
}

const Feed: React.FC<FeedProps> = ({
  eventList,
  fetchEvents
}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  // const [eventList, setEventList] = useState<eventListProps[]>();

  // const fetchEvents = async () => {
  //   const { error, data } = await supabase
  //     .from('meetup_events')
  //     .select(`
  //       *,
  //       users(
  //         id,
  //         name,
  //         photo
  //       )
  //     `).order('created_at', { ascending: false })
  //   if (data) { setEventList(data); }
  //   if (error) console.error(error.message)
  // }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchEvents();

  //   }, [])
  // );
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchEvents()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <ScrollView className={Platform.OS === 'ios'? 'h-[89%] z-0' : 'h-5/6'}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
      {eventList?.map((event: any) => (
        <FeedCard
          name={event.users.name}
          key={event.event_id}
          description={event.event_description}
          title={event.event_title}
          date={event.event_date}
          photo={event.users.photo}
          time={event.event_time}
          event_id={event.event_id}
          user_id={event.users.id}
        />
      ))}
    </ScrollView>
  )
}


export default Feed