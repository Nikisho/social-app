import { View } from 'react-native'
import React from 'react'
import FeaturedEventsScreenHeader from './FeaturedEventsScreenHeader'
import FeaturedEventsFeed from './FeaturedEventsFeed'
import UpdateAppModal from '../../../components/UpdateAppModal'

const FeaturedEventsScreen = () => {
  return (
    <View className='pb-10'>
      <UpdateAppModal />
      <FeaturedEventsScreenHeader/>
      <FeaturedEventsFeed />
    </View>
  )
}

export default FeaturedEventsScreen