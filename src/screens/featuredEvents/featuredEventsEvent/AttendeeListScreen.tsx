import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
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

    const renderItem = ({ item }: { item: AttendeeProps }) => {

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', { user_id: item.user_id })}
                style={styles.shadow}
                className='mx-3 my-2  bg-white flex-row items-center space-x-5  p-2 rounded-xl'>
                {item.users.photo ?
                    <Image
                        source={{
                            uri: item.users.photo
                        }}
                        className='h-11 w-11 rounded-full'
                    />
                    :
                    <View className='bg-white rounded-full'
                        style={styles.shadow}
                    >
                        <FontAwesome name="user-circle" size={40} color="black" />
                    </View>
                }

                <Text className='text-lg'>
                    {item.users.name}
                </Text>
            </TouchableOpacity>)
    }
    return (
        <View>
            <SecondaryHeader
                displayText='Attendees'
            />
            <View className='flex items-center'>

                <TouchableOpacity
                    onPress={() => navigation.navigate('featuredeventgroupchat', {
                        chat_room_id: chat_room_id
                    })}
                    style={styles.shadow}
                    className='p-3 my-5 w-1/3 rounded-full bg-black flex-row justify-center space-x-3 items-center'>
                    <Entypo name="chat" size={24} color="white" />
                    <Text className='text-lg text-white text-center font-bold'>
                        Chat
                    </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={attendees}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    )
}

export default AttendeeListScreen