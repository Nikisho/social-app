import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import convertDateFormat from '../utils/functions/convertDateFormat';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import LikeHandler from './LikeHandler';
import { RootStackNavigationProp } from '../utils/types/types';
import Entypo from '@expo/vector-icons/Entypo';
import FeedCardOptionsModal from './FeedCardOptionsModal';
import styles from '../utils/styles/shadow';

interface FeedCardProps {
    name: string;
    photo: string;
    title: string;
    description: string;
    date: string;
    time: string;
    event_id: number;
    user_id: number;
    event_type: string;
    refreshOnBlock: () => void;

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
    event_type,
    refreshOnBlock
}) => {
    const formattedDate = convertDateFormat(date);
    const timeSliced = time.slice(0, -3);
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('event', {
                    event_id: event_id,
                });
            }}
            style={styles.shadow}
            className={`rounded-xl bg-white p-2 my-3 space-y-4 w-[93%] ${(event_type === 'women-only' && currentUser.sex !== 2 && currentUser.id !== 3) &&  'hidden' }` }
        >
            <View className=' flex flex-row justify-between'>

                <TouchableOpacity
                    onPress={() => navigation.navigate('profile',
                        { user_id: user_id }
                    )}
                    className='flex flex-row space-x-3 items-center'>
                    {
                        photo === null ?
                            <>
                                <FontAwesome name="user-circle" size={31} color="black" />
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
                </TouchableOpacity>
                <View className='flex flex-row'>
                    {event_type === 'women-only' &&
                    <View className=' bg-red-200 rounded-lg p-2'>
                        <Text className='text-black font-semibold'>
                            Women Only
                        </Text>
                    </View>
                    }

                    <TouchableWithoutFeedback 
                        className=''
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Entypo name="dots-three-vertical" size={20} color="black" />
                    </TouchableWithoutFeedback>
                </View>
            </View>

            <View className='mb-1 space-y-1'>
                <Text className='text-xl'>
                    {title}
                </Text>
                <Text className='whitespace-normal' numberOfLines={3}>
                    {description.replace(/(\r\n|\n|\r)/gm, "")}
                </Text>
            </View>

            <View className='space-x-3 flex flex-row items-center bg-white'>
                <View className='space-x-2 flex-row flex p-2 rounded-xl bg-[#176b7d]' style={styles.shadow}>

                    <View className='space-x-1 flex flex-row items-center '>
                        <AntDesign name="calendar" size={24} color="white" />
                        <Text className=' text-white font-bold '> {formattedDate} </Text>
                    </View>
                    <View className='space-x-1 flex flex-row items-center '>
                        <AntDesign name="clockcircleo" size={24} color="white" />
                        <Text className=' text-white font-bold '> {timeSliced} </Text>
                    </View>
                </View>
                <LikeHandler
                    user_id={currentUser.id}
                    event_id={event_id}
                />

            </View>
            {
                modalVisible &&
                <FeedCardOptionsModal
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    event_id={event_id}
                    user_id={user_id}
                    currentUser={currentUser}
                    refreshOnBlock={refreshOnBlock}
                />
            }

        </TouchableOpacity>
    )
}

export default FeedCard