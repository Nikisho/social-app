import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { supabase } from '../../../../supabase';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import FastImage from 'react-native-fast-image';
import { t } from 'i18next';


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
}

interface Interest {
    interest: {
        interest_code: number;
        interests: {
            description: string
        }
    }
}

const FeaturedEventsFeed = ({
    interest
}: Interest) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [featuredEvents, setFeaturedEvents] = useState<any>();
    const fetchFeaturedEvents = async () => {
        const { data, error } = await supabase.rpc('fetch_events', {
            interest_code: interest ? interest.interest_code : null
        })
        if (data) {
            setFeaturedEvents(data);
        }
        if (error) {
            console.error(error.message);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchFeaturedEvents()
        }, [interest])
    );
    const renderItem = ({ item }: { item: FeaturedEventCard }) => {

        return (
            <TouchableOpacity
                className={`my-2
                    rounded-xl border bg-white p-2
                    ${item.test === true && !__DEV__ ? 'hidden' : ''}
                `}
                onPress={() => navigation.navigate('featuredeventsevent', {
                    featured_event_id: item.featured_event_id
                })}
            >
                <FastImage
                    source={{ uri: item.image_url }}
                    className="w-full h-80 rounded-xl overflow-hidden justify-end"
                >
                    <View className="p-2 bg-black w-1/4 text-center mx-2 my-2 rounded-lg">
                        {
                            item.is_free ?
                                <Text className="text-lg text-center font-semibold text-white">
                                    {t('featured_events.free')}
                                </Text>
                                :
                                <Text className="text-lg text-center font-semibold text-white">
                                    {t('featured_events.currency')} {item.price}
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
        <View className='p-2 px-4
                h-[88%]
                mx-[-8]
                space-y-2
        '>

            {interest && (
                <View className="bg-gray-100 rounded-2xl px-4 py-2 mb-3">
                    <Text className="text-base text-gray-700 font-semibold">
                        Events related to <Text className="text-indigo-600">{interest.interests.description}</Text>
                    </Text>
                </View>
            )}

            {
                featuredEvents && featuredEvents.length !== 0 ?
                    <FlatList
                        data={featuredEvents}
                        renderItem={renderItem}
                        keyExtractor={item => item.featured_event_id.toString()}
                    /> :
                    <View className="flex-1 items-center justify-center p-6">
                        <Text className="text-lg font-semibold text-gray-700">
                            No events found
                        </Text>
                        <Text className="mt-2 text-center text-gray-500">
                            There aren’t any events linked to this interest yet.
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("featuredEvents", {} as never)}
                            className="mt-6 px-4 py-2 bg-black rounded-xl"
                        >
                            <Text className="text-white font-medium">Return Home</Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}

export default FeaturedEventsFeed