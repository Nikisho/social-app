import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useState } from 'react'
import TitleInput from './TitleInput'
import AddressInput from './AddressInput';
import DateTimeInput from './DateTimeInput';
import HideParticipants from './HideParticipants';


interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    end_datetime: Date;
    quantity: string | null;
    hide_participants?: boolean;

}

interface BasicInfoProps {
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
    eventData: EventDataProps
    repeatEvent: boolean,
    setRepeatEvent: (repeatEvent: boolean) => void;

};

const BasicInfo: React.FC<BasicInfoProps> = ({
    setEventData,
    eventData,
    repeatEvent,
    setRepeatEvent
}) => {
    const [open, setOpen] = useState(false);
    const deviceHeight = Dimensions.get('window').height;
    console.log('Location is: ', eventData?.location)
    return (
        <View
            className={` flex mx-4 ${deviceHeight < 650 && 'h-2/3'}`} >
            <View className={`mb-5`} >
                <Text className='text-2xl font-semibold '>
                    Basic info
                </Text>
            </View>
            <View className='mb-4 bg-gray-200 p-2 border border-gray-500'>
                <Text>
                    Give your event a title and hightlight details to let people know
                    what makes your event special.
                </Text>
            </View>


            <TitleInput
                setEventData={setEventData}
                title={eventData?.title}
            />
            <AddressInput
                setEventData={setEventData}
                address={eventData.location}
            />
            <DateTimeInput
                open={open}
                date={eventData.date}
                end_datetime={eventData.end_datetime}
                repeatEvent={repeatEvent}
                setOpen={setOpen}
                setEventData={setEventData}
                setRepeatEvent={setRepeatEvent}
            />
            <HideParticipants
                hide_participants={eventData.hide_participants!}
                setEventData={setEventData}
                />

        </View>
    )
}

export default BasicInfo