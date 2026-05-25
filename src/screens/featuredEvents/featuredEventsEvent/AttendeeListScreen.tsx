import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';
import SecondaryHeader from '../../../components/SecondaryHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AttendeeListScreenProps, RootStackNavigationProp } from '../../../utils/types/types';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { getColorFromName } from '../../../utils/functions/getColorFromName';
import { useTranslation } from 'react-i18next';

interface AttendeeProps {
    id: number;
    users: { name: string, photo: string };
    user_id: number
};

const AttendeeListScreen = () => {
    const [attendees, setAttendees] = useState<AttendeeProps[]>();
    const navigation = useNavigation<RootStackNavigationProp>();
    const route = useRoute<AttendeeListScreenProps>()
    const [organizerIdUserId, setOragnizerUserId] = useState<number>();
    const [organizer, setOrganizer] = useState<any>();
    const { featured_event_id } = route.params
    const currentUser = useSelector(selectCurrentUser);
    const { t } = useTranslation();

    const fetchOrganizerUserId = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*,
                organizers(
                    user_id
                )
            `)
            .eq('featured_event_id', featured_event_id)
            .single();

        if (data) {
            setOragnizerUserId(data.organizers.user_id)
        }

        if (error) {
            console.error(error.message)
        }
    };

    const fetchOrgniserData = async () => {
        const { data, error } = await supabase
            .from('featured_events')
            .select(`*,
                organizers(
                    user_id,
                    users(
                        name,
                        photo
                    )
                )
            `)
            .eq('featured_event_id', featured_event_id)
            .single();

        if (data) {
            const organizerObject = {
                user_id: data.organizers.user_id,
                users: {
                    name: data.organizers.users.name,
                    photo: data.organizers.users.photo
                }
            }
            console.log(organizerObject)
            setOrganizer(organizerObject)
        }
    }
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

            const uniqueUsers = Array.from(
                new Map(
                    data.map((item) => [item.user_id, item])
                ).values()
            )

            setAttendees(uniqueUsers as any)
        }

        if (error) {
            throw error.message;
        }
    };

    useEffect(() => {
        fetchAttendees();
        fetchOrgniserData();
        fetchOrganizerUserId();
    }, [])

    const RenderItem = ({ item }: { item: AttendeeProps }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', { user_id: item.user_id })}
                className='p-3 px-5 flex-row justify-between '>

                <View className='flex flex-row space-x-3'>
                    {item.users.photo ?
                        <Image
                            source={{
                                uri: item.users.photo
                            }}
                            className='h-14 w-14 rounded-full '
                        />
                        :
                        <View
                            style={{
                                backgroundColor: item.users.name ? getColorFromName(item?.users?.name) : 'gray',
                                width: 55,
                                height: 55,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 5,
                                borderWidth: 1
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                                {item.users.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    }
                    <View className=''>
                        <Text
                            numberOfLines={1}
                            style={{ width: 100 }}
                            className='text-lg text-'>
                            {item.users.name}
                        </Text>
                        {
                            item.user_id === organizerIdUserId && (
                                <View className="bg-green-100 rounded-full  flex-row items-center border-green-800 border justify-center">
                                    <Text className="text-green-800 font-semibold text-xs text-center"> Organiser</Text>
                                </View>
                            )
                        }
                    </View>
                </View>

                {
                    currentUser.id !== item.user_id &&
                    <TouchableOpacity
                        onPress={() => navigation.navigate('chat',
                            { user_id: item.user_id }
                        )}
                        className='self-end p-2 px-3 bg-gray-300 rounded-full'>
                        <Text>
                            Message
                        </Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity >)
    }
    return (
        <ScrollView className=''
            contentContainerStyle={{ paddingBottom: 100 }}

        >
            <SecondaryHeader
                displayText={t('attendee_list_screen.title')}
            />

            {
                attendees && organizer && (
                    <View className='flex justify-center mt-5'>
                        <Text className='mx-5 text-lg font-semibold text-gray-600'>
                            {attendees?.length! + 1} members
                        </Text>

                        {
                            Array.from(
                                new Map(
                                    [...attendees, organizer].map((item) => [item.user_id, item])
                                ).values()
                            )
                                .sort((a, b) =>
                                    a.user_id === organizerIdUserId ? -1 : b.user_id === organizerIdUserId ? 1 : 0
                                )
                                .map((item) => (
                                    <RenderItem
                                        key={item.user_id}
                                        item={item}
                                    />
                                ))
                        }

                    </View>
                )
            }
        </ScrollView>
    )
}

export default AttendeeListScreen