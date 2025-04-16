import { Text, View } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../../../supabase';
import Header from '../../components/Header';
import EventDetails from './EventDetails';
import EngagementBar from './EngagementBar';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import CommentFeed from './CommentFeed';
import { EventScreenRouteProp } from '../../utils/types/types';
import BoostEvent from './BoostEvent';
import styles from '../../utils/styles/shadow';

interface EventDataProps {
    name: string
    key: number
    event_id: number
    event_description: string
    event_title: string
    event_date: string
    event_time: string
    event_type: string
    photo: string
    user_id: string;
    users: {
        name: string
        id: number
        photo: string
    }
    hubs: {
        hub_name: string;
        hub_code: number;
    }
    boost_expires_at: Date

};

const EventScreen = () => {
    const route = useRoute<EventScreenRouteProp>()
    const { event_id } = route.params;
    const [eventData, setEventData] = useState<EventDataProps>();
    const currentUser = useSelector(selectCurrentUser);
    const fetchData = async () => {
        const { error, data } = await supabase
            .from('meetup_events')
            .select(`
            *,
            users(
              id,
              name,
              photo
            ), hubs (
                hub_code,
                hub_name
            )
          `)
            .eq('event_id', event_id)
        if (data) { setEventData(data[0]) }
        if (error) console.error(error.message)
    }
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [event_id])
    );
    return (
        <View className='mx-2 h-[90%]'>
            <Header />
            {
                eventData && (
                    <EventDetails
                        user_photo={eventData.users.photo}
                        user_name={eventData.users.name}
                        event_date={eventData.event_date}
                        event_title={eventData.event_title}
                        event_time={eventData.event_time}
                        event_description={eventData.event_description}
                        isUsersOwnPost={eventData.user_id === currentUser.id}
                        user_id={eventData.users.id}
                        event_location={eventData.hubs.hub_name}
                        event_id={event_id}
                        event_type={eventData.event_type}
                    />
                )
            }
            {
                currentUser.id === eventData?.users?.id && ( 
                    (!eventData?.boost_expires_at || new Date(eventData.boost_expires_at) < new Date()) ? ( 
                        <BoostEvent 
                            event_id={event_id}
                            eventData={eventData!}
                            setEventData={setEventData}
                        /> 
                    ) : (
                        <View className='flex my-5 flex-row justify-center'>
                            <View
                                style={styles.shadow}
                                className='p-2 rounded-full bg-yellow-200 w-1/3 pl-5'>
                                <Text className='text-center text-lg'>
                                    Boosted 💥
                                </Text>
                            </View>
                        </View>
                    )
                )
            }

            {/* Reaction bar */}
            <EngagementBar
                user_id={currentUser.id}
                event_id={event_id}
            />

            <CommentFeed
                event_id={event_id}
            />
        </View>
    )
}

export default EventScreen