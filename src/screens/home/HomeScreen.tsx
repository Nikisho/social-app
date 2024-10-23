import { Text, TouchableOpacity, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react'
import Feed from '../../components/Feed'
import Header from '../../components/Header'
import { supabase } from '../../../supabase'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../context/navSlice'
import styles from '../../utils/styles/shadow'
import FilterEventsModal from '../../components/FilterEventsModal';
import Entypo from '@expo/vector-icons/Entypo';
import ChooseEventLocationModal from '../../components/ChooseEventLocationModal';

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
const HomeScreen = () => {
  const [eventList, setEventList] = useState<eventListProps[]>();
  const currentUser = useSelector(selectCurrentUser);
  const [filterEventsModalVisible, setFilterEventsModalVisible] = useState<boolean>(false);
  const [chooseEventLocationModalVisible, setChooseEventLocationModalVisible] = useState<boolean>(false);
  const [sortingOption, setSortingOption] = useState<string>('event_date');

  const fetchEvents = async () => {
    const { error, data } = await supabase
      .rpc('get_events_excluding_blocked_users', { current_user_id: currentUser.id, sorting_option: sortingOption });

    if (data) { setEventList(data); }
    if (error) console.error(error.message)
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [sortingOption])
  );
  return (
    <View className='mx-2'>
      <Header />
      <View className='flex flex-row space-x-2'>
        <TouchableOpacity
          onPress={() => setChooseEventLocationModalVisible(!chooseEventLocationModalVisible)}
          className='p-2 mb-3  px-3 bg-white rounded-full flex flex-row items-center space-x-1 '
          style={styles.translucidViewStyle}
        >
          <Entypo name="location-pin" size={24} color="black" />
          <Text>London</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterEventsModalVisible(!filterEventsModalVisible)}
          className='p-2 mb-3 px-3 bg-white rounded-full flex flex-row items-center space-x-1'
          style={styles.translucidViewStyle}
        >
          <Ionicons name="filter" size={22} color="black" />
          <Text> {sortingOption === 'created_at' ? 'New' : 'Event date'}</Text>
        </TouchableOpacity>
      </View>

      <Feed
        eventList={eventList!}
        fetchEvents={fetchEvents}
      />
      <FilterEventsModal
        modalVisible={filterEventsModalVisible}
        setModalVisible={setFilterEventsModalVisible}
        setSortingOption={setSortingOption}
        sortingOption={sortingOption}
      />
      <ChooseEventLocationModal
        modalVisible={chooseEventLocationModalVisible}
        setModalVisible={setChooseEventLocationModalVisible}
        />
    </View>
  )
}

export default HomeScreen
