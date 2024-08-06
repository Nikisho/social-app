import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { supabase } from '../../../supabase';
import hasUserLikedEvent from '../../utils/functions/hasUserLikedEvent';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../../utils/styles/shadow';

interface EngagementBarProps {
    event_id: number;
    user_id: number;
};

const EngagementBar: React.FC<EngagementBarProps> = ({ event_id, user_id }) => {
    const [hasUserLikedEventState, setHasUserLikedEventState] = useState<boolean>();
    const handleSubmitLike = async () => {
        const { error } = await supabase
            .from('event_likes')
            .insert({
                event_id: event_id,
                user_id: user_id
            })
        setHasUserLikedEventState(true);
        if (error) console.error(error.message);
    };

    const handleUnlike = async () => {
        const { error } = await supabase
        .from('event_likes')
        .delete()
        .eq('user_id', user_id)
        .eq('event_id', event_id )

        setHasUserLikedEventState(false);
        if (error) console.error(error.message);
    };

    const likeEventCheck = async () => {
        const check = await hasUserLikedEvent(user_id = user_id, event_id = event_id);
        setHasUserLikedEventState(check);
    };

    useEffect(() => {
        likeEventCheck(); 
    }, [])
    return (
        <View 
            style={styles.translucidViewStyle}
            className='bg-orange-200 rounded-xl py-2 flex flex-row'>
            {
                hasUserLikedEventState ?
                    <TouchableOpacity
                        onPress={handleUnlike}
                        className='w-1/2 flex flex-row justify-center items-center'>
                        <Ionicons name="heart" size={25} color="red" />
                    </TouchableOpacity> 
                    :
                    <TouchableOpacity
                        onPress={handleSubmitLike}
                        className='w-1/2 flex flex-row justify-center items-center'>
                        <Ionicons name="heart-outline" size={25} color="black" />
                    </TouchableOpacity>
            }

            <TouchableOpacity className='w-1/2 flex flex-row justify-center items-center'>
                <EvilIcons name="comment" size={30} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default EngagementBar