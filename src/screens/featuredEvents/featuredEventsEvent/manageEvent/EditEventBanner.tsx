import React from 'react'
import { RootStackNavigationProp } from '../../../../utils/types/types';
import { useNavigation } from '@react-navigation/native';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';

const EditEventBanner = ({ featured_event_id }: { featured_event_id: number }) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('editfeaturedevent', {
            featured_event_id: featured_event_id
        })
    };
    return (
        <ManageEventBannerComponent
            onPress={handleNavigate}
            title='Edit event'
            description='Edit your event details'
        />
    )
}

export default EditEventBanner