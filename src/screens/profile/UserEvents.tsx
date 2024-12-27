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
    user_id: number
}

const UserEvents = ({ user_id }: { user_id: number }) => {
    const [eventList, setEventList] = useState<Array<eventListProps>>();
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>();
    const fetchEvents = async () => {
        const { error, data } = await supabase
            .rpc('get_events_excluding_blocked_users',
                {
                    current_user_id: user_id,
                    filter_user_id: user_id
                });

        if (data) {
            setEventList(data);

        }
        if (error) console.error(error.message)
    }

    useEffect(() => {
        fetchEvents();
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
                        fetchEvents={fetchEvents}
                        sorting_option={null}
                        hub_code={null}
                    />
            }

        </View>
    )
}

export default UserEvents