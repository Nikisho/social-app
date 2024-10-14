import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ImagePickerAsset } from 'expo-image-picker';

interface SendMediaProps {
    media: { uri: string };
    setMedia: (media: ImagePickerAsset | null) => void;
    onSendMessage: (message: string) => void;
}

const SendMedia: React.FC<SendMediaProps> = ({
    media,
    setMedia,
    onSendMessage,
}) => {
    const [message, setMessage] = useState<string>('');
    const screenHeight = Dimensions.get('window').height;
    const [inputHeight, setInputHeight] = useState<number>(40); // default height (min)

    const cancelAddMedia = () => {
        setMedia(null);
    };

    const handleSubmit = async () => {
        if (!media) {
            return;
        }
        onSendMessage(message);
        setMessage('');
        setInputHeight(40); // Reset height after sending message
        setMedia(null);
    };

    return (
        <View style={styles.container} className={`${Platform.OS === 'android' && 'px-3'}`}>
            <TouchableOpacity className='text-white pt-5' onPress={cancelAddMedia}>
                <Ionicons name="chevron-back-circle-outline" size={30} color="white" />
            </TouchableOpacity>
            <Image
                style={[styles.image, { height: screenHeight * 0.4 }]} // 40% of the screen height for the image
                resizeMode="contain" // Ensures image keeps its aspect ratio
                source={{
                    uri: media.uri,
                }}
            />
            <KeyboardAvoidingView
                className='flex justify-start flex-row px-1 space-x-3  items-center'
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <View
                    style={[
                        styles.inputContainer,
                        { borderRadius: inputHeight > 40 ? 20 : 30 },
                    ]}
                >
                    <TextInput
                        placeholder='Message'
                        multiline
                        maxLength={300}
                        value={message}
                        onChangeText={setMessage}
                        className='px-4'
                        onContentSizeChange={(event) => {
                            // Dynamically change height but cap it at 120 and ensure a minimum of 40
                            const newHeight = Math.max(40, Math.min(event.nativeEvent.contentSize.height, 120));
                            setInputHeight(newHeight);
                        }}
                        style={[styles.input, { height: inputHeight }]} 
                    />
                </View>

                <TouchableOpacity
                    onPress={handleSubmit}
                    className='bg-blue-300 p-4 rounded-full'
                >
                    <Ionicons name="send-outline" size={23} color="black" />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SendMedia;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'flex-start',
    },
    image: {
        width: '100%',
        marginTop: 0,
        marginBottom: 10
    },
    inputContainer: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 1,
        paddingVertical:5
    },
    input: {
        fontSize: 16,
        color: 'black',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 30,
        flex: 1,
    },
});
