import { View, Text, TouchableOpacity, TextInput, Keyboard, Switch } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-date-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../supabase';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import formatDate from '../../utils/functions/formatDate';
import styles from '../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import SubmitScreenHeader from './SubmitScreenHeader';
import Entypo from '@expo/vector-icons/Entypo';
import platformAlert from '../../utils/functions/platformAlert';
import ChooseEventLocationModal from '../../components/ChooseEventLocationModal';
import extractTimeFromDateSubmit from '../../utils/functions/extractTimeFromDateSubmit';

interface eventDetailsProps {
    title: string;
    description: string;
    date: Date;
}

interface HubProps {
    hub_name: string;
    hub_code: number;
}

const SubmitScreen = () => {
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>()
    const [eventDetails, setEventDetails] = useState<eventDetailsProps>({
        date: new Date(),
        title: '',
        description: ''
    });
    const [isWomenOnly, setIsWomenOnly] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [chooseEventLocationModalVisible, setChooseEventLocationModalVisible] = useState<boolean>(false);
    const [selectedHub, setSelectedHub] = useState<HubProps | null>(null);
    const handleChange = (name: string, value: string | Date) => {
        setEventDetails((prevData: eventDetailsProps) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (eventDetails.title === '' || eventDetails.description === '' || selectedHub === null) {
            platformAlert('Please, enter a title, description and select a hub.')
            return;
        }
        const { error } = await supabase
            .from('meetup_events')
            .insert({
                user_id: currentUser.id,
                event_date: eventDetails.date,
                event_title: eventDetails.title,
                event_description: eventDetails.description,
                event_time: extractTimeFromDateSubmit(eventDetails.date),
                event_type: isWomenOnly? 'women-only' : 'general',
                hub_code: selectedHub?.hub_code
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
            <SubmitScreenHeader />
            <View >
                <TextInput className='text-2xl bg-white p-4 rounded-xl ' placeholder='Title'
                    value={eventDetails?.title}
                    style={styles.shadow}
                    onChangeText={value => handleChange('title', value)}
                    maxLength={50}
                />
            </View>
            <View className='h-1/3 bg-white p-4 rounded-xl mb-5 flex'
                style={styles.shadow}
            >
                <View className='h-[85%]'>
                    <TextInput multiline={true} className='text-lg' placeholder='Description'
                        value={eventDetails?.description}
                        maxLength={700}
                        onChangeText={value => handleChange('description', value)}
                    />
                </View>

                <TouchableOpacity
                    style={styles.shadowButtonStyle}
                    onPress={Keyboard.dismiss}
                    className='self-end p-2 rounded-lg'>
                    <Text className='text-white'>
                        OK
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setOpen(true)}
                style={styles.translucidViewStyle}
                className='justify-between flex items-center space-x-2 flex-row p-2 rounded-xl mb-3'>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="calendar" size={34} color="black" />
                    <Text className='text-lg'>
                        {formatDate(eventDetails.date)}
                    </Text>
                </View>
                <View className='flex flex-row space-x-2 items-center'>

                    <AntDesign name="clockcircle" size={24} color="black" />
                    <Text className='text-lg'>
                        {extractTimeFromDateSubmit(eventDetails.date)}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setChooseEventLocationModalVisible(!chooseEventLocationModalVisible)}
                className='mb-3 p-3 bg-white rounded-xl flex flex-row items-center space-x-3 '
                style={styles.translucidViewStyle}
            >
                <Entypo name="location-pin" size={24} color="black" />
                <Text className='text-lg'>{selectedHub ? selectedHub.hub_name : 'Choose a hub'}</Text>
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
            <ChooseEventLocationModal
                setModalVisible={setChooseEventLocationModalVisible}
                modalVisible={chooseEventLocationModalVisible}
                setSelectedHub={setSelectedHub}
            />
            {
                currentUser.sex === 2 && (

                    <View className='flex flex-row  justify-between'>
                        <View className='p-2 bg-red-100 rounded-xl'>
                            <Text className='text-lg '>
                                Women Only
                            </Text>
                        </View>

                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            onValueChange={() => setIsWomenOnly(!isWomenOnly)}
                            value={isWomenOnly}
                        />
                    </View>
                )
            }

            <View className='justify-center h-1/6 flex grow items-end '>
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