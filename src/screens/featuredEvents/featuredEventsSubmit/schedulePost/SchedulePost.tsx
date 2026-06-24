import { View, Text, TouchableOpacity, Switch } from 'react-native'
import React from 'react'
import DatePicker from 'react-native-date-picker';
import AntDesign from '@expo/vector-icons/AntDesign';
import formatDateShortWeekday from '../../../../utils/functions/formatDateShortWeekday';
import extractTimeFromDateSubmit from '../../../../utils/functions/extractTimeFromDateSubmit';

const SchedulePost = ({
    setSchedulePostDateTime,
    schedulePostDateTime,
    publishNow,
    setPublishNow,
    alertOnPurchase,
    setAlertOnPurchase
}: {
    setSchedulePostDateTime: (schedule: Date | null) => void;
    schedulePostDateTime: Date | null;
    publishNow: boolean;
    setPublishNow: (publishNow: boolean) => void;
    alertOnPurchase: boolean;
    setAlertOnPurchase: (alertOnPurchase: boolean) => void;
}) => {
    const [open, setOpen] = React.useState<boolean>(false);
  
    return (
        <View className='mx-4 mb-4'>
            <View className="mb-5">
                <Text className="text-2xl font-semibold">
                    Schedule post and alerts
                </Text>

                <Text className="text-gray-500 mt-1">
                    Publish your event automatically at a later date and time.
                </Text>
                <Text className="text-gray-500 mt-1">
                    Set up an alert whenever a ticket is purchased.
                </Text>

            </View>

            <View
                className={`p-4 my-2 rounded-xl ${schedulePostDateTime === null ? "bg-gray-100" : "bg-white"
                    }`}
            >
                <Text className="font-semibold text-base">Publish now</Text>
                <Text className="text-gray-500 text-sm my-2 mb-4">
                    Your event will be visible immediately.
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    onValueChange={() => setPublishNow(!publishNow)}
                    value={publishNow!}
                />
            </View>

            <TouchableOpacity
                disabled={publishNow}
                onPress={() => setOpen(true)}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 3,
                    elevation: 2,
                }}
                className={`bg-white rounded-2xl p-4 border border-gray-100 ${publishNow ? 'opacity-40 ' : ''}`}
            >

                <Text className="font-semibold text-base my-2">Schedule for later</Text>
                <View className="flex-row items-center justify-between">

                    <View className="flex-row items-center space-x-3">
                        <View className="bg-gray-100 p-2 rounded-full">
                            <AntDesign name="calendar" size={18} color="black" />
                        </View>

                        <View>
                            <Text className="text-xs text-gray-500">
                                Publish date
                            </Text>

                            <Text className="font-semibold text-base">
                                {formatDateShortWeekday(schedulePostDateTime!)}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center space-x-2">
                        <AntDesign name="clockcircleo" size={18} color="black" />

                        <Text className="font-medium">
                            {extractTimeFromDateSubmit(schedulePostDateTime!)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>


            <View
                className={`p-4 my-2 rounded-xl ${alertOnPurchase === null ? "bg-gray-100" : "bg-white"
                    }`}
            >
                <Text className="font-semibold text-base">Turn on alerts</Text>
                <Text className="text-gray-500 text-sm my-2 mb-4">
                    When activated, you will receive an email whevener a ticket is purchased.
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    onValueChange={() => setAlertOnPurchase(!alertOnPurchase)}
                    value={alertOnPurchase!}
                />
            </View>
            <DatePicker
                modal
                open={open}
                date={schedulePostDateTime || new Date()}
                onConfirm={(date: Date) => {
                    setOpen(false)
                    setSchedulePostDateTime(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    )
}

export default SchedulePost