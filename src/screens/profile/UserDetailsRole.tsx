import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import fetchOrganizerId from '../../utils/functions/fetchOrganizerId';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../utils/types/types';
interface UserDetailsRoleProps {
    isOrganizer: boolean;
    user_id: number;
}
const UserDetailsRole: React.FC<UserDetailsRoleProps> = ({
    isOrganizer,
    user_id
}) => {
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [userFollows, setUserFollows] = useState(false);
    const followDisplayText = userFollows ? 'Following' : 'Follow';
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>();

    const handleFollow = async () => {
        const organizer_id = await fetchOrganizerId(user_id)
        try {
            if (!userFollows) {
                //If the user does not already follow, follow. 
                const { error } = await supabase
                    .from('organizer_followers')
                    .insert({
                        organizer_id: organizer_id,
                        follower_id: currentUser.id
                    })
                if (error) {
                    console.error(error.message);
                    return;
                }
                setUserFollows(true);
            } else if (userFollows) {
                //If the user already follows, unfollow.
                const { error } = await supabase
                    .from('organizer_followers')
                    .delete()
                    .eq('follower_id', currentUser.id)
                    .eq('organizer_id', organizer_id)
                if (error) { console.error(error.message); return; }
                setUserFollows(false);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const checkUserFollows = async () => {
        if (!isOrganizer) return;
        //Return is the user profile is the current user's. 
        if (user_id === currentUser.id) return;

        //Fetch organizer id
        const organizer_id = await fetchOrganizerId(user_id)

        //Check if the current user follows the user.
        const { data, error } = await supabase
            .from('organizer_followers')
            .select()
            .eq('follower_id', currentUser.id)
            .eq('organizer_id', organizer_id)
            .single()
        if (data) {
            setUserFollows(true);
        }
        if (error) {
            console.error(error.message)
        }
    }


    const fetchFollowerCount = async () => {
        if (!isOrganizer) { return }
        const organizer_id = await fetchOrganizerId(user_id);
        const { count, error } = await supabase
            .from('organizer_followers')
            .select(`follower_id
                `
                ,
                { count: 'exact', head: true }
            ).eq('organizer_id', organizer_id)

        if (count) {
            setFollowerCount(count)
        }
        if (error) {
            console.error(error.message);
        }
    }

    const fetchFollowingCount = async () => {
        const { count, error } = await supabase
            .from('organizer_followers')
            .select(`follower_id `, {count: 'exact', head:true})
            .eq('follower_id', user_id)

        if (count) {
            setFollowingCount(count)
        }
        if (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchFollowerCount();
        fetchFollowingCount();
        checkUserFollows();
    }, [isOrganizer, user_id, userFollows]);

    return (
        <View className='mb-3'>
            {
                isOrganizer ?
                    <View className=' space-y-2'>
                        <View className="bg-black px-3 space-x-1 py-2 rounded-full mt-1 flex-row items-center  border">
                            <Text className="text-white mr-2">📣 Event organiser</Text>
                            <View className='border-x  px-2 border-white'>
                                <Text className='text-white'>
                                    {followerCount} Followers
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('following', { user_id: user_id })}
                                className=' px-2 border-white'>
                                <Text className='text-white'>
                                    Following  {followingCount}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {
                            user_id !== currentUser.id && (
                                <TouchableOpacity
                                    onPress={() => handleFollow()}
                                    className='self-center p-2 px-3 bg-black rounded-full '>
                                    <Text className='text-white font-semibold'>
                                        {followDisplayText}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>

                    :
                    <View className="bg-gray-200 px-3 py-2 rounded-full mt-1 flex-row items-center">
                        <Text className="text-gray-700 font-semibold text-xs mr-3">👤 Community member</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('following', { user_id: user_id })}
                            className=' px-2 border-l '>
                            <Text className='text-'>
                                Following  {followingCount}
                            </Text>
                        </TouchableOpacity>
                    </View>
            }
        </View>
    )
}

export default UserDetailsRole