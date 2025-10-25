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
        sales_end:Date;
        name:string;
        price:string
        quantity: number;
        tickets_sold: number;
        ticket_type_id: number;
    }[]

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
    ticket_types

}) => {
    const currentUser = useSelector(selectCurrentUser);
    const isSoldOut = tickets_sold >= max_tickets;
    const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [ticketTypeModalVisible, setTicketTypeModalVisible] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

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
        // if (__DEV__) {
        //     return false;
        // }
        const now = new Date();
        const event = new Date(eventDate)
        const eventEndOfDay = new Date(event)
        eventEndOfDay.setHours(23, 59, 59, 999);
        return now > eventEndOfDay;
    };
    const isExpired = isEventExpired(date);

    const showBookingModal = async () => {
        try {
            const canPost = await canBook();
            if (canPost === false) {
                platformAlert("You've already booked tickets for this event");
                return;
            }
            setCheckoutModalVisible(!checkoutModalVisible)
        } catch (error: any) {
            Alert.alert(error.message)
        }

    }

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

    const handleBookEvent = async () => {
        if (selectedTicket.is_free ) {
            const { error } = await supabase
                .from('featured_event_bookings')
                .insert({
                    user_id: currentUser.id,
                    featured_event_id: featured_event_id,
                })
            if (error) {
                console.error(error.message);
            } else {
                const { error } = await supabase
                    .from('ticket_types')
                    .update({
                        tickets_sold: selectedTicket.tickets_sold + 1
                    })
                    // .eq('featured_event_id', featured_event_id)
                    .eq('ticket_type_id', selectedTicket.ticket_type_id)

                if (error)
                    console.error(error.message);
            }
            //generate the ticket is the event is free as for paid events
            //it is generated in the backend

            const { error: participantsError } = await supabase
                .from('participants')
                .insert({
                    user_id: currentUser.id,
                    chat_room_id: chat_room_id
                })
            if (participantsError) {
                console.error(participantsError.message);
            }

            const qrValue = `com.linkzy://event/${featured_event_id}/user/${currentUser.id}`;
            const eventDate = new Date(date)
            const { error: TicketsError } = await supabase
                .from('tickets')
                .insert({
                    user_id: currentUser.id,
                    featured_event_id: featured_event_id,
                    ticket_type_id: selectedTicket.ticket_type_id,
                    qr_code_link: qrValue,
                    expiry_date: new Date(eventDate.setDate(eventDate.getDate() + 1))
                })
            if (TicketsError) {
                console.error('Error buying ticket :', TicketsError.message);
                return;
            }
        };

        platformAlert('Purchase successful! 💫');
        await delay(2000);
        navigation.navigate('ticketfeed');
        setCheckoutModalVisible(!checkoutModalVisible);
        setTicketTypeModalVisible(!ticketTypeModalVisible)
        emailUserUponPurchase();
    };

    const emailUserUponPurchase = async () => {
        try {
            const edge_function_base_url = 'https://wffeinvprpdyobervinr.supabase.co/functions/v1/ticket-purchase-email'

            const {
                data: { session },
            } = await supabase.auth.getSession();

            const accessToken = session?.access_token;
            const response = await fetch(edge_function_base_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: currentUser.name,
                    email: currentUser.email,
                    title: title,
                    location: location,
                    date: date && time && (formatDateShortWeekday(date) + ', ' + (time).slice(0, -3)),
                }),
            });

            const data = await response.json();
            console.log("✅ Function response:", data);
        } catch (error: any) {
            console.error('Error booking event:', error.message);
            platformAlert('An error occurred while booking the event. Please try again later.');

        }
    }
    const fadeAnim = useRef(new Animated.Value(0)).current;
    console.log('hey: ' ,ticket_types[0].price)
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800, 
            useNativeDriver: true,
        }).start();
    }, []);
    return (
        <Animated.View
            style={{
                opacity: fadeAnim
            }}
            className={`absolute bg-black inset-x-0 py-5 flex justify-center flex-row items-center px-6 ${Platform.OS === 'ios'? 'bottom-20' : 'bottom-14'}`}>
            <RenderActionButton
                isExpired={isExpired}
                showTicketTypeModal={showTicketTypeModal}
            />
            {/* {(!isExpired && !isSoldOut) && (
                <Text className="text-2xl text-blue-800 font-bold">
                    {Number(ticket_types[0].price) === 0 ? t('featured_event_screen.free') : `£${ticket_types[0].price}`}
                </Text>
            )} */}

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
            />
            <TicketTypeModal 
                modalVisible={ticketTypeModalVisible}
                setBookEventModalVisible={setCheckoutModalVisible}
                setModalVisible={setTicketTypeModalVisible}
                setSelectedTicket={setSelectedTicket}
                // selectedTicket={selectedTicket}
                ticket_types={ticket_types}
            />
        </Animated.View>

    )
}

export default BookEvent