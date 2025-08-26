import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { t } from 'i18next';

interface RenderActionButtonProps {
    isSoldOut:boolean
    showBookingModal: () => void
    isExpired:boolean
}
const RenderActionButton:React.FC<RenderActionButtonProps>= ({
    isSoldOut,
    showBookingModal,
    isExpired
}) => {
    if (isSoldOut) {
        return (
            <View className="p-3 rounded-lg bg-green-800 opacity-60">
                <Text className="text-center text-white font-bold">SOLD OUT</Text>
            </View>
        )
    }

    return (
        <TouchableOpacity
            onPress={showBookingModal}
            disabled={isExpired}
            className={`p-3 rounded-lg bg-green-700 px-5 ${isExpired && 'opacity-60'}`}
        >
            <Text className="text-center text-white font-bold">
                {isExpired
                    ? t('featured_event_screen.closed')
                    : t('featured_event_screen.book')}
            </Text>
        </TouchableOpacity>
    )
};

export default RenderActionButton