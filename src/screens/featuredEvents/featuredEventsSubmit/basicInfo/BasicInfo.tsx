import { View, Text } from 'react-native'
import React, { useState } from 'react'
import TitleInput from './TitleInput'
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

    return (
        <View className='flex mx-4' >
            <View className={`mb-5`} >
                <Text className='text-2xl font-semibold '>
                    Basic info
                </Text>
            </View>
            <View className=' bg-gray-200 p-2 border border-gray-500'>
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
                repeatEvent={repeatEvent}
                setOpen={setOpen}
                setEventData={setEventData}
                setRepeatEvent={setRepeatEvent}
            />
        </View>
    )
}

export default BasicInfo