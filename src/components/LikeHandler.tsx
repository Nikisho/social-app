import { View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import getLikeCount from '../utils/functions/getLikeCount';
import { supabase } from '../../supabase';
import hasUserLikedEvent from '../utils/functions/hasUserLikedEvent';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../utils/styles/shadow';
import colours from '../utils/styles/colours';

interface LikeHandlerProps {
    event_id: number;
    user_id: number;
}
const LikeHandler: React.FC<LikeHandlerProps> = ({
    event_id,
    user_id
}) => {
    const [hasUserLikedEventState, setHasUserLikedEventState] = useState<boolean>();
    const [likeNumber, setLikeNumber] = useState<number>();
    const handleSubmitLike = async () => {
        const { error } = await supabase
            .from('event_likes')
            .insert({
                event_id: event_id,
                user_id: user_id
            })
        setHasUserLikedEventState(true);
        fetchLikeCount();
        if (error) console.error(error.message);
    };

    const handleUnlike = async () => {
        const { error } = await supabase
            .from('event_likes')
            .delete()
            .eq('user_id', user_id)
            .eq('event_id', event_id)
        fetchLikeCount();
        setHasUserLikedEventState(false);
        if (error) console.error(error.message);
    };

    const likeEventCheck = async () => {
        const check = await hasUserLikedEvent(user_id = user_id, event_id = event_id);
        setHasUserLikedEventState(check);
    };

    const fetchLikeCount = async () => {
        const likeCount = await getLikeCount(event_id);
        setLikeNumber(likeCount!);
    };

    useFocusEffect(
        React.useCallback(() => {
            likeEventCheck();
            fetchLikeCount();
        }, [])
    );
    return (

        <TouchableOpacity
        className='w-1/2'
        >
            {
                hasUserLikedEventState ?
                    <TouchableOpacity
                        onPress={handleUnlike}
                        className='w-full flex flex-row justify-center space-x-3 items-center'>

                        <View className='p-2 rounded-full bg-white flex flex-row items-center space-x-3'
                            style={styles.shadow}
                        >
                            <Ionicons name="heart" size={25} color={colours.likeHandlerColour} />
                        <Text>
                            {likeNumber}
                        </Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={handleSubmitLike}
                        className='w-full flex flex-row justify-center space-x-3 items-center'>

                        <View className='p-2 rounded-full bg-white flex flex-row items-center space-x-3'
                            style={styles.shadow}
                        >
                            <Ionicons name="heart-outline" size={25} color="black" />
                        <Text>
                            {likeNumber}
                        </Text>
                        </View>
                    </TouchableOpacity>
            }
        </TouchableOpacity>
    )
}

export default LikeHandler