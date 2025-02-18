import { View, Text, FlatList } from 'react-native'
import React from 'react'

const LeaderboardSkeleton = () => {
    const fakeData = Array(10)
        .fill({ id: Math.random() }) // Fill the array with objects containing random IDs
        .map((item, index) => ({ id: index + 1 }));
    return (
        <FlatList
            className='h-4/5'
            data={fakeData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={() => (
                <View className='flex flex-row space-x-5 p-2 bg-gray-200 py-3 my-2 align-center justify-between rounded-xl'>
                    <View className='flex flex-row space-x-5 items-center'>
                        <View className='h-8 w-8 rounded-full bg-gray-300' />
                        <View className='w-10 h-10 rounded-full bg-gray-300' />
                        <View className='w-24 h-6 bg-gray-300 rounded-md' />
                    </View>
                    <View className='w-12 h-6 bg-gray-300 rounded-md' />
                </View>
            )}
        />
    );
}

export default LeaderboardSkeleton