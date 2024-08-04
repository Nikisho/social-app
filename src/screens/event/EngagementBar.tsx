import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { supabase } from '../../../supabase';
import hasUserLikedEvent from '../../utils/functions/hasUserLikedEvent';

interface EngagementBarProps {
    event_id: number;
    user_id: number;
};

const EngagementBar:React.FC<EngagementBarProps> = ({event_id, user_id}) => {

    const handleSubmitLike = async () => {
        const { error } = await supabase
            .from('event_likes')
            .insert({
                event_id: event_id,
                user_id: user_id
            })
        if (error) console.error(error.message);
    };

    useEffect(() => {
        // const test = hasUserLikedEvent(user_id=user_id, event_id=event_id)
        // console.log(test)
    }, [])
    return (
        <View className='bg-emerald-300 rounded-xl py-2 flex flex-row'>
            <TouchableOpacity 
                onPress={handleSubmitLike}
                className='w-1/2 flex flex-row justify-center items-center'>
                <EvilIcons name="heart" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className='w-1/2 flex flex-row justify-center items-center'>
                <EvilIcons name="comment" size={30} color="blacsk" />
            </TouchableOpacity>
        </View>
    )
}

export default EngagementBar