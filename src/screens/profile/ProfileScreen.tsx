import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <View className='flex '>
      {/* <Text>ProfileScreen</Text> */}
      <View className=' flex items-center'>

        <FontAwesome name="user-circle" size={70} color="black" />
        <Text className='text-xl'>Name</Text>
      </View>

    </View>
  )
}

export default ProfileScreen