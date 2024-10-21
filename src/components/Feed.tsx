import { ScrollView, Platform, RefreshControl, View } from 'react-native'
import React, { useState } from 'react'
import FeedCard from './FeedCard';
import GoogleAds from './GoogleAds';


interface FeedProps {
  eventList: {
    user_name: string
    key: number
    event_description: string
    event_title: string
    event_date: string
    user_photo: string
    event_time: string
    event_id: number
    user_id: number;
  }[];
  fetchEvents: () => void
}

const Feed: React.FC<FeedProps> = ({
  eventList,
  fetchEvents
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchEvents()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  return (
    <ScrollView className={Platform.OS === 'ios' ? 'h-[89%] z-0' : 'h-5/6'}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {eventList?.map((event, index) => (
        <View key={event.event_id}>
          {/* Render the feed card */}
          <FeedCard
            name={event.user_name}
            description={event.event_description}
            title={event.event_title}
            date={event.event_date}
            photo={event.user_photo}
            time={event.event_time}
            event_id={event.event_id}
            user_id={event.user_id}
            refreshOnBlock={onRefresh}
          />
          
          {/* Display ad after every 3rd card */}
          {(index + 1) % 3 === 0 && (
            <GoogleAds />
          )}
        </View>
      ))}
    </ScrollView>
  )
}


export default Feed