import { View, Text, Image, TouchableOpacity, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackNavigationProp } from '../../../utils/types/types';
import formatDateShortWeekday from '../../../utils/functions/formatDateShortWeekday';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import styles from '../../../utils/styles/shadow';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface ChatHeaderProps {
    title: string;
    image_url: string;
    featured_event_id: number;
    date: string;
    time: string;
    chat_room_id:number;
    // blockAndReportUser: () => void;
}

const GroupChatHeader: React.FC<ChatHeaderProps> = ({
    title,
    image_url,
    featured_event_id,
    date,
    time,
    chat_room_id
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const blurb_message = `Use this group to coordinate arrivals, ask questions, and meet people attending!`;
    const fadeAnim = useRef(new Animated.Value(0)).current; // start invisible

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500, // half a second fade in
            useNativeDriver: true,
        }).start();
    }, []);
    return (
        <>
            <View className='flex flex-row justify-between items-center bg-gray-200'>

                <View
                    // style={{backgroundColor: colours.secondaryColour}}
                    className='p-2 py-3 flex flex-row space-x-3 items-center'>
                    <TouchableOpacity className='mr-1' onPress={() => { navigation.goBack() }}>
                        <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
                    </TouchableOpacity>


                    <TouchableOpacity
                        className='flex flex-row space-x-3'
                        onPress={() => navigation.navigate('featuredeventsevent', {
                            featured_event_id: featured_event_id
                        })}
                    >

                        {
                            image_url === null ?
                                <>
                                    <FontAwesome name="user-circle" size={40} color="black" />
                                </> :
                                <View>

                                    <Image
                                        className='w-24 h-24 rounded-lg'
                                        source={{
                                            uri: image_url,
                                        }}
                                    />
                                </View>
                        }

                        <View className='space-y-2'>
                            <Text
                                numberOfLines={1} style={{ width: 300 }}
                                className='text-black text-lg'>
                                {title}
                            </Text>
                            <Text
                                numberOfLines={1} style={{ width: 300 }}
                                className='text-black text-'>
                                {
                                    date && time && (formatDateShortWeekday(date) + ', ' + (time).slice(0, -3))
                                }
                            </Text>

                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('attendeelist', {
                                        featured_event_id: featured_event_id,
                                        chat_room_id: chat_room_id
                                    })
                                }}
                                style={styles.shadow}
                                className='flex flex-row justify-center bg-white items-center space-x-2  rounded-full w-2/3 p-1 px-2'>
                                <MaterialIcons name="groups" size={24} color="black" />
                                <Text className='text- font-semibold'>View participants</Text>
                            </TouchableOpacity>
                        </View>

                    </TouchableOpacity>

                </View>

                {/* <TouchableOpacity onPress={() => setOpenDropDown(!openDropDown)}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity> */}
                {/* {
                openDropDown &&
                <View className='w-full absolute right-5 flex flex-row justify-end'>
                    <TouchableOpacity
                        onPress={blockAndReportUser}
                        className=' p-3 bg-red-200 rounded-l-full flex justify-between flex-row mx-2' style={styles.shadowButtonStyle}>
                        <Text className='text-white font-semibold'>Block and report</Text>
                    </TouchableOpacity>
                </View>
            } */}
            </View>

            {/* blurb pin messages */}
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    borderTopWidth: 1,
                    borderColor: '#ccc',
                }}
                className="p-3 px-3 flex-row space-x-2 bg-gray-200"
            >
                <MaterialCommunityIcons name="pin" size={24} color="black" />
                <View className="flex-1">
                    <Text className="text-wrap">{blurb_message}</Text>
                </View>
            </Animated.View>
        </>

    )
}

export default GroupChatHeader