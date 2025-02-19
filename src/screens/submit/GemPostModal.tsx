import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from '../../utils/styles/shadow';
import colours from '../../utils/styles/colours';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../context/navSlice';
import abbrNum from '../../utils/functions/abbrNum';

interface GemPostModalProps {
    modalVisible: boolean;
    onAction: (userConfirmed: boolean) => void;
}

const GemPostModal: React.FC<GemPostModalProps> = ({ modalVisible, onAction }) => {
    const gem_cost = '100';
    const currentUser = useSelector(selectCurrentUser);

    if (!modalVisible) return null;

    const handleYes = () => {
        console.log('first')
        onAction(true);
    };
    const handleCancel = () => {
        onAction(false);
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => onAction(false)}
        >
            <View className='flex-1 justify-center items-center mt-22 h-full shadow-xl'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
                <View
                    className='bg-white rounded-xl m-20 h-auto w-[90%] p-4 space-y-3 items-center'

                    style={styles.shadow}
                >
                    <View className='w-full flex flex-row justify-end '>
                        <View className='bg-gray-200 p-2 flex flex-row'>
                            <Text className='font-bold'>
                                {abbrNum(currentUser.gemCount, 2)}
                            </Text>
                            <MaterialCommunityIcons name="diamond" size={20} color="turquoise" />

                        </View>
                    </View>
                    <Text className='text-xl font-semibold'>You’ve Reached Your Limit! </Text>
                    <Text className='text-lg text- flex'>
                        You’ve already posted 1 event this week. Would you like to post one more for {gem_cost} gems?
                    </Text>
                    <View className='flex flex-row my-2 items-center space-x-2 bg-gray-200 p-2 rounded-xl'>
                        <Text style={{ fontFamily: 'American Typewriter' }} className='font-bold text-lg' >{gem_cost}</Text>
                        <MaterialCommunityIcons name="diamond" size={30} color="turquoise" />
                    </View>

                    <View className='flex w-full space-y-2'>
                        <TouchableOpacity
                            className='flex flex-row justify-center py-2 rounded-lg'
                            style={{ backgroundColor: colours.secondaryColour }}
                            onPress={handleYes}
                        >
                            <Text className='text-lg text-white font-semibold'>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='flex flex-row justify-center py-2 bg-gray-200 rounded-lg'
                            onPress={handleCancel}
                        >
                            <Text className='text-lg text-black'>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default GemPostModal;
