import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import DoneKeyboardCloseButton from '../../../../components/DoneKeyboardCloseButton';

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
    end_datetime: Date;
}

interface DescriptionInputProps {
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
    description: string;
};
const DescriptionInput: React.FC<DescriptionInputProps> = ({
    description,
    setEventData
}) => {
    const inputAccessoryViewID = 'eventDescriptionID'
    return (

        <View className
            ='border my-6'
        >
            <Text className='font-semibold mt-3 px-5'>
                Description
                <Text className='text-red-400'>* </Text>
            </Text>

            <TextInput
                multiline={true}
                value={description}
                inputAccessoryViewID={inputAccessoryViewID}
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
            <DoneKeyboardCloseButton
                inputAccessoryViewID={inputAccessoryViewID}
            />
        </View>

    )
}

export default DescriptionInput