import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackNavigationProp } from '../../../utils/types/types';

interface ChatHeaderProps {
    title: string;
    image_url: string;
    featured_event_id: number;
    // blockAndReportUser: () => void;
}

const GroupChatHeader: React.FC<ChatHeaderProps> = ({
    title,
    image_url,
    featured_event_id,
}) => {

    const navigation = useNavigation<RootStackNavigationProp>();
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);

    return (
        <View className='flex flex-row justify-between items-center bg-gray-200'>

            <View

                // style={{backgroundColor: colours.secondaryColour}}
                className='p-2 py-3 flex  flex-row space-x-3 items-center '>
                <TouchableOpacity className='mr-4' onPress={() => {navigation.goBack()}}>
                    <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
                </TouchableOpacity>
                {
                    image_url === null ?
                        <>
                            <FontAwesome name="user-circle" size={40} color="black" />
                        </> :
                        <TouchableOpacity onPress={() => navigation.navigate('featuredeventsevent', {
                            featured_event_id: featured_event_id
                        })}>

                            <Image
                                className='w-12 h-12 rounded-full'
                                source={{
                                    uri: image_url,
                                }}
                                />
                        </TouchableOpacity>
                }
                <Text className='text-black text-lg'>
                    {title}
                </Text>

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

    )
}

export default GroupChatHeader