import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../../context/navSlice'
import SecondaryHeader from '../../../components/SecondaryHeader'
import { supabase } from '../../../../supabase'
import { FlatList } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../../utils/types/types'
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday'
import styles from '../../../utils/styles/shadow'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'


interface TicketsProps {
    ticket_id: number;
    featured_event: {
        title: string;
        featured_event_id: string;
        description: string;
        date: string;
        time: string;
        image_url: string;
    }
};

const TicketFeedScreen = () => {
    const currentUser = useSelector(selectCurrentUser);
    const [tickets, setTickets] = useState<TicketsProps[] | null>(null);
    const navigation = useNavigation<RootStackNavigationProp>();
    const { t } = useTranslation();
    const fetchTickets = async () => {
        const { error, data } = await supabase
            .from('tickets')
            .select(`*,
                featured_events(
                    title,
                    description,
                    date,
                    image_url,
                    time
                )
                `)
            .eq('user_id', currentUser.id)
            .order('featured_events(date)', {
                ascending: false
            })

        if (error) { console.error(error.message) }
        if (data) {
            setTickets(data);
        }
    }

    const isTicketExpired = (eventDate: Date | string): boolean => {
        if (__DEV__) return false;
        // Convert input to Date object (works with both strings and Date objects)
        const event = new Date(eventDate);
        const now = new Date();
        const endOfEventDay = new Date(event);
        endOfEventDay.setHours(23, 59, 59, 999);

        return now > endOfEventDay;
    };
    useEffect(() => {
        fetchTickets()
    }, []);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                className={`my-2
                        rounded-xl  m-2 p-2
                        flex flex-row justify-between
                        bg-white
                        ${isTicketExpired(item.featured_events.date) === true ? 'opacity-50' : ''}
                    `}
                style={styles.shadow}
                disabled={isTicketExpired(item.featured_events.date)}
                onPress={() => navigation.navigate('ticket', {
                    ticket_id: item.ticket_id
                })}
            >
                <View className='  w-2/3'>
                    <Text
                        numberOfLines={1}
                        className='text-2xl font-bold '>
                        {item.featured_events.title}
                    </Text>
                    <Text className='text-lg text-amber-800'>
                        {formatDateShortWeekday(item.featured_events.date)}
                    </Text>
                </View>
                <FastImage
                    source={{
                        uri: item.featured_events.image_url
                    }}
                    className='h-24 w-24 rounded-xl'
                />
            </TouchableOpacity>
        )
    };
    return (
        <View className=''>
            <SecondaryHeader
                displayText={t('ticket_list_screen.title')}
            />
            {
                tickets && tickets?.length != 0 ?
                    <FlatList
                        className='h-4/5 my-3 px-2 '
                        data={tickets}
                        keyExtractor={(item) => item.ticket_id.toString()}
                        renderItem={renderItem}
                    /> :
                    <View className="h-5/6 justify-center items-center p-6">
                        <Text className="text-black text-2xl font-bold mb-4 text-center">
                            No tickets yet
                        </Text>
                        <Text className="text-black text-base text-center mb-6">
                            You haven’t purchased any tickets yet. Explore featured events and grab your spot!
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('featuredEvents')}
                            className="bg-black px-6 py-3 rounded-full"
                        >
                            <Text className="text-white font-semibold text-base">Browse Events</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}

export default TicketFeedScreen