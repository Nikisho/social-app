import { View, Text, TouchableOpacity, Alert, Animated, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import colours from '../../../utils/styles/colours'
import { supabase } from '../../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import platformAlert from '../../../utils/functions/platformAlert';
import BookEventCheckoutModal from './BookEventCheckoutModal';
import { delay } from '../../../utils/functions/delay';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import { t } from 'i18next';
import RenderActionButton from './RenderActionButton';
import TicketTypeModal from './TicketTypeModal';
import { uuidv4 } from '../../../../supabase/functions/_utils/uuidv4';
import LoadingScreen from '../../loading/LoadingScreen';

interface BookEventProps {
    is_free: boolean;
    price: string;
    featured_event_id: number
    tickets_sold: number;
    max_tickets: number;
    date: Date;
    organizer_id: number;
    chat_room_id: number;
    location: string;
    title: string;
    time: string;
    ticket_types: {
        description: string;
        is_free: boolean;
        organizer_id: number;
        sales_start: Date;
        sales_end: Date;
        name: string;
        price: string
        quantity: number;
        tickets_sold: number;
        ticket_type_id: number;
    }[],
    organizers: {
        user_id: number
        platform_fee_discount_pct: number;
    }
}
const BookEvent: React.FC<BookEventProps> = ({
    is_free,
    price,
    featured_event_id,
    organizer_id,
    tickets_sold,
    max_tickets,
    date,
    chat_room_id,
    location,
    title,
    time,
    ticket_types,
    organizers

}) => {
    const currentUser = useSelector(selectCurrentUser);
    const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [ticketTypeModalVisible, setTicketTypeModalVisible] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const canBook = async () => {
        if (__DEV__) {
            return true;
        }
        const { count, error } = await supabase
            .from('featured_event_bookings')
            .select('user_id', { count: 'exact' })
            .eq('featured_event_id', featured_event_id)
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error checking bookings:', error.message);
            return;
        }
        if (count && count >= 1) {
            return false;
        } else {
            return true;
        }
    };

    const isEventExpired = (eventDate: Date) => {
        if (__DEV__) {
            return false;
        }
        const now = new Date();
        const event = new Date(eventDate)
        const eventEndOfDay = new Date(event)
        eventEndOfDay.setHours(23, 59, 59, 999);
        return now > eventEndOfDay;
    };
    const isExpired = isEventExpired(date);

    const showTicketTypeModal = async () => {
        try {
            const canPost = await canBook();
            if (canPost === false) {
                platformAlert("You've already booked tickets for this event");
                return;
            }
            setTicketTypeModalVisible(!ticketTypeModalVisible)
        } catch (error: any) {
            Alert.alert(error.message)
        }

    }

    const handleBookEvent = async (quantity: undefined | number = 1) => {
        setLoading(true);
        if (selectedTicket.is_free) {
            const { error, response } = await supabase.functions.invoke(
                'guest_free_ticket_claim',
                {
                    body: {
                        user: { name: currentUser.name, email: currentUser.email },
                        selected_ticket: {
                            featured_event_id: selectedTicket.featured_event_id,
                            tickets_sold: selectedTicket.tickets_sold,
                            ticket_type_id: selectedTicket.ticket_type_id
                        },
                        event: {
                            date: date,
                            time: time,
                            title: title,
                            organizer_id: organizer_id,
                            location: location,
                            chat_room_id: chat_room_id,
                        },
                        quantity: quantity
                    }
                }
            );
            if (error) {
                const status = response?.status
                // console.log('Error code is  ', response?.status)
                if (status === 409) {
                    platformAlert("You already have a booking for this event.");
                    return;
                }

                platformAlert("Something went wrong. Please try again.");
                return;
            }
            setLoading(false);

        };
        setLoading(false);

        platformAlert('Purchase successful! 💫');
        await delay(2000);
        navigation.navigate('ticketfeed');
        setCheckoutModalVisible(!checkoutModalVisible);
        setTicketTypeModalVisible(!ticketTypeModalVisible)
        setLoading(false);
    };

    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    if (loading) {
        return (
            <View className='absolute inset-0 bg-white h-full w-full'>
                <LoadingScreen displayText={'Processing your booking'} />
             </View> 
        )
    }
    return (
        <Animated.View
            style={{
                opacity: fadeAnim
            }}
            className={`absolute bg-black inset-x-0 py-5 flex justify-center flex-row items-center px-6 ${Platform.OS === 'ios' ? 'bottom-20' : 'bottom-14'}`}>
            <RenderActionButton
                isExpired={isExpired}
                showTicketTypeModal={showTicketTypeModal}
            />
            <BookEventCheckoutModal
                modalVisible={checkoutModalVisible}
                setModalVisible={setCheckoutModalVisible}
                price={selectedTicket?.price}
                is_free={selectedTicket?.is_free}
                organizer_id={organizer_id}
                featured_event_id={featured_event_id}
                handleBookEvent={handleBookEvent}
                date={date}
                tickets_sold={selectedTicket?.tickets_sold}
                chat_room_id={chat_room_id}
                ticket_name={selectedTicket?.name}
                ticket_type_id={selectedTicket?.ticket_type_id}
                platform_fee_discount_pct={organizers.platform_fee_discount_pct}
            />
            <TicketTypeModal
                modalVisible={ticketTypeModalVisible}
                setBookEventModalVisible={setCheckoutModalVisible}
                setModalVisible={setTicketTypeModalVisible}
                setSelectedTicket={setSelectedTicket}
                ticket_types={ticket_types}
            />
        </Animated.View>

    )
}

export default BookEvent