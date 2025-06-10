import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import { FeaturedEventGroupChatScreenProps } from '../../../utils/types/types'

const FeaturedEventGroupChatScreen = () => {
    const route = useRoute<FeaturedEventGroupChatScreenProps>()

    const { chat_room_id } = route.params;
    console.log(chat_room_id);

    return (
        <View>
            <Text>

            </Text>
        </View>
    )
}

export default FeaturedEventGroupChatScreen