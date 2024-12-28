import { View, Modal, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import styles from '../../utils/styles/shadow';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { FontAwesome } from '@expo/vector-icons';

interface ProfilePictureModalTypes {
    setModalVisible: (modalVisible: boolean) => void;
    modalVisible: boolean;
    photo: string;
    user_id: number;
    pickImage: () => void;
    clearImage: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalTypes> = ({
    setModalVisible,
    modalVisible,
    photo,
    user_id,
    pickImage,
    clearImage
}) => {
    const currentUser = useSelector(selectCurrentUser);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                className='flex-1 mt-20 items-center ' >
                <TouchableWithoutFeedback>
                    <View className='bg-white m-20 h-1/3 w-5/6' style={styles.shadow} >

                        {
                            photo ?
                                (
                                    <Image
                                        className='w-full h-full'
                                        source={{
                                            uri: `${photo}`,
                                        }}
                                    />
                                ) :
                                <View className='w-full h-full flex items-center justify-center'>
                                    <FontAwesome name="user-circle" size={100} color="black" />
                                </View>
                        }
                        {
                            currentUser.id === user_id && (
                                <View className='py-2 px-10 bg-blue-100 flex flex-row space-x-20 justify-center rounded-b-xl'>
                                    <TouchableOpacity
                                        onPress={clearImage}
                                    >
                                        <EvilIcons name="trash" size={34} color="black" />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={pickImage}
                                    >
                                        <EvilIcons className='' name="pencil" size={34} color="black" />
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default ProfilePictureModal