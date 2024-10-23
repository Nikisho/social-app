import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import styles from '../utils/styles/shadow';
import AntDesign from '@expo/vector-icons/AntDesign';

interface ChooseEventLocationModalProps {
    modalVisible: boolean
    setModalVisible: (modalVisible: boolean) => void;
}


const ChooseEventLocationModal:React.FC<ChooseEventLocationModalProps> = ({
    modalVisible,
    setModalVisible
}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View className='flex-1 justify-end items-center shadow-xl' >
                <View className='bg-white rounded-xl m-20 h-1/2 w-full p-1 space-y-5 '
                    style={styles.shadow}
                >
                    <View
                        className='w-full p-1 flex flex-row items-center '
                    >
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                        >

                            <AntDesign name="close" size={25} color="black" />
                        </TouchableOpacity>
                        <Text className='place-self-center ml-32'>Select a hub</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ChooseEventLocationModal