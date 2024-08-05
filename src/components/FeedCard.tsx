import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import convertDateFormat from '../utils/functions/convertDateFormat';
import styles from '../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import hasUserLikedEvent from '../utils/functions/hasUserLikedEvent';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import { supabase } from '../../supabase';

interface FeedCardProps {
    name: string;
    photo: string;
    title: string;
    description: string;
    date: string;
    time: string;
    id: number;
}

const FeedCard: React.FC<FeedCardProps> = ({
    name,
    title,
    description, 
    date,
    photo,
    time,
    id,
}) => {
    const formattedDate = convertDateFormat(date);
    const timeSliced = time.slice(0, -3);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [hasUserLikedEventState, setHasUserLikedEventState] = useState<boolean>();

    const currentUser = useSelector(selectCurrentUser);
    const handleSubmitLike = async () => {
        const { error } = await supabase
            .from('event_likes')
            .insert({
                event_id: id,
                user_id: currentUser.id
            })
        setHasUserLikedEventState(true);
        if (error) console.error(error.message);
    };

    const handleUnlike = async () => {
        const { error } = await supabase
        .from('event_likes')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('event_id', id )

        setHasUserLikedEventState(false);
        if (error) console.error(error.message);
    };
    const likeEventCheck = async () => {
        const check = await hasUserLikedEvent(currentUser.id, id);
        setHasUserLikedEventState(check);
    };

    useEffect(() => {
        likeEventCheck();
    }, []);

    return (
        <TouchableOpacity
            onPress={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate('event', {
                    event_id: id,
                });
            }}
            style={styles.shadow} className='rounded-lg bg-white p-2 mb-3 space-y-1'>
            <View className='flex flex-row space-x-3 items-center'>

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
            </View>
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
                {
                    hasUserLikedEventState ?
                        <TouchableOpacity 
                            onPress={handleUnlike}
                            className='self-center '>
                            <Ionicons name="heart" size={25} color="red" />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity 
                            onPress={handleSubmitLike}
                            className='self-center '>
                            <Ionicons name="heart-outline" size={25} color="black" />
                        </TouchableOpacity>
                }

            </View>
        </TouchableOpacity>
    )
}

export default FeedCard