import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../../supabase';
import { ProfileScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';
import { getColorFromName } from '../../utils/functions/getColorFromName';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import SecondaryHeader from '../../components/SecondaryHeader';

const FollowingScreen = () => {
    const route = useRoute<ProfileScreenRouteProp>();
    const { user_id } = route.params;
    const [followings, setFollowings] = useState<any>();
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>();
    const fetchFollowings = async () => {
        const { data, error } = await supabase
            .from('organizer_followers')
            .select(`*, organizers(user_id, users(name, photo))`)
            .eq('follower_id', user_id);
        if (error) console.error(error.message);

        if (data) {
            setFollowings(data);
            console.log(data[0].organizers.users.name)
        }
    }

    useEffect(() => {
        fetchFollowings();
    }, [user_id]);



    const RenderItem = ({ item }: { item: any }) => {
        const [userFollows, setUserFollows] = useState(true);

        const handleFollow = async () => {

            if (currentUser.id !== user_id) return;
            try {
                if (!userFollows) {
                    //If the user does not already follow, follow. 
                    const { error } = await supabase
                        .from('organizer_followers')
                        .insert({
                            organizer_id: item.organizer_id,
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
                        .eq('organizer_id', item.organizer_id)
                    if (error) { console.error(error.message); return; }
                    setUserFollows(false);
                }
            } catch (error) {
                console.error(error);
            }
        };
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', { user_id: item.organizers.user_id })}
                // style={styles.shadow}
                className='p-3 px-5 flex-row justify-between items-center '>

                <View className='flex flex-row space-x-3 items-center'>
                    {item.organizers.users.photo ?
                        <Image
                            source={{
                                uri: item.organizers.users.photo
                            }}
                            className='h-14 w-14 rounded-full '
                        />
                        :
                        <View
                            style={{
                                backgroundColor: getColorFromName(item.organizers.users.name),
                                width: 55,
                                height: 55,
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 5,
                                borderWidth: 1
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>
                                {item.organizers.users.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    }
                    <View className=''>
                        <Text
                            numberOfLines={1}
                            style={{ width: 100 }}
                            className='text-lg text-'>
                            {item.organizers.users.name}
                        </Text>
                        {/* {
                                item.user_id === organizerIdUserId && (
                                    <View className="bg-green-100 rounded-full  flex-row items-center border-green-800 border justify-center">
                                        <Text className="text-green-800 font-semibold text-xs text-center"> Organiser</Text>
                                    </View>
                                )
                            } */}
                    </View>

                </View>

                {
                    currentUser.id === user_id &&
                    <TouchableOpacity
                        onPress={handleFollow}
                        className='p-2 px-3 bg-gray-300 rounded-full'>
                        <Text>
                            {userFollows ? 'Following' : 'Follow'}
                        </Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity >)
    }
    console.log(followings)
    return (
        <View>
            <SecondaryHeader displayText='Following' />
            {followings?.length !==0 ? (
                <FlatList
                    data={followings}
                    renderItem={({ item }) => <RenderItem item={item} />}
                    keyExtractor={item => item.organizer_id.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            ) : (
                <View className="h-1/2 justify-center items-center p-6">
                    <Text className="text-lg font-semibold text-gray-700">No followings</Text>
                    <Text className="mt-2 text-center text-gray-500">
                        {currentUser.id === user_id
                            ? "You're not following anyone yet 😴"
                            : "This user isn’t following anyone yet 😴"}
                    </Text>
                </View>
            )}
        </View>
    )
}

export default FollowingScreen