import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../utils/styles/shadow';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

interface FilterEventsModalProps {
    modalVisible: boolean
    sortingOption: string;
    setModalVisible: (modalVisible: boolean) => void;
    setSortingOption: (sortingOption: string) => void;
}
const FilterEventsModal: React.FC<FilterEventsModalProps> = ({
    modalVisible,
    sortingOption,
    setModalVisible,
    setSortingOption
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
                <View className='bg-white rounded-xl m-20 h-1/4 w-full p-1 space-y-5 '
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
                        <Text className='place-self-center ml-32'>Sort by</Text>
                    </View>
                    <View className='space-y-1'>
                        <TouchableOpacity
                            onPress={() => setSortingOption('event_date')}
                            className={`p-3 bg-gray-100 rounded-full flex flex-row items-center space-x-3 ${sortingOption === 'event_date' ? 'bg-blue-400' : ''}`}>
                            <Entypo name="calendar" size={24} color="black" />
                            <Text>Event date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSortingOption('created_at')}
                            className={`p-3 bg-gray-100 rounded-full flex flex-row items-center space-x-3 ${sortingOption === 'created_at' ? 'bg-blue-400' : ''}`}>
                            <Entypo name="new" size={24} color="black" />                           
                             <Text>New</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default FilterEventsModal