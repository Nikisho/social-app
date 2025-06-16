import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase'
import styles from '../../../utils/styles/shadow';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import platformAlert from '../../../utils/functions/platformAlert';

interface AttendeeProps {
    id: number, users: { name: string, photo: string }
}

const Attendees = ({ featured_event_id, chat_room_id }: { featured_event_id: number, chat_room_id: number }) => {

    const [attendees, setAttendees] = useState<AttendeeProps[]>();

    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);

    const fetchAttendees = async () => {
        const { data, error } = await supabase
            .from('featured_event_bookings')
            .select(` *,
                users(
                    name,
                    photo,
                    id
                )
            `)
            .eq('featured_event_id', featured_event_id)

        if (data) {
            console.log(data);
            setAttendees(data);
        }

        if (error) {
            throw error.message;
        }
    };

    const handleNavigate = async () => {
        const attendeeIds = attendees?.map(attendee => attendee.id)
        // if (!attendeeIds?.includes(currentUser.id )) {
        //     platformAlert("Join the event to see who's going and chat with them!")
        //     return;
        // }
        navigation.navigate('attendeelist', {
            featured_event_id: featured_event_id,
            chat_room_id: chat_room_id
        })
    }

    useEffect(() => {
        fetchAttendees();
    }, [])


    const renderItem = ({ item }: { item: AttendeeProps }) => {

        return (
            <View className='m-2 mr-[-15]'>
                {item.users.photo ?
                    <Image
                        source={{
                            uri: item.users.photo
                        }}
                        className='h-11 w-11 rounded-full border'
                    />
                    :
                    <View className='bg-white rounded-full'
                        style={styles.shadow}
                    >
                        <FontAwesome name="user-circle" size={40} color="black" />
                    </View>
                }
            </View>)
    }

    return (
        <TouchableOpacity
            onPress={handleNavigate}
            className='p-2'>
            <Text className='text-xl font-bold'>
                Going {'  ' + attendees?.length.toString()}
            </Text>
            <FlatList
                horizontal
                data={attendees?.slice(0, 3)}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />

        </TouchableOpacity>
    )
}

export default Attendees