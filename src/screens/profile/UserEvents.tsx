import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import Feed from '../../components/Feed';
import { AntDesign } from '@expo/vector-icons';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';

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
}

const UserEvents = ({ user_id }: { user_id: number }) => {
    const [eventList, setEventList] = useState<Array<eventListProps>>();
    const [hasMore, setHasMore] = useState(true); // Tracks if more events can be fetched
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [pageNumber, setPageNumber] = useState(1);
    
    const fetchEvents = async (
        hub_code: number | null,
        sorting_option: string | null,
        page: number = 1
    ) => {
        const limit = 5 
        const offset = (page - 1) * limit;
        const { error, data } = await supabase
            .rpc('get_events_excluding_blocked_users_v2',
                {
                    current_user_id: user_id,
                    filter_user_id: user_id,
                    sorting_option,
                    hub_code,
                    lmt: limit,
                    ofst: offset,
                });

        if (data) {
        // Append or replace the event list based on the page number
        setEventList((prevEvents: any) => (page === 1 ? data : [...prevEvents, ...data]));
        setHasMore(data.length === limit); // If fewer results than the limit, no more data

        }
        if (error) console.error(error.message)
    }

    useEffect(() => {
        fetchEvents(null,'event_date',pageNumber);
    }, [user_id]);

    return (
        <View className='h-[51%] mt-5 flex space-y-2'>
            <View className=''>
                <Text className='text-lg font-semibold'>Events</Text>
            </View>
            {
                eventList?.length === 0 ?
                    (
                        currentUser.id === user_id ?
                            <View className='w-full h-1/2 justify-center flex items-center space-y-5'>
                                <Text className=''>
                                    Create your first event now!
                                </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('submit')}
                                    className='p-4 bg-white rounded-full'
                                    style={styles.shadow}
                                >
                                    <AntDesign name="plus" size={30} color="black" />
                                </TouchableOpacity>
                            </View> :
                            <View className='w-full h-1/2 justify-center flex items-center space-y-5'>
                                <Text className='italic'>This user has not posted yet</Text>
                            </View>
                    )
                    :
                    <Feed
                        eventList={eventList!}
                        fetchEvents={(hub_code, sorting_option, page) =>
                            fetchEvents(hub_code, sorting_option, page)
                        }
                        page={pageNumber}
                        setPage={setPageNumber}
                        hasMore={hasMore}
                        sorting_option={'event_date'}
                        hub_code={null}
                        setHasMore={setHasMore}
                    />
            }

        </View>
    )
}

export default UserEvents