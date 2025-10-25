import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { t } from 'i18next';

interface RenderActionButtonProps {
    isExpired:boolean
    showTicketTypeModal: () => void
}
const RenderActionButton:React.FC<RenderActionButtonProps>= ({
    isExpired,
    showTicketTypeModal
}) => {


    return (
        <TouchableOpacity
            onPress={showTicketTypeModal}
            disabled={isExpired}
            className={`p-3 rounded-full bg-white px-10 ${isExpired && 'opacity-60'}`}
        >
            <Text className="text-center text-black font-bold">
                {isExpired
                    ? t('featured_event_screen.closed')
                    : 'GET TICKETS' }
            </Text>
        </TouchableOpacity>
    )
};

export default RenderActionButton