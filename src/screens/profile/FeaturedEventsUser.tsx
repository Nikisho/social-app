import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import { supabase } from '../../../supabase';
import formatDateShortWeekday from '../../utils/functions/formatDateShortWeekday';
import FastImage from 'react-native-fast-image';
import fetchOrganizerId from '../../utils/functions/fetchOrganizerId';

interface FeaturedEventCard {
    image_url: string;
    featured_event_id: number;
    title: string;
    price: string;
    location: string;
    date: Date;
    time: string;
    is_free: boolean;
    test: boolean;
    ticket_types: {
        name:string;
        price:string
    }[]
}

const FeaturedEventsUser = ({ user_id, HeaderContent }: { user_id: number, HeaderContent: any }) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [featuredEvents, setFeaturedEvents] = useState<FeaturedEventCard[] | null>(null);

    const fetchFeaturedEvents = async () => {
        const organizer_id = await fetchOrganizerId(user_id);
        if (!organizer_id) {
            setFeaturedEvents(null);
            return;
        }
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*, ticket_types(*)`)
            .order('date', { ascending: false })
            .eq('organizer_id', organizer_id)

        if (data) {
            setFeaturedEvents(data);
        }
        if (error) {
            console.error(error.message);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchFeaturedEvents();
        }, [user_id])
    );
    const renderItem = ({ item }: { item: FeaturedEventCard }) => {
        const minPrice = Math.min(
            ...item.ticket_types.map(t => Number(t.price))
        );
        return (
            <TouchableOpacity
                className={`my-2
                    rounded-xl border bg-white p-2
                    ${item.test && !__DEV__ ? 'hidden' : ''}
                `}
                onPress={() => navigation.navigate('featuredeventsevent', {
                    featured_event_id: item.featured_event_id
                })}
            >
                <FastImage
                    source={{ uri: item.image_url }}
                    className="w-full h-80 rounded-xl overflow-hidden justify-end"
                >
                    <View className="p-2 w-1/4 bg-black text-center mx-2 my-4 rounded-lg">
                        {
                            minPrice === 0?
                                <Text className="text-lg font-semibold text-center text-white">
                                    FREE
                                </Text>
                                :
                                <Text className="text-lg font-semibold text-center text-white">
                                    £{minPrice}
                                </Text>
                        }
                    </View>

                </FastImage>
                <View className='p-1'>
                    <Text
                        className='text-3xl font-bold my-2'
                    >
                        {item.title}
                    </Text>
                    <Text className='text-amber-800 mb-1'>
                        {item.time && formatDateShortWeekday(item?.date) + ', ' + (item?.time).slice(0, -3)}
                    </Text>
                    <Text>
                        {item.location}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    };
    return (
        <View className='
                px-3
                pb-40
        '>
            <FlatList
                data={featuredEvents}
                ListHeaderComponent={HeaderContent}
                renderItem={renderItem}
                // ListEmptyComponent={
                // <View className="flex-1 bg-[#fffef4] items-center justify-center px-6">
                //     <Text className="text-5xl mb-4 text-white">📭</Text>
                //     <Text className="text-xl font-semibold text-black mb-2">
                //         No Events Posted Yet
                //     </Text>
                //     <Text className="text-base text-black text-center">
                //         Featured events will appear here once available.
                //     </Text>
                // </View>}
                keyExtractor={item => item.featured_event_id.toString()}
            />
        </View>
    )
}


export default FeaturedEventsUser