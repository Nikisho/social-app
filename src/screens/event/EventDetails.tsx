import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Hyperlink from 'react-native-hyperlink'

interface evenDetailsProps {
    user_name: string;
    event_description: string;
    event_title: string;
    event_date: string;
    event_time: string;
    user_photo: string;
    isUsersOwnPost: boolean;
    event_location: string;
    user_id: number;
    event_id: number;
    event_type: string

}
const EventDetails: React.FC<evenDetailsProps> = ({
    user_photo,
    user_name,
    event_date,
    event_time,
    event_title,
    event_description,
    isUsersOwnPost,
    event_location,
    event_type,
    user_id,
    event_id
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const timeSliced = event_time.slice(0, -3);
    return (
        <ScrollView className='mb-2 h-1/2'>
            <View className='flex flex-row space-x-3 items-center'>
                <TouchableOpacity
                    onPress={() => navigation.navigate('profile',
                        { user_id: user_id }
                    )}
                >
                    {
                        user_photo === null ?
                            <>
                                <FontAwesome name="user-circle" size={35} color="black" />
                            </> :
                            <>
                                <Image
                                    className='w-10 h-10 rounded-full'
                                    source={{
                                        uri: user_photo,
                                    }}
                                />
                            </>
                    }
                </TouchableOpacity>
                <View>
                    <Text>
                        {user_name}
                    </Text>
                </View>
                <View className='flex flex-row grow justify-end '>

                    {event_type === 'women-only' &&
                        <View className=' bg-red-200 rounded-lg p-2'>
                            <Text className='text-black font-semibold'>
                                Women Only
                            </Text>
                        </View>
                    }
                </View>

                {
                    isUsersOwnPost && (
                        <TouchableOpacity className='flex flex-row justify-end grow'
                            onPress={() => navigation.navigate('editevent', {
                                event_id: event_id
                            })}
                        >
                            <FontAwesome name="edit" size={24} color="black" />
                        </TouchableOpacity>
                    )
                }

            </View>
            <View className='mt-1'>
                <Text className='text-lg font-semibold'>
                    {event_title}
                </Text>
            </View>
            <View className='mt-3 flex flex-row items-center space-x-1'>
                <Entypo name="location-pin" size={24} color="black" />

                <Text>
                    {event_location}
                </Text>
            </View>
            <View className='mb-3 flex flex-row items-center space-x-5'>
                <View className='flex flex-row space-x-2 my-2 mx-1 items-center'>
                    <AntDesign name="calendar" size={18} color="black" />
                    <Text>
                        {event_date}
                    </Text>
                </View>
                <View className='flex flex-row space-x-2 items-center'>
                    <AntDesign name="clockcircleo" size={18} color="black" />
                    <Text>
                        {timeSliced}
                    </Text>
                </View>
            </View>
            <View>
                <Hyperlink
                    linkDefault={true}
                    linkStyle={{ color: "blue" }}
                >
                    <Text className=''>
                        {event_description}
                    </Text>
                </Hyperlink>
            </View>
        </ScrollView>

    )
}

export default EventDetails