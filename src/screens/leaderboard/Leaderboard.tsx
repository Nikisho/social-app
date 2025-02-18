import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../../supabase';
import { FontAwesome } from '@expo/vector-icons';
import LeaderboardSkeleton from './LeaderboardSkeleton';

const Leaderboard = () => {

    const [users, setUsers] = useState<any>();
    const [loading, setLoading] = useState<boolean>();
    const [filter, setFilter] = useState<string>('alltime');

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
    function ordinal_suffix_of(i:number) {
        let j = i % 10,
            k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    }

    useEffect(() => {
        fetchLeaderboard();
    }, [filter]);

    return (
        <>
        <View className='flex flex-row bg-gray-200 rounded-xl items-center justify-between'>

            <TouchableOpacity
                className={`${filter==='alltime' && 'bg-blue-300'} flex items-center w-1/3 p-3 rounded-l-xl`}
                onPress={()=> setFilter('alltime')}
            >
                <Text>
                    All time
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
                className={`${filter==='7days' && 'bg-blue-300'} flex items-center  w-1/3 p-3 rounded-r-xl`}
                onPress={()=> setFilter('7days')}
            >
                <Text>
                    Week
                </Text>
            </TouchableOpacity>
        </View>

        {loading ? 
            <LeaderboardSkeleton />
            :
        
        <FlatList
            className='h-4/5'
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
                                {/* {ordinal_suffix_of(item.rank).toString()} */}
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
        />
}
        </>
    )
}

export default Leaderboard