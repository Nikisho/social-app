import { View} from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header'
import SearchComponent from './SearchComponent'
import { supabase } from '../../../supabase'
import Feed from '../../components/Feed'
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

  const [eventList, setEventList] = useState<eventListProps[]>();
  const fetchEvents = async () => {
    if (query === '' || query === null) {
      return;
    }
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
      .or(`event_title.ilike.%${query}%, event_description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
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
          eventList && (
            <Feed
              eventList={eventList}
            />
          )
        }
      </View>
    </View>
  )
}

export default SearchScreen