import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import SecondaryHeader from '../../../../components/SecondaryHeader'
import MediaPicker from './MediaPicker'
import * as ImagePicker from 'expo-image-picker';
import DescriptionInput from './DescriptionInput';
import InterestsInput from './InterestsInput';

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
    end_datetime: Date;
}

interface EventDetailsProps {
    setMedia: (media: ImagePicker.ImagePickerAsset) => void;
    media: any,
    eventData: EventDataProps,
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
    userInterests?: {
        interestCode: number
        interestGroupCode: number
    }[]
}

const EventDetails: React.FC<EventDetailsProps> = ({
    setEventData,
    eventData,
    setMedia,
    media,
    userInterests
}) => {
    const deviceHeight = Dimensions.get('window').height;

    return (
        <ScrollView className={`flex mx-4 ${deviceHeight < 650 && 'h-2/3'}`}
            contentContainerStyle={{
                paddingBottom: 350
            }}
        >
            <View className={`mb-5`} >
                <Text className='text-2xl font-semibold '>
                    Event details
                </Text>
            </View>
            <Text className='text-lg font-semibold'>
                Main Event Image
            </Text>
            <View className=' bg-gray-200 p-2 mt-2 border border-gray-500'>
                <Text>
                    This is the image attendees will see at the top of your listing.
                </Text>
            </View>
            <MediaPicker
                setMedia={setMedia}
                media={media}
            />
            <DescriptionInput
                setEventData={setEventData}
                description={eventData?.description}
            />

            <InterestsInput
                userInterests={userInterests}
                setEventData={setEventData}
            />
        </ScrollView>
    )
}

export default EventDetails