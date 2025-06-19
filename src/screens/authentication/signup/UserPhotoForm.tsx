import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

interface UserDataProps {
    photo: ImagePicker.ImagePickerAsset | null;
};

interface UserPhotoFormProps extends UserDataProps {
    updateFields: (fields: Partial<UserDataProps>) => void;
};

const UserPhotoForm: React.FC<UserPhotoFormProps> = ({
    photo,
    updateFields
}) => {

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
            updateFields({ photo: result.assets[0]})
        }
    }
    return (
        <View className='flex flex-col w-full h-1/2 items-center justify-center space-y-3 '>
            <View className='ml-2 w-5/6 mb-5 flex'>
                <Text className=' text-xl font-bold'>
                    Let's make your profile stand out!
                </Text>
                <Text className=' py-1'>
                    Add a picture of yourself so others can recognise you.
                </Text>
            </View>
            <TouchableOpacity 
                className='flex flex-row items-center space-x-3'
                onPress={pickImage}>
                {
                    photo ?
                        <Image
                            source={{ uri: `${photo.uri}` }}
                            className='h-52 w-52 rounded-full '
                        /> :
                        <MaterialCommunityIcons 
                            name="image-plus" 
                            size={180} 
                            color="black" 
                        />
                }
            </TouchableOpacity>
        </View>
    )
}

export default UserPhotoForm