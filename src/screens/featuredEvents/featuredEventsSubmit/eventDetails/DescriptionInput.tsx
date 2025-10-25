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

interface DescriptionInputProps {
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
    description: string;
};
const DescriptionInput: React.FC<DescriptionInputProps> = ({
    description,
    setEventData
}) => {

    return (
        <View className='border my-6'>
            <Text className='font-semibold mt-3 px-5'>
                Description
                <Text className='text-red-400'> *  </Text>
            </Text>

            <TextInput
                multiline={true}
                value={description}
                placeholder="Enter your event's description"
                maxLength={1500}
                onChangeText={(value) => {
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        description: value
                    }))
                }}
                className='h-32 p-5 '
            />
        </View>
    )
}

export default DescriptionInput