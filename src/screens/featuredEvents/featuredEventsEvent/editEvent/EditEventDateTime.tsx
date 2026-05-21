import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import formatDateShortWeekday from '../../../../utils/functions/formatDateShortWeekday'
import DatePicker from 'react-native-date-picker'
import AntDesign from '@expo/vector-icons/AntDesign'
import { EventDataProps } from '../../../../utils/types/types'

interface EditEventDateTimeProps {
    eventData: {
        date: Date;
        time: string
        end_date: Date;
        end_time: string;
    }
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps | null>>;
}

const EditEventDateTime = ({
    eventData,
    setEventData
}: EditEventDateTimeProps) => {

    const { date, time, end_date, end_time } = eventData;
    const [open, setOpen] = useState(false);
    const [openEndDateTime, setOpenEndDateTime] = useState(false);

    return (
        <View
            style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                marginVertical: 10,
                paddingVertical: 10
            }}
        >
            <Text className='font-semibold mt-2 px-5 my-4'>

                Date and time
            </Text>

            <View className='mx-2 mr-5'>

                <TouchableOpacity onPress={() => setOpen(true)}
                    className='justify-between  flex items-center space-x-2 flex-row  mb-3'>
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
                            {time.slice(0, 5)}
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
                            {formatDateShortWeekday(end_date)}
                        </Text>
                    </View>
                    <View className='flex flex-row space-x-2 items-center'>

                        <AntDesign name="clockcircleo" size={24} color="black" />
                        <Text className='text-'>
                            {end_time.slice(0, 5)}
                        </Text>
                    </View>
                </TouchableOpacity>


                <DatePicker
                    modal
                    open={open}
                    date={new Date(`${date}T${time}`)}
                    onConfirm={(date: Date) => {
                        setOpen(false)

                        const dateString = date.toISOString().split("T")[0]
                        const timeString = date.toTimeString().slice(0, 5)

                        setEventData((prevData: any) => ({
                            ...prevData,
                            date: dateString,
                            time: timeString // Store only the time part
                        }))
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />

                <DatePicker
                    modal
                    open={openEndDateTime}
                    date={new Date(`${end_date}T${end_time}`)}
                    onConfirm={(end_datetime: Date) => {
                        setOpenEndDateTime(false)
                        const endDateString = end_datetime.toISOString().split("T")[0]
                        const endTimeString = end_datetime.toTimeString().slice(0, 5)
                        setEventData((prevData: any) => ({
                            ...prevData,
                            end_date: endDateString,
                            end_time: endTimeString
                        }))
                    }}
                    onCancel={() => {
                        setOpenEndDateTime(false)
                    }}
                />
            </View>

        </View>
    )
}

export default EditEventDateTime