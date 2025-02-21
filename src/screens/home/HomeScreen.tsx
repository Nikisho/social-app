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
import UpdateAppModal from '../../components/UpdateAppModal';

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
  event_type: string;
};

interface HubProps {
  hub_name: string;
  hub_code: number;
}

const HomeScreen = () => {
  const [eventList, setEventList] = useState<eventListProps[]>([]);
  const [hasMore, setHasMore] = useState(true); // Tracks if more events can be fetched
  const [filterEventsModalVisible, setFilterEventsModalVisible] = useState<boolean>(false);
  const [chooseEventLocationModalVisible, setChooseEventLocationModalVisible] = useState<boolean>(false);
  const [sortingOption, setSortingOption] = useState<string>('event_date');
  const [selectedHub, setSelectedHub] = useState<HubProps | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const currentUser = useSelector(selectCurrentUser);

  console.log(pageNumber);

  const fetchEvents = async (
    hub_code: number | null,
    sorting_option: string | null,
    page: number = 1
  ) => {
    const limit = 3
    const offset = (page - 1) * limit;
    try {
      const { data, error } = await supabase.rpc('get_events_excluding_blocked_users_v2', {
        current_user_id: currentUser.id,
        sorting_option,
        hub_code,
        lmt: limit,
        ofst: offset,
      });

      if (error) throw error;

      if (data) {
        // Append or replace the event list based on the page number
        setEventList((prevEvents) => (page === 1 ? data : [...prevEvents, ...data]));
        setHasMore(data.length === limit); // If fewer results than the limit, no more data
      }
    } catch (error:any) {
      console.error('Error fetching events:', error.message);
    }
  };

  // console.log(eventList)
  // Refetch events when the hub, sorting option, or page number changes
  useFocusEffect(
    React.useCallback(() => {
      // setPageNumber(1)
      fetchEvents(selectedHub?.hub_code || null, sortingOption,pageNumber);
    }, [sortingOption, selectedHub])
  );

  return (
    <View className="px-2">
      {/* Header */}
      <Header />
      <UpdateAppModal />

      {/* Filter and Location Modals */}
      <View className="flex flex-row space-x-2">
        <TouchableOpacity
          onPress={() => setChooseEventLocationModalVisible(!chooseEventLocationModalVisible)}
          className="p-2 mb-3 px-3 bg-white rounded-full flex flex-row items-center space-x-1"
          style={styles.translucidViewStyle}
        >
          <Entypo name="location-pin" size={24} color="black" />
          <Text>{selectedHub ? selectedHub.hub_name : 'All'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterEventsModalVisible(!filterEventsModalVisible)}
          className="p-2 mb-3 px-3 bg-white rounded-full flex flex-row items-center space-x-1"
          style={styles.translucidViewStyle}
        >
          <Ionicons name="filter" size={22} color="black" />
          <Text>{sortingOption === 'created_at' ? 'New' : 'Event date'}</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      <Feed
        eventList={eventList}
        fetchEvents={(hub_code, sorting_option, page) =>
          fetchEvents(hub_code, sorting_option, page)
        }
        sorting_option={sortingOption}
        page={pageNumber}
        setPage={setPageNumber}
        hub_code={selectedHub?.hub_code || null}
        hasMore={hasMore}
        setHasMore={setHasMore}
      />

      {/* Modals */}
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
  );
};

export default HomeScreen;
