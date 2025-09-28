import { View, Text, Switch, TouchableOpacity, Platform, Alert } from 'react-native'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';

interface RepeatEventProps {
    repeatEvent: boolean;
    setRepeatEvent: (repeatEvent: boolean) => void;
}

const RepeatEvent: React.FC<RepeatEventProps> = ({
    repeatEvent,
    setRepeatEvent
}) => {
    const infoMessage = "If selected, this event will auto-schedule every Sunday for the week after next.";

    return (
        <View className='flex mt-4 flex-row  items-center justify-between'>

            <View className=' flex space-x-2  items-center flex-row'>
                <Text className='text-lg'>
                    Repeat this event weekly
                </Text>
                <TouchableOpacity
                    onPress={() => Alert.alert(infoMessage)}
                >
                    <Entypo name="info-with-circle" size={22} color="black" />
                </TouchableOpacity>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                onValueChange={() => setRepeatEvent(!repeatEvent)}
                value={repeatEvent}
            />
        </View>
    )
}

export default RepeatEvent