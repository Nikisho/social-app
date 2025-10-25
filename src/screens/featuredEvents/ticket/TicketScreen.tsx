import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../../../../supabase';
import { RootStackNavigationProp, TicketScreenRouteProps } from '../../../utils/types/types';
import QRCode from 'react-native-qrcode-svg';
import colours from '../../../utils/styles/colours';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import SecondaryHeader from '../../../components/SecondaryHeader';
import { useTranslation } from 'react-i18next';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import PromoterDetails from '../featuredEventsEvent/PromoterDetails';
import OrganizerInfo from './OrganizerInfo';

interface TicketProps {
    ticket_id: number;
    qr_code_link: string;
    featured_event_id: number;
    featured_events: {
        title: string;
        date: string;
        time: string;
        chat_room_id: number;
        location: string;
        organizer_id: number;
    }
    ticket_types: {
        description: string;
        name: string;

    }
}

const TicketScreen = ({ }) => {

    const route = useRoute<TicketScreenRouteProps>();
    const { ticket_id } = route.params;
    const [ticket, setTicket] = useState<TicketProps>();
    const navigation = useNavigation<RootStackNavigationProp>();
    const { t } = useTranslation();
    const fetchTicket = async () => {
        const { data, error } = await supabase
            .from('tickets')
            .select(`*,
                    ticket_types(*),
                    featured_events(
                    featured_event_id,
                    title,
                    date,
                    time,
                    description,
                    chat_room_id,
                    location,
                    organizer_id
                )`)
            .eq('ticket_id', ticket_id)
            .single()
        if (data) {
            setTicket(data);
        }

        if (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, []);
    return (
        <ScrollView
            style={{ backgroundColor: colours.primaryColour }}
            contentContainerStyle={{ paddingBottom: 150 }}
            className='h-3/4 p-3 mx-5'

        >
            <View className='mb-2'>
                <SecondaryHeader displayText={t('ticket_screen.title')} />
            </View>
            {
                ticket && (
                    <>
                        <View className='flex p-5  bg-white rounded-2xl border border-dashed space-y-1'>

                            <View className='flex mb-5 items-center p-3 bg-white'>
                                <QRCode
                                    value={ticket.qr_code_link}
                                    size={250}
                                    color="black"
                                    backgroundColor="white"
                                />
                            </View>
                            <View className='flex flex-row space-x-4 mx-2'>
                                <Entypo name="megaphone" size={24} color="black" />
                                <Text className='text-lg font-semibold text-wrap'>
                                    {ticket.featured_events.title}
                                </Text>
                            </View>
                            <View className='flex flex-row space-x-4 mx-2'>
                                <Entypo name="ticket" size={24} color="black" />
                                <View className="flex-1">
                                    <Text className='text-lg font-semibold'>
                                        {ticket.ticket_types?.name}
                                    </Text>

                                    {ticket.ticket_types?.description ? (
                                        <Text className="text-sm text-gray-600 mt-1">
                                            {ticket.ticket_types.description}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>

                            <View className='flex flex-row items-center mx-1 space-x-5'>
                                <Entypo name="calendar" size={23} color="black" />
                                <Text className='text-lg font-semibold'>
                                    {formatDateShortWeekday(ticket.featured_events.date)} ({ticket.featured_events.time.slice(0, -3)})
                                </Text>
                            </View>
                            <View className='flex flex-row items-center mx-1 space-x-5'>
                                <Entypo name="location-pin" size={24} color="black" />
                                <Text className='text-lg font-semibold'>
                                    {ticket.featured_events.location}
                                </Text>
                            </View>

                        </View>

                        <View className='flex space-y-2 mt-5'>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('featuredeventsevent', {
                                    featured_event_id: ticket.featured_event_id
                                })}
                                className='py-4 px-5 rounded-full bg-black flex flex-row space-x-3 justify-center'>
                                <Entypo name="calendar" size={26} color="white" />
                                <Text
                                    className='text-lg text-center text-white font-semibold'>
                                    View event
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('attendeelist', {
                                    featured_event_id: ticket.featured_event_id,
                                    chat_room_id: ticket.featured_events.chat_room_id
                                })}
                                className='py-4 px-5 rounded-full bg-white border flex flex-row space-x-3 justify-center'>
                                <MaterialIcons name="groups" size={26} color="black" />

                                <Text className='text-lg text-center font-semibold'>
                                    View attendees
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('groupchat', {
                                    featured_event_id: ticket.featured_event_id
                                })}
                                className='py-4 px-5 rounded-full bg-green-50 border-green-900 border-2 flex flex-row space-x-3 justify-center'>
                                <Entypo name="chat" size={26} color="black" />
                                <Text className='text-lg text-center font-semibold text-green-900'>
                                    Join the event chat
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <OrganizerInfo
                            organizer_id={ticket.featured_events.organizer_id}
                        />
                    </>
                )
            }
        </ScrollView>
    )
}

export default TicketScreen