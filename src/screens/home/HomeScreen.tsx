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
};

interface HubProps {
  hub_name: string;
  hub_code: number;
}

const HomeScreen = () => {
  const [eventList, setEventList] = useState<eventListProps[]>();
  const currentUser = useSelector(selectCurrentUser);
  const [filterEventsModalVisible, setFilterEventsModalVisible] = useState<boolean>(false);
  const [chooseEventLocationModalVisible, setChooseEventLocationModalVisible] = useState<boolean>(false);
  const [sortingOption, setSortingOption] = useState<string>('event_date');
  const [selectedHub, setSelectedHub] = useState<HubProps | null>(null);

  const fetchEvents: (hub_code:number | null, sorting_option: string| null) => void = async (
    hub_code: number | null, 
    sorting_option: string | null
  ) => {
    const { error, data } = await supabase
      .rpc('get_events_excluding_blocked_users',
        { 
          current_user_id: currentUser.id, 
          sorting_option: sorting_option,
          hub_code:hub_code
        });

    if (data) { setEventList(data); }
    if (error) console.error(error.message)
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents(selectedHub?.hub_code!, sortingOption);
    }, [sortingOption, selectedHub])
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
          <Text>{selectedHub ? selectedHub.hub_name : 'All'}</Text>
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
        fetchEvents={() => fetchEvents(selectedHub?.hub_code!, sortingOption)}
        sorting_option={sortingOption}
        hub_code={selectedHub?.hub_code!}
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
        setSelectedHub={setSelectedHub}
        />
    </View>
  )
}

export default HomeScreen
