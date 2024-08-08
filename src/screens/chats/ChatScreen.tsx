import { View, Text } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../utils/types/types';


const ChatScreen = () => {
    const route = useRoute<any>();
    const { user_id } = route.params
    console.log(user_id)
  return (
    <View>
      <Text>

      </Text>
    </View>
  )
}

export default ChatScreen