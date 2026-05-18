import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'

interface DeleteEventModalProps {
    showDeleteModal: boolean
    setShowDeleteModal: (value: boolean) => void
    handleDeleteEvent?: () => void
}

const DeleteEventModal = ({
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteEvent,
}: DeleteEventModalProps) => {  
    return (
        <Modal
            visible={showDeleteModal}
            transparent
            animationType="fade"
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-6">

                <View className="bg-white w-full rounded-2xl p-5">

                    <Text className="text-xl font-bold text-center mb-3">
                        Delete Event
                    </Text>

                    <Text className="text-gray-600 text-center leading-5 mb-6">
                        Are you sure you want to delete this event?
                        {"\n\n"}
                        This action is non reversible.
                    </Text>

                    <View className="flex-row gap-3">

                        <TouchableOpacity
                            onPress={() => setShowDeleteModal(false)}
                            className="flex-1 p-3 rounded-xl bg-gray-200"
                        >
                            <Text className="text-center font-semibold text-gray-800">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setShowDeleteModal(false);
                                handleDeleteEvent?.();
                            }}
                            className="flex-1 p-3 rounded-xl bg-red-600"
                        >
                            <Text className="text-center font-semibold text-white">
                                Confirm
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        </Modal>
    )
}

export default DeleteEventModal