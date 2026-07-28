import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../../utils/types/types';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';

const AnalyticsBanner = ({ featured_event_id }: { featured_event_id: number }) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('eventanalytics', {
            featured_event_id: featured_event_id
        })
    };
    return (

        <ManageEventBannerComponent
            onPress={handleNavigate}
            title='Analytics'
            description='View your event analytics'
        />
    )
}

export default AnalyticsBanner