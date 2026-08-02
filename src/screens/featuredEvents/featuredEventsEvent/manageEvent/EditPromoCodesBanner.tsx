import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../../utils/types/types';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';

const EditPromoCodesBanner = ({ featured_event_id }: { featured_event_id: number }) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    
    const handleNavigate = () => {
        navigation.navigate('editpromocodes', {
            featured_event_id: featured_event_id
        })
    };
    return (
        <ManageEventBannerComponent
            onPress={handleNavigate}
            title='Manage promo codes'
            description='Create and delete promo codes'
        />
    )
}

export default EditPromoCodesBanner