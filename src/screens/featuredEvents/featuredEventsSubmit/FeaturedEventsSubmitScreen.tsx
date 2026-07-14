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
import styles from '../../../utils/styles/shadow';
import SchedulePost from './schedulePost/SchedulePost';
import NewPromoCodes from './promocode/NewPromoCodes';
import RefundPolicy from './refundPolicy/RefundPolicy';

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    end_datetime: Date;
    quantity: string | null;
    hide_participants?: boolean;
    userInterests?: {
        interestCode: number
        interestGroupCode: number
    }[],
    refund_policy_type_id: number | null;
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
        end_datetime: new Date((new Date()).setHours(17, 0, 0, 0)),
        userInterests: [],
        hide_participants: false,
        refund_policy_type_id: 1
    });
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [media, setMedia] = useState<ImagePickerAsset | null>(null);
    const currentUser = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const [repeatEvent, setRepeatEvent] = useState<boolean>(false);
    const [schedulePostDateTime, setSchedulePostDateTime] = useState<Date | null>(new Date());
    const [publishNow, setPublishNow] = useState<boolean>(true);
    const navigation = useNavigation<RootStackNavigationProp>();
    const [alertOnPurchase, setAlertOnPurchase] = useState<boolean>(false);
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
        if (eventData.date >= eventData.end_datetime) {
            platformAlert('The start date/time must be before the end date/time.');
            setLoading(false);

            return;
        }
        if (tickets.length === 0) {
            platformAlert('You need to add at least one ticket type');
            setLoading(false);
            return;
        }

        if (!eventData?.title?.trim()) {
            platformAlert('Please enter a title for your event.');
            setLoading(false);
            return;
        }

        if (!eventData.location?.trim()) {
            platformAlert('Please choose a location for your event.');
            setLoading(false);
            return;
        }

        if (!eventData.description?.trim()) {
            platformAlert('Please enter a description for your event.');
            setLoading(false);
            return;

        }

        if (media === null) {
            platformAlert('Please select a main image for your event.');
            setLoading(false);
            return;
        }

        if (eventData.userInterests?.length === 0) {
            platformAlert('Please select topics & interests for the event.');
            setLoading(false);
            return;
        }

        if (
            !eventData?.title?.trim() ||
            !eventData.description?.trim() ||
            !eventData.location?.trim() ||
            media === null
        ) {
            platformAlert('Please fill in all the fields')
            setLoading(false);
            return;
        }

        const organizer_id = await fetchOrganizerId(currentUser.id);
        const unique_file_identifier = uuidv4(9);
        const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/featured-events/${organizer_id}/${unique_file_identifier}.jpg`
        if (media) {
            await uploadEventMediaToStorageBucket(media.base64!, unique_file_identifier, organizer_id);
        }

        const handleSubmitPromoCodes = async (featured_event_id: number, organizer_id: number) => {
            const promoCodeInserts = promoCodes.map((p) => ({
                organizer_id: organizer_id,
                featured_event_id: featured_event_id,
                code: p.code,
                discount_type: 'percentage',
                discount_value: p.discount_value,
                quantity: p.quantity,
                active: p.active
            }));

            const { error } = await supabase.from('promo_codes').insert(promoCodeInserts);
            if (error) console.error(error.message);
        }

        const { error, data } = await supabase
            .from('featured_events')
            .insert({
                title: eventData?.title,
                description: eventData?.description,
                image_url: mediaUrl,
                location: eventData?.location,
                date: eventData?.date,
                time: extractTimeFromDateSubmit(eventData?.date),
                end_time: extractTimeFromDateSubmit(eventData?.end_datetime),
                end_date: eventData?.end_datetime,
                organizer_id: organizer_id,
                test: __DEV__ ? true : false,
                hide_participants: eventData?.hide_participants,
                email_on_ticket_purchase: alertOnPurchase ?? false,
                publish_at: publishNow ? null : schedulePostDateTime,
                refund_policy_type_id: eventData?.refund_policy_type_id ?? 1
            })
            .select('featured_event_id')
            .single()
        if (data) {
            createInterests(data.featured_event_id);

            handleSubmitTickets(data.featured_event_id, organizer_id);

            if (promoCodes.length > 0) {
                handleSubmitPromoCodes(data.featured_event_id, organizer_id);
            }

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
            />,
            <NewPromoCodes
                promoCodes={promoCodes}
                setPromoCodes={setPromoCodes}
            />,
            <RefundPolicy
                setEventData={setEventData}
                eventData={eventData}
            />,
            <SchedulePost
                setSchedulePostDateTime={setSchedulePostDateTime}
                schedulePostDateTime={schedulePostDateTime}
                publishNow={publishNow}
                setPublishNow={setPublishNow}
                alertOnPurchase={alertOnPurchase}
                setAlertOnPurchase={setAlertOnPurchase}
            />

        ]);

    if (loading) {
        return <LoadingScreen displayText='Loading...' />
    }

    return (

        <View className='flex-1'
        >
            <View>
                {step}
            </View>
            <View
                className={`absolute ${Platform.OS !== 'android' ? 'bottom-28' : 'bottom-20'} flex self-center w-full h-14 items-center justify-center `}>

                <View className='flex flex-row space-x-5 justify-between w-full px-5'>
                    {
                        !isFirstStep ?
                            <TouchableOpacity
                                style={styles.shadow}
                                className='bg-blue-500 rounded-lg w-1/3 p-3 justify-center'
                                onPress={back}>
                                <Text className='text-center text-white text-lg font-bold'>
                                    Go back
                                </Text>
                            </TouchableOpacity> :
                            <View>
                            </View>
                    }

                    <TouchableOpacity
                        style={styles.shadow}
                        className='bg-black rounded-lg p-3  w-1/3 '
                        onPress={isLastStep ? submitEvent : next}>
                        <Text className='text-white text-center text-lg font-bold'>
                            {isLastStep ? 'Publish' : 'Continue'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>

    )
}

export default FeaturedEventsSubmitScreen