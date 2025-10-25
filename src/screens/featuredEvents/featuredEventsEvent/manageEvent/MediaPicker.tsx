import { View, TouchableOpacity, Alert, Text } from 'react-native'
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../../../../utils/styles/shadow';
import FastImage from 'react-native-fast-image';

interface MediaPickerProps {
    setEventData: any;
    eventData: {
        image_url: string | {uri: string}
    }
}

const MediaPicker: React.FC<MediaPickerProps> = ({ setEventData, eventData }) => {
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
            setEventData((prevData: any) => ({
                ...prevData,
                image_url: result.assets[0]
            }))
        }
    }
    return (
        <TouchableOpacity onPress={pickImage} className="items-center">
            {eventData
                ? <FastImage 
                        style={{borderRadius: 50}}
                        source={typeof eventData.image_url === 'string' ? { uri: eventData?.image_url} : { uri: eventData?.image_url.uri }}
                        className="h-64 w-full rounded-xl mt-2 flex items-center justify-center">
                    <View 
                        style={styles.shadow}
                        className='bg-white rounded-full  p-2 px-4'>
                        <Text className='font-bold'>EDIT</Text>
                    </View>
                </FastImage>
                : <Ionicons name="image" size={240} color="gray" />
            }
        </TouchableOpacity>
    )
}

export default MediaPicker