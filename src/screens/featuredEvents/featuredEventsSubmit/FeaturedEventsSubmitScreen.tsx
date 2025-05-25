import { View, Text, TouchableOpacity, ScrollView, Switch, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import SecondaryHeader from '../../../components/SecondaryHeader'
import { TextInput } from 'react-native-gesture-handler';
import { ImagePickerAsset } from 'expo-image-picker';
import MediaPicker from './MediaPicker';
import { supabase } from '../../../../supabase';
import { decode } from 'base64-arraybuffer';
import { uuidv4 } from '../../../utils/functions/uuidv4';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../context/navSlice';
import LoadingScreen from '../../loading/LoadingScreen';
import formatDate from '../../../utils/functions/formatDate';
import extractTimeFromDateSubmit from '../../../utils/functions/extractTimeFromDateSubmit';
import AntDesign from '@expo/vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';
import platformAlert from '../../../utils/functions/platformAlert';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import TitleInput from './TitleInput';
import DescriptionInput from './DescriptionInput';
import PriceInput from './PriceInput';
import Quantity from './Quantity';
import AddressInput from './AddressInput';
import DateTimeInput from './DateTimeInput';


interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;

}
const FeaturedEventsSubmitScreen = () => {
    const [eventData, setEventData] = useState<EventDataProps>({
        title: '',
        description: '',
        price: '',
        location: '',
        quantity: null,
        date: new Date((new Date()).setHours(12, 0, 0, 0))
    });

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
        const organizer_id = await fetchOrganizerId();
        const unique_file_identifier = uuidv4(9);
        const mediaUrl = `https://wffeinvprpdyobervinr.supabase.co/storage/v1/object/public/featured-events/${organizer_id}/${unique_file_identifier}.jpg`
        if (media) {
            await uploadEventMediaToStorageBucket(media.base64!, unique_file_identifier, organizer_id);
        }
        const { error } = await supabase
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
                max_tickets: eventData?.quantity
            })
        if (error) {
            console.error(error.message)
        }
        setLoading(false);
        navigation.navigate('featuredEvents');
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
            <View className='p-3'>
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