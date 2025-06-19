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
import { getColorFromName } from '../../../utils/functions/getColorFromName';

interface AttendeeProps {
    id: number;
    users: { name: string, photo: string, id: number }
}

const Attendees = ({ featured_event_id, chat_room_id, organizers }: { featured_event_id: number, chat_room_id: number, organizers: { user_id: number } }) => {

    const [attendees, setAttendees] = useState<AttendeeProps[]>();

    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const isOrganizer = currentUser.id === organizers.user_id;

    console.log(isOrganizer)
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
        await fetchAttendees();
        const attendeeIds = attendees?.map(attendee => attendee.users.id)
        // console.log(attendeeIds)
        if (!attendeeIds?.includes(currentUser.id) && !isOrganizer) {
            platformAlert("Join the event to see who's going and chat with them!")
            return;
        }
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
            <View className='m-1'>
                {item.users.photo ?
                    <Image
                        source={{
                            uri: item.users.photo
                        }}
                        className='h-11 w-11 rounded-full border'
                    />
                    :
                    <View
                        style={{
                            backgroundColor: getColorFromName(item.users.name),
                            width: 45,
                            height: 45,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 5,
                            borderWidth: 1
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            {item.users.name.charAt(0).toUpperCase()}
                        </Text>
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