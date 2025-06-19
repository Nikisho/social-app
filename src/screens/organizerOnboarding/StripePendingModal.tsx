import React from 'react';
import { View, Text, TouchableOpacity, Linking, Modal, TouchableWithoutFeedback } from 'react-native';

interface StripePendingModalProps {
    modalVisible: boolean;
    setModalVisible: (bool: boolean) => void;
    onRetry: () => void;
}

export default function StripePendingModal({
    modalVisible,
    setModalVisible,
    onRetry
}: StripePendingModalProps)  {
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
                className='flex-1 justify-center items-center mt-22 ' >
                <TouchableWithoutFeedback>

                    <View className="bg-white mx-4 border p-6 rounded-2xl shadow-lg flex justify-center">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-semibold text-black">Stripe Account Pending</Text>
                        </View>

                        <Text className="text-base text-gray-700 mb-4">
                            Your Stripe account is still being verified. This usually takes a few minutes, but Stripe may ask for additional information.
                        </Text>

                        <Text className="text-sm text-gray-500 mb-4">
                            You won’t be able to post paid events on Linkzy until your account is fully active.
                        </Text>

                        <View className="space-y-3">
                            <TouchableOpacity
                                className="bg-black py-3 rounded-xl"
                                onPress={onRetry}
                            >
                                <Text className="text-white text-center font-medium">Check Again</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                className="border border-gray-300 py-3 rounded-xl"
                                onPress={() => Linking.openURL(stripeDashboardUrl)}
                            >
                                <Text className="text-center text-gray-800 font-medium">Open Stripe Dashboard</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
}
