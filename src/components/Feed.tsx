import { Platform, RefreshControl, View, FlatList, ActivityIndicator, Text } from 'react-native'
import React from 'react'
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
    event_type: string;
  }[];
  loading: boolean;
  refreshing:boolean,
  onRefresh:() => Promise<void>,
  onEndReached:() => Promise<void>,
}

const Feed:React.FC<FeedProps> = ({
  eventList,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
}) => {
  return (
    <FlatList
      className={`mx-[-8] ${Platform.OS === 'ios' ? 'h-[80%] z-0' : 'h-[76%]'}`}
      data={eventList}
      keyExtractor={(item) => item.event_id.toString()}
      renderItem={({ item, index }) => (
        <View key={item.event_id} className="flex items-center w-full ">
          <FeedCard
            name={item.user_name}
            description={item.event_description}
            title={item.event_title}
            date={item.event_date}
            photo={item.user_photo}
            time={item.event_time}
            event_id={item.event_id}
            user_id={item.user_id}
            refreshOnBlock={onRefresh}
            event_type={item.event_type}
          />
          {(index + 1) % 3 === 0 && <GoogleAds />}
        </View>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="small" color="#808080" /> : null}      
      ListEmptyComponent={
        !loading && !refreshing ? (
          <View className="flex items-center justify-center p-4">
            <Text className="text-gray-500">No events found.</Text>
          </View>
        ) : null
      }
    />
  );
};


export default Feed