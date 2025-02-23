import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import { FontAwesome } from '@expo/vector-icons';
import LeaderboardSkeleton from './LeaderboardSkeleton';
import CompetitionCountDown from './CompetitionCountDown';

const Leaderboard = () => {

    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('7days');

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase.rpc('get_leaderboard', {
                filter: filter
            })
            if (data) setUsers(data);
            if (error) console.error(error.message);
        } catch (error: any) {
            throw error.message
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [filter]);

    return (
        <>
        <View className='flex flex-row bg-gray-200 rounded-xl items-center justify-between'>
            <TouchableOpacity
                className={`${filter==='7days' && 'bg-blue-300'} flex items-center w-1/3 p-3 rounded-l-xl`}
                onPress={()=> setFilter('7days')}
            >
                <Text>
                    Week
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className={`${filter==='month' && 'bg-blue-300'}  flex items-center w-1/3 p-3 `}
                onPress={()=> setFilter('month')}
            >
                <Text>
                    Month
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                className={`${filter==='alltime' && 'bg-blue-300'} flex items-center  w-1/3 p-3 rounded-r-xl`}
                onPress={()=> setFilter('alltime')}
            >
                <Text>
                    All time
                </Text>
            </TouchableOpacity>
        </View>
      <CompetitionCountDown 
        filter={filter}
      />

        {loading ? 
            <LeaderboardSkeleton />
            :
        
        <FlatList
            className={`${filter === 'alltime' ? 'h-4/5': 'h-2/3'}`}
            data={users}
            keyExtractor={(item) => item.poster_id.toString()}
            renderItem={({ item, index }) => (
                <View className='flex flex-row space-x-5 p-2  bg-gray-200 py-3 my-2 align-center justify-between rounded-xl '>
                    <View className='flex flex-row space-x-5 items-center'>
                        <View className={`px-2 py-2 h-8 w-8 justify-center items-center flex rounded-full 
                            ${item.rank === 1 && 'bg-yellow-300'}
                            ${item.rank === 2 && 'bg-gray-300'}
                            ${item.rank === 3 && 'bg-amber-500'}
                            `}>
                            <Text className='text-l '>
                                {item.rank.toString()}
                            </Text>
                        </View>

                        <View>
                            {
                                item?.photo ?
                                    <Image
                                        className='w-10 h-10 rounded-full'
                                        source={{
                                            uri: item?.photo,
                                        }}
                                    />
                                    :
                                    <>
                                        <FontAwesome name="user-circle" size={42} color="black" />
                                    </>
                            }
                        </View>

                        <Text className='text-lg'>
                            {item.name}
                        </Text>
                    </View>

                    <Text className='text-lg'>
                        {item.total_likes} ❤️
                    </Text>
                </View>
            )}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchLeaderboard} />}
            
        />
}
        </>
    )
}

export default Leaderboard