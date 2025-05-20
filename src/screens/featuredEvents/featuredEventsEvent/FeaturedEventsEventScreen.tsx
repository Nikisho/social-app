import { Image, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { FeaturedEventsEventScreenRouteProps } from '../../../utils/types/types'
import { supabase } from '../../../../supabase'
import BookEvent from './BookEvent'
import FeaturedEventDetails from './FeaturedEventDetails'

interface EventDataProps {
    title: string;
    description: string;
    organizer_id: number;
    price: string;
    time: string;
    location: string;
    image_url: string;
    is_free: boolean;
    featured_event_id: number;
    tickets_sold: number;
    date: Date;
    max_tickets: number;
    organizers: {
        users: {
            name: string
            photo: string
        }
    }

}
const FeaturedEventsEventScreen = () => {
    const [eventData, setEventData] = useState<EventDataProps | null>(null);
    const route = useRoute<FeaturedEventsEventScreenRouteProps>();
    const { featured_event_id } = route.params;

    const fetchEventData = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*, 
                organizers(
                    user_id,
                    users(*)
                )
                `)
            .eq('featured_event_id', featured_event_id)
            .single()
        if (data) {
            console.log(data.organizers.users)
            setEventData(data)
        }

        if (error) console.error(error.message);
    }

    useEffect(() => {
        fetchEventData();
    }, []);

    return (
        <>
            <View>

                <ScrollView className='h-[89%] p-2'>
                    <FeaturedEventDetails
                        {...eventData!}
                    />
                    <View className='p-2'>
                        <Text className='text-xl font-bold'>
                            Promoter
                        </Text>

                        <View className='flex flex-row border items-center  space-x-5 rounded-xl p-2 my-3'>
                            <Image
                                className='w-10 h-10 rounded-full'
                                source={{
                                    uri: eventData?.organizers.users.photo
                                }}
                            />

                            <Text className='text-xl'>
                                {eventData?.organizers.users.name}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

            <BookEvent
                {...eventData!}
            />
        </>
    )
}

export default FeaturedEventsEventScreen