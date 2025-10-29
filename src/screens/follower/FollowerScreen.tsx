import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProfileScreenRouteProp, RootStackNavigationProp } from '../../utils/types/types';
import { selectCurrentUser } from '../../context/navSlice';
import { supabase } from '../../../supabase';
import fetchOrganizerId from '../../utils/functions/fetchOrganizerId';
import SecondaryHeader from '../../components/SecondaryHeader';
import { getColorFromName } from '../../utils/functions/getColorFromName';

const FollowerScreen = () => {
    const route = useRoute<ProfileScreenRouteProp>();
    const { user_id } = route.params;
    const [followers, setFollowers] = useState<any>([]);
    const currentUser = useSelector(selectCurrentUser);
    const navigation = useNavigation<RootStackNavigationProp>();

    const fetchFollowers = async () => {
        const organizer_id = await fetchOrganizerId(user_id);

        const { data: followers, error: followersError } = await supabase
            .from('organizer_followers')
            .select('follower_id')
            .eq('organizer_id', organizer_id);

        if (followersError) throw followersError;

        // Step 2: get user details
        const followerIds = followers.map(f => f.follower_id);
        console.log(followerIds.length)
        if (followerIds.length > 0) {
            const { data: userData, error: usersError } = await supabase
                .from('users')
                .select('id, name, photo')
                .in('id', followerIds);

            if (usersError) throw usersError;
            setFollowers(userData);
            console.log(userData.length)
        }
    }

    useEffect(() => {
        fetchFollowers();
    }, [user_id]);

    const RenderItem = ({ item }: { item: any }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('profile', { user_id: item.id })}
                // style={styles.shadow}
                className='p-3 px-5 flex-row justify-between items-center '>

                <View className='flex flex-row space-x-3 items-center'>
                    {item.photo ?
                        <Image
                            source={{
                                uri: item.photo
                            }}
                            className='h-14 w-14 rounded-full '
                        />
                        :
                        <View
                            style={{
                                backgroundColor: getColorFromName(item.name),
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
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    }
                    <View className=''>
                        <Text
                            numberOfLines={1}
                            style={{ width: 100 }}
                            className='text-lg text-'>
                            {item.name}
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
                        onPress={() => navigation.navigate('chat', {user_id: item.id})}
                        className='p-2 px-3 bg-gray-300 rounded-full'>
                        <Text>
                            Message
                        </Text>
                    </TouchableOpacity>
                }
            </TouchableOpacity >)
    }

    return (
        <View>
            <SecondaryHeader displayText={`Followers  ${followers?.length}`}/>
            {
                followers && (
                    <>
                    {followers?.length !== 0  ? (
                        <FlatList
                            data={followers}
                            renderItem={({ item }) => <RenderItem item={item} />}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                    ) : (
                        <View className="h-1/2 justify-center items-center p-6">
                            <Text className="text-lg font-semibold text-gray-700">No followers</Text>
                            <Text className="mt-2 text-center text-gray-500">
                                {currentUser.id === user_id
                                    ? "You don't have any followers yet. Start connecting!"
                                    : "This user is not followed by anyone yet😴"}
                            </Text>
                        </View>
                    )}
                    </>

                )
            }
        </View>
    )
}

export default FollowerScreen