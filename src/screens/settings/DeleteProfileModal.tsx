import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { supabase } from '../../../supabase';
import { setCurrentUser } from '../../context/navSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../utils/styles/shadow';
import platformAlert from '../../utils/functions/platformAlert';

interface DeleteProfileModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    currentUserId: number;
}

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({
    modalVisible,
    setModalVisible,
    currentUserId
}) => {
    const dispatch = useDispatch();
    const deleteAccount = async () => {

        const { error } = await supabase.rpc('delete_user');
        if (error) { throw error.message };

        const { error: DeleteUserError } = await supabase
            .from('users')
            .delete()
            .eq('id', currentUserId);
        if (DeleteUserError) { throw DeleteUserError.message };

        dispatch(setCurrentUser({
            name: null,
            email: null,
            photo: null,
            id: null
        }));
        setModalVisible(!modalVisible);
        //Delete the user's folder and profile picture.
        await deleteUserFolder();
        platformAlert('Account deleted successfully.')
    };

    const deleteUserFolder = async () => {
        const { data, error: DeleteBucketFolderError } = await supabase
            .storage
            .from('users')
            .remove([`${currentUserId}/profile_picture.jpg`])
        if (DeleteBucketFolderError) {
            console.error(DeleteBucketFolderError)
        }
        if (data) {
            const { error: DeleteEmptyBucket } = await supabase
                .storage
                .from('users')
                .remove([`/${currentUserId}`])
            if (DeleteEmptyBucket) console.error(DeleteEmptyBucket.message)
        }
    };

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View className='flex-1 justify-center items-center mt-22 h-full shadow-xl' >
                    <View className='bg-white m-20 h-auto w-[90%]  p-2 space-y-5 items-center'
                        style={styles.shadow}
                    >
                        <View className='flex w-full space-y-3' >
                            <Text className='text'
                                style={{ fontSize: 18 }}
                            >
                                Are you sure you want to delete your account? This action is
                                permanent and cannot be undone.
                            </Text>
                            <Text className='text'
                                style={{ fontSize: 18 }}
                            >
                                All your data, including your profile, events, connections, and messages,
                                will be permanently deleted. If you're sure, please confirm.
                            </Text>
                        </View>
                        <View className='flex flex-row w-full justify-between '>
                            <TouchableOpacity
                                className='p-2 bg-gray-500 w-[48%] rounded-full space-x-2'
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text className='text-white text-center font-bold'>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className='p-2 bg-red-500 w-[48%] rounded-full'
                                onPress={deleteAccount}>
                                <Text className='text-white text-center font-bold'>Delete my account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default DeleteProfileModal;