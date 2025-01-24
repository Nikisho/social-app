import { ScrollView, Platform, RefreshControl, View, FlatList, ActivityIndicator } from 'react-native'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  fetchEvents: (hob_code: number | null, sorting_option: string | null, pageNumber?: number) => Promise<void>
  hub_code: number | null;
  sorting_option: string | null
  page: number
  setPage: Dispatch<SetStateAction<number>>
  hasMore: boolean;
  setHasMore: Dispatch<SetStateAction<boolean>>
}

const Feed: React.FC<FeedProps> = ({
  eventList,
  fetchEvents,
  hub_code,
  sorting_option,
  setPage,
  page,
  hasMore,
  setHasMore
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState<any>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1); // Reset to page 1
    try {
      await fetchEvents(hub_code, sorting_option, 1);
    } finally {
      setRefreshing(false);
    }
  };

  const onEndReached = (() => {
    let loading = false;
    return async () => {
      setLoadingMore(true);
      if (hasMore && !loading) {
        loading = true;
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchEvents(hub_code, sorting_option, nextPage);
        loading = false;
      }
      setLoadingMore(false);
    };
  })();


  return (
    <FlatList
      className={`mx-[-8] ${Platform.OS === 'ios' ? 'h-[80%] z-0' : 'h-[76%]'}`}
      data={eventList}
      keyExtractor={(item) => item.event_id.toString()}
      renderItem={({ item, index }) => (
        <View key={item.event_id} className="flex items-center w-full bg-white">
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
      ListFooterComponent={loadingMore && <ActivityIndicator size="small" color="#808080" />}
    />
  );
};


export default Feed