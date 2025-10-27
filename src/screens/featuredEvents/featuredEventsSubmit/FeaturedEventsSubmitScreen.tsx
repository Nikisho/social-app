import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader'
import { ImagePickerAsset } from 'expo-image-picker';
import MediaPicker from './eventDetails/MediaPicker';
import { supabase } from '../../../../supabase';
import { decode } from 'base64-arraybuffer';
import { uuidv4 } from '../../../utils/functions/uuidv4';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import LoadingScreen from '../../loading/LoadingScreen';
import extractTimeFromDateSubmit from '../../../utils/functions/extractTimeFromDateSubmit';
import platformAlert from '../../../utils/functions/platformAlert';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import fetchOrganizerId from '../../../utils/functions/fetchOrganizerId';
import { useMultistepForm } from '../../../hooks/useMultistepForm';
import BasicInfo from './basicInfo/BasicInfo';
import EventDetails from './eventDetails/EventDetails';
import TicketTypesList from './newTickets/TicketTypesList';
import { useKeyboardListener } from '../../../hooks/useKeyboardListener';

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
    hide_participants?: boolean;
    userInterests?: {
        interestCode: number
        interestGroupCode: number
    }[]
};

type TicketProps = {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    sales_start: Date;
    sales_end: Date;
    is_free: boolean;
    id: number;
}

const FeaturedEventsSubmitScreen = () => {
    const [eventData, setEventData] = useState<EventDataProps>({
        title: '',
        description: '',
        price: '',
        location: '',
        quantity: null,
        date: new Date((new Date()).setHours(12, 0, 0, 0)),
        userInterests: [],
        hide_participants: false
    });
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [media, setMedia] = useState<ImagePickerAsset | null>(null);
    const currentUser = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const [repeatEvent, setRepeatEvent] = useState<boolean>(false);

    const navigation = useNavigation<RootStackNavigationProp>();

    const isKeyboardVisible = useKeyboardListener();

    console.log('The keyboard is up :', isKeyboardVisible)
    const uploadEventMediaToStorageBucket = async (file: string, unique_file_identifier: string, organizer_id: number) => {
        const arrayBuffer = decode(file);
        try {
            const { error } = await supabase
                .storage
                .from('featured-events')
                .upload(`${organizer_id}/${unique_file_identifier}.jpg`, arrayBuffer, {
                    contentType: 'image/png',
                    upsert: true,
                });
            if (error) {
                console.error('Upload error:', error.message);
            }
        } catch (error) {
            console.error('Conversion or upload error:', error);
        }
    };


    const createInterests = async (featured_event_id: number) => {
        const userInterestsData = eventData?.userInterests!.map((interest) => ({
            featured_event_id: featured_event_id,
            interest_code: interest.interestCode,
            interest_group_code: interest.interestGroupCode,
        }));
        const { error } = await supabase
            .from('featured_event_interests')
            .insert(userInterestsData)
        if (error) { console.error(error.message) }
    };

    const handleScheduleEvent = async (featured_event_id: number) => {
        const { data, error } = await supabase
            .from('recurring_series')
            .insert({
                featured_event_id: featured_event_id,
                day_of_week: eventData.date.getDay()
            })
            .select('series_id')
            .single()

        if (data) {
            const { error: errorInsertSeriesId } = await supabase
                .from('featured_events')
                .update({
                    series_id: data.series_id
                })
                .eq('featured_event_id', featured_event_id)
            if (errorInsertSeriesId) {
                console.error(errorInsertSeriesId.message)
            }
        }
        if (error) {
            console.error('Error inserting into series :', error.message)
        }
    }

    const handleSubmitTickets = async (featured_event_id: number, organizer_id: number) => {
        const ticketInserts = tickets.map((t) => ({
            featured_event_id: featured_event_id,
            organizer_id: organizer_id,
            name: t.name,
            description: t.description,
            is_free: t.is_free,
            price: t.is_free ? '0' : t.price,
            quantity: t.quantity,
            sales_start: t.sales_start,
            sales_end: t.sales_end
        }));

        const { error } = await supabase.from('ticket_types').insert(ticketInserts);
        if (error) console.error(error.message);
    }

    const submitEvent = async () => {
        setLoading(true);
        if (tickets.length === 0) {
            platformAlert('You need to add at least one ticket type');
            setLoading(false)
            return;
        }
        if (
            !eventData?.title?.trim() ||
            !eventData.description?.trim() ||
            // (!isFree && !eventData.price?.trim()) ||
            !eventData.location?.trim() ||
            media === null
        ) {
            platformAlert('Please fill in all the fields')
            setLoading(false);
            return;
        }


        if (eventData.userInterests?.length === 0) {
            platformAlert('Please select topics & interests for the event.');
            setLoading(false);
            return;
        }
        const organizer_id = await fetchOrganizerId(currentUser.id);
        const unique_file_identifier = uuidv4(9);
        const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/featured-events/${organizer_id}/${unique_file_identifier}.jpg`
        if (media) {
            await uploadEventMediaToStorageBucket(media.base64!, unique_file_identifier, organizer_id);
        }

        const { data: chatRoomData, error: chatRoomError } = await supabase
            .from('chat_rooms')
            .insert({
                type: 'group'
            })
            .select('chat_room_id')
            .single();

        if (chatRoomError) throw chatRoomError.message

        const { error: participantError } = await supabase
            .from('participants')
            .insert({
                chat_room_id: chatRoomData.chat_room_id,
                user_id: currentUser.id
            })
        if (participantError) throw participantError.message;

        const { error, data } = await supabase
            .from('featured_events')
            .insert({
                title: eventData?.title,
                description: eventData?.description,
                image_url: mediaUrl,
                location: eventData?.location,
                date: eventData?.date,
                time: extractTimeFromDateSubmit(eventData?.date),
                organizer_id: organizer_id,
                max_tickets: eventData?.quantity,
                chat_room_id: chatRoomData?.chat_room_id,
                test: __DEV__ ? true : false,
                hide_participants: eventData?.hide_participants
            })
            .select('featured_event_id')
            .single()
        if (data) {
            createInterests(data.featured_event_id);

            handleSubmitTickets(data.featured_event_id, organizer_id);
            if (repeatEvent) {
                handleScheduleEvent(data.featured_event_id);
            }
        }
        if (error) {
            console.error(error.message)
        }
        setLoading(false);
        navigation.navigate('dashboard');
    }

    const {
        steps,
        currentStepIndex,
        step,
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultistepForm(
        [
            <BasicInfo
                setEventData={setEventData}
                eventData={eventData}
                repeatEvent={repeatEvent}
                setRepeatEvent={setRepeatEvent}
            />,
            <EventDetails
                setMedia={setMedia}
                media={media}
                setEventData={setEventData}
                eventData={eventData}
                userInterests={eventData.userInterests}
            />,
            <TicketTypesList
                tickets={tickets}
                setTickets={setTickets}
            />

        ]);

    if (loading) {
        return <LoadingScreen displayText='Loading...' />
    }

    return (

        <KeyboardAvoidingView className=''
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // keyboardVerticalOffset={Platform.OS === 'ios' ?  47 : 0}
            style={{ flex: 1 }}
        >
            <View>
                {step}
            </View>

            {
                (Platform.OS === 'android' && !isKeyboardVisible) &&
                <View
                    className={`absolute ${Platform.OS !== 'android' ? 'bottom-28' : 'bottom-20'} flex self-center w-full h-14 items-center justify-center `}>

                    <View className='flex flex-row space-x-5 justify-between w-full px-5'>
                        {
                            !isFirstStep ?
                                <TouchableOpacity
                                    className='bg-blue-100 border-2 border-blue-600 w-32 px-4 justify-center'
                                    onPress={back}>
                                    <Text className='text-center text-lg font-bold'>
                                        Go back
                                    </Text>
                                </TouchableOpacity> :
                                <View>

                                </View>
                        }

                        <TouchableOpacity
                            className='bg-black p-4 w-32  '
                            onPress={isLastStep ? submitEvent : next}>
                            <Text className='text-white text-center text-lg font-bold'>
                                {isLastStep ? 'Publish' : 'Continue'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            }
        </KeyboardAvoidingView>

    )
}

export default FeaturedEventsSubmitScreen