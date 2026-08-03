import React from 'react'
import { RootStackNavigationProp } from '../../../../utils/types/types';
import { useNavigation } from '@react-navigation/native';
import ManageEventBannerComponent from '../../../../components/ManageEventBannerComponent';

const ManageTicketBucketsBanner = ({ featured_event_id }: { featured_event_id: number }) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('manageticketbuckets', {
            featured_event_id: featured_event_id
        })
    };
    return (
        <ManageEventBannerComponent
            onPress={handleNavigate}
            title='Manage ticket buckets'
            description='Manage your ticket buckets'
        />
    )
}

export default ManageTicketBucketsBanner