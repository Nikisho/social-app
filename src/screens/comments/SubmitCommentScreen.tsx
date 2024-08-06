import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const SubmitCommentScreen = () => {
    const route = useRoute<any>();
    const {event_id} = route.params;
  return (
    <View>
      <Text>

      </Text>
    </View>
  )
}

export default SubmitCommentScreen