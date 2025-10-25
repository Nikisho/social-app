import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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
import * as Linking from 'expo-linking';
import Attendees from './Attendees'
import EventInterests from './EventInterests'

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
    chat_room_id: number
    ticket_types: {
        description:string;
        is_free: boolean;
        organizer_id: number;
        sales_start: Date;
        sales_end:Date;
        name:string;
        price:string
        quantity: number;
        tickets_sold:number;
        ticket_type_id: number;
    }[]
    organizers: {
        user_id: number
        users: {
            name: string
            photo: string
            id: number;
        }
    }

}

interface Interests {
    interest_code: number;
    interest_group_code: number;
    interests: {
        description: string;
    }
}

const FeaturedEventsEventScreen = () => {
    const [eventData, setEventData] = useState<EventDataProps | null>(null);
    const route = useRoute<FeaturedEventsEventScreenRouteProps>();
    const { featured_event_id } = route.params;
    const currentUser = useSelector(selectCurrentUser);
    const isOwnEvent = currentUser.id === eventData?.organizers.user_id;
    const navigation = useNavigation<RootStackNavigationProp>();
    const [interests, setInterests] = useState<Interests[]>();

    const fetchEventData = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*, 
                organizers(
                    user_id,
                    users(*)
                ),
                ticket_types(*)
                `)
            .eq('featured_event_id', featured_event_id)
            .single()
        if (data) {
            setEventData(data)
            console.log(eventData?.ticket_types)
        }
        if (error) console.error(error.message);
    };

    const fetchEventInterests = async () => {
        const { error, data } = await supabase
            .from('featured_event_interests')
            .select(`*,
                interests(
                    interest_code,
                    description
                )
                `)
            .eq('featured_event_id', featured_event_id)

        if (data) {
            setInterests(data)
        }
        if (error) console.error(error.message);
    };

    useEffect(() => {
        fetchEventData();
        fetchEventInterests();
    }, [featured_event_id]);
    return (
        <>
            {
                eventData && (

                    <>
                        <ScrollView
                            className='p-2'
                            contentContainerStyle={{ paddingBottom: 200 }}
                        >
                            <FeaturedEventsEventHeader
                                {...eventData}
                            />
                            <FeaturedEventDetails
                                {...eventData}
                            />
                            <PromoterDetails
                                {...eventData}
                            />
                            <Attendees
                                {...eventData}
                            />
                            <EventInterests
                                interests={interests}
                            />
                        </ScrollView>

                        {
                            isOwnEvent ?
                                <View
                                    style={{
                                        backgroundColor: colours.secondaryColour,
                                    }}
                                    className={`absolute inset-x-0 h-[10%] flex justify-center flex-row items-center px-6 ${Platform.OS === 'ios'? 'bottom-20' : 'bottom-14'}`}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('editfeaturedevent', {
                                            featured_event_id: featured_event_id
                                        })}
                                        className='bg-white p-2 px-4 rounded-full  '>
                                        <Text className='text-lg font-semibold text-center'>
                                            Manage event
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
        </>
    )
}

export default FeaturedEventsEventScreen