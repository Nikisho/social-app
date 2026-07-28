import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../../../utils/types/types'
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent'

const EditTicketsBanner = ({featured_event_id}: {featured_event_id: number}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('edittickets', {
            featured_event_id: featured_event_id
        })
    };
  return (
      <ManageEventBannerComponent
        onPress={handleNavigate}
        title='Ticket Types'
        description='Edit ticket types'
      />
  )
}

export default EditTicketsBanner