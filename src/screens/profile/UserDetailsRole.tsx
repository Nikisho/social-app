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
        const organizer_id = await fetchOrganizerId(user_id);

        if (!organizer_id) return;
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
        if (!organizer_id) return;

        const { count, error } = await supabase
            .from('organizer_followers')
            .select(`follower_id
                `
                ,
                { count: 'exact', head: true }
            ).eq('organizer_id', organizer_id)
        if (count !== null && count !== undefined) {
            setFollowerCount(count)
        }
        if (error) {
            console.error(error.message);
        }
    }

    const handleJoinChat = async () => {
        const organizer_id = await fetchOrganizerId(user_id);
        const { data, error } = await supabase
            .from('organizers')
            .select('chat_room_id')
            .eq('organizer_id', organizer_id)
            .single()

        if (error) {
            console.error(error.message);
            return;
        }
        const { data: participantsData, error: participantsError } = await supabase
            .from('participants')
            .select()
            .eq('user_id', currentUser.id)
            .eq('chat_room_id', data?.chat_room_id)
            .single()

        if (participantsError && participantsError.code !== 'PGRST116') {
            console.error(participantsError.message);
            return;
        }
        //If the user is already a participant, navigate to the chat. 
        if (participantsData) {
            navigation.navigate("groupchat", { organizer_id })
            return;
        }
        const { error: joinError } = await supabase
            .from('participants')
            .insert({
                user_id: currentUser.id,
                chat_room_id: data?.chat_room_id
            })
        if (joinError) {
            console.error(joinError.message);
            return;
        }

        navigation.navigate("groupchat", { organizer_id })
    }

    const fetchFollowingCount = async () => {
        const { count, error } = await supabase
            .from('organizer_followers')
            .select(`follower_id `, { count: 'exact', head: true })
            .eq('follower_id', user_id)
        if (count !== null && count !== undefined) {
            setFollowingCount(count!)
        }
        if (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchFollowerCount();
        fetchFollowingCount();
        checkUserFollows();
    }, [user_id, isOrganizer, userFollows]);

    return (
        <View className='mb-3'>
            {
                isOrganizer ?
                    <View className="items-center space-y-3">

                        {/* Stats */}
                        <View className="flex-row items-center space-x-8">

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("followers", { user_id })
                                }
                                className="items-center"
                            >
                                <Text className="font-bold text-lg">
                                    {followerCount}
                                </Text>

                                <Text className="text-gray-500 text-sm">
                                    Followers
                                </Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("following", { user_id })
                                }
                                className="items-center"
                            >
                                <Text className="font-bold text-lg">
                                    {followingCount}
                                </Text>

                                <Text className="text-gray-500 text-sm">
                                    Following
                                </Text>
                            </TouchableOpacity>



                        </View>

                        {/* Organiser badge */}
                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                            <Text className="text-xs text-gray-600 font-medium">
                                📣 Event organiser
                            </Text>
                        </View>

                        {/* Follow button */}
                        {user_id !== currentUser.id && (
                            <View className="flex-row items-center space-x-3">

                                <TouchableOpacity
                                    onPress={handleFollow}
                                    className="bg-black px-8 py-3 rounded-full"
                                >
                                    <Text className="text-white font-semibold">
                                        {followDisplayText}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleJoinChat}
                                    className="bg-gray-100 px-5 py-3 rounded-full"
                                >
                                    <Text className="text-gray-800 font-semibold">
                                        Join chat
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        )}

                    </View>

                    :
                    <View className="items-center space-y-3">

                        {/* Stats */}
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("following", { user_id })
                            }
                            className="items-center"
                        >
                            <Text className="font-bold text-lg">
                                {followingCount}
                            </Text>

                            <Text className="text-gray-500 text-sm">
                                Following
                            </Text>
                        </TouchableOpacity>


                        {/* Community badge */}
                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                            <Text className="text-xs text-gray-600 font-medium">
                                👤 Community member
                            </Text>
                        </View>

                    </View>
            }
        </View>
    )
}

export default UserDetailsRole