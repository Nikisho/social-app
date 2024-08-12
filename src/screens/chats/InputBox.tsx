import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../../supabase';

interface ChatBodyProps {
    onSendMessage: (message: string) => void
};

const InputBox:React.FC<ChatBodyProps> = ({
    onSendMessage
}) => {
    const [message, setMessage] = useState<string>('');
    const handleSubmit = async () => {
        if (message === '') {
            return;
        }
        onSendMessage(message)
        setMessage('');
    };

    return (
        <View className='absolute inset-x-0 bottom-0 h-24 flex justify-center flex-row py-6 px-6 bg-white'>
            <View className='bg-gray-200 px-3 w-full rounded-xl flex flex-row items-center justify-between'>
                <TextInput
                    placeholder='Message'
                    value={message}
                    onChangeText={(value) => {setMessage(value)}}
                    className=' text-lg px-1 w-5/6 h-full'>
                </TextInput>
                <TouchableOpacity
                    onPress={handleSubmit}
                    >
                    <Ionicons name="send-outline" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default InputBox