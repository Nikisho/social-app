import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';

interface evenDetailsProps {
    user_name: string
    event_description: string
    event_title: string
    event_date: string
    user_photo: string
    isUsersOwnPost: boolean;
}
const EventDetails: React.FC<evenDetailsProps> = ({
    user_photo,
    user_name,
    event_date,
    event_title,
    event_description,
    isUsersOwnPost
}) => {
    return (
        <View className='p-2'>
            <View className='flex flex-row space-x-3 items-center'>

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
                <View>
                    <Text>
                        {user_name}
                    </Text>
                    <Text className='opacity-70 italic'>
                        {event_date}
                    </Text>
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