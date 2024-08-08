import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import convertDateFormat from '../utils/functions/convertDateFormat';
import styles from '../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import LikeHandler from './LikeHandler';
import { RootStackNavigationProp } from '../utils/types/types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface FeedCardProps {
    name: string;
    photo: string;
    title: string;
    description: string;
    date: string;
    time: string;
    event_id: number;
    user_id: number;
}

const FeedCard: React.FC<FeedCardProps> = ({
    name,
    title,
    description,
    date,
    photo,
    time,
    event_id,
    user_id,
}) => {
    const formattedDate = convertDateFormat(date);
    const timeSliced = time.slice(0, -3);
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                navigation.navigate('event', {
                    event_id: event_id,
                });
            }}
            // style={styles.shadow} 
            className='rounded-lg bg-gray-100 p-2 mb-3 space-y-1'>
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('profile',
                    { user_id: user_id }
                )}
                className='flex flex-row space-x-3 items-center'>

                {
                    photo === null ?
                        <>
                            <FontAwesome name="user-circle" size={24} color="black" />
                        </> :
                        <>
                            <Image
                                className='w-8 h-8 rounded-full'
                                source={{
                                    uri: photo,
                                }}
                            />
                        </>
                }
                <Text>
                    {name}
                </Text>
            </TouchableWithoutFeedback>
            <View className='mb-1 space-y-1'>
                <Text className='text-xl'>
                    {title}
                </Text>
                <Text className='whitespace-normal' numberOfLines={3}>
                    {description.replace(/(\r\n|\n|\r)/gm, "")}
                </Text>
            </View>

            <View className='space-x-3 flex flex-row items-center'>
                <View className='space-x-1 flex flex-row items-center '>
                    <AntDesign name="calendar" size={24} color="black" />
                    <Text className='font-semibold '> {formattedDate} </Text>
                </View>
                <View className='space-x-1 flex flex-row items-center '>
                    <AntDesign name="clockcircleo" size={24} color="black" />
                    <Text className='font-semibold '> {timeSliced} </Text>
                </View>
                <LikeHandler
                    user_id={currentUser.id}
                    event_id={event_id}
                />

            </View>
        </TouchableWithoutFeedback>
    )
}

export default FeedCard