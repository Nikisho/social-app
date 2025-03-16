import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import styles from '../../utils/styles/shadow';
import LikeHandler from '../../components/LikeHandler';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';

interface EngagementBarProps {
    event_id: number;
    user_id: number;
};

const EngagementBar: React.FC<EngagementBarProps> = ({ event_id, user_id }) => {
    const navigation = useNavigation<RootStackNavigationProp>()

    return (
        <View
            style={styles.shadow}
            className='rounded-xl py-2 flex flex-row bg-gray-100 '>
            <LikeHandler
                user_id={user_id}
                event_id={event_id}
            />
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('comment', {
                        event_id: event_id
                    })
                }}
                className='w-1/2 flex flex-row justify-center items-center'>
                <View className='p-2 rounded-full bg-white flex justify-center'
                    style={styles.shadow}
                >
                    <EvilIcons name="comment" size={30} color="black" />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default EngagementBar