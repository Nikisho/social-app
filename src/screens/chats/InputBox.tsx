import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';

interface ChatBodyProps {
    onSendMessage: (message: string) => void;
};

const InputBox: React.FC<ChatBodyProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState<string>('');
    const [inputHeight, setInputHeight] = useState<number>(40); // default height (min)

    const handleSubmit = async () => {
        if (message === '') {
            return;
        }
        onSendMessage(message);
        setMessage('');
        setInputHeight(40); // Reset height after sending message
    };

    return (
        <View className='flex justify-center flex-row px-3 my-2'>
            <View className='bg-gray-200 px-5 py-3 w-full rounded-2xl flex flex-row items-center justify-between'>
                <TextInput
                    placeholder='Message'
                    multiline
                    value={message}
                    onChangeText={(value) => setMessage(value)}
                    onContentSizeChange={(event) => {
                        // Dynamically change height but cap it at 120 and ensure a minimum of 40
                        setInputHeight(Math.max(40, Math.min(event.nativeEvent.contentSize.height, 120)));
                    }}
                    style={{ height: inputHeight }}  // Set dynamic height
                    className='text-lg px-1 w-5/6'>
                </TextInput>
                <TouchableOpacity onPress={handleSubmit}>
                    <Ionicons name="send-outline" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default InputBox;
