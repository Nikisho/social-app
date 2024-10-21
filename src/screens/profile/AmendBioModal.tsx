import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import colours from '../../utils/styles/colours';
import styles from '../../utils/styles/shadow';

interface UserDataProps {
    name: string;
    age: string;
    photo: string;
    bio: string;
}

interface AmendBioModalProps {
    setModalVisible: (bool: boolean) => void;
    updateUserDescription: () => void;
    closeModal: () => void;
    setUserData: React.Dispatch<React.SetStateAction<UserDataProps>>;
    modalVisible: boolean;
    userData: {
        bio: string;
    };
}
const AmendBioModal: React.FC<AmendBioModalProps> = ({
    setModalVisible,
    setUserData,
    closeModal,
    updateUserDescription,
    modalVisible,
    userData
}) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View className='flex-1 justify-center items-center mt-22' >
                    <View className='bg-white rounded-xl m-20 h-1/2 w-4/5 p-5 space-y-5' style={styles.shadow} >
                        <TextInput className='mb-15 border rounded-lg p-2'
                            maxLength={300}
                            value={userData.bio}
                            multiline={true}
                            onChangeText={(value) => (setUserData((prevData) => ({
                                ...prevData,
                                bio: value
                            })))}
                        >
                        </TextInput>
                        <View className='flex flex-row space-x-1 justify-center'>
                            <TouchableOpacity
                                className='rounded-full p-2 bg-red-500 w-1/2'
                                onPress={closeModal}>
                                <Text className='text-white text-center font-bold'>Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: colours.secondaryColour }}
                                className='rounded-full p-2 w-1/2'
                                onPress={updateUserDescription}>
                                <Text className='text-white text-center font-bold'>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default AmendBioModal