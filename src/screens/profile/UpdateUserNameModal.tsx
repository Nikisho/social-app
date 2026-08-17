import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../../utils/styles/shadow';

interface UpdateUserNameModalProps {
    setModalVisible: (modalVisible: boolean) => void
    modalVisible: boolean
    updateUserName: (newName: string) => void
    currentName?: string
}

const UpdateUserNameModal: React.FC<UpdateUserNameModalProps> = ({
    setModalVisible,
    modalVisible,
    updateUserName,
    currentName = ''
}) => {

    const [name, setName] = useState(currentName);

    const handleCancel = () => {
        setName(currentName);
        setModalVisible(false);
    };

    const handleSave = () => {
        const trimmedName = name.trim();

        if (!trimmedName) return;

        updateUserName(trimmedName);
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={modalVisible}
            onRequestClose={handleCancel}
        >
            <View className="flex-1 justify-center items-center bg-black/40">

                <View
                    className="bg-white rounded-3xl w-4/5 p-5"
                    style={styles.shadow}
                >

                    <Text className="text-xl font-semibold">
                        Update your name
                    </Text>

                    <Text className="text-gray-500 mt-2 mb-6">
                        Enter the name you'd like to display on Linkzy.
                    </Text>

                    <Text className="font-medium mb-2">
                        Name
                    </Text>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        autoCapitalize="words"
                        autoCorrect={false}
                        maxLength={50}
                        className="border border-gray-200 rounded-2xl px-4 py-4"
                    />

                    <View className="flex-row mt-7">

                        <TouchableOpacity
                            onPress={handleCancel}
                            className="flex-1 border border-gray-200 rounded-2xl py-4 mr-2"
                        >
                            <Text className="text-center font-medium">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={!name.trim()}
                            className={`flex-1 rounded-2xl py-4 ml-2 ${
                                name.trim()
                                    ? 'bg-black'
                                    : 'bg-gray-300'
                            }`}
                        >
                            <Text className="text-center text-white font-semibold">
                                Save
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default UpdateUserNameModal;