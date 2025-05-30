import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../../../../supabase';
import { RootStackNavigationProp, TicketScreenRouteProps } from '../../../utils/types/types';
import QRCode from 'react-native-qrcode-svg';
import colours from '../../../utils/styles/colours';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import SecondaryHeader from '../../../components/SecondaryHeader';
import styles from '../../../utils/styles/shadow';

interface TicketProps {
    ticket_id: number;
    qr_code_link: string;
    featured_event_id: number;
    featured_events: {
        title: string;
        date: string;
        time: string;
    }
}

const TicketScreen = ({ }) => {

    const route = useRoute<TicketScreenRouteProps>();
    const { ticket_id } = route.params;
    const [ticket, setTicket] = useState<TicketProps>();
    const navigation = useNavigation<RootStackNavigationProp>();
    const fetchTicket = async () => {
        const { data, error } = await supabase
            .from('tickets')
            .select(`*,
                    featured_events(
                    featured_event_id,
                    title,
                    date,
                    time,
                    description
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
        <View
            style={{ backgroundColor: colours.primaryColour }}
            className='h-3/4 p-3 '>
            <View className='pb-4'>
                <SecondaryHeader displayText='Your ticket' />
            </View>
            {
                ticket && (
                    <View className='flex justify-center items-center h-full bg-white border'>

                        <View className='flex my-12 items-center p-3 bg-white'>
                            <QRCode
                                value={ticket.qr_code_link}
                                size={300}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>
                        <View className='w-4/5'>
                            <Text 
                                numberOfLines={1}
                                className='text-3xl font-bold text-center'>
                                {ticket.featured_events.title}
                            </Text>
                        </View>
                        <View className='flex flex-row space-x-5'>
                            <Text className='text-2xl font-bold'>
                                {formatDateShortWeekday(ticket.featured_events.date)}
                            </Text>
                            <Text className='text-2xl font-bold'>
                                {ticket.featured_events.time.slice(0, -3)}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.shadow}
                            onPress={() => navigation.navigate('featuredeventsevent', {
                                featured_event_id: ticket.featured_event_id
                            })}
                            className='bg-black p-2 w-1/3 rounded-full my-10'>
                            <Text className='text-center text-white font-bold text-lg'>
                                Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    )
}

export default TicketScreen