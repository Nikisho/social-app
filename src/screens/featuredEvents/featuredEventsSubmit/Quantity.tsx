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

interface QuantityProps {
    quantity: string;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
}
const Quantity:React.FC<QuantityProps> = ({
    quantity,
    setEventData
}) => {
    return (
        <View>
            <Text className='text-xl font-bold m-2'>
                Quantity
            </Text>
            <View className='border rounded-xl h-14 w-1/3 flex flex-row justify-center space-x-2 items-center px-5'>
                <TextInput
                    value={quantity!}
                    maxLength={3}
                    keyboardType='numeric'
                    onChangeText={(value) => {
                        setEventData((prevData: EventDataProps) => ({
                            ...prevData,
                            quantity: value.replace(/[^0-9]/g, '')
                        }))
                    }}
                    className='w-1/3 text-xl pb-1'
                />
            </View>
        </View>
    )
}

export default Quantity