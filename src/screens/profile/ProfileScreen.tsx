import { View, Text, Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import UserEvents from './UserEvents';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  const currentUser = useSelector(selectCurrentUser);
  return (
    <View className='flex '>
      <View className=' flex items-center space-y-3 h-1/3 justify-center border-b'>
        {
          currentUser.photo ?
            (
              <Image
                className='w-20 h-20 rounded-full'
                source={{
                  uri: `${currentUser.photo}`,
                }}
              />
            ) :
            <>
              <FontAwesome name="user-circle" size={70} color="black" />
            </>
        }
        <Text className='text-xl font-bold'>
          {currentUser.name}
        </Text>
      </View>
      <UserEvents />
    </View>
  )
}

export default ProfileScreen