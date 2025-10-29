import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker';
import formatDate from '../../../../utils/functions/formatDate';
import extractTimeFromDateSubmit from '../../../../utils/functions/extractTimeFromDateSubmit';
import AntDesign from '@expo/vector-icons/AntDesign';
import formatDateShortWeekday from '../../../../utils/functions/formatDateShortWeekday';
import platformAlert from '../../../../utils/functions/platformAlert';

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    end_datetime: Date;
    quantity: string | null;
    hide_participants?: boolean;
}

interface DateTimeInputProps {
    date: Date;
    end_datetime: Date;
    repeatEvent: boolean;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
    setRepeatEvent: (repeatEvent: boolean) => void;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
    date,
    end_datetime,
    repeatEvent,
    setEventData,
    setRepeatEvent
}) => {
    console.log(repeatEvent)
    const infoMessage = "If selected, this event will auto repost weekly";
    const [openEndDateTime, setOpenEndDateTime] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    console.log('Date is:' ,formatDateShortWeekday(end_datetime))
    return (
        <View className='border mb-3 px-5  space-y-4'>

            <Text className='font-semibold mt-2 '>
                Date and time
                <Text className='text-red-400'> *  </Text>
            </Text>

            <View className='flex flex-row space-x-4 my-2'>
                <TouchableOpacity
                    onPress={() => setRepeatEvent(false)}
                    className={`p-4 flex items-center ${!repeatEvent && 'text-blue-300'} `}
                    style={{
                        borderWidth: 0.3,
                        borderColor: repeatEvent ? '#000000' : 'blue',
                    }}
                >
                    <Text className={`font-semibold ${!repeatEvent && 'text-blue-500'}`}>
                        Single event
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => { setRepeatEvent(true); platformAlert(infoMessage) }}
                    className='p-4 flex items-center  '
                    style={{
                        borderWidth: 0.3,
                        borderColor: '#000000'
                    }}
                >
                    <Text className={`font-semibold ${repeatEvent && 'text-blue-500'}`}>
                        Recurring event
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setOpen(true)}
                // style={styles.translucidViewStyle}
                className='justify-between  flex items-center space-x-2 flex-row   mb-'>
                <View className=' flex flex-row space-x-2 items-center'>
                    <AntDesign name="calendar" size={23} color="black" />
                    <Text className='font-semibold'>Starts</Text>

                    <Text className='text-'>
                        {formatDateShortWeekday(date)}
                    </Text>
                </View>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="clockcircleo" size={24} color="black" />
                    <Text className='text-'>
                        {extractTimeFromDateSubmit(date)}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setOpenEndDateTime(true)}
                // style={styles.translucidViewStyle}
                className='justify-between  flex items-center space-x-2 flex-row   mb-3'>
                <View className=' flex flex-row space-x-2 items-center'>
                    <AntDesign name="calendar" size={23} color="black" />
                    <Text className='font-semibold'>Ends</Text>

                    <Text className='text-'>
                        {formatDateShortWeekday(end_datetime)}
                    </Text>
                </View>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="clockcircleo" size={24} color="black" />
                    <Text className='text-'>
                        {extractTimeFromDateSubmit(end_datetime)}
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
            <DatePicker
                modal
                open={openEndDateTime}
                date={end_datetime}
                onConfirm={(end_datetime: Date) => {
                    setOpenEndDateTime(false)
                    setEventData((prevData: EventDataProps) => ({
                        ...prevData,
                        end_datetime: end_datetime
                    }))
                }}
                onCancel={() => {
                    setOpenEndDateTime(false)
                }}
            />
        </View>
    )
}

export default DateTimeInput