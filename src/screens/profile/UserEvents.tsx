import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import FeedCard from '../../components/FeedCard';
import Feed from '../../components/Feed';

interface eventListProps {
    name: string
    key: number
    description: string
    title: string
    date: Date
    photo: string
    time: Date
    event_id: number
    id: number
}

const UserEvents = ({ user_id }: { user_id: number }) => {
    const [eventList, setEventList] = useState<Array<eventListProps>>();
    const fetchEvents = async () => {
        const { error, data } = await supabase
        .rpc('get_events_excluding_blocked_users', 
            { current_user_id:user_id, 
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
        <View className='h-[50%] flex space-y-2'>

            <View className=''>
                <Text className='text-lg font-semibold'>Events</Text>
            </View>
            <Feed 
                eventList={eventList!}
                fetchEvents={fetchEvents}
            />
        </View>
    )
}

export default UserEvents