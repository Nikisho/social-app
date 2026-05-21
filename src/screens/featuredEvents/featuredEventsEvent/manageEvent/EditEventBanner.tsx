import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { RootStackNavigationProp } from '../../../../utils/types/types';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../../utils/styles/shadow';

const EditEventBanner = ({ featured_event_id }: { featured_event_id: number }) => {
    const navigation = useNavigation<RootStackNavigationProp>();
    const handleNavigate = () => {
        navigation.navigate('editfeaturedevent', {
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
                    <Text className="text-black/70 text-base font-semibold">Edit event</Text>
                    <Text className="text-black text-lg font-bold">
                        Edit your event details
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default EditEventBanner