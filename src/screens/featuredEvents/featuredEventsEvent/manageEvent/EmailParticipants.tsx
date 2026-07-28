import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigationProp } from '../../../../utils/types/types'
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent'

const EmailParticipants = ({ featured_event_id }: { featured_event_id: number }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const handleNavigate = () => {
    navigation.navigate('emailattendees', {
      featured_event_id: featured_event_id
    })
  };
  return (

    <ManageEventBannerComponent
      onPress={handleNavigate}
      title='Information'
      description='Email your attendees'
    />
  )
}

export default EmailParticipants