import { Text, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import SearchComponent from './SearchComponent'
import { supabase } from '../../../supabase'
import Feed from '../../components/Feed'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
import { usePagination } from '../../hooks/usePagination'

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
const SearchScreen = () => {
  const [query, setQuery] = useState<string>('');
  const currentUser = useSelector(selectCurrentUser);

  const fetchEvents = async (page: number) => {
    const limit = 3;
    const offset = (page - 1) * limit;
    const { data, error } = await supabase.rpc('get_events_excluding_blocked_users_v2', {
      current_user_id: currentUser.id,
      query: query, // Use the query state
      lmt: limit,
      ofst: offset,
    });
  
    if (error) throw error;
    return data || [];
  };

  const {
    data: eventList,
    loading,
    refreshing,
    onRefresh,
    onEndReached,
  } = usePagination(fetchEvents, 1,3, true);

  return (
    <View className='mx-2'>
      <Header />
      <SearchComponent
        query={query}
        setQuery={setQuery}
        onRefresh={onRefresh}
      />
      <View className='h-[68%]'>

        {
          eventList && eventList.length === 0 ?
            (
              <View className='flex flex-row justify-center items-center h-1/2'>
                <Text className='font-semibold text-lg text-gray-800'>
                  No results, try a different key word.
                </Text>
              </View>
            ) : (
              <Feed
                eventList={eventList}
                loading={loading}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={onEndReached}
              />
            )
        }
      </View>
    </View>
  )
}

export default SearchScreen