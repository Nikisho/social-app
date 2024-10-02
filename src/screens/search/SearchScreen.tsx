import { Text, View} from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import SearchComponent from './SearchComponent'
import { supabase } from '../../../supabase'
import Feed from '../../components/Feed'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
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
const SearchScreen = () => {
  const [query, setQuery] = useState<string>('');
  const currentUser = useSelector(selectCurrentUser);
  const [eventList, setEventList] = useState<eventListProps[]>();
  const fetchEvents = async () => {
    if (query === '' || query === null) {
      return;
    }
    const { error, data } = await supabase
      .rpc('get_events_excluding_blocked_users', { current_user_id: currentUser.id, query: query });

    if (data) { setEventList(data);}
    if (error) console.error(error.message)
  }

  return (
    <View className='mx-2'>
      <Header />
      <SearchComponent
        query={query}
        setQuery={setQuery}
        fetchEvents={fetchEvents}
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
              eventList={eventList!}
              fetchEvents={fetchEvents}
            />
          )  
        }
      </View>
    </View>
  )
}

export default SearchScreen