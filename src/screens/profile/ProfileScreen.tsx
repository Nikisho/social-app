import { View, Text, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';

const ProfileScreen = () => {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <View className='flex '>
      <View className=' flex items-center space-y-3 h-1/3 justify-end bg-blue-200'>
        <Image
          className='w-20 h-20 rounded-full'
          source={{
            uri: `${currentUser.photo}`,
          }}
        />
        <Text className='text-xl font-bold'>
          {currentUser.name}
        </Text>
      </View>
      <View className='h-2/3 bg-red-200'>
        <Text>Posts</Text>
      </View>
    </View>
  )
}

export default ProfileScreen