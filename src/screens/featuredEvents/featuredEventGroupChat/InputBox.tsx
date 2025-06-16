import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
// import MediaAttachment from './MediaAttachment';
import { ImagePickerAsset } from 'expo-image-picker';

interface InputBoxProps {
    onSendMessage: (message: string) => void;
    // setMedia: (media: ImagePickerAsset) => void;
};

const InputBox: React.FC<InputBoxProps> = ({ onSendMessage }) => {
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
        <KeyboardAvoidingView className='flex justify-start flex-row px-5 my-3 mb-10 space-x-3 items-center'
            behavior='padding'
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
            <View className={`bg-gray-200 px-5 py-2 w-5/6 flex flex-row items-center justify-between ${inputHeight > 40 ? 'rounded-2xl' : 'rounded-full'}`}>
                <TextInput
                    placeholder='Message'
                    multiline
                    value={message}
                    maxLength={500}
                    onChangeText={(value) => setMessage(value)}
                    onContentSizeChange={(event) => {
                        // Dynamically change height but cap it at 120 and ensure a minimum of 40
                        setInputHeight(Math.max(40, Math.min(event.nativeEvent.contentSize.height, 120)));
                    }}
                    style={{ height: inputHeight }}  // Set dynamic height
                    className='text-lg px-1 w-5/6'>
                </TextInput>
                {/* {
                    message === '' && (
                        <MediaAttachment 
                            setMedia={setMedia}
                        />
                    )
                } */}
            </View>

            <TouchableOpacity onPress={handleSubmit} className='bg-blue-300 p-4 rounded-full'>
                <Ionicons name="send-outline" size={23} color="black" />
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

export default InputBox;
