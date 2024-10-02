import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { SetStateAction, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import convertDateFormat from '../utils/functions/convertDateFormat';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../context/navSlice';
import LikeHandler from './LikeHandler';
import { RootStackNavigationProp } from '../utils/types/types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Entypo from '@expo/vector-icons/Entypo';
import FeedCardOptionsModal from './FeedCardOptionsModal';

interface FeedCardProps {
    name: string;
    photo: string;
    title: string;
    description: string;
    date: string;
    time: string;
    event_id: number;
    user_id: number;
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
    refreshOnBlock
}) => {
    const formattedDate = convertDateFormat(date);
    const timeSliced = time.slice(0, -3);
    const navigation = useNavigation<RootStackNavigationProp>();
    const currentUser = useSelector(selectCurrentUser);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                navigation.navigate('event', {
                    event_id: event_id,
                });
            }}
            // style={styles.shadow} 
            className='rounded-lg bg-gray-100 p-2 mb-3 space-y-1 '>
            <View className=' flex flex-row justify-between'>

                <TouchableWithoutFeedback
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
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
                    <Entypo name="dots-three-vertical" size={20} color="black" />
                </TouchableWithoutFeedback>
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

        </TouchableWithoutFeedback>
    )
}

export default FeedCard