import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import DatePicker from 'react-native-date-picker';
import formatDate from '../../../utils/functions/formatDate';
import extractTimeFromDateSubmit from '../../../utils/functions/extractTimeFromDateSubmit';
import AntDesign from '@expo/vector-icons/AntDesign';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
}

interface DateTimeInputProps {
    open: boolean;
    date: Date;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
    open,
    date,
    setOpen,
    setEventData
}) => {
    return (
        <>
            <Text className='text-xl pt-4 font-bold m-2'>
                Date & Time
            </Text>
            <TouchableOpacity onPress={() => setOpen(true)}
                // style={styles.translucidViewStyle}
                className='justify-between border flex items-center space-x-2 flex-row p-2 rounded-xl mb-3'>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="calendar" size={34} color="black" />
                    <Text className='text-lg'>
                        {formatDateShortWeekday(date)}
                    </Text>
                </View>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="clockcircle" size={24} color="black" />
                    <Text className='text-lg'>
                        {extractTimeFromDateSubmit(date)}
                    </Text>
                </View>
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date: Date) => {
                    setOpen(false)
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        date: date
                    }))
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default DateTimeInput