import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import FeedCard from '../../components/FeedCard';

interface eventListProps {
    name: string
    key: number
    description: string
    title: string
    date: Date
    photo: string
    time: Date
    event_id: number
}

const UserEvents = ({ user_id }: { user_id: number }) => {
    const [eventList, setEventList] = useState<Array<eventListProps>>();
    const fetchEvents = async () => {
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
            .eq('user_id', user_id)
        if (data) {
            setEventList(data)
        }
        if (error) console.error(error.message)
    }

    useEffect(() => {
        fetchEvents();
    }, [user_id]);

    return (
        <View className='h-2/3 flex space-y-2'>

            <View className=' '>
                <Text className='text-lg font-semibold'>Events</Text>
            </View>
            <View className=''>
                {eventList?.map((event: any) => (
                    <FeedCard
                        key={event.event_id}
                        event_id={event.event_id}
                        name={event.users.name}
                        description={event.event_description}
                        title={event.event_title}
                        date={event.event_date}
                        photo={event.users.photo}
                        time={event.event_time}
                        user_id={event.users.id}
                    />
                ))}
            </View>
        </View>
    )
}

export default UserEvents