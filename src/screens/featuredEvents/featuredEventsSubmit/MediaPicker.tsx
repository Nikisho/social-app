import { View, TouchableOpacity, Alert, Image } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

interface MediaPickerProps {
    setMedia: (media: ImagePicker.ImagePickerAsset) => void;
    media: any

}

const MediaPicker: React.FC<MediaPickerProps> = ({ setMedia, media }) => {
    const pickImage = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'We need access to your gallery to let you select images.',
                [{ text: 'OK' }]
            );
        }
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setMedia(result.assets[0]);
        }
    }
    return (
        <TouchableOpacity
            onPress={pickImage}
            className=' py-[-10] items-center'>
            {
                media ?

                    <Image
                        source={media}
                        className='h-64 bg-red-200  w-3/4 rounded-xl mt-3 '
                    />
                    :
                    <View>
                        <Ionicons name="image" size={240} color="gray" />

                    </View>
            }
        </TouchableOpacity>
    )
}

export default MediaPicker