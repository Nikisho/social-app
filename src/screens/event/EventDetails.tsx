import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface evenDetailsProps {
    user_name: string
    event_description: string
    event_title: string
    event_date: string
    event_time: string
    user_photo: string
    isUsersOwnPost: boolean;
    user_id: number;
}
const EventDetails: React.FC<evenDetailsProps> = ({
    user_photo,
    user_name,
    event_date,
    event_time,
    event_title,
    event_description,
    isUsersOwnPost,
    user_id
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const timeSliced = event_time.slice(0, -3);
    return (
        <View className='p-2'>
            <View className='flex flex-row space-x-3 items-center'>
                <TouchableOpacity
                    onPress={() => navigation.navigate('profile',
                        { user_id: user_id }
                    )}
                >
                    {
                        user_photo === null ?
                            <>
                                <FontAwesome name="user-circle" size={24} color="black" />
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
                    <View className='flex flex-row space-x-3'>

                        <Text className='opacity-70 italic'>
                            {event_date}
                        </Text>
                        <Text className='opacity-70 italic'>
                            {timeSliced}
                        </Text>
                    </View>
                </View>
                {
                    isUsersOwnPost && (
                        <TouchableOpacity className='flex flex-row justify-end grow'>
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

            <View>
                <Text className=''>
                    {event_description}
                </Text>
            </View>
        </View>

    )
}

export default EventDetails