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
        <View>
            <Text className='text-xl font-bold m-2'>
                Description
            </Text>

            <TextInput
                multiline={true}
                value={description}
                placeholder="Enter your event's description"
                onChangeText={(value) => {
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        description: value
                    }))
                }}
                className='border rounded-xl h-32 p-5 '
            />
        </View>
    )
}

export default DescriptionInput