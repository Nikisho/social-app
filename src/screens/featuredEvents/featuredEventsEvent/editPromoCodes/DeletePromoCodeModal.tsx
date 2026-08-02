import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const DeletePromoCodeModal = ({
    modalVisible,
    setModalVisible,
    onDelete
}: {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    onDelete: () => void;
}) => {
    return (
        <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-center items-center bg-black/40 px-6">
                <View className="bg-white rounded-3xl p-6 w-full">
                    <View className="items-center mb-5">
                        <View className="bg-red-100 p-3 rounded-full">
                            <Ionicons
                                name="trash-outline"
                                size={28}
                                color="#dc2626"
                            />
                        </View>
                    </View>

                    <Text className="text-xl font-semibold text-center">
                        Delete promo code?
                    </Text>

                    <Text className="text-gray-500 text-center mt-3 leading-6">
                        Are you sure you would like to delete this promo code? This action cannot be undone.
                    </Text>
                    <View className="flex-row mt-8">

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="flex-1 border border-gray-200 rounded-2xl py-4 mr-2"
                        >
                            <Text className="text-center font-medium">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onDelete}
                            className="flex-1 bg-red-600 rounded-2xl py-4 ml-2"
                        >
                            <Text className="text-center text-white font-semibold">
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeletePromoCodeModal