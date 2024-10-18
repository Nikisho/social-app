import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import formatDate from '../../utils/functions/formatDate';
import extractTimeFromDate from '../../utils/functions/extractTimeFromDate';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import SubmitScreenHeader from './SubmitScreenHeader';

interface eventDetailsProps {
    title: string;
    description: string;
    date: Date;
}
const SubmitScreen = () => {
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>()
    const [eventDetails, setEventDetails] = useState<eventDetailsProps>({
        date: new Date(),
        title: '',
        description: ''
    });
    const [open, setOpen] = useState(false)
    const handleChange = (name: string, value: string | Date) => {
        setEventDetails((prevData: eventDetailsProps) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (eventDetails.title === '' || eventDetails.description === '') {
            Alert.alert('Please, enter a title and description.')
            return;
        }
        const { error } = await supabase
            .from('meetup_events')
            .insert({
                user_id: currentUser.id,
                event_date: eventDetails.date,
                event_title: eventDetails.title,
                event_description: eventDetails.description,
                event_time: extractTimeFromDate(eventDetails.date)
            });
        setEventDetails({
            date: new Date(),
            title: '',
            description: ''
        });
        navigation.navigate('home');

        if (error) console.error(error.message);
    };

    return (
        <View className='flex space-y-2 mx-3 '>
            <SubmitScreenHeader/>
            <View >
                <TextInput className='text-2xl bg-white p-4 rounded-xl ' placeholder='Title'
                    value={eventDetails?.title}
                    style={styles.shadow}
                    onChangeText={value => handleChange('title', value)}
                    maxLength={50}
                />
            </View>
            <View className='h-1/3 bg-white p-4 rounded-xl mb-1'
                style={styles.shadow}

            >
                <TextInput multiline={true} className='text-lg' placeholder='Description'
                    value={eventDetails?.description}
                    maxLength={700}
                    onChangeText={value => handleChange('description', value)}
                />
            </View>
            <TouchableOpacity onPress={() => setOpen(true)}
                style={styles.translucidViewStyle}
                className='justify-between flex items-center space-x-2 flex-row opacity-90 p-2 rounded-xl'>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="calendar" size={34} color="black" />
                    <Text className='text-lg'>
                        {formatDate(eventDetails.date)}
                    </Text>
                </View>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="clockcircle" size={24} color="black" />
                    <Text className='text-lg'>
                        {extractTimeFromDate(eventDetails.date)}
                    </Text>
                </View>
            </TouchableOpacity>
            <DatePicker
                modal
                open={open}
                date={eventDetails.date}
                onConfirm={(date: Date) => {
                    setOpen(false)
                    handleChange('date', date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
            <View className='justify-end h-1/4 flex grow items-end '>
                <TouchableOpacity
                    style={styles.shadowButtonStyle}
                    className='bg-sky-600 py-3 px-3 rounded-xl w-full '
                    onPress={handleSubmit}>
                    <Text className='text-white font-bold text-lg text-center'>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SubmitScreen