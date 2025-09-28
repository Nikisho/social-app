import { View, Text, Platform, Switch } from 'react-native'
import React from 'react'
import styles from '../../../utils/styles/shadow'

interface ManageSeriesProps {
    repeatEvent: boolean | null;
    setRepeatEvent: (repeat: boolean) => void
}

const ManageSeries:React.FC<ManageSeriesProps> = ({
    repeatEvent,
    setRepeatEvent,
}) => {

    return (
        <View
            style={Platform.OS === 'ios' ? styles.shadow : { borderWidth: 1 }}
            className="bg-white mt-4 rounded-2xl p-4 flex-row items-center justify-between">
            <View>
                <Text className="text-black/70 text-base font-semibold">Manage series</Text>
                <Text className="text-black text-lg font-bold">
                    Repeat this event
                </Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                onValueChange={() => setRepeatEvent(!repeatEvent)}
                value={repeatEvent!}
            />
        </View>
    )
}

export default ManageSeries