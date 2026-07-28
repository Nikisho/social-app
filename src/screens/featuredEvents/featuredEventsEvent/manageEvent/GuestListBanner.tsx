import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../../utils/types/types';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';

const GuestListBanner = ({
    featured_event_id
}: {
    featured_event_id: number
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('guestlist', {
            featured_event_id: featured_event_id
        })
    };
    return (
        <ManageEventBannerComponent
            onPress={handleNavigate}
            title='Manage guests'
            description='Manage guests & initiate refunds'
        />
    )
}

export default GuestListBanner