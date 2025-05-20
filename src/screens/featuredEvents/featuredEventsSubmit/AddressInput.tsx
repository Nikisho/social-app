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

interface AddressInputProps {
    address: string;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
}

const AddressInput: React.FC<AddressInputProps> = ({
    address,
    setEventData
}) => {
    return (
        <View>
            <Text className='text-xl font-bold m-2'>
                Address
            </Text>
            <TextInput
                value={address}
                placeholder='London, 123 Street'
                maxLength={60}
                onChangeText={(value) => {
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        location: value
                    }))
                }}
                className='border rounded-xl h-16 px-5'
            />
        </View>
    )
}

export default AddressInput