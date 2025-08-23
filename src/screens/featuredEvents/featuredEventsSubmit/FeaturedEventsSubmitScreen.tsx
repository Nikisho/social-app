import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader'
import { ImagePickerAsset } from 'expo-image-picker';
import MediaPicker from './MediaPicker';
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
import TitleInput from './TitleInput';
import DescriptionInput from './DescriptionInput';
import PriceInput from './PriceInput';
import Quantity from './Quantity';
import AddressInput from './AddressInput';
import DateTimeInput from './DateTimeInput';
import InterestsInput from './InterestsInput';


interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
    userInterests?: {
        interestCode: number
        interestGroupCode:number
    }[]

}
const FeaturedEventsSubmitScreen = () => {
    const [eventData, setEventData] = useState<EventDataProps>({
        title: '',
        description: '',
        price: '',
        location: '',
        quantity: null,
        date: new Date((new Date()).setHours(12, 0, 0, 0)),
        userInterests: []
    });

    console.log(eventData);

    const [media, setMedia] = useState<ImagePickerAsset | null>(null);
    const currentUser = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const [isFree, setIsFree] = useState<boolean>(false)
    const [open, setOpen] = useState(false);

    const navigation = useNavigation<RootStackNavigationProp>();

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


    const fetchOrganizerId = async () => {
        const { error, data } = await supabase
            .from('organizers')
            .select('organizer_id')
            .eq('user_id', currentUser.id)
            .single()
        if (error) console.error(error.message);
        if (data) {
            return data.organizer_id;
        }
    }
    console.log(eventData.userInterests);
    
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


    const submitEvent = async () => {
        setLoading(true);
        if (
            !eventData?.title?.trim() ||
            !eventData.description?.trim() ||
            (!isFree && !eventData.price?.trim()) ||
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
        const organizer_id = await fetchOrganizerId();
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
                price: isFree ? '0' : eventData?.price,
                location: eventData?.location,
                date: eventData?.date,
                time: extractTimeFromDateSubmit(eventData?.date),
                organizer_id: organizer_id,
                is_free: isFree,
                max_tickets: eventData?.quantity,
                chat_room_id: chatRoomData?.chat_room_id,
                test: __DEV__ ? true : false
            })
            .select('featured_event_id')
            .single()
        if (data) {
            createInterests(data.featured_event_id)
        }
        if (error) {
            console.error(error.message)
        }
        setLoading(false);
        navigation.navigate('featuredEvents', {
            
        });
    }
    if (loading) {
        return <LoadingScreen displayText='Loading...' />
    }

    return (

        <KeyboardAvoidingView className=''
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // keyboardVerticalOffset={Platform.OS === 'ios' ?  47 : 0}
            style={{ flex: 1 }}
        >
            <View className=''>
                <SecondaryHeader
                    displayText='Create an event'
                />
            </View>
            <ScrollView className='px-3 '
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <MediaPicker
                    setMedia={setMedia}
                    media={media}
                />
                <TitleInput
                    setEventData={setEventData}
                    title={eventData?.title}
                />
                <DescriptionInput
                    setEventData={setEventData}
                    description={eventData?.description}
                />
                <PriceInput
                    isFree={isFree}
                    price={eventData?.price}
                    setEventData={setEventData}
                    setIsFree={setIsFree}
                />
                <Quantity
                    quantity={eventData?.quantity!}
                    setEventData={setEventData}
                />
                <DateTimeInput
                    open={open}
                    date={eventData.date}
                    setOpen={setOpen}
                    setEventData={setEventData}
                />
                <AddressInput
                    address={eventData?.location}
                    setEventData={setEventData}
                />
                <InterestsInput
                    setEventData={setEventData}
                    userInterests={eventData.userInterests}
                />
                <TouchableOpacity
                    onPress={() => submitEvent()}
                    className='bg-black w-1/3 mt-5 rounded-full self-center p-3'>
                    <Text className='text-white text-xl text-center font-bold'>
                        Submit
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>

    )
}

export default FeaturedEventsSubmitScreen