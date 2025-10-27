import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
}
interface HideParticipantsProps {
    hide_participants: boolean;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
}
const HideParticipants:React.FC<HideParticipantsProps> = ({
    hide_participants,
    setEventData
}) => {
    return (
        <View>
            <Text className='font-semibold mt-3 px-5'>
                Hide participants
                <Text className='text-red-400'> *  </Text>
            </Text>
            <View className='flex flex-row space-x-4 my-3 justif-center'>

                <TouchableOpacity
                    onPress={() => setEventData((prevData: any) => ({
                        ...prevData,
                        hide_participants: true
                    }))}
                    className={`p-4 flex grow items-center `}
                    style={{
                        borderWidth: 0.3,
                        borderColor: !hide_participants ? '#000000' : 'blue',
                    }}
                >
                    <Text className={`font-semibold ${hide_participants && 'text-blue-500'}`}>
                        Yes
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setEventData((prevData: any) => ({
                        ...prevData,
                        hide_participants: false,
                    }))}
                    className='p-4 flex  grow items-center  '
                    style={{
                        borderWidth: 0.3,
                        borderColor: hide_participants ? '#000000' : 'blue',
                    }}
                >
                    <Text className={`font-semibold ${!hide_participants && 'text-blue-500'}`}>
                        No
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default HideParticipants