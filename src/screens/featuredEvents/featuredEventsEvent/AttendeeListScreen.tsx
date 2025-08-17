import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../../utils/styles/shadow';
import SecondaryHeader from '../../../components/SecondaryHeader';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AttendeeListScreenProps, RootStackNavigationProp } from '../../../utils/types/types';
import Entypo from '@expo/vector-icons/Entypo';
import checkProfilePicture from '../../../utils/functions/checkProfilePicture';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import platformAlert from '../../../utils/functions/platformAlert';
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

    const { featured_event_id, chat_room_id } = route.params
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

    const fetchAttendees = async () => {
        const { data, error } = await supabase
            .from('participants')
            .select(` *,
                users(
                    name,
                    photo
                )
            `)
            .eq('chat_room_id', chat_room_id)

        if (data) {
            setAttendees(data);
        }

        if (error) {
            throw error.message;
        }
    };

    const handleNavigate = async () => {
        const userHasPhoto = await checkProfilePicture(currentUser.id);
        if (!userHasPhoto && !__DEV__) {
            platformAlert('Add a profile picture to chat with attendees!');
            return;
        }
        navigation.navigate('groupchat', {
            featured_event_id: featured_event_id
        })
    }

    useEffect(() => {
        fetchAttendees();
        fetchOrganizerUserId();
    }, [])

    const RenderItem = ({ item }: { item: AttendeeProps }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', { user_id: item.user_id })}
                // style={styles.shadow}
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
                                backgroundColor: getColorFromName(item.users.name),
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
            <View className='flex items-center mt-'>

                <TouchableOpacity
                    onPress={handleNavigate}
                    style={styles.shadow}
                    className='p-3 my-5 w-1/3 rounded-full bg-black flex-row justify-center space-x-3 items-center'>
                    <Entypo name="chat" size={24} color="white" />
                    <Text className='text-lg text-white text-center font-bold'>
                        Chat
                    </Text>
                </TouchableOpacity>
            </View>
            <View className='flex justify-center'>
                <Text className='mx-5 text-lg font-semibold text-gray-600'>
                    {attendees?.length} members
                </Text>
                {
                    attendees &&
                    [...attendees]
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

        </ScrollView>
    )
}

export default AttendeeListScreen