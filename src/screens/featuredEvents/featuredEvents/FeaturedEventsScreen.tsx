import { View } from 'react-native'
import React from 'react'
import FeaturedEventsScreenHeader from './FeaturedEventsScreenHeader'
import FeaturedEventsFeed from './FeaturedEventsFeed'
import UpdateAppModal from '../../../components/UpdateAppModal'
import { useRoute } from '@react-navigation/native'
import { FeaturedEventsScreenRouteProps } from '../../../utils/types/types'

const FeaturedEventsScreen = () => {
  const route = useRoute<FeaturedEventsScreenRouteProps>();
  const { interest } = route.params ?? {};

  console.log(interest)
  return (
    <View>
      <UpdateAppModal />
      <FeaturedEventsScreenHeader/>
      <FeaturedEventsFeed 
          interest={interest!}
      />
    </View>
  )
}

export default FeaturedEventsScreen