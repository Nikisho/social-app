import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FeaturedEventsEventScreenRouteProps, RootStackNavigationProp } from '../../../utils/types/types'
import { supabase } from '../../../../supabase'
import BookEvent from './BookEvent'
import FeaturedEventDetails from './FeaturedEventDetails'
import PromoterDetails from './PromoterDetails'
import FeaturedEventsEventHeader from './FeaturedEventsEventHeader'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../context/navSlice'
import colours from '../../../utils/styles/colours'

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
        user_id: number
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
    const currentUser = useSelector(selectCurrentUser);
    const isOwnEvent = currentUser.id === eventData?.organizers.user_id;
    const navigation = useNavigation<RootStackNavigationProp>();
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
                    {
                        eventData && (
                            <>
                                <FeaturedEventsEventHeader
                                    {...eventData!}
                                />
                                <FeaturedEventDetails
                                    {...eventData!}
                                />
                                <PromoterDetails
                                    {...eventData!}
                                />
                            </>
                        )
                    }
                </ScrollView>
            </View>

            {
                isOwnEvent ?
                    <View
                        style={{
                            backgroundColor: colours.secondaryColour,
                        }}
                        className='absolute inset-x-0 bottom-0 h-[10%] flex justify-center flex-row items-center px-6'>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('editfeaturedevent', {
                                    featured_event_id: featured_event_id
                                })}
                                className='bg-white p-3 px-4 rounded-full  '>
                                <Text className='text- font-semibold'>
                                    MANAGE
                                </Text>
                            </TouchableOpacity>
                    </View>
                    :

                    <BookEvent
                        {...eventData!}
                    />
            }
        </>
    )
}

export default FeaturedEventsEventScreen