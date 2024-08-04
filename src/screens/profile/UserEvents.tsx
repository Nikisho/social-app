import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import FeedCard from '../../components/FeedCard';

interface eventListProps{
    name: string
    key: number
    description: string
    title:string
    date: Date
    photo: string
    time: Date
    id: number
} 

const UserEvents = () => {
    const [eventList, setEventList] = useState<Array<eventListProps>>();
    const currentUser = useSelector(selectCurrentUser);

    const fetchEvents = async () => {
        const { error, data } = await supabase
            .from('meetup_events')
            .select()
            .eq('user_id', currentUser.id)

        if (data) {
            setEventList(data)
            console.log(data)
        }

        if (error) console.error(error.message)
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <View className='h-2/3 p-2 flex space-y-2'>

            <View className=' '>
                <Text className='text-lg font-semibold'> Your events</Text>
            </View>
            <View className=''>
                {eventList?.map((event: any) => (
                    <FeedCard
                        key={event.event_id}
                        id={event.event_id}
                        name={currentUser.name}
                        description={event.event_description}
                        title={event.event_title}
                        date={event.event_date}
                        photo={currentUser.photo}
                        time={event.event_time}
                    />
                ))}
            </View>
        </View>
    )
}

export default UserEvents