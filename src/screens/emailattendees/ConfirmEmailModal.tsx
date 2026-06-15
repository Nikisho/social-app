import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'


type ConfirmEmailModalProps = {
    visible: boolean;
    setConfirmModalVisible: (value: boolean) => void;
    email: {
        subject: string;
        body: string;
    }
    handleSubmit: () => void;
    handleSaveDraft: () => void;
}

const ConfirmEmailModal = ({ visible, setConfirmModalVisible, email, handleSubmit, handleSaveDraft }: ConfirmEmailModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
        >
            <View className="bg-white rounded-3xl p-6 mt-16">
                <Text className="text-xl font-bold text-center mb-2">
                    Send email?
                </Text>

                <Text className="text-gray-600 text-center mb-5">
                    This email will be sent to all attendees of the event.
                </Text>

                <View className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
                    <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <Text className="font-semibold">
                            Email Preview
                        </Text>
                    </View>
                    <View className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                        <View className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                            <Text className="text-xs text-gray-500 mb-1">
                                Subject
                            </Text>
                            <Text className="font-semibold text-base">
                                {email.subject}
                            </Text>
                        </View>

                        <ScrollView
                            className="max-h-96 px-4 py-4"
                            showsVerticalScrollIndicator={false}
                        >
                            <Text className="text-gray-700 leading-6">
                                {email.body}
                            </Text>
                        </ScrollView>
                    </View>
                </View>

                <Text className="text-xs text-gray-500 text-center mb-5">
                    Please review the content before sending.
                </Text>

                <View className="gap-3">
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 py-4 rounded-2xl border border-gray-300"
                            onPress={handleSaveDraft}
                        >
                            <Text className="text-center font-medium">
                                Draft
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 py-4 rounded-2xl border border-gray-300"
                            onPress={() => setConfirmModalVisible(false)}
                        >
                            <Text className="text-center font-medium">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 py-4 rounded-2xl bg-red-600"
                            onPress={handleSubmit}
                        >
                            <Text className="text-center text-white font-semibold">
                                Send
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmEmailModal