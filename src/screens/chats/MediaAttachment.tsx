import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../../supabase';

interface MediaAttachmentProops {
    setMedia: (media: ImagePicker.ImagePickerAsset) => void;
}

const MediaAttachment:React.FC<MediaAttachmentProops> = ({setMedia}) => {

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
        <TouchableOpacity className='' onPress={pickImage}>
            <FontAwesome name="photo" size={24} color="black" />    
        </TouchableOpacity>
    )
}

export default MediaAttachment