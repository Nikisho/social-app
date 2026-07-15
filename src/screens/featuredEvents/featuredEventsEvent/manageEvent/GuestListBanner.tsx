import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import styles from '../../../../utils/styles/shadow';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../../utils/types/types';

const GuestListBanner = ({
    featured_event_id
}: { featured_event_id: number
}) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('guestlist', {
            featured_event_id: featured_event_id
        })
    };
    return (
        <View>
            <TouchableOpacity
                onPress={handleNavigate}
                style={Platform.OS === 'ios' ? styles.shadow : { borderWidth: 1 }}
                className="bg-white mt-4 rounded-2xl p-4 flex-row items-center justify-between">
                <View>
                    <Text className="text-black/70 text-base font-semibold">Manage guests</Text>
                    <Text className="text-black text-lg font-bold">
                        Manage guests & initiate refunds
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default GuestListBanner