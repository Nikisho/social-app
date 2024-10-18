import { View, Text, TouchableOpacity, ToastAndroid, Platform, Alert, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { EditEventScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types'
import { supabase } from '../../../supabase'
import DatePicker from 'react-native-date-picker'
import styles from '../../utils/styles/shadow'
import formatDate from '../../utils/functions/formatDate'
import AntDesign from '@expo/vector-icons/AntDesign';
import _ from 'lodash';

interface EventDataProps {
    event_title: string;
    event_description: string;
    event_date: Date;
    event_time: string;
    amended: boolean
}

const EditEventScreen = () => {
    const route = useRoute<EditEventScreenRouteProp>()
    const { event_id } = route.params;
    const [eventData, setEventData] = useState<EventDataProps | null>(null);
    const initialEventDataRef = useRef(null);
    const [isEventDataAmended, setIsEventDataAmended] = useState(false);
    const navigation = useNavigation<RootStackNavigationProp>()
    const [open, setOpen] = useState(false);
    const fetchEventData = async () => {
        const { data, error } = await supabase
            .from('meetup_events')
            .select()
            .eq('event_id', event_id)
            .single()
        if (error) throw error.message;

        if (data) {
            setEventData({
                ...data,
                event_date: new Date(data.event_date),
            });
            initialEventDataRef.current = data;
        }
    }
    const handleChange = (name: string, value: string | Date) => {
        setEventData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const updateEventDetails = async () => {

        if (!isEventDataAmended) {
            return;
        }

        const { error } = await supabase
            .from('meetup_events')
            .update({
                event_title: eventData?.event_title,
                event_description: eventData?.event_description,
                event_date: eventData?.event_date,
                event_time: eventData?.event_time
            })
            .eq('event_id', event_id)

        if (error) console.error(error.message);
        fetchEventData();
        if (Platform.OS === 'android') {
            ToastAndroid.show('Event saved successfully!', ToastAndroid.SHORT);
        } else (
            Alert.alert('Event saved successfully!')
        )
    };

    const deleteEvent = async () => {
        const { error } = await supabase
            .from('meetup_events')
            .delete()
            .eq('event_id', event_id);

        if (error) console.error(error.message);
        if (Platform.OS === 'android') {
            ToastAndroid.show('Event deleted successfully!', ToastAndroid.SHORT);
        } else (
            Alert.alert('Event deleted successfully!')
        )
        navigation.navigate('home')
    };


    useEffect(() => {
        if (eventData && initialEventDataRef.current) {
            const isAmended = !_.isEqual(eventData, initialEventDataRef.current);
            setIsEventDataAmended(isAmended);
        }
    }, [eventData]);

    useEffect(() => {
        fetchEventData();
    }, []);

    return (
        <View className='p-2 px-3  '>
            <View className='mt-2 flex flex-row justify-between items-center'>
                <Text className='font-bold  '>
                    Edit your event
                </Text>
                <TouchableOpacity
                    onPress={updateEventDetails}
                    disabled={!isEventDataAmended}
                    style={styles.shadowButtonStyle}
                    className={`p-2 px-3 rounded-full ${!isEventDataAmended && 'opacity-40'}`}>
                    <Text className='font-bold text-white'>
                        Save changes
                    </Text>
                </TouchableOpacity>
            </View>
            <View >
                <Text className='mb-2'>
                    Title
                </Text>
                <TextInput className='text-xl p-2 border rounded-xl ' placeholder='Title'
                    value={eventData?.event_title}
                    multiline
                    onChangeText={value => handleChange('event_title', value)}
                    maxLength={50}
                />
            </View>
            <View className='mt-3 h-[54%]'>
                <Text className='mb-2'>
                    Description
                </Text>
                <TextInput className='text-lg border p-2 rounded-xl h-[90%]' placeholder='Title'
                    value={eventData?.event_description}
                    multiline
                    onChangeText={value => handleChange('event_description', value)}
                    maxLength={700}
                />
            </View>
            {
                eventData && eventData.event_date && (
                    <>
                        <Text className='mb-2'>
                            Date & Time
                        </Text>
                        <TouchableOpacity onPress={() => setOpen(true)}
                            style={styles.translucidViewStyle}
                            className='justify-between  flex items-center space-x-2 flex-row opacity-90 p-2 rounded-xl'>
                            <View className='flex flex-row space-x-2 items-center'>

                                <AntDesign name="calendar" size={34} color="black" />
                                <Text className='text-lg'>
                                    {formatDate(eventData?.event_date)}
                                </Text>
                            </View>
                            <View className='flex flex-row space-x-2 items-center'>

                                <AntDesign name="clockcircle" size={24} color="black" />
                                <Text className='text-lg'>
                                    {(eventData?.event_time).slice(0, -3)}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <DatePicker
                            modal
                            open={open}
                            date={eventData.event_date}
                            onConfirm={(date: Date = new Date) => {
                                setOpen(false)
                                handleChange('event_date', date)
                                handleChange('event_time', date.toTimeString().split(' ')[0])
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />
                    </>
                )
            }
            <View className='w-full flex items-center justify-center my-5 h-auto grow'>
                <TouchableOpacity
                    onPress={deleteEvent}
                    className='bg-red-500 py-3 rounded-xl w-full px-4'>
                    <Text className='text-white font-bold text-center'>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EditEventScreen