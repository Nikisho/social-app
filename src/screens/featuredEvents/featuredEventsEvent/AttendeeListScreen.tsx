import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../../utils/styles/shadow';
import SecondaryHeader from '../../../components/SecondaryHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AttendeeListScreenProps, RootStackNavigationProp } from '../../../utils/types/types';
import Entypo from '@expo/vector-icons/Entypo';

interface AttendeeProps {
    id: number;
    users: { name: string, photo: string };
    user_id: number
};

const AttendeeListScreen = () => {
    const [attendees, setAttendees] = useState<AttendeeProps[]>();
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute<AttendeeListScreenProps>()
    const { featured_event_id, chat_room_id } = route.params

    console.log(featured_event_id)
    const fetchAttendees = async () => {
        const { data, error } = await supabase
            .from('featured_event_bookings')
            .select(` *,
                users(
                    name,
                    photo
                )
            `)
            .eq('featured_event_id', featured_event_id)

        if (data) {
            // console.log(data);
            setAttendees(data);
        }

        if (error) {
            throw error.message;
        }
    };

    useEffect(() => {
        fetchAttendees();
    }, [])

    const RenderItem = ({ item }: { item: AttendeeProps }) => {

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', { user_id: item.user_id })}
                style={styles.shadow}
                className='mx-3  bg-white my-2 items-center rounded-xl flex justify-between p-3 w-1/4 h-32'>
                {item.users.photo ?
                    <Image
                        source={{
                            uri: item.users.photo
                        }}
                        className='h-16 w-16 rounded-full '
                    />
                    :
                    <View className='bg-white rounded-full'
                        style={styles.shadow}
                    >
                        <FontAwesome name="user-circle" size={50} color="black" />
                    </View>
                }

                <Text className='text-lg'>
                    {item.users.name}
                </Text>
            </TouchableOpacity>)
    }
    return (
        <ScrollView className=''>
            <SecondaryHeader
                displayText='Attendees'
            />
            <View className='flex items-center my-5'>

                <TouchableOpacity
                    onPress={() => navigation.navigate('featuredeventgroupchat', {
                        chat_room_id: chat_room_id,
                        featured_event_id: featured_event_id
                    })}
                    style={styles.shadow}
                    className='p-3 my-5 w-1/3 rounded-full bg-black flex-row justify-center space-x-3 items-center'>
                    <Entypo name="chat" size={24} color="white" />
                    <Text className='text-lg text-white text-center font-bold'>
                        Chat
                    </Text>
                </TouchableOpacity>
            </View>

            <View className='flex flex-row flex-wrap justify-center '>
                {
                    attendees?.map((item) => (
                        <RenderItem
                            key={item.user_id}
                            item={item}
                        />
                    ))
                }
            </View>

        </ScrollView>
    )
}

export default AttendeeListScreen