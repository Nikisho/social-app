import { View, Text, Button, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import DatePicker from 'react-native-date-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';

interface eventDetailsProps {
    title: string;
    description: string;
    date: Date;
}
const SubmitScreen = () => {
    const currentUser = useSelector(selectCurrentUser);
    const [eventDetails, setEventDetails] = useState<eventDetailsProps>({
        date: new Date(),
        title: '',
        description: ''
    });
    const [open, setOpen] = useState(false)
    const handleChange = (name: string, value: string) => {
        setEventDetails((prevData: any | null) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (eventDetails.title === '' || eventDetails.description === '') {
            Alert.alert('You need a title or description for the event!')
            return;
        }
        const { error } = await supabase
            .from('meetup_events')
            .insert({
                user_id: currentUser.id,
                event_date: eventDetails.date,
                event_title:eventDetails.title,
                event_description: eventDetails.description
            });
        setEventDetails({
            date: new Date(),
            title: '',
            description: ''
        })
        if (error) console.error(error.message);
    }

    return (
        <View className='p-2 flex space-y-5  h-5/6'>
            <View className='border-b'>

                <TextInput className='text-2xl ' placeholder='Title'
                    value={eventDetails?.title}
                    onChangeText={value => handleChange('title', value)}
                />
            </View>
            <View className='h-1/3 border-b'>

                <TextInput multiline={true} className='text-lg' placeholder='Description'
                    value={eventDetails?.description}
                    onChangeText={value => handleChange('description', value)}
                />
            </View>
            <TouchableOpacity onPress={() => setOpen(true)}>
                <AntDesign name="calendar" size={34} color="black" />
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={eventDetails.date}
                onConfirm={(date: any) => {
                    setOpen(false)
                    handleChange('date', date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <View className='flex-grow justify-end flex items-center'>

            <TouchableOpacity className='bg-sky-600 py-2 px-3 rounded-full w-1/4 ' 
                onPress={handleSubmit}>
                <Text className='text-white font-bold text-lg text-center'>Submit</Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}

export default SubmitScreen