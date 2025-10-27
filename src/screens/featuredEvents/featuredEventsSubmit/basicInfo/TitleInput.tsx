import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native'
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

const TitleInput: React.FC<TitleInputProps> = ({
    setEventData,
    title,
}) => {
    return (
        <View className='border my-6'>
            <Text className='font-semibold mt-3 px-5'>
                Event Title
                <Text className='text-red-400'> *  </Text>
            </Text>
            <TextInput
                value={title}
                placeholder='Add a title for your event'
                maxLength={60}
                returnKeyType='done'
                onChangeText={(value) => {
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        title: value
                    }))
                }}
                className=' h-10 px-5'
            />
        </View>
    )
}

export default TitleInput