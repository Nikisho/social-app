import { View } from 'react-native'
import React from 'react'
import FeaturedEventsScreenHeader from './FeaturedEventsScreenHeader'
import FeaturedEventsFeed from './FeaturedEventsFeed'

const FeaturedEventsScreen = () => {
  return (
    <View className=''>
      <FeaturedEventsScreenHeader/>
      <FeaturedEventsFeed />
    </View>
  )
}

export default FeaturedEventsScreen