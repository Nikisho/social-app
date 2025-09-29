import { View, Text, TextInput, Switch, Platform } from 'react-native'
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

    const calculateRevenue = (price: string) => {
        const platformFeeRate = 0;
        const priceNum = Number(price);
        const stripeFee = priceNum * 0.015 + 0.2;
        const platformFee = priceNum * platformFeeRate;
        const revenue = priceNum - stripeFee - platformFee;
        return revenue.toFixed(2);
    };

    return (
        <>
            <View className='flex flex-row w-full justify-between  '>
                <View className={`${isFree ? 'opacity-30' : 'opacity-1'}`}>
                    <Text className='text-xl font-bold mx-2'>
                        Price
                    </Text>
                    <View className='border rounded-xl h-14 w-2/3 flex flex-row justify-center space-x-2 items-center px-3'>
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
                            className={`text-xl w-10 ${Platform.OS === 'ios' && 'pb-1'}`}
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
            <View className='flex-row my-4 items-center space-x-4 px-2 py-1 bg-amber-100 border border-amber-500 '>
                <Text className=''>You’ll receive the ticket price minus Stripe’s processing fee (1.5% + 20p). {price ? `Total per ticket: £${calculateRevenue(price)}` : ''}</Text>
            </View>
        </>

    )
}

export default PriceInput