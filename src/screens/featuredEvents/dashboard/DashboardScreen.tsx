import { View, TouchableOpacity, Text, Animated, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader';
import AntDesign from '@expo/vector-icons/AntDesign';
import styles from '../../../utils/styles/shadow';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { supabase } from '../../../../supabase';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import { Entypo } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface EventCard {
    image_url: string;
    featured_event_id: number;
    title: string;
    price: string;
    location: string;
    date: Date;
    time: string;
    is_free: boolean;
    test: boolean;
    ticket_types : {
        name:string;
        price: string
    }[]
}

const DashboardScreen = () => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const [events, setEvents] = useState<EventCard[] | null>([]);
    const currentUser = useSelector(selectCurrentUser);
    const [isUpcoming, setIsUpcoming] = useState<boolean>(true);

    const fetchOrganizerId = async () => {
        const { data, error } = await supabase
            .from('organizers')
            .select('organizer_id')
            .eq('user_id', currentUser.id)
            .single()
        if (data) {
            return data.organizer_id;
        }
        if (error) {
            console.error(error.message)
        }
        return null;
    };

    const fetchFeaturedEvents = async () => {
        const organizer_id = await fetchOrganizerId();
        if (!organizer_id) {
            setEvents(null);
            return;
        }
        const { data, error } = await supabase
            .from(`featured_events`)
            .select(`*, ticket_types(*)`)
            .order('date', { ascending: false })
            .eq('organizer_id', organizer_id)

        if (data) {
            setEvents(data);
        }
        if (error) {
            console.error(error.message);
        }
    };

    const FadeInItem = ({ item, index }: { item: EventCard, index: number }) => {
        const today = new Date();
        const fadeAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 200,
                useNativeDriver: true,
            }).start();
        }, []);

        const minPrice = Math.min(
            ...item.ticket_types.map(t => Number(t.price))
        );

        return (
            <Animated.View style={{ opacity: fadeAnim }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('featuredeventsevent', { featured_event_id: item.featured_event_id })}
                    style={styles.shadow}
                    className={` bg-gray-100 my-1 flex-row flex p-4 gap-x-5 
                    ${isUpcoming && new Date(item.date) <= today && 'hidden'}
                    ${!isUpcoming && new Date(item.date) > today && 'hidden'}
                `} >
                    <Image
                        source={{ uri: item.image_url }}
                        className='w-28 h-28 rounded-xl overflow-hidden justify-end'
                    />

                    <View className='gap-y-2 flex-1'>
                        <Text
                            numberOfLines={2}
                            className='text-xl font-bold text-wrap'>
                            {item.title}
                        </Text>
                        <View className='flex-row items-center gap-x-2 flex-1 mr-4'>
                            <Entypo name="location-pin" size={24} color="black" />
                            <Text
                                numberOfLines={1}
                                className=' text-lg text-wrap'>
                                {item.location}
                            </Text>
                        </View>
                        <View className='flex flex-row items-center gap-x-2'>
                            <Entypo name="calendar" size={24} color="black" />
                            <Text className=' text-lg'>
                                {item.date && item.time && (formatDateShortWeekday(item.date) + ', ' + (item.time).slice(0, -3))}
                            </Text>
                        </View>

                        <View className='flex flex-row items-center gap-x-2'>
                            <Entypo name="ticket" size={24} color="black" />
                            {
                                minPrice === 0 ?
                                    <Text className=' text-lg'>
                                        {`FREE`}
                                    </Text>
                                    :
                                    <Text className=' text-lg'>
                                        £{minPrice}
                                    </Text>
                            }
                        </View>
                    </View>
                    <TouchableOpacity
                        className='self-start rounded-lg'
                        style={styles.shadowButtonStyle}
                        onPress={() => navigation.navigate('ticketscanner', { featured_event_id: item.featured_event_id })}
                    >
                        <Text className='text-white m-2'>
                            Scan tickets
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity >
            </Animated.View>

        )
    };

    useEffect(() => {
        fetchFeaturedEvents();
    }, []);

    const upcomingEvents = events?.filter(
        (e) => new Date(e.date) > new Date()
    );

    const pastEvents = events?.filter(
        (e) => new Date(e.date) <= new Date()
    );

    const eventsToShow = isUpcoming ? upcomingEvents : pastEvents;

    return (
        <View className='h-screen'>
            <SecondaryHeader
                displayText='Organise'
            />
            {/* tabs view */}
            {/* <TouchableOpacity
                onPress={() => navigation.navigate('managememberships')}
                style={styles.shadow}
                className='my-2 gap-x-2 items-center flex flex-row self-center p-3 px-4 rounded-full bg-white'>
                <FontAwesome6 name="user-group" size={14} color="black" />
                <Text className='font-bold text-center text-black'>
                    Manage memberships
                </Text>
            </TouchableOpacity> */}

            <View className='my-5 bg-gray-200 rounded-full flex flex-row self-center justify-center w-3/4'>
                <TouchableOpacity
                    onPress={() => setIsUpcoming(true)}
                    className={` p-3  w-1/2 rounded-full ${isUpcoming ? 'bg-black' : ''}`}>
                    <Text className={` font-bold text-center text-gray-600 ${isUpcoming ? 'text-white' : ''} `}>
                        Upcoming
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsUpcoming(false)}
                    className={` p-3  w-1/2 rounded-full ${!isUpcoming ? 'bg-black' : ''}`}>

                    <Text className={` font-bold text-center text-gray-600 ${!isUpcoming ? 'text-white' : ''} `}>
                        Past
                    </Text>
                </TouchableOpacity>
            </View>
            {
                eventsToShow?.length === 0 ?
                    <View className="bg-red-20 h-1/2 justify-center items-center  p-6">
                        <Text className="text-lg font-semibold text-gray-700">
                            No events found
                        </Text>
                        <Text className="mt-2 text-center text-gray-500">
                            Organise an event and bring your community together 🚀
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("featuredEventsSubmit")}
                            className="mt-6 px-4 py-2 bg-black rounded-xl"
                        >
                            <Text className="text-white text-lg font-medium">Create event</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <FlatList
                        data={eventsToShow}
                        contentContainerStyle={{ paddingBottom: 200 }}

                        renderItem={({ item, index }) => (
                            <FadeInItem item={item} index={index} />
                        )}
                        keyExtractor={(item) => item.featured_event_id.toString()}
                    />
            }

            <TouchableOpacity
                onPress={() => navigation.navigate('featuredEventsSubmit')}
                style={styles.shadowButtonStyle}
                className='absolute bottom-48 right-5 p-5 rounded-full'>
                <AntDesign name="plus" size={25} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default DashboardScreen;