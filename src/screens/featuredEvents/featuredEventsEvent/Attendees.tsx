import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import platformAlert from '../../../utils/functions/platformAlert';
import { getColorFromName } from '../../../utils/functions/getColorFromName';
import { useTranslation } from 'react-i18next';
import styles from '../../../utils/styles/shadow';
import Entypo from '@expo/vector-icons/Entypo';

interface AttendeeProps {
    id: number;
    users: { name: string, photo: string, id: number };
}

interface AttendeesProps {
    featured_event_id: number, chat_room_id: number, organizers: { user_id: number }, hide_participants: boolean;
}

const Attendees: React.FC<AttendeesProps> = ({
    featured_event_id,
    chat_room_id,
    hide_participants,
    organizers }) => {

    const [attendees, setAttendees] = useState<AttendeeProps[]>();
    const { t } = useTranslation();
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const isOrganizer = currentUser.id === organizers.user_id;

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
            setAttendees(data);
            return data;
        }

        if (error) {
            throw error.message;
        }
        return null;
    };

    const handleNavigateGroupChat = async () => {
        const response = await fetchAttendees();
        const attendeeIds = response?.map(attendee => attendee.users.id);
        if (!attendeeIds?.includes(currentUser.id) && !isOrganizer) {
            platformAlert("Join the event to see who's going and chat with them!");
            return;
        }
        navigation.navigate('groupchat', {
            featured_event_id: featured_event_id
        })
    }
    const handleNavigate = async () => {
        // const attendeeIds = data?.map(attendee => attendee.users.id);
        const response = await fetchAttendees();
        const attendeeIds = response?.map(attendee => attendee.users.id);

        if (!attendeeIds?.includes(currentUser.id) && !isOrganizer) {
            platformAlert("Join the event to see who's going and chat with them!");
            return;
        }

        if (hide_participants && !isOrganizer ) {
            platformAlert('The organiser has chosen to hide the participants for this event.');
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
        <View className='flex flex-row justify-between mx-2'>
            <TouchableOpacity
                onPress={handleNavigate}
                className='p-2'>
                <Text className='text-xl font-bold'>
                    {t('featured_event_screen.going')} {attendees?.length !== 0  && '  ' + attendees?.length.toString()}
                </Text>
                {
                    attendees?.length !== 0 ?

                    <FlatList
                        horizontal
                        data={attendees?.slice(0, 3)}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                    /> :
                    <Text className='italic my-2'>No attendees yet</Text>
                }

            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleNavigateGroupChat}
                style={styles.shadow}
                className='border h-10 mt-5 px-3 self-center rounded-xl bg-black flex-row justify-center space-x-3 items-center'>
                <Entypo name="chat" size={20} color="white" />
                <Text className='text-white text-center font-bold'>
                    Event chat
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Attendees