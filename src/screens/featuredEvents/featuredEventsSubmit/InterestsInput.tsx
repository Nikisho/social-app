import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import ProfileInterestsSelector from '../../../components/ProfileInterestsSelector';
import styles from '../../../utils/styles/shadow';
import UserInterests from '../../profile/UserInterests';




const InterestsInput = ({
    userInterests,
    setEventData
}:any) => {
    const [modalVisible, setModalVisible] = useState(false);
    function updateFields(fields:any) {
        setEventData((prev: any) => {
            return { ...prev, ...fields }
        })
    };
    return (
        <>
            <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}  
                style={styles.shadow}
                className='p-2 mt-4 rounded-full bg-gray-200 w-1/ border-green-800'
            >
                <Text className='text-lg text-center'>
                    Select topics & interests
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>

                <View className='flex-1 justify-center items-center mt-22 bg-' >
                    <View className='bg-white rounded-xl m-20 w-4/5 p-5 space-y-5' style={styles.shadow} >

                        <ProfileInterestsSelector
                            userInterests={userInterests}
                            updateFields={updateFields}
                            maxNumberOfInterests={5}
                        />

                        <View className='flex flex-row w-full py-10 justify-center space-x-20'>
                            <TouchableOpacity
                                onPress={() => setModalVisible(!modalVisible)}
                                className='bg-black rounded-full  p-3 w-1/3'>
                                <Text className='text-white font-bold text-center'>
                                    Ok
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default InterestsInput