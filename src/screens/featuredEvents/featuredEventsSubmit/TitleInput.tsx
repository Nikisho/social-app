import { View, Text, TextInput } from 'react-native'
import React from 'react'

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;

}

interface TitleInputProps {
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
    title: string;
};

const TitleInput:React.FC<TitleInputProps> = ({
    setEventData,
    title,
}) => {
    return (
        <View>
            <Text className='text-xl font-bold m-2'>
                Title
            </Text>

            <TextInput
                value={title}
                placeholder='Add a title for your event'
                maxLength={40}
                onChangeText={(value) => {
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        title: value
                    }))
                }}
                className='border rounded-xl h-16 px-5'
            />
        </View>
    )
}

export default TitleInput