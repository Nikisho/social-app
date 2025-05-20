import { View, Text, TextInput, Switch } from 'react-native'
import React from 'react'

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
}
interface PriceInputProps {
    isFree: boolean;
    price: string;
    setIsFree: React.Dispatch<React.SetStateAction<boolean>>;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
}

const PriceInput: React.FC<PriceInputProps> = ({
    isFree,
    price,
    setIsFree,
    setEventData,
}) => {
    return (
        <View className='flex flex-row w-full justify-between  '>
            <View className={`${isFree ? 'opacity-30' : 'opacity-1'}`}>
                <Text className='text-xl font-bold m-2'>
                    Price
                </Text>
                <View className='border rounded-xl h-14 w-2/3 flex flex-row justify-center space-x-2 items-center px-5'>
                    <Text className='text-xl'>£</Text>
                    <TextInput
                        editable={!isFree}
                        value={price}
                        maxLength={6}
                        keyboardType='numeric'
                        onChangeText={(value) => {
                            setEventData((prevData: any) => ({
                                ...prevData,
                                price: value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                            }))
                        }}
                        className='w-1/3 text-xl pb-1'
                    />
                </View>
            </View>

            <View className='flex items-center justify-between'>
                <View className='rounded-xl'>
                    <Text className='text-xl font-bold m-2'>
                        Free event
                    </Text>
                </View>

                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    onValueChange={() => setIsFree(!isFree)}
                    value={isFree}
                />
            </View>
        </View>
    )
}

export default PriceInput