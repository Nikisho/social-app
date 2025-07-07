import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { supabase } from '../../../../supabase';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import FastImage from 'react-native-fast-image';


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

const FeaturedEventsFeed = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [featuredEvents, setFeaturedEvents] = useState<any>();
    
    const fetchFeaturedEvents = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select()
            .order('date', { ascending: false })
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
        }, [])
    );
    const renderItem = ({ item }: { item: FeaturedEventCard }) => {

        return (
            <TouchableOpacity
                className={`my-2
                    rounded-xl border bg-white p-2
                    ${item.test === true && !__DEV__? 'hidden' : ''}
                `}
                onPress={() => navigation.navigate('featuredeventsevent', {
                    featured_event_id: item.featured_event_id
                })}
            >
                <FastImage
                    source={{ uri: item.image_url}}
                    className="w-full h-80 rounded-xl overflow-hidden justify-end"
                >
                    <View className="p-2 bg-black w-1/4 text-center mx-2 my-2 rounded-lg">
                        {
                            item.is_free ?
                                <Text className="text-lg text-center font-semibold text-white">
                                    FREE
                                </Text>
                                :
                                <Text className="text-lg text-center font-semibold text-white">
                                    £{item.price}
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
            {
                featuredEvents &&
                <FlatList
                    data={featuredEvents}
                    renderItem={renderItem}
                    keyExtractor={item => item.featured_event_id.toString()}
                />
            }

        </View>
    )
}

export default FeaturedEventsFeed