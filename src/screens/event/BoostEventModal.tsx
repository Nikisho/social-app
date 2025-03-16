import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native'
import React from 'react'
import styles from '../../utils/styles/shadow';
import colours from '../../utils/styles/colours';

interface BoostEventModalProps {
    modalVisible: boolean;
    setModalVisible: (boolean: boolean) => void
    boostEvent: () => void
};

const BoostEventModal: React.FC<BoostEventModalProps> = ({
    modalVisible,
    setModalVisible,
    boostEvent
}) => {
    
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
                className='mt-20 items-center h-2/3 flex justify-center' >
                <TouchableWithoutFeedback>
                    <View className='bg-white m-20 h-1/4 w-3/5 flex justify-center items-center rounded-xl' style={styles.shadow} >
                        <Text style={{ fontFamily: 'American Typewriter' }} className='text-center w-1/2 font-bold text-lg'>
                            Boost event for 50 💎 ?
                        </Text>
                        <View className='flex w-1/2 space-y-2 '>
                            <TouchableOpacity
                                className='flex flex-row justify-center py-1 rounded-lg mt-5 '
                                style={{ backgroundColor: colours.secondaryColour }}
                                onPress={() => boostEvent()}
                            >
                                <Text className='text-lg text-white font-semibold'>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
}

export default BoostEventModal