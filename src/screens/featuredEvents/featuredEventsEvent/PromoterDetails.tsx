import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../utils/types/types';
import { useTranslation } from 'react-i18next';

interface PromoterDetailsProps {
    organizers : {
        users : {
            photo:string;
            name:string;
            id:number
        }
    }
}
const PromoterDetails:React.FC<PromoterDetailsProps> = ({
    organizers,
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const { t } = useTranslation();
    return (
        <View className='p-2'>
            <Text className='text-xl font-bold'>
                {t('featured_event_screen.promoter')}
            </Text>
            <TouchableOpacity 
                onPress={() => navigation.navigate('profile', {
                    user_id: organizers.users.id
                })}
                className='flex flex-row border items-center  space-x-5 rounded-xl p-2 my-3'>
                <Image
                    className='w-10 h-10 rounded-full'
                    source={{
                        uri: organizers?.users.photo
                    }}
                />
                <Text className='text-xl'>
                    {organizers?.users.name}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default PromoterDetails