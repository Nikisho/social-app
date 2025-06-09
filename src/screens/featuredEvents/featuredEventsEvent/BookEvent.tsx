import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import colours from '../../../utils/styles/colours'
import { supabase } from '../../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import platformAlert from '../../../utils/functions/platformAlert';
import BookEventCheckoutModal from './BookEventCheckoutModal';

interface BookEventProps {
    is_free: boolean;
    price: string;
    featured_event_id: number
    tickets_sold: number;
    max_tickets: number;
    date: Date;
    organizer_id: number;

}
const BookEvent: React.FC<BookEventProps> = ({
    is_free,
    price,
    featured_event_id,
    organizer_id,
    tickets_sold,
    max_tickets,
    date
}) => {
    const currentUser = useSelector(selectCurrentUser);
    const isSoldOut = tickets_sold >= max_tickets;
    const [checkoutModalVisible, setCheckoutModalVisible] = useState<boolean>(false);
    const navigation = useNavigation<RootStackNavigationProp>();

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

    const showBookingModal = async () => {
        try {
            const canPost = await canBook();
            if (canPost === false) {
                platformAlert("You've already booked tickets for this event");
                return;
            }
            setCheckoutModalVisible(!checkoutModalVisible)
        } catch (error:any) {
            Alert.alert(error.message)
        }

    }

    const handleBookEvent = async () => {
        const canPost = await canBook();
        if (canPost === false) {
            platformAlert("You've already booked tickets for this event");
            return;
        }

        if (is_free) {
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
                    .from('featured_events')
                    .update({
                        tickets_sold: tickets_sold + 1
                    })
                    .eq('featured_event_id', featured_event_id)

                if (error)
                    console.error(error.message);
            }
            //generate the ticket is the event is free as for paid events
            //it is generated in the backend
            const qrValue = `com.linkzy://event/${featured_event_id}/user/${currentUser.id}`;
            const eventDate = new Date(date)
            const { error:TicketsError } = await supabase
                .from('tickets')
                .insert({
                    user_id: currentUser.id,
                    featured_event_id: featured_event_id,
                    qr_code_link: qrValue,
                    expiry_date: new Date(eventDate.setDate(eventDate.getDate() + 1))
                })
            if (TicketsError) {
                throw TicketsError.message;
            }
        };

        platformAlert('Purchase successful! 💫');
        navigation.navigate('ticketfeed');
        setCheckoutModalVisible(!checkoutModalVisible)
    };

    return (
        <View
            style={{
                backgroundColor: colours.secondaryColour,
            }}
            className='absolute inset-x-0 bottom-0 h-[10%] flex justify-between flex-row items-center px-6'>
            {
                isSoldOut ?
                    <View
                        className='p-3 rounded-full bg-white opacity-60'
                    >
                        <Text className='text-center font-bold'>
                            SOLD OUT
                        </Text>
                    </View>
                    :

                    <TouchableOpacity
                        onPress={showBookingModal}
                        disabled={isEventExpired(date)}
                        className={`p-3 rounded-full bg-white w-1/4 ${isEventExpired(date) && 'opacity-60'}`}
                    >
                        <Text className='text-center font-bold'>
                            {isEventExpired(date) ? 'CLOSED' : 'BOOK'}
                        </Text>
                    </TouchableOpacity>
            }
            {
                is_free ?
                    <Text className='text-3xl text-white font-bold'>
                        FREE
                    </Text>
                    :
                    <Text className='text-3xl text-white font-bold'>
                        £{price}
                    </Text>
            }

            <BookEventCheckoutModal
                modalVisible={checkoutModalVisible}
                setModalVisible={setCheckoutModalVisible}
                price={price}
                is_free={is_free}
                organizer_id={organizer_id}
                featured_event_id={featured_event_id}
                handleBookEvent={handleBookEvent}
                date={date}
                tickets_sold={tickets_sold}
            />
        </View>
    )
}

export default BookEvent